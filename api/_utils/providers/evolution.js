import { BaseProvider } from './base.js'

/**
 * Evolution API Provider
 * Self-hosted WhatsApp API using Baileys
 */
export class EvolutionProvider extends BaseProvider {
    constructor(config = {}) {
        super(config)
        this.name = 'evolution'
        this.baseUrl = config.baseUrl || process.env.EVOLUTION_API_URL
        this.globalApiKey = config.apiKey || process.env.EVOLUTION_GLOBAL_API_KEY
    }

    /**
     * Make authenticated request to Evolution API
     */
    async _request(method, path, body = null) {
        const url = `${this.baseUrl}${path}`
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'apikey': this.globalApiKey
            }
        }

        if (body) {
            options.body = JSON.stringify(body)
        }

        const response = await fetch(url, options)

        if (!response.ok) {
            const error = await response.text()
            throw new Error(`Evolution API error (${response.status}): ${error}`)
        }

        return response.json()
    }

    /**
     * Normalize phone to Evolution format (just digits, no suffix)
     */
    normalizePhone(phone) {
        let cleaned = super.normalizePhone(phone)
        // Evolution uses plain numbers without @s.whatsapp.net for sending
        if (cleaned.startsWith('0')) cleaned = '972' + cleaned.substring(1)
        return cleaned
    }

    async createInstance(instanceName) {
        const result = await this._request('POST', '/instance/create', {
            instanceName,
            qrcode: true,
            integration: 'WHATSAPP-BAILEYS'
        })

        return {
            instanceId: result.instance?.instanceName || instanceName,
            apiToken: result.hash?.apikey || '',
            qrCode: result.qrcode?.base64 || null
        }
    }

    async getQRCode(instanceId) {
        const result = await this._request('GET', `/instance/connect/${instanceId}`)
        return {
            base64: result.base64 || result.qrcode?.base64,
            code: result.code || result.pairingCode
        }
    }

    async deleteInstance(instanceId) {
        await this._request('DELETE', `/instance/delete/${instanceId}`)
        return { success: true }
    }

    async getStatus(instanceId) {
        try {
            const result = await this._request('GET', `/instance/connectionState/${instanceId}`)
            return {
                connected: result.state === 'open',
                status: result.state
            }
        } catch (error) {
            // Instance might not exist
            return { connected: false, status: 'error' }
        }
    }

    async sendText(instanceId, apiToken, to, text) {
        const number = this.normalizePhone(to)

        // Use instance-specific token if provided, otherwise global
        const headers = {
            'Content-Type': 'application/json',
            'apikey': apiToken || this.globalApiKey
        }

        const url = `${this.baseUrl}/message/sendText/${instanceId}`
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify({ number, text })
        })

        if (!response.ok) {
            const error = await response.text()
            throw new Error(`Evolution sendText failed: ${error}`)
        }

        const result = await response.json()
        return { messageId: result.key?.id || result.messageId }
    }

    async sendMedia(instanceId, apiToken, to, media) {
        const number = this.normalizePhone(to)

        const headers = {
            'Content-Type': 'application/json',
            'apikey': apiToken || this.globalApiKey
        }

        const url = `${this.baseUrl}/message/sendMedia/${instanceId}`
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                number,
                mediatype: media.type || 'image',
                media: media.url,
                caption: media.caption || ''
            })
        })

        if (!response.ok) {
            const error = await response.text()
            throw new Error(`Evolution sendMedia failed: ${error}`)
        }

        const result = await response.json()
        return { messageId: result.key?.id || result.messageId }
    }

    normalizeWebhook(payload) {
        const { event, instance, data } = payload

        // CONNECTION_UPDATE
        if (event === 'connection.update') {
            return {
                event: 'connection.update',
                instance,
                data: {
                    state: data.state, // open, close, connecting
                    reason: data.statusReason
                }
            }
        }

        // MESSAGES_UPSERT
        if (event === 'messages.upsert') {
            const message = data.message || data
            const key = data.key || {}

            return {
                event: 'message.received',
                instance,
                data: {
                    remoteJid: key.remoteJid,
                    fromMe: key.fromMe || false,
                    id: key.id,
                    timestamp: data.messageTimestamp || Math.floor(Date.now() / 1000),
                    type: this._getMessageType(message),
                    content: this._extractContent(message)
                }
            }
        }

        // SEND_MESSAGE (confirmation)
        if (event === 'send.message') {
            return {
                event: 'message.sent',
                instance,
                data: {
                    id: data.key?.id,
                    status: data.status
                }
            }
        }

        return { event: 'unknown', instance, data: payload }
    }

    _getMessageType(message) {
        if (message.conversation || message.extendedTextMessage) return 'text'
        if (message.imageMessage) return 'image'
        if (message.videoMessage) return 'video'
        if (message.audioMessage) return 'audio'
        if (message.documentMessage) return 'document'
        if (message.stickerMessage) return 'sticker'
        if (message.locationMessage) return 'location'
        if (message.contactMessage) return 'contact'
        return 'unknown'
    }

    _extractContent(message) {
        if (message.conversation) {
            return { text: message.conversation }
        }
        if (message.extendedTextMessage) {
            return { text: message.extendedTextMessage.text }
        }
        if (message.imageMessage) {
            return {
                url: message.imageMessage.url,
                caption: message.imageMessage.caption
            }
        }
        if (message.videoMessage) {
            return {
                url: message.videoMessage.url,
                caption: message.videoMessage.caption
            }
        }
        if (message.documentMessage) {
            return {
                url: message.documentMessage.url,
                filename: message.documentMessage.fileName
            }
        }
        return { raw: message }
    }

    async healthCheck() {
        const start = Date.now()
        try {
            const response = await fetch(this.baseUrl, {
                headers: { 'apikey': this.globalApiKey }
            })
            const data = await response.json()
            return {
                healthy: response.ok && data.status === 200,
                latency: Date.now() - start,
                version: data.version
            }
        } catch {
            return { healthy: false, latency: Date.now() - start }
        }
    }

    /**
     * Fetch all instances from Evolution API
     */
    async fetchAllInstances() {
        const result = await this._request('GET', '/instance/fetchInstances')
        return result.instances || result || []
    }
}
