/**
 * Base Provider Interface
 * All WhatsApp providers (GreenAPI, Evolution) must implement this interface
 */
export class BaseProvider {
    constructor(config) {
        this.config = config
        this.name = 'base'
    }

    /**
     * Get provider name
     * @returns {string}
     */
    getName() {
        return this.name
    }

    /**
     * Create a new WhatsApp instance
     * @param {string} instanceName - Unique name for the instance
     * @returns {Promise<{instanceId: string, apiToken: string, qrCode?: string}>}
     */
    async createInstance(instanceName) {
        throw new Error('createInstance() must be implemented')
    }

    /**
     * Get QR code for connecting
     * @param {string} instanceId
     * @returns {Promise<{base64: string, code?: string}>}
     */
    async getQRCode(instanceId) {
        throw new Error('getQRCode() must be implemented')
    }

    /**
     * Delete/logout an instance
     * @param {string} instanceId
     * @returns {Promise<{success: boolean}>}
     */
    async deleteInstance(instanceId) {
        throw new Error('deleteInstance() must be implemented')
    }

    /**
     * Check instance connection status
     * @param {string} instanceId
     * @returns {Promise<{connected: boolean, status: string}>}
     */
    async getStatus(instanceId) {
        throw new Error('getStatus() must be implemented')
    }

    /**
     * Send a text message
     * @param {string} instanceId
     * @param {string} apiToken
     * @param {string} to - Phone number
     * @param {string} text - Message content
     * @returns {Promise<{messageId: string}>}
     */
    async sendText(instanceId, apiToken, to, text) {
        throw new Error('sendText() must be implemented')
    }

    /**
     * Send a media message
     * @param {string} instanceId
     * @param {string} apiToken
     * @param {string} to - Phone number
     * @param {Object} media - {url, type, filename, caption}
     * @returns {Promise<{messageId: string}>}
     */
    async sendMedia(instanceId, apiToken, to, media) {
        throw new Error('sendMedia() must be implemented')
    }

    /**
     * Normalize incoming webhook payload to standard format
     * @param {Object} payload - Raw webhook payload
     * @returns {{event: string, instance: string, data: Object}}
     */
    normalizeWebhook(payload) {
        throw new Error('normalizeWebhook() must be implemented')
    }

    /**
     * Normalize phone number to provider-specific format
     * @param {string} phone
     * @returns {string}
     */
    normalizePhone(phone) {
        let cleaned = phone.replace(/[^\d+]/g, '')
        if (cleaned.startsWith('+')) cleaned = cleaned.substring(1)
        return cleaned
    }

    /**
     * Health check
     * @returns {Promise<{healthy: boolean, latency: number}>}
     */
    async healthCheck() {
        throw new Error('healthCheck() must be implemented')
    }
}
