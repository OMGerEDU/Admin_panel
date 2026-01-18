/**
 * Evolution API Service - v1
 * 
 * This service manages all interactions with the Evolution API v1.
 * It is structured to mirror the Green API service but tailored for Evolution API's endpoints.
 * 
 * @module services/evolutionApi
 */

import { logger } from '../lib/logger';

// Default base URL, can be overridden by env var or arguments
// Helper to retrieve Base URL dynamically (supports Vite env and Node process.env)
const getBaseUrl = () => {
    // Check Vite's import.meta.env
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_EVOLUTION_API_URL) {
        return import.meta.env.VITE_EVOLUTION_API_URL;
    }
    // Check Node's process.env (for testing environments like Vitest without Vite transform, or fallback)
    if (typeof process !== 'undefined' && process.env && process.env.VITE_EVOLUTION_API_URL) {
        return process.env.VITE_EVOLUTION_API_URL;
    }
    return 'http://localhost:8080';
};

/**
 * Generic Evolution API call helper.
 * 
 * @param {string} instanceName - The name of the instance (e.g., "Sasha").
 * @param {string} token - The API Key (Global or Instance specific).
 * @param {string} endpoint - The specific endpoint path (e.g., "message/sendText").
 * @param {object} options - Fetch options (method, body, etc.).
 * @returns {Promise<object>} - { success: boolean, data?: any, error?: any }
 */
async function evolutionApiCall(instanceName, token, endpoint, options = {}) {
    // normalize base url to remove trailing slash
    const baseUrl = (options.baseUrl || getBaseUrl()).replace(/\/$/, '');

    // Construct URL. Note: Most Evolution API endpoints follow /{controller}/{action}/{instance}
    // But some are global. The 'endpoint' argument should handle the structure relative to base.
    // We will assume the caller passes the full relative path, including instanceName if needed.
    const url = `${baseUrl}/${endpoint}`;

    const config = {
        method: options.method || 'GET',
        headers: {
            'Content-Type': 'application/json',
            'apikey': token, // Evolution API generic auth header
            'x-api-key': token, // Support for Coolify/Specific setups
            ...(options.headers || {}),
        },
    };

    if (options.body) {
        config.body = JSON.stringify(options.body);
    }

    // Handle Query Params
    if (options.queryParams) {
        const params = new URLSearchParams(options.queryParams);
        // If url already has '?', append with '&', else '?'
        const separator = url.includes('?') ? '&' : '?';
        // We cannot easily modify 'const url', so we'd need to reconstruct.
        // For simplicity, let's just append to a new variable.
        // In this specific helper design, let's assume endpoint might not have params often 
        // or we handle it here.
        // simpler:
        const fullUrl = `${url}${separator}${params.toString()}`;
        // Re-assign url to fullUrl for the fetch
        // (JavaScript closure generic, let's just use the result in fetch)
        try {
            console.log(`[EvolutionAPI] Fetching: ${fullUrl}`); // DEBUG LOG
            const response = await fetch(fullUrl, config);

            if (!response.ok) {
                const errorText = await response.text();
                await logger.error('Evolution API HTTP error', {
                    status: response.status,
                    endpoint,
                    errorText: errorText.slice(0, 500),
                });
                return { success: false, error: `HTTP ${response.status}: ${errorText}` };
            }

            // Some endpoints might return empty body (204)
            if (response.status === 204) {
                return { success: true };
            }

            const data = await response.json();
            return { success: true, data };

        } catch (error) {
            console.error('Evolution API Request Error:', error);
            return { success: false, error: error.message };
        }
    } else {
        // Duplicate logic for non-query param path (refactor if preferred)
        try {
            console.log(`[EvolutionAPI] Fetching: ${url}`); // DEBUG LOG
            const response = await fetch(url, config);

            if (!response.ok) {
                const errorText = await response.text();
                await logger.error('Evolution API HTTP error', {
                    status: response.status,
                    endpoint,
                    errorText: errorText.slice(0, 500),
                });
                return { success: false, error: `HTTP ${response.status}: ${errorText}` };
            }

            if (response.status === 204) {
                return { success: true };
            }

            const data = await response.json();
            return { success: true, data };

        } catch (error) {
            console.error('Evolution API Request Error:', error);
            return { success: false, error: error.message };
        }
    }
}

