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
     * Send sticker message
     * @param {string} instanceName
     * @param {string} number
     * @param {string} stickerUrl
     */
    async sendSticker(instanceName, number, stickerUrl) {
        try {
            const response = await fetch(`${BASE_URL}/api/messages/sticker`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    instanceName,
                    number,
                    sticker: stickerUrl
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return { success: false, error: errorData.message || 'Failed to send sticker' };
            }

            return { success: true, data: await response.json() };
        } catch (error) {
            console.error('EvolutionAPI Send Sticker Error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Send audio/voice note
     * @param {string} instanceName
     * @param {string} number
     * @param {string} audioUrl
     * @param {boolean} ptt - If true, sends as Voice Note (blue mic)
     */
    async sendAudio(instanceName, number, audioUrl, ptt = true) {
        try {
            const response = await fetch(`${BASE_URL}/api/messages/audio`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    instanceName,
                    number,
                    audioUrl,
                    ptt
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return { success: false, error: errorData.message || 'Failed to send audio' };
            }

            return { success: true, data: await response.json() };
        } catch (error) {
            console.error('EvolutionAPI Send Audio Error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Update/Edit a message
     * @param {string} instanceName
     * @param {string} messageKey - The ID of the message to edit
     * @param {string} newMessage - New text content
     */
    async updateMessage(instanceName, messageKey, newMessage) {
        try {
            const response = await fetch(`${BASE_URL}/api/chats/update-message`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({
                    instanceName,
                    messageKey,
                    newMessage
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return { success: false, error: errorData.message || 'Failed to update message' };
            }

            return { success: true, data: await response.json() };
        } catch (error) {
            console.error('EvolutionAPI Update Message Error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Delete a message (for everyone)
     * @param {string} instanceName
     * @param {string} messageId - The message ID/Key
     * @param {string} remoteJid - The chat JID
     * @param {boolean} fromMe - Check if message is from me (usually required)
     */
    async deleteMessage(instanceName, messageId, remoteJid, fromMe = true) {
        try {
            const response = await fetch(`${BASE_URL}/api/chats/delete-message`, {
                method: 'DELETE',
                headers,
                body: JSON.stringify({
                    instanceName,
                    messageKey: {
                        id: messageId,
                        remoteJid,
                        fromMe
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return { success: false, error: errorData.message || 'Failed to delete message' };
            }

            return { success: true, data: await response.json() };
        } catch (error) {
            console.error('EvolutionAPI Delete Message Error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Mark chat as read
     * @param {string} instanceName
     * @param {string} remoteJid
     */
    async markRead(instanceName, remoteJid) {
        try {
            const response = await fetch(`${BASE_URL}/api/chats/mark-read`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({
                    instanceName,
                    remoteJid
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return { success: false, error: errorData.message || 'Failed to mark as read' };
            }

            return { success: true, data: await response.json() };
        } catch (error) {
            console.error('EvolutionAPI Mark Read Error:', error);
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
            const normalized = rawList.map(chat => {
                const lm = chat.lastMessage || {};
                // Improved text extraction for last message
                const lastMessageText = lm.textMessage ||
                    lm.conversation ||
                    lm.extendedTextMessage?.text ||
                    lm.message ||
                    lm.caption ||
                    (lm.id ? '' : null); // If it has an ID but no text, it's likely media

                return {
                    id: chat.remoteJid, // CRITICAL: Use JID as ID, not the internal database ID
                    chatId: chat.remoteJid,
                    remoteJid: chat.remoteJid,
                    name: chat.name || chat.pushName || chat.remoteJid?.split('@')[0],
                    unreadCount: chat.unreadCount || 0,
                    timestamp: chat.updatedAt ? new Date(chat.updatedAt).getTime() / 1000 : Date.now() / 1000,
                    image: chat.profilePicUrl,
                    avatar: chat.profilePicUrl,
                    lastMessage: lastMessageText // Store the text string directly for easy UI use
                };
            });

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

            // Handle various likely response structures
            // Target: data.data.messages.records (from user's JSON)
            let rawList = [];

            if (data?.data?.messages?.records && Array.isArray(data.data.messages.records)) {
                rawList = data.data.messages.records;
            } else if (data?.data?.messages && Array.isArray(data.data.messages)) {
                rawList = data.data.messages;
            } else if (Array.isArray(data?.data)) {
                rawList = data.data;
            } else if (Array.isArray(data)) {
                rawList = data;
            } else if (data?.messages && Array.isArray(data.messages)) {
                rawList = data.messages;
            }

            return { success: true, data: rawList };
        } catch (error) {
            console.error('EvolutionAPI Fetch Messages Error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Send presence (composing, recording)
     * @param {string} instanceName
     * @param {string} remoteJid
     * @param {string} presence - 'composing', 'recording', 'available'
     */
    async sendPresence(instanceName, remoteJid, presence) {
        try {
            const response = await fetch(`${BASE_URL}/api/chats/presence`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    instanceName,
                    remoteJid,
                    presence
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return { success: false, error: errorData.message || 'Failed to set presence' };
            }

            return { success: true };
        } catch (error) {
            console.error('EvolutionAPI Send Presence Error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Download media (Base64)
     * @param {string} instanceName
     * @param {object} message - The full message object containing media
     * @returns {Promise<object>} { success: true, base64: "..." }
     */
    async downloadMedia(instanceName, message) {
        try {
            const response = await fetch(`${BASE_URL}/api/chats/download-media`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    instanceName,
                    message,
                    convertToMp4: false
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return { success: false, error: errorData.message || 'Failed to download media' };
            }

            const data = await response.json();
            let base64 = data.base64;
            // Handle nested data object (e.g. { data: { base64: "..." } })
            if (!base64 && data.data) {
                if (typeof data.data === 'string') {
                    base64 = data.data;
                } else if (data.data.base64) {
                    base64 = data.data.base64;
                }
            }
            return { success: true, base64 };
        } catch (error) {
            console.error('EvolutionAPI Download Media Error:', error);
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
    },

    /**
     * Fetch profile picture (avatar) for a contact or group
     * @param {string} instanceName
     * @param {string} number - remoteJid
     * @returns {Promise<object>} { success: true, data: { profilePictureUrl: "..." } }
     */
    async fetchProfilePicture(instanceName, number) {
        try {
            const response = await fetch(`${BASE_URL}/api/profile/picture-url`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ instanceName, number })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return { success: false, error: errorData.message || 'Failed to fetch profile picture' };
            }

            const data = await response.json();
            // The response for /api/profile/picture-url is expected to have the URL
            const profilePictureUrl = data.profilePictureUrl || data.data?.profilePictureUrl || data.url || data.picture || null;
            return { success: true, data: { urlAvatar: profilePictureUrl } };
        } catch (error) {
            console.error('EvolutionAPI Fetch Profile Picture Error:', error);
            return { success: false, error: error.message };
        }
    }
};
