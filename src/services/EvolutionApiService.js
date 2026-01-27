import { logger } from '../lib/logger';

const rawUrl = import.meta.env.VITE_EVOLUTION_API_URL || 'https://evolution.omger.cloud';
const BASE_URL = rawUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
const API_KEY = import.meta.env.VITE_EVOLUTION_API_KEY || import.meta.env.VITE_EVOLUTION_API_TOKEN || '54yWPufPt9y2Wp9QUap';

const baseHeaders = {
    'Content-Type': 'application/json',
    'apikey': API_KEY
};

// Backward-compatible alias for existing calls that rely on `headers`
const headers = baseHeaders;

const buildHeaders = (apiKeyOverride) => ({
    ...baseHeaders,
    ...(apiKeyOverride ? { apikey: apiKeyOverride } : {})
});

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
     * @param {string} apiKeyOverride - Optional per-instance API key
     * @returns {Promise<object>}
     */
    async sendText(instanceName, number, text, apiKeyOverride) {
        try {
            const body = {
                instanceName,
                number,
                text,
                delay: 1200,
                linkPreview: true
            };

            const response = await fetch(`${BASE_URL}/api/messages/text`, {
                method: 'POST',
                headers: buildHeaders(apiKeyOverride),
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
     * @param {string} apiKeyOverride - Optional per-instance API key
     */
    async sendMedia(instanceName, number, options, apiKeyOverride) {
        try {
            const body = {
                instanceName,
                number,
                mediatype: options.mediatype || 'image',
                mimetype: options.mimetype,
                caption: options.caption,
                media: options.media, // Base64
                fileName: options.fileName
            };

            const response = await fetch(`${BASE_URL}/api/messages/media`, {
                method: 'POST',
                headers: buildHeaders(apiKeyOverride),
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
     * @param {string} apiKeyOverride - Optional per-instance API key
     */
    async sendSticker(instanceName, number, stickerUrl, apiKeyOverride) {
        try {
            const response = await fetch(`${BASE_URL}/api/messages/sticker`, {
                method: 'POST',
                headers: buildHeaders(apiKeyOverride),
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
     * @param {string} apiKeyOverride - Optional per-instance API key
     */
    async sendAudio(instanceName, number, audioUrl, ptt = true, apiKeyOverride) {
        try {
            const response = await fetch(`${BASE_URL}/api/messages/audio`, {
                method: 'POST',
                headers: buildHeaders(apiKeyOverride),
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

            const extractLastMessageText = (lm) => {
                if (!lm) return null;
                // Sometimes API returns the last message already as a string
                if (typeof lm === 'string') return lm;

                // Common flat fields
                if (typeof lm.textMessage === 'string' && lm.textMessage) return lm.textMessage;
                if (typeof lm.conversation === 'string' && lm.conversation) return lm.conversation;
                if (typeof lm.caption === 'string' && lm.caption) return lm.caption;

                // Common nested structures (Baileys-like)
                const msg = lm.message && typeof lm.message === 'object' ? lm.message : null;
                if (msg) {
                    if (typeof msg.conversation === 'string' && msg.conversation) return msg.conversation;
                    const extText = msg.extendedTextMessage?.text;
                    if (typeof extText === 'string' && extText) return extText;
                    const imgCaption = msg.imageMessage?.caption;
                    if (typeof imgCaption === 'string' && imgCaption) return imgCaption;
                    const vidCaption = msg.videoMessage?.caption;
                    if (typeof vidCaption === 'string' && vidCaption) return vidCaption;
                    const docCaption = msg.documentMessage?.caption;
                    if (typeof docCaption === 'string' && docCaption) return docCaption;
                }

                // Some payloads put extendedTextMessage at top-level
                const extTop = lm.extendedTextMessage?.text;
                if (typeof extTop === 'string' && extTop) return extTop;

                // Media with no caption/text
                if (lm.id || lm.key?.id || msg?.imageMessage || msg?.videoMessage || msg?.documentMessage || msg?.audioMessage) {
                    return '[Media]';
                }

                return null;
            };

            // Normalize to match Green API structure expected by Chats.jsx
            const normalized = rawList.map(chat => {
                const remoteJid = chat.remoteJid;
                const isGroup = typeof remoteJid === 'string' && remoteJid.includes('@g.us');
                const lm = chat.lastMessage || {};
                const lastMessageText = extractLastMessageText(lm);

                // IMPORTANT:
                // For Evolution group chats, `pushName` can reflect a participant (often the last sender),
                // which causes groups to show the last responder name instead of the group subject.
                const groupTitle =
                    chat.subject ||
                    chat.groupSubject ||
                    chat.groupName ||
                    chat.name;

                const chatName = isGroup
                    ? (groupTitle || remoteJid?.split('@')[0])
                    : (chat.name || chat.pushName || remoteJid?.split('@')[0]);

                return {
                    id: remoteJid, // CRITICAL: Use JID as ID, not the internal database ID
                    chatId: remoteJid,
                    remoteJid,
                    name: chatName,
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
    },

    /**
     * Send contact card
     * @param {string} instanceName
     * @param {string} number
     * @param {object} contact - { fullName, phoneNumber }
     */
    async sendContact(instanceName, number, contact) {
        try {
            const response = await fetch(`${BASE_URL}/api/messages/contact`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    instanceName,
                    number,
                    contact: [
                        {
                            fullName: contact.fullName || contact.name,
                            phoneNumber: contact.phoneNumber || contact.phone
                        }
                    ]
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return { success: false, error: errorData.message || 'Failed to send contact' };
            }

            return { success: true, data: await response.json() };
        } catch (error) {
            console.error('EvolutionAPI Send Contact Error:', error);
            return { success: false, error: error.message };
        }
    }
};