// ==============================================================================
// 1. Instance Controller
// ==============================================================================

export const instanceController = {
    create: async (token, instanceName, settings = {}) => {
        return evolutionApiCall(null, token, 'instance/create', { // Global endpoint? Usually just /instance/create
            method: 'POST',
            body: { instanceName, ...settings }
        });
    },

    fetchInstances: async (token) => {
        return evolutionApiCall(null, token, 'instances', {
            method: 'GET'
        });
    },

    connect: async (instance, token) => {
        return evolutionApiCall(instance, token, `instance/connect/${instance}`, {
            method: 'GET'
        });
    },

    async connectionState(instanceName, token) {
        // Based on probes: /instances/{instanceName} returns the instance object with connectionStatus
        const result = await evolutionApiCall(null, token, `instances/${instanceName}`);
        if (result.success && result.data) {
            // Map the response to a standard format if needed, or just return the data
            // The integration test expects result.data.instance.state or similar? 
            // The API returns { name: "...", connectionStatus: "...", ... } directly or in .data?
            // evolutionApiCall returns { success: true, data: JSON }
            // If the API returns JSON: { name: "...", ... }
            // Then result.data is that object.
            // We can map connectionStatus to state for compatibility
            return {
                success: true,
                data: {
                    instance: {
                        state: result.data.connectionStatus,
                        ...result.data
                    }
                }
            };
        }
        return result;
    },

    logout: async (instance, token) => {
        return evolutionApiCall(instance, token, `instance/logout/${instance}`, {
            method: 'DELETE'
        });
    },

    delete: async (instance, token) => {
        return evolutionApiCall(instance, token, `instance/delete/${instance}`, {
            method: 'DELETE'
        });
    },

    restart: async (instance, token) => {
        return evolutionApiCall(instance, token, `instance/restart/${instance}`, {
            method: 'PUT'
        });
    },

    setPresence: async (instance, token, presence) => {
        // presence: 'available' | 'unavailable'
        return evolutionApiCall(instance, token, `instance/setPresence/${instance}`, {
            method: 'POST',
            body: { presence }
        });
    }
};

// ==============================================================================
// 2. Chat Controller
// ==============================================================================

export const chatController = {
    checkWhatsApp: async (instance, token, numbers) => {
        // numbers: string[]
        return evolutionApiCall(instance, token, `chat/whatsappNumbers/${instance}`, {
            method: 'POST',
            body: { numbers }
        });
    },

    findChats: async (instance, token) => {
        return evolutionApiCall(instance, token, `chat/findChats/${instance}`, {
            method: 'GET'
        });
    },

    findMessages: async (instance, token, chatId, options = {}) => {
        // options: { count, page, ... }
        return evolutionApiCall(instance, token, `chat/findMessages/${instance}`, {
            method: 'POST',
            body: { chatId, ...options }
        });
    },

    findStatusMessage: async (instance, token, options = {}) => {
        return evolutionApiCall(instance, token, `chat/findStatusMessage/${instance}`, {
            method: 'POST',
            body: options
        });
    },

    findContacts: async (instance, token) => {
        return evolutionApiCall(instance, token, `chat/findContacts/${instance}`, {
            method: 'POST' // Docs say POST usually for sync/check
        });
    },

    fetchProfilePictureUrl: async (instance, token, number) => {
        return evolutionApiCall(instance, token, `chat/fetchProfilePictureUrl/${instance}`, {
            method: 'POST',
            body: { number }
        });
    },

    archiveChat: async (instance, token, chatId, archive = true) => {
        return evolutionApiCall(instance, token, `chat/archiveChat/${instance}`, {
            method: 'PUT',
            body: { chatId, archive }
        });
    },

    deleteMessageForEveryone: async (instance, token, chatId, messageId) => {
        return evolutionApiCall(instance, token, `chat/deleteMessageForEveryone/${instance}`, {
            method: 'DELETE',
            body: { chatId, messageId }
        });
    },

    markMessageAsRead: async (instance, token, chatId) => {
        // Some versions take array of messages or just chat
        return evolutionApiCall(instance, token, `chat/markMessageAsRead/${instance}`, {
            method: 'PUT',
            body: { readMessages: [chatId] } // Typically expected payload structure might vary, assume simple
        });
    },

    updateMessage: async (instance, token, chatId, messageId, newMessage) => {
        return evolutionApiCall(instance, token, `chat/updateMessage/${instance}`, {
            method: 'PUT',
            body: { chatId, messageId, newMessage }
        });
    },

    sendPresence: async (instance, token, chatId, presence) => {
        // presence: 'composing' | 'recording' | 'paused'
        return evolutionApiCall(instance, token, `chat/sendPresence/${instance}`, {
            method: 'POST',
            body: { chatId, presence }
        });
    }
};

