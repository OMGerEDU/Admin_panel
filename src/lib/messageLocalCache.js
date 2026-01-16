// Local Storage Cache for Messages - persists across page reloads
// Key: `whatsapp_messages_${instanceId}_${chatId}`

const CACHE_PREFIX = 'whatsapp_messages_';
const CACHE_VERSION = '1.0';
const MAX_CACHE_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days
const MAX_MESSAGES_PER_CHAT = 2000; // Increase limit even more
const CHATS_CACHE_PREFIX = 'whatsapp_chats_';
const AVATARS_CACHE_PREFIX = 'whatsapp_avatars_';
const SYNC_META_PREFIX = 'whatsapp_sync_meta_';

/**
 * Get cache key for a chat
 */
function getCacheKey(instanceId, chatId) {
    return `${CACHE_PREFIX}${instanceId}_${chatId}`;
}

/**
 * Save messages to localStorage
 */
export function saveMessagesToCache(instanceId, chatId, messages) {
    try {
        const key = getCacheKey(instanceId, chatId);
        const cacheData = {
            version: CACHE_VERSION,
            timestamp: Date.now(),
            messages: messages.slice(-MAX_MESSAGES_PER_CHAT), // Keep only last N messages
            chatId,
        };
        localStorage.setItem(key, JSON.stringify(cacheData));
        console.log(`[CACHE] Saved ${messages.length} messages for ${chatId}`);
    } catch (error) {
        console.error('[CACHE] Error saving to localStorage:', error);
        // If quota exceeded, try to clean old cache
        if (error.name === 'QuotaExceededError') {
            cleanOldCache();
        }
    }
}

/**
 * Load messages from localStorage
 */
export function loadMessagesFromCache(instanceId, chatId) {
    try {
        const key = getCacheKey(instanceId, chatId);
        const cached = localStorage.getItem(key);

        if (!cached) {
            return null;
        }

        const cacheData = JSON.parse(cached);

        // Check if cache is valid
        if (cacheData.version !== CACHE_VERSION) {
            console.log('[CACHE] Cache version mismatch, clearing');
            localStorage.removeItem(key);
            return null;
        }

        // Check if cache is too old
        const age = Date.now() - cacheData.timestamp;
        if (age > MAX_CACHE_AGE) {
            console.log('[CACHE] Cache too old, clearing');
            localStorage.removeItem(key);
            return null;
        }

        console.log(`[CACHE] Loaded ${cacheData.messages.length} messages for ${chatId} (age: ${Math.round(age / 1000)}s)`);
        return cacheData.messages;
    } catch (error) {
        console.error('[CACHE] Error loading from localStorage:', error);
        return null;
    }
}

/**
 * Merge new messages with cached messages (remove duplicates, keep sorted)
 * REFACTORED: Aggressive deduplication strategies
 */
export function mergeMessages(cachedMessages, newMessages) {
    const combined = [...(cachedMessages || []), ...(newMessages || [])];

    // 1. Deduplication Map by ID
    const messageMap = new Map();
    // 2. Content Hash Set to catch duplicates that have no ID or mixed ID/No-ID state
    // Hash format: `${timestamp}_${fromMe}_${text_preview}`
    const contentHashSet = new Set();

    // Sort combined list by timestamp to ensure we process in order
    // This helps keep the "best" version if we encounter duplicates
    combined.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

    const result = [];

    combined.forEach(msg => {
        // Normalize Text
        const text = msg.textMessage || msg.conversation || msg.content || '';
        // Allow messages without text if they have other content (like media), but if truly empty ignore
        if (!text && !msg.typeMessage && !msg.imageMessage && !msg.videoMessage) return;

        // Create Content Hash (Dedupe Key)
        // usage of 'Math.floor' on timestamp helps if there are slight ms differences
        const ts = msg.timestamp || 0;
        const hash = `${ts}_${msg.fromMe}_${text ? text.substring(0, 50) : 'media'}`;

        const id = msg.idMessage || msg.id;

        if (id) {
            // If it has an ID, we prioritize ID uniqueness
            if (!messageMap.has(id)) {
                // If we also haven't seen this content hash, it's definitely new.
                // If we HAVE seen the content hash, it usually means we have a temp (no-id) version of this message.
                // In that case, we should strictly prefer this ID version.
                // BUT, we might have already pushed the temp version to 'result'.
                // To fix this perfectly, we would need two passes, but let's stick to the simple robust rule:
                // Trust ID. Trust Hash if No ID.

                messageMap.set(id, msg);
                contentHashSet.add(hash);
                result.push(msg);
            }
        } else {
            // NO ID: Strictly check content hash
            if (!contentHashSet.has(hash)) {
                // New unique content
                const tempId = `temp_${ts}_${Math.random().toString(36).substr(2, 9)}`;
                const msgWithId = { ...msg, idMessage: tempId };

                contentHashSet.add(hash);
                result.push(msgWithId);
            }
        }
    });

    // Final sort
    result.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    return result;
}

/**
 * Clear cache for a specific chat
 */
export function clearChatCache(instanceId, chatId) {
    try {
        const key = getCacheKey(instanceId, chatId);
        localStorage.removeItem(key);
        console.log(`[CACHE] Cleared cache for ${chatId}`);
    } catch (error) {
        console.error('[CACHE] Error clearing cache:', error);
    }
}

/**
 * Clear all message caches (cleanup)
 */
