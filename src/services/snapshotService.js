import { supabase } from '../lib/supabaseClient';
import { saveMessagesToCache, saveChatsToCache, saveAvatarsToCache } from '../lib/messageLocalCache';

const SNAPSHOT_BUCKET = 'chat-snapshots';

/**
 * SNAPSHOT SERVICE:
 * Accelerates initial loading by bundling all chat state (chats, messages, avatars)
 * into a single JSON file stored in Supabase Storage.
 */

/**
 * Uploads a state snapshot for a specific instance.
 */
export async function uploadStateSnapshot(instanceId, payload) {
    try {
        const filename = `${instanceId}/latest_snapshot.json`;
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });

        const { error } = await supabase.storage
            .from(SNAPSHOT_BUCKET)
            .upload(filename, blob, {
                contentType: 'application/json',
                upsert: true
            });

        if (error) {
            // If error is bucket not found, we might need to handle it once
            console.warn('[SNAPSHOT] Upload error:', error.message);
            return { success: false, error: error.message };
        }

        console.log(`[SNAPSHOT] State snapshot updated for ${instanceId}`);
        return { success: true };
    } catch (error) {
        console.error('[SNAPSHOT] Critical upload error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Loads a state snapshot and populates local caches.
 */
export async function bootstrapFromSnapshot(instanceId) {
    try {
        const filename = `${instanceId}/latest_snapshot.json`;

        // Use the public or signed URL path depending on bucket config
        const { data, error } = await supabase.storage
            .from(SNAPSHOT_BUCKET)
            .download(filename);

        if (error) {
            console.log(`[SNAPSHOT] No snapshot found for ${instanceId}`);
            return { success: false };
        }

        const text = await data.text();
        const payload = JSON.parse(text);

        // 1. Populate Chat List
        if (payload.chats) {
            saveChatsToCache(instanceId, payload.chats);
        }

        // 2. Populate Message Caches
        if (payload.messageChunks) {
            Object.entries(payload.messageChunks).forEach(([chatId, messages]) => {
                saveMessagesToCache(instanceId, chatId, messages);
            });
        }

        // 3. Populate Avatars
        if (payload.avatars) {
            saveAvatarsToCache(instanceId, new Map(Object.entries(payload.avatars)));
        }

        console.log(`[SNAPSHOT] Boostrapped ${instanceId} from snapshot. Time: ${payload.timestamp}`);
        return { success: true, timestamp: payload.timestamp };
    } catch (error) {
        console.error('[SNAPSHOT] Bootstrap error:', error);
        return { success: false, error: error.message };
    }
}
