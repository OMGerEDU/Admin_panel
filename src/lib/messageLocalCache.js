// Local Storage Cache for Messages - persists across page reloads
// Key: `whatsapp_messages_${instanceId}_${chatId}`

const CACHE_PREFIX = 'whatsapp_messages_';
const CACHE_VERSION = '1.0';
const MAX_CACHE_AGE = 24 * 60 * 60 * 1000; // 24 hours
const MAX_MESSAGES_PER_CHAT = 500; // Limit cache size per chat
const CHATS_CACHE_PREFIX = 'whatsapp_chats_';

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
 */
export function mergeMessages(cachedMessages, newMessages) {
    if (!cachedMessages || cachedMessages.length === 0) {
        return newMessages;
    }

    if (!newMessages || newMessages.length === 0) {
        return cachedMessages;
    }

    // Create a map of existing messages by idMessage
    const messageMap = new Map();
    cachedMessages.forEach(msg => {
        const id = msg.idMessage || msg.id;
        if (id) {
            messageMap.set(id, msg);
        }
    });

    // Add or update messages from newMessages
    newMessages.forEach(msg => {
        const id = msg.idMessage || msg.id;
        if (id) {
            // Keep the newer version
            const existing = messageMap.get(id);
            if (!existing || (msg.timestamp && existing.timestamp && msg.timestamp > existing.timestamp)) {
                messageMap.set(id, msg);
            }
        } else {
            // If no ID, add it anyway (might be a new message)
            messageMap.set(`temp_${Date.now()}_${Math.random()}`, msg);
        }
    });

    // Convert back to array and sort by timestamp
    const merged = Array.from(messageMap.values());
    merged.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

    return merged;
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

        // Cache is valid for 1 hour for the list summary
        const age = Date.now() - cacheData.timestamp;
        if (age > 60 * 60 * 1000) return null;

        return cacheData.chats;
    } catch (error) {
        console.error('[CACHE] Error loading chats from localStorage:', error);
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

