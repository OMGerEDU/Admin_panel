// Message cache - prevents redundant Green API calls
// Similar to extension's caching strategy

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const SYNC_COOLDOWN = 30 * 1000; // 30 seconds between syncs for same chat

const cache = {
  chats: new Map(), // chatId -> { data, timestamp }
  messages: new Map(), // chatId -> { data, timestamp, lastSync }
  lastFullSync: null, // timestamp of last full sync
};

/**
 * Check if we should sync chats (not synced recently)
 */
export function shouldSyncChats() {
  if (!cache.lastFullSync) return true;
  const timeSinceSync = Date.now() - cache.lastFullSync;
  return timeSinceSync > CACHE_TTL;
}

/**
 * Mark chats as synced
 */
export function markChatsSynced() {
  cache.lastFullSync = Date.now();
}

/**
 * Check if we should sync messages for a chat
 */
export function shouldSyncMessages(chatId) {
  const cached = cache.messages.get(chatId);
  if (!cached) return true;
  
  const timeSinceSync = Date.now() - (cached.lastSync || 0);
  return timeSinceSync > SYNC_COOLDOWN;
}

/**
 * Mark messages as synced for a chat
 */
export function markMessagesSynced(chatId) {
  const cached = cache.messages.get(chatId) || {};
  cached.lastSync = Date.now();
  cache.messages.set(chatId, cached);
}

/**
 * Get cached messages count for a chat (to avoid unnecessary syncs)
 */
export function getCachedMessageCount(chatId) {
  const cached = cache.messages.get(chatId);
  return cached?.data?.length || 0;
}

/**
 * Clear cache for a chat (when user explicitly syncs)
 */
export function clearChatCache(chatId) {
  cache.messages.delete(chatId);
}

/**
 * Clear all cache
 */
export function clearAllCache() {
  cache.chats.clear();
  cache.messages.clear();
  cache.lastFullSync = null;
}