// ==============================================================================
// 3. Group Controller
// ==============================================================================

export const groupController = {
    create: async (instance, token, subject, participants) => {
        return evolutionApiCall(instance, token, `group/create/${instance}`, {
            method: 'POST',
            body: { subject, participants }
        });
    },

    fetchAllGroups: async (instance, token, getParticipants = false) => {
        return evolutionApiCall(instance, token, `group/fetchAllGroups/${instance}`, {
            method: 'GET',
            queryParams: { getParticipants }
        });
    },

    findGroupInfos: async (instance, token, groupJid) => {
        return evolutionApiCall(instance, token, `group/findGroupInfos/${instance}`, {
            method: 'GET',
            queryParams: { groupJid }
        });
    },

    findGroupInfosByInviteCode: async (instance, token, inviteCode) => {
        return evolutionApiCall(instance, token, `group/inviteInfo/${instance}`, {
            method: 'GET',
            queryParams: { inviteCode }
        });
    },

    getParticipants: async (instance, token, groupJid) => {
        return evolutionApiCall(instance, token, `group/participants/${instance}`, {
            method: 'GET',
            queryParams: { groupJid }
        });
    },

    getInviteCode: async (instance, token, groupJid) => {
        return evolutionApiCall(instance, token, `group/inviteCode/${instance}`, {
            method: 'GET',
            queryParams: { groupJid }
        });
    },

    revokeInviteCode: async (instance, token, groupJid) => {
        return evolutionApiCall(instance, token, `group/revokeInviteCode/${instance}`, {
            method: 'PUT',
            body: { groupJid }
        });
    },

    acceptInviteCode: async (instance, token, inviteCode) => {
        return evolutionApiCall(instance, token, `group/acceptInviteCode/${instance}`, {
            method: 'POST', // Docs said GET but usually actions are POST/PUT
            body: { inviteCode }
        });
    },

    sendInvite: async (instance, token, groupJid, number, caption) => {
        return evolutionApiCall(instance, token, `group/sendInvite/${instance}`, {
            method: 'POST',
            body: { groupJid, number, caption }
        });
    },

    updateSubject: async (instance, token, groupJid, subject) => {
        return evolutionApiCall(instance, token, `group/updateGroupSubject/${instance}`, {
            method: 'PUT',
            body: { groupJid, subject }
        });
    },

    updateDescription: async (instance, token, groupJid, description) => {
        return evolutionApiCall(instance, token, `group/updateGroupDescription/${instance}`, {
            method: 'PUT',
            body: { groupJid, description }
        });
    },

    updatePicture: async (instance, token, groupJid, image) => {
        return evolutionApiCall(instance, token, `group/updateGroupPicture/${instance}`, {
            method: 'PUT',
            body: { groupJid, image }
        });
    },

    updateSetting: async (instance, token, groupJid, action, status) => {
        return evolutionApiCall(instance, token, `group/updateSetting/${instance}`, {
            method: 'PUT',
            body: { groupJid, action, status } // action: 'announcement' | 'locked' | 'not_announcement' | 'unlocked'
        });
    },

    updateParticipant: async (instance, token, groupJid, action, participants) => {
        // action: 'add' | 'remove' | 'promote' | 'demote'
        return evolutionApiCall(instance, token, `group/updateParticipant/${instance}`, {
            method: 'PUT',
            body: { groupJid, action, participants }
        });
    },

    toggleEphemeral: async (instance, token, groupJid, ephemeral) => {
        return evolutionApiCall(instance, token, `group/toggleEphemeral/${instance}`, {
            method: 'PUT',
            body: { groupJid, ephemeral }
        });
    },

    leaveGroup: async (instance, token, groupJid) => {
        return evolutionApiCall(instance, token, `group/leaveGroup/${instance}`, {
            method: 'DELETE',
            body: { groupJid }
        });
    }
};

