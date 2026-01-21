import { logger } from '../lib/logger';

const rawUrl = import.meta.env.VITE_EVOLUTION_API_URL || 'https://evolution.omger.cloud';
const BASE_URL = rawUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
const API_KEY = import.meta.env.VITE_EVOLUTION_API_KEY || '54yWPufPt9y2Wp9QUap';

const headers = {
    'Content-Type': 'application/json',
    'apikey': API_KEY
};

export const EvolutionApiService = {
    /**
     * Create a new instance
     * @param {string} instanceName 
     * @returns {Promise<object>} Response with instance data and QR code if requested
     */
    async createInstance(instanceName) {
        try {
            const response = await fetch(`${BASE_URL}/api/instances`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    instanceName,
                    qrcode: true,
                    integration: 'WHATSAPP-BAILEYS'
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message?.[0] || errorData.message || 'Failed to create instance');
            }

            return await response.json();
        } catch (error) {
            console.error('EvolutionAPI Create Instance Error:', error);
            throw error;
        }
    },

    /**
     * Fetch QR Code for an existing instance
     * @param {string} instanceName 
     * @returns {Promise<object>}
     */
    async fetchQrCode(instanceName) {
        try {
            const response = await fetch(`${BASE_URL}/api/instances/${instanceName}/qr`, {
                method: 'GET',
                headers
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to fetch QR code');
            }

            return await response.json();
        } catch (error) {
            console.error('EvolutionAPI Fetch QR Error:', error);
            throw error;
        }
    },

    /**
     * Get instance connection state
     * @param {string} instanceName 
     * @returns {Promise<object>}
     */
    async getInstance(instanceName) {
        try {
            const response = await fetch(`${BASE_URL}/api/instances/${instanceName}`, {
                method: 'GET',
                headers
            });

            if (!response.ok) {
                if (response.status === 404) return null; // Not found
                throw new Error('Failed to fetch instance');
            }

            return await response.json();
        } catch (error) {
            console.error('EvolutionAPI Get Instance Error:', error);
            throw error;
        }
    },

    /**
     * Send a text message
     * @param {string} instanceName
     * @param {string} number - Phone number match (normalized)
     * @param {string} text - Message content
     * @returns {Promise<object>}
     */
    async sendText(instanceName, number, text) {
        try {
            const body = {
                number,
                text,
                delay: 1200,
                linkPreview: true
            };

            const response = await fetch(`${BASE_URL}/api/message/sendText/${instanceName}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return { success: false, error: errorData.message?.[0] || errorData.message || 'Failed to send message' };
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error('EvolutionAPI Send Text Error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Send media message
     * @param {string} instanceName
     * @param {string} number
     * @param {object} options - { mediatype, mimetype, caption, media, fileName }
     */
    async sendMedia(instanceName, number, options) {
        try {
            const body = {
                number,
                mediatype: options.mediatype || 'image',
                mimetype: options.mimetype,
                caption: options.caption,
                media: options.media, // Base64
                fileName: options.fileName
            };

            const response = await fetch(`${BASE_URL}/api/message/sendMedia/${instanceName}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return { success: false, error: errorData.message || 'Failed to send media' };
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error('EvolutionAPI Send Media Error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Fetch all chats
     * @param {string} instanceName
     * @returns {Promise<object>}
     */
    async fetchChats(instanceName) {
        try {
            const response = await fetch(`${BASE_URL}/api/chats?instanceName=${instanceName}`, {
                method: 'GET',
                headers
            });

            if (!response.ok) {
                // Return empty if not found or err
                const errorData = await response.json().catch(() => ({}));
                console.warn('EvolutionAPI Fetch Chats Failed:', errorData);
                return { success: false, data: [] };
            }

            const data = await response.json();
            const rawList = Array.isArray(data) ? data : (data.data || []);

            // Normalize to match Green API structure expected by Chats.jsx
            const normalized = rawList.map(chat => ({
                id: chat.remoteJid, // CRITICAL: Use JID as ID, not the internal database ID
                chatId: chat.remoteJid,
                remoteJid: chat.remoteJid,
                name: chat.pushName || chat.name || chat.remoteJid?.split('@')[0],
                unreadCount: chat.unreadCount || 0,
                timestamp: chat.updatedAt ? new Date(chat.updatedAt).getTime() / 1000 : Date.now() / 1000,
                image: chat.profilePicUrl,
                avatar: chat.profilePicUrl,
                lastMessage: chat.lastMessage || {}
            }));

            return { success: true, data: normalized };
        } catch (error) {
            console.error('EvolutionAPI Fetch Chats Error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Fetch messages for a chat
     * @param {string} instanceName
     * @param {string} remoteJid
     * @param {number} limit
     * @returns {Promise<object>}
     */
    async fetchMessages(instanceName, remoteJid, limit = 50) {
        try {
            // Updated endpoint based on standard v2 paths: /chat/findMessages/{instance}
            // Ensure BASE_URL doesn't have double /api
            // Updated to use the Exposed API endpoint documented in workflow
            const response = await fetch(`${BASE_URL}/api/chats/find-messages`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    instanceName,
                    where: {
                        key: { remoteJid }
                    },
                    options: {
                        limit,
                        sort: { "messageTimestamp": "DESC" }
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.warn('EvolutionAPI Fetch Messages Failed:', errorData);
                return { success: false, data: [] };
            }

            const data = await response.json();
            const rawList = Array.isArray(data) ? data : (data.data || data.messages || []);

            // Normalize messages if needed (or return usage-ready format)
            // Chats.jsx and messageSync.js handle some mapping, but let's ensure consistency
            return { success: true, data: rawList };
        } catch (error) {
            console.error('EvolutionAPI Fetch Messages Error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Delete an instance
     * @param {string} instanceName 
     */
    async deleteInstance(instanceName) {
        try {
            const response = await fetch(`${BASE_URL}/api/instances/${instanceName}`, {
                method: 'DELETE',
                headers
            });

            if (!response.ok && response.status !== 404) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to delete instance');
            }

            return true;
        } catch (error) {
            console.error('EvolutionAPI Delete Instance Error:', error);
            throw error;
        }
    }
};
