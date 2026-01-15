import { BaseProvider } from './base.js'

/**
 * GreenAPI Provider
 * Cloud-hosted WhatsApp API service
 */
export class GreenAPIProvider extends BaseProvider {
    constructor(config = {}) {
        super(config)
        this.name = 'green-api'
        this.baseUrl = config.baseUrl || 'https://api.green-api.com'
    }

    /**
     * Normalize phone to GreenAPI chatId format
     */
    normalizePhone(phone) {
        let cleaned = super.normalizePhone(phone)
        // GreenAPI uses country code format
        if (cleaned.startsWith('0')) cleaned = '972' + cleaned.substring(1)
        if (!cleaned.startsWith('972')) cleaned = '972' + cleaned
        return `${cleaned}@c.us`
    }

    async createInstance(instanceName) {
        // GreenAPI instances are created via their dashboard
        // This is a placeholder - actual flow requires manual setup
        throw new Error('GreenAPI instances must be created via green-api.com dashboard')
    }

    async getQRCode(instanceId) {
        // GreenAPI QR is managed via their dashboard
        throw new Error('GreenAPI QR code is managed via green-api.com dashboard')
    }

    async deleteInstance(instanceId) {
        // GreenAPI instances are deleted via their dashboard
        throw new Error('GreenAPI instances must be deleted via green-api.com dashboard')
    }

    async getStatus(instanceId, apiToken) {
        const url = `${this.baseUrl}/waInstance${instanceId}/getStateInstance/${apiToken}`
        const response = await fetch(url)

        if (!response.ok) {
            return { connected: false, status: 'error' }
        }

        const data = await response.json()
        return {
            connected: data.stateInstance === 'authorized',
            status: data.stateInstance
        }
    }

    async sendText(instanceId, apiToken, to, text) {
        const chatId = this.normalizePhone(to)
        const url = `${this.baseUrl}/waInstance${instanceId}/sendMessage/${apiToken}`

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chatId, message: text })
        })

        if (!response.ok) {
            const error = await response.text()
            throw new Error(`GreenAPI sendText failed: ${error}`)
        }

        const result = await response.json()
        return { messageId: result.idMessage }
    }

    async sendMedia(instanceId, apiToken, to, media) {
        const chatId = this.normalizePhone(to)
        const url = `${this.baseUrl}/waInstance${instanceId}/sendFileByUrl/${apiToken}`

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chatId,
                urlFile: media.url,
                fileName: media.filename || 'file',
                caption: media.caption || ''
            })
        })

        if (!response.ok) {
            const error = await response.text()
            throw new Error(`GreenAPI sendMedia failed: ${error}`)
        }

        const result = await response.json()
        return { messageId: result.idMessage }
    }

    async setSettings(instanceId, apiToken, settings) {
        const url = `${this.baseUrl}/waInstance${instanceId}/setSettings/${apiToken}`
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings)
        })

        if (!response.ok) {
            const error = await response.text()
            throw new Error(`GreenAPI setSettings failed: ${error}`)
        }

        return await response.json()
    }

    normalizeWebhook(payload) {
        // GreenAPI webhook format normalization
        const { typeWebhook, instanceData, messageData, senderData } = payload

        if (typeWebhook === 'incomingMessageReceived') {
            return {
                event: 'message.received',
                instance: instanceData?.idInstance,
                data: {
                    remoteJid: senderData?.chatId || messageData?.chatId,
                    fromMe: false,
                    id: messageData?.idMessage,
                    timestamp: Math.floor(Date.now() / 1000),
                    type: messageData?.typeMessage || 'text',
                    content: {
                        text: messageData?.textMessage || messageData?.extendedTextMessage?.text
                    }
                }
            }
        }

        if (typeWebhook === 'stateInstanceChanged') {
            return {
                event: 'connection.update',
                instance: instanceData?.idInstance,
                data: {
                    state: instanceData?.stateInstance === 'authorized' ? 'open' : 'close'
                }
            }
        }

        return { event: 'unknown', instance: null, data: payload }
    }

    async healthCheck() {
        const start = Date.now()
        try {
            const response = await fetch(this.baseUrl, { method: 'HEAD' })
            return {
                healthy: response.ok,
                latency: Date.now() - start
            }
        } catch {
            return { healthy: false, latency: Date.now() - start }
        }
    }
}