// ==============================================================================
// 4. Message Controller
// ==============================================================================

export const messageController = {
    sendText: async (instance, token, number, options = {}) => {
        // options: { text, checkNumber, ... }
        return evolutionApiCall(instance, token, `message/sendText/${instance}`, {
            method: 'POST',
            body: { number, ...options }
        });
    },

    sendMedia: async (instance, token, number, options = {}) => {
        // options: { mediatype, mimetype, caption, fileName, media }
        return evolutionApiCall(instance, token, `message/sendMedia/${instance}`, {
            method: 'POST',
            body: { number, ...options }
        });
    },

    sendAudio: async (instance, token, number, audio) => {
        // audio param can be base64 or url depending on impl
        return evolutionApiCall(instance, token, `message/sendWhatsAppAudio/${instance}`, {
            method: 'POST',
            body: { number, audio }
        });
    },

    sendSticker: async (instance, token, number, sticker) => {
        return evolutionApiCall(instance, token, `message/sendSticker/${instance}`, {
            method: 'POST',
            body: { number, sticker }
        });
    },

    sendLocation: async (instance, token, number, location = {}) => {
        // location: { name, address, latitude, longitude }
        return evolutionApiCall(instance, token, `message/sendLocation/${instance}`, {
            method: 'POST',
            body: { number, ...location }
        });
    },

    sendContact: async (instance, token, number, contactParams = {}) => {
        // contactParams: { fullName, waid, phoneNumber, ... }
        return evolutionApiCall(instance, token, `message/sendContact/${instance}`, {
            method: 'POST',
            body: { number, ...contactParams }
        });
    },

    sendList: async (instance, token, number, listParams = {}) => {
        // listParams: { title, description, buttonText, sections }
        return evolutionApiCall(instance, token, `message/sendList/${instance}`, {
            method: 'POST',
            body: { number, ...listParams }
        });
    },

    sendPoll: async (instance, token, number, pollParams = {}) => {
        // pollParams: { name, values, selectableCount }
        return evolutionApiCall(instance, token, `message/sendPoll/${instance}`, {
            method: 'POST',
            body: { number, ...pollParams }
        });
    },

    sendReaction: async (instance, token, key, reaction) => {
        // key: { id, fromMe, ... }
        return evolutionApiCall(instance, token, `message/sendReaction/${instance}`, {
            method: 'POST',
            body: { key, reaction }
        });
    },

    sendStatus: async (instance, token, statusParams = {}) => {
        // statusParams types vary (text, image, video)
        return evolutionApiCall(instance, token, `message/sendStatus/${instance}`, {
            method: 'POST',
            body: statusParams
        });
    },

    sendTemplate: async (instance, token, number, templateParams = {}) => {
        return evolutionApiCall(instance, token, `message/sendTemplate/${instance}`, {
            method: 'POST',
            body: { number, ...templateParams }
        });
    }
};

// ==============================================================================
// 5. Profile Settings
// ==============================================================================