export function clearAllCache() {
    try {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(CACHE_PREFIX)) {
                localStorage.removeItem(key);
            }
        });
        console.log('[CACHE] Cleared all message caches');
    } catch (error) {
        console.error('[CACHE] Error clearing all cache:', error);
    }
}

/**
 * Clean old cache entries (when quota exceeded)
 */
function cleanOldCache() {
    try {
        const keys = Object.keys(localStorage);
        const cacheEntries = [];

        keys.forEach(key => {
            if (key.startsWith(CACHE_PREFIX)) {
                try {
                    const cached = JSON.parse(localStorage.getItem(key));
                    if (cached && cached.timestamp) {
                        cacheEntries.push({ key, timestamp: cached.timestamp });
                    }
                } catch (e) {
                    // Invalid cache, remove it
                    localStorage.removeItem(key);
                }
            }
        });

        // Sort by timestamp (oldest first)
        cacheEntries.sort((a, b) => a.timestamp - b.timestamp);

        // Remove oldest 50% of caches
        const toRemove = Math.floor(cacheEntries.length / 2);
        for (let i = 0; i < toRemove; i++) {
            localStorage.removeItem(cacheEntries[i].key);
        }

        console.log(`[CACHE] Cleaned ${toRemove} old cache entries`);
    } catch (error) {
        console.error('[CACHE] Error cleaning old cache:', error);
    }
}

/**
 * Save chat list to localStorage
 */
export function saveChatsToCache(instanceId, chats) {
    try {
        const key = `${CHATS_CACHE_PREFIX}${instanceId}`;
        const cacheData = {
            version: CACHE_VERSION,
            timestamp: Date.now(),
            chats: chats,
        };
        localStorage.setItem(key, JSON.stringify(cacheData));
        console.log(`[CACHE] Saved ${chats.length} chats for instance ${instanceId}`);
    } catch (error) {
        console.error('[CACHE] Error saving chats to localStorage:', error);
    }
}

/**
 * Load chat list from localStorage
 */
export function loadChatsFromCache(instanceId) {
    try {
        const key = `${CHATS_CACHE_PREFIX}${instanceId}`;
        const cached = localStorage.getItem(key);

        if (!cached) return null;

        const cacheData = JSON.parse(cached);

        // Cache is valid for 24 hours for the list summary (instant load)
        const age = Date.now() - cacheData.timestamp;
        if (age > 24 * 60 * 60 * 1000) return null;

        return cacheData.chats;
    } catch (error) {
        console.error('[CACHE] Error loading chats from localStorage:', error);
        return null;
    }
}

/**
 * Save avatar map to localStorage
 * @param {string} instanceId 
 * @param {Map|Object} avatars - Map or Object of {chatId: url}
 */
export function saveAvatarsToCache(instanceId, avatars) {
    try {
        const key = `${AVATARS_CACHE_PREFIX}${instanceId}`;
        const data = avatars instanceof Map ? Object.fromEntries(avatars) : avatars;
        const cacheData = {
            version: CACHE_VERSION,
            timestamp: Date.now(),
            avatars: data,
        };
        localStorage.setItem(key, JSON.stringify(cacheData));
        // console.log(`[CACHE] Saved avatars for instance ${instanceId}`);
    } catch (error) {
        console.error('[CACHE] Error saving avatars to localStorage:', error);
    }
}

/**
 * Load avatar map from localStorage
 * @param {string} instanceId 
 * @returns {Map} Map of {chatId: url}
 */
export function loadAvatarsFromCache(instanceId) {
    try {
        const key = `${AVATARS_CACHE_PREFIX}${instanceId}`;
        const cached = localStorage.getItem(key);

        if (!cached) return new Map();

        const cacheData = JSON.parse(cached);

        // Avatars cache is valid for 30 days
        const age = Date.now() - cacheData.timestamp;
        if (age > 30 * 24 * 60 * 60 * 1000) return new Map();

        return new Map(Object.entries(cacheData.avatars || {}));
    } catch (error) {
        console.error('[CACHE] Error loading avatars from localStorage:', error);
        return new Map();
    }
}

/**
 * Save sync metadata for a chat (e.g. last fetched timestamp)
 */
export function saveSyncMeta(instanceId, chatId, meta) {
    try {
        const key = `${SYNC_META_PREFIX}${instanceId}_${chatId}`;
        localStorage.setItem(key, JSON.stringify({
            ...meta,
            updatedAt: Date.now()
        }));
    } catch (e) { }
}

/**
 * Get sync metadata for a chat
 */
export function getSyncMeta(instanceId, chatId) {
    try {
        const key = `${SYNC_META_PREFIX}${instanceId}_${chatId}`;
        const cached = localStorage.getItem(key);
        return cached ? JSON.parse(cached) : null;
    } catch (e) {
        return null;
    }
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
    try {
        const keys = Object.keys(localStorage);
        const cacheEntries = keys.filter(key => key.startsWith(CACHE_PREFIX));

        let totalMessages = 0;
        let totalSize = 0;

        cacheEntries.forEach(key => {
            try {
                const cached = JSON.parse(localStorage.getItem(key));
                if (cached && cached.messages) {
                    totalMessages += cached.messages.length;
                    totalSize += JSON.stringify(cached).length;
                }
            } catch (e) {
                // Skip invalid entries
            }
        });

        return {
            chatCount: cacheEntries.length,
            totalMessages,
            totalSizeKB: Math.round(totalSize / 1024),
        };
    } catch (error) {
        console.error('[CACHE] Error getting cache stats:', error);
        return { chatCount: 0, totalMessages: 0, totalSizeKB: 0 };
    }
}