export const profileSettings = {
    fetchProfile: async (instance, token, number) => {
        return evolutionApiCall(instance, token, `chat/fetchProfile/${instance}`, {
            method: 'POST',
            body: { number }
        });
    },

    fetchBusinessProfile: async (instance, token, number) => {
        return evolutionApiCall(instance, token, `chat/fetchBusinessProfile/${instance}`, {
            method: 'POST',
            body: { number }
        });
    },

    fetchPrivacySettings: async (instance, token) => {
        return evolutionApiCall(instance, token, `chat/fetchPrivacySettings/${instance}`, {
            method: 'GET'
        });
    },

    updatePrivacySettings: async (instance, token, settings = {}) => {
        return evolutionApiCall(instance, token, `chat/updatePrivacySettings/${instance}`, {
            method: 'PUT',
            body: settings
        });
    },

    updateProfileName: async (instance, token, name) => {
        return evolutionApiCall(instance, token, `chat/updateProfileName/${instance}`, {
            method: 'POST',
            body: { name }
        });
    },

    updateProfileStatus: async (instance, token, status) => {
        return evolutionApiCall(instance, token, `chat/updateProfileStatus/${instance}`, {
            method: 'POST',
            body: { status }
        });
    },

    updateProfilePicture: async (instance, token, image) => {
        return evolutionApiCall(instance, token, `chat/updateProfilePicture/${instance}`, {
            method: 'PUT',
            body: { image }
        });
    },

    removeProfilePicture: async (instance, token) => {
        return evolutionApiCall(instance, token, `chat/removeProfilePicture/${instance}`, {
            method: 'PUT'
        });
    }
};

// ==============================================================================
// 6. Settings & Webhooks
// ==============================================================================

export const settingsController = {
    find: async (instance, token) => {
        return evolutionApiCall(instance, token, `settings/find/${instance}`, {
            method: 'GET'
        });
    },

    set: async (instance, token, settings = {}) => {
        return evolutionApiCall(instance, token, `settings/set/${instance}`, {
            method: 'POST',
            body: settings
        });
    }
};

export const webhookController = {
    find: async (instance, token) => {
        return evolutionApiCall(instance, token, `webhook/find/${instance}`, {
            method: 'GET'
        });
    },

    set: async (instance, token, webhookSettings = {}) => {
        return evolutionApiCall(instance, token, `webhook/set/${instance}`, {
            method: 'POST',
            body: webhookSettings
        });
    }
};


// ==============================================================================
// 7. Integrations (Typebot, Chatwoot, etc.)
// ==============================================================================

export const integrations = {
    typebot: {
        find: async (instance, token) => {
            return evolutionApiCall(instance, token, `typebot/find/${instance}`, { method: 'GET' });
        },
        set: async (instance, token, settings) => {
            return evolutionApiCall(instance, token, `typebot/set/${instance}`, { method: 'POST', body: settings });
        },
        start: async (instance, token, settings) => {
            return evolutionApiCall(instance, token, `typebot/start/${instance}`, { method: 'POST', body: settings });
        },
        changeStatus: async (instance, token, status) => {
            return evolutionApiCall(instance, token, `typebot/changeStatus/${instance}`, { method: 'POST', body: { status } });
        }
    },

    chatwoot: {
        find: async (instance, token) => {
            return evolutionApiCall(instance, token, `chatwoot/find/${instance}`, { method: 'GET' });
        },
        set: async (instance, token, settings) => {
            return evolutionApiCall(instance, token, `chatwoot/set/${instance}`, { method: 'POST', body: settings });
        }
    },

    rabbitmq: {
        find: async (instance, token) => {
            return evolutionApiCall(instance, token, `rabbitmq/find/${instance}`, { method: 'GET' });
        },
        set: async (instance, token, settings) => {
            return evolutionApiCall(instance, token, `rabbitmq/set/${instance}`, { method: 'POST', body: settings });
        }
    },

    sqs: {
        find: async (instance, token) => {
            return evolutionApiCall(instance, token, `sqs/find/${instance}`, { method: 'GET' });
        },
        set: async (instance, token, settings) => {
            return evolutionApiCall(instance, token, `sqs/set/${instance}`, { method: 'POST', body: settings });
        }
    }
};

export default {
    instance: instanceController,
    chat: chatController,
    group: groupController,
    message: messageController,
    profile: profileSettings,
    settings: settingsController,
    webhook: webhookController,
    integrations
};
