import {
  getChats,
  getChatHistory,
  getLastIncomingMessages,
  receiveNotification,
  deleteNotification,
  getChatMetadata
} from './greenApi';
import { supabase } from '../lib/supabaseClient';
import { uploadStateSnapshot } from './snapshotService';

// Global state for background sync status
const activeSyncTasks = new Map(); // numberId -> status object

/**
 * Sync chats from Green API into Supabase `chats` table for a given number.
 *
 * @param {string} numberId - Supabase numbers.id
 * @param {string} instanceId - Green API instance ID
 * @param {string} token - Green API token
 */
/**
 * Sync chats - SMART + BATCHED:
 * - Single Green API call (getChats)
 * - Single select from Supabase for existing chats
 * - Single upsert back to Supabase
 *
 * This avoids hundreds of per-chat SELECTs and drastically reduces network traffic.
 */
export async function syncChatsToSupabase(numberId, instanceId, token, enrichNames = false) {
  try {
    // 1) Fetch chats list from Green API (one request)
    const result = await getChats(instanceId, token);

    if (!result.success) {
      return result;
    }

    const chats = result.data || [];
    if (chats.length === 0) {
      return { success: true, data: [] };
    }

    // 2) Fetch all existing chats for this number in a single query
    const { data: existingChats, error: existingError } = await supabase
      .from('chats')
      .select('id, remote_jid, name')
      .eq('number_id', numberId);

    if (existingError) {
      console.error('Error fetching existing chats during sync:', existingError);
    }

    const existingMap = new Map(
      (existingChats || []).map((c) => [c.remote_jid, c]),
    );

    const rows = [];
    const enrichmentTasks = [];

    // 3) Pre-process and collect enrichment tasks
    for (const chat of chats) {
      const chatRemoteId =
        chat.id || chat.chatId || chat.chatIdString || chat.remoteJid;

      if (!chatRemoteId) continue;

      const lastText =
        chat.lastMessage?.textMessage ||
        chat.lastMessage?.extendedTextMessage?.text ||
        chat.lastMessage?.message ||
        chat.lastMessage?.conversation ||
        chat.lastMessage?.caption ||
        null;

      const lastTs =
        chat.lastMessage?.timestamp != null
          ? new Date(chat.lastMessage.timestamp * 1000).toISOString()
          : null;

      const existing = existingMap.get(chatRemoteId);

      // Improved name detection: if name is just a JID or a phone number, consider it "missing"
      const currentName = existing?.name || chat.name || chat.chatName || chat.pushName;
      // Filter out JIDs from names
      const isJid = (n) => n && (n.includes('@s.whatsapp.net') || n.includes('@g.us') || n.includes('@c.us'));
      const isMissingRealName = !currentName || isJid(currentName) || /^\d+$/.test(currentName);

      let displayName = isJid(currentName) ? null : (currentName || null);

      if (enrichNames && isMissingRealName) {
        enrichmentTasks.push({
          chatRemoteId,
          lastText,
          lastTs,
          existingId: existing?.id,
          currentDisplayName: displayName
        });
      } else {
        rows.push({
          number_id: numberId,
          remote_jid: chatRemoteId,
          name: displayName,
          last_message: lastText,
          last_message_at: lastTs
        });
      }
    }

    // 4) Perform Parallel Enrichment in Chunks (faster than serial, safer than massive Promise.all)
    if (enrichmentTasks.length > 0) {
      console.log(`[SYNC] Enriching names for ${enrichmentTasks.length} chats in parallel...`);
      const CHUNK_SIZE = 10;
      for (let i = 0; i < enrichmentTasks.length; i += CHUNK_SIZE) {
        const chunk = enrichmentTasks.slice(i, i + CHUNK_SIZE);
        await Promise.all(chunk.map(async (task) => {
          let enrichedName = task.currentDisplayName;
          try {
            const infoResult = await getChatMetadata(instanceId, token, task.chatRemoteId);
            if (infoResult.success) {
              const remoteName = infoResult.data?.name || infoResult.data?.contactName || infoResult.data?.chatName;
              if (remoteName && !isJid(remoteName)) {
                enrichedName = remoteName;
              }
            }
          } catch (e) {
            console.warn(`[SYNC] Enrichment error for ${task.chatRemoteId}:`, e.message);
          }

          rows.push({
            number_id: numberId,
            remote_jid: task.chatRemoteId,
            name: enrichedName,
            last_message: task.lastText,
            last_message_at: task.lastTs
          });
        }));
        // Small pause between chunks to respect rate limits (jitter added)
        if (i + CHUNK_SIZE < enrichmentTasks.length) {
          await new Promise(r => setTimeout(r, 800 + Math.random() * 400));
        }
      }
    }

    if (rows.length === 0) {
      return { success: true, data: [] };
    }

    // 5) Upsert all chats in a single call
    const { data: upserted, error: upsertError } = await supabase
      .from('chats')
      .upsert(rows, { onConflict: 'number_id,remote_jid' })
      .select();

    if (upsertError) {
      console.error('Error upserting chats during sync:', upsertError);
      return {
        success: false,
        error: upsertError.message || 'Failed to upsert chats',
      };
    }

    return { success: true, data: upserted || [] };
  } catch (error) {
    console.error('syncChatsToSupabase error:', error);
    return { success: false, error: error.message || 'Failed to sync chats' };
  }
}

/**
 * Sync messages for a given chat from Green API into Supabase `messages` table.
 *
 * @param {string} chatId - Supabase chats.id
 * @param {string} instanceId - Green API instance ID
 * @param {string} token - Green API token
 * @param {string} remoteJid - Chat JID in Green API format
 * @param {number} limit - How many messages to load
 */
export async function syncMessagesToSupabase(
  chatId,
  instanceId,
  token,
  remoteJid,
  limit = 100,
) {
  try {
    const result = await getChatHistory(instanceId, token, remoteJid, limit);

    if (result.success && result.data) {
      const messages = result.data || [];

      // Batch sync: Save all new messages to Supabase
      // To be efficient, we do this in the background but we'll wait for this part
      // since fetchMessages depends on accurate data.
      for (const msg of messages) {
        const ts = msg.timestamp != null
          ? new Date(msg.timestamp * 1000).toISOString()
          : new Date().toISOString();

        // Optimized check: only insert if not exists (using maybeSingle to minimize load)
        const { data: existing } = await supabase
          .from('messages')
          .select('id')
          .eq('chat_id', chatId)
          .eq('timestamp', ts)
          .maybeSingle();

        if (!existing) {
          const { content, mediaMeta } = extractMessageContentAndMeta(msg);
          await supabase.from('messages').insert({
            chat_id: chatId,
            content,
            is_from_me: msg.type === 'outgoing' || msg.type === 'outgoingMessage' || msg.fromMe === true,
            timestamp: ts,
            media_meta: mediaMeta,
            green_id: msg.idMessage || msg.id || null
          });
        }
      }
    }

    // Now fetch the authoritative list from Supabase to return to the UI
    const { data: finalMessages, error: finalError } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (finalError) throw finalError;

    // Return in chronological order (oldest first) for the chat UI
    return { success: true, data: (finalMessages || []).reverse() };
  } catch (error) {
    console.error('syncMessagesToSupabase error:', error);
    return {
      success: false,
      error: error.message || 'Failed to sync messages',
    };
  }
}

/**
 * Full sync: chats + messages for a given number.
 * SMART: Only sync messages for chats that don't have many messages yet.
 */
export async function fullSync(numberId, instanceId, token, messageLimit = 50) {
  const chatsResult = await syncChatsToSupabase(numberId, instanceId, token, false); // Don't enrich all names

  if (!chatsResult.success) {
    return chatsResult;
  }

  // Only sync messages for chats that have < 10 messages in DB (new chats)
  const chatsToSync = [];
  for (const chat of chatsResult.data) {
    const { count } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('chat_id', chat.id);

    if ((count || 0) < 10) {
      chatsToSync.push(chat);
    }
  }

  const allMessages = [];

  // Batch sync with delay to avoid rate limits
  for (let i = 0; i < chatsToSync.length; i++) {
    const chat = chatsToSync[i];

    // Add small delay between chats to avoid rate limiting
    if (i > 0) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    const messagesResult = await syncMessagesToSupabase(
      chat.id,
      instanceId,
      token,
      chat.remote_jid,
      messageLimit,
    );

    if (messagesResult.success && messagesResult.data) {
      allMessages.push(...messagesResult.data);
    }
  }

  return {
    success: true,
    data: {
      chats: chatsResult.data,
      messages: allMessages,
    },
  };
}

/**
 * Poll for new Green API notifications and call a callback on new messages.
 * The caller is responsible for scheduling (setInterval).
 */
export async function pollNewMessages(instanceId, token, onNewMessage) {
  try {
    const result = await receiveNotification(instanceId, token);

    // FAILURE CASE: Check for Webhook conflict
    if (!result.success) {
      // If error indicates custom webhook is set (400 Bad Request)
      if (result.error && (result.error.includes('custom webhook url') || result.error.includes('400'))) {
        console.warn('[POLLING] Custom webhook detected, falling back to history polling.');

        // Polling Fallback: Check last 1 minute of income messages
        const historyResult = await getLastIncomingMessages(instanceId, token, 1);

        if (historyResult.success && Array.isArray(historyResult.data)) {
          // Filter for very recent messages (last 30 seconds to be safe)
          const nowSeconds = Math.floor(Date.now() / 1000);
          const cutoff = nowSeconds - 30;

          const recentMessages = historyResult.data.filter(msg => {
            const ts = msg.timestamp || 0;
            return ts >= cutoff;
          });

          // If we found recent messages, trigger the callback for each
          if (recentMessages.length > 0) {
            console.log(`[POLLING] Found ${recentMessages.length} recent messages via history fallback.`);
            if (onNewMessage) {
              // We pass just the message object, simulating the 'incomingMessageReceived' payload
              // Chats.jsx mainly needs to know *something* arrived to trigger a refresh.
              // We pass the last one to be representative.
              await onNewMessage(recentMessages[0], null);

              // Note: We don't delete these form the queue because they are from history/storage, not the notification queue.
            }
          }

          return { success: true, fallback: true, count: recentMessages.length };
        }
      }
      return { success: false, error: result.error };
    }

    if (!result.data) {
      return { success: false };
    }

    const notification = result.data;

    const type = notification?.body?.typeWebhook;
    if (type === 'incomingMessageReceived' || type === 'outgoingMessageStatus') {
      const message = notification.body?.messageData;
      if (onNewMessage && message) {
        await onNewMessage(message, notification);
      }
    }

    if (notification?.receiptId) {
      await deleteNotification(instanceId, token, notification.receiptId);
    }

    return { success: true, data: notification };
  } catch (error) {
    console.error('pollNewMessages error:', error);
    return { success: false, error: error.message || 'Polling failed' };
  }
}

/**
 * DEEP SYNC - Background Worker
 * This performs an iterative sync: 
 * 1. Last 30 days of messages
 * 2. Full history for each active chat
 * 3. Additional 30-day blocks backwards
 */
export async function startBackgroundSync(numberId, instanceId, token) {
  if (activeSyncTasks.has(numberId)) {
    console.log(`[SYNC] Sync already in progress for number ${numberId}`);
    return activeSyncTasks.get(numberId);
  }

  const status = {
    inProgress: true,
    phase: 'starting',
    completedChats: 0,
    totalChats: 0,
    startTime: Date.now()
  };

  activeSyncTasks.set(numberId, status);

  // Run in background (don't await the whole process)
  (async () => {
    try {
      console.log(`[SYNC] Starting Background Sync for ${numberId}`);

      // PHASE 1: Initial Chat List & Last 24h
      status.phase = 'chats';
      const chatsResult = await syncChatsToSupabase(numberId, instanceId, token);
      if (!chatsResult.success) throw new Error(chatsResult.error);

      const chats = chatsResult.data || [];
      status.totalChats = chats.length;

      // PHASE 2+: Discovery Blocks (30 days at a time)
      let daysBack = 0;
      let hasMoreHistory = true;

      while (hasMoreHistory && daysBack < 180) { // Limit to 6 months
        daysBack += 30;
        status.phase = `discovery_${daysBack}_days`;
        console.log(`[SYNC] Scanning: ${daysBack - 30} to ${daysBack} days ago`);

        const minutes = daysBack * 24 * 60;
        const result = await getLastIncomingMessages(instanceId, token, minutes);

        if (result.success && result.data && result.data.length > 0) {
          // Discover new chats and process their messages
          await processMessageBatch(numberId, chats, result.data, instanceId, token);

          // Refresh internal chat list to include discovered ones
          const refreshResult = await syncChatsToSupabase(numberId, instanceId, token);
          if (refreshResult.success) {
            chats.splice(0, chats.length, ...refreshResult.data);
            status.totalChats = chats.length;
          }
        }

        // Deep dive into each chat's own history
        status.phase = `deep_sync_${daysBack}`;
        for (let i = 0; i < chats.length; i++) {
          const chat = chats[i];
          status.completedChats = i;
          status.currentChat = chat.name || chat.remote_jid;
          await syncFullChatHistory(chat, instanceId, token);
          // Moderate delay between different chats
          await new Promise(r => setTimeout(r, 1500 + Math.random() * 500));
        }

        // Stop scanning blocks if we got no messages in this block
        if (!result.success || !result.data || result.data.length === 0) {
          hasMoreHistory = false;
        }

        await new Promise(r => setTimeout(r, 2000));
      }

      console.log(`[SYNC] Completed Background Sync for ${numberId}`);
      status.inProgress = false;
      status.phase = 'completed';
    } catch (err) {
      console.error(`[SYNC] Error during background sync for ${numberId}:`, err);
      status.inProgress = false;
      status.phase = 'error';
      status.error = err.message;
    }
  })();

  return status;
}

/**
 * Syncs the entire history of a single chat back to the beginning
 */
const activeChatSyncs = new Set(); // chatId string

export async function syncFullChatHistory(chat, instanceId, token) {
  const syncKey = `${chat.number_id}:${chat.remote_jid}`;
  if (activeChatSyncs.has(syncKey)) return;
  activeChatSyncs.add(syncKey);

  console.log(`[SYNC] Starting full sync for chat: ${chat.remote_jid}`);

  try {
    let hasMore = true;
    let retryCount = 0;
    let lastId = null;

    while (hasMore) {
      // Get oldest message we have in DB to fetch before it
      const { data: oldest } = await supabase
        .from('messages')
        .select('id, timestamp, green_id')
        .eq('chat_id', chat.id)
        .order('timestamp', { ascending: true })
        .limit(1)
        .maybeSingle();

      const idMessage = oldest?.green_id || null;

      const result = await getChatHistory(instanceId, token, chat.remote_jid, 100, idMessage);

      if (result.success) {
        const messages = result.data || [];
        if (messages.length === 0) {
          hasMore = false;
          break;
        }

        // Process batch
        const processed = await processMessageBatch(chat.number_id, [chat], messages, instanceId, token);

        // If we didn't add anything new, we might have reached the end or a gap
        if (processed.newCount === 0) {
          hasMore = false;
        } else {
          // If we got a full batch, try to go deeper
          hasMore = messages.length >= 50;
        }
      } else {
        if (result.error?.includes('429')) {
          console.warn('[SYNC] Rate limit, waiting 30s...');
          await new Promise(r => setTimeout(r, 30000));
          retryCount++;
          if (retryCount > 3) break;
        } else {
          break;
        }
      }

      await new Promise(r => setTimeout(r, 2000 + Math.random() * 1000));
    }
  } finally {
    activeChatSyncs.delete(syncKey);
    console.log(`[SYNC] Finished full sync for chat: ${chat.remote_jid}`);
  }
}

async function processMessageBatch(numberId, chats, rawMessages, instanceId, token) {
  const chatMap = new Map(chats.map(c => [c.remote_jid, c]));
  let newCount = 0;

  for (const msg of rawMessages) {
    const rawChatId = msg.chatId || msg.remoteJid;
    if (!rawChatId) continue;

    let chat = chatMap.get(rawChatId);

    // Discovery: If chat is missing, create it
    if (!chat) {
      console.log(`[SYNC] Discovered new chat: ${rawChatId}`);
      try {
        // Attempt to get name/avatar from Green API
        let displayName = msg.senderName || msg.senderContactName || rawChatId.split('@')[0];
        try {
          const info = await getChatMetadata(instanceId, token, rawChatId);
          if (info.success) {
            displayName = info.data?.name || info.data?.contactName || info.data?.chatName || displayName;
          }
        } catch (e) {
          console.warn(`[SYNC] Failed to fetch info for ${rawChatId}:`, e.message);
        }

        const { data: newChat, error: createError } = await supabase
          .from('chats')
          .upsert({
            number_id: numberId,
            remote_jid: rawChatId,
            name: displayName
          }, { onConflict: 'number_id,remote_jid' })
          .select()
          .single();

        if (!createError && newChat) {
          chat = newChat;
          chatMap.set(rawChatId, chat);
          chats.push(chat);
        } else {
          continue;
        }
      } catch (e) {
        console.warn(`[SYNC] Failed to create discovered chat: ${rawChatId}`, e);
        continue;
      }
    }

    const ts = msg.timestamp != null
      ? new Date(msg.timestamp * 1000).toISOString()
      : new Date().toISOString();

    const { data: existing } = await supabase
      .from('messages')
      .select('id')
      .eq('chat_id', chat.id)
      .eq('timestamp', ts)
      .maybeSingle();

    if (existing) continue;

    // Use PanelMaster extraction helper for all sync paths
    const { content, mediaMeta } = extractMessageContentAndMeta(msg);

    const { error } = await supabase
      .from('messages')
      .insert({
        chat_id: chat.id,
        content: content,
        is_from_me: msg.type === 'outgoing' || msg.fromMe === true,
        timestamp: ts,
        media_meta: mediaMeta
      });

    if (!error) {
      newCount++;
      // Update chat's last message info if this message is newer
      const currentLastTs = chat.last_message_at ? new Date(chat.last_message_at).getTime() : 0;
      const msgTs = new Date(ts).getTime();

      if (msgTs >= currentLastTs) {
        chat.last_message = content;
        chat.last_message_at = ts;
      }
    }
  }

  // Final metadata update: ensure chats table reflects discovery
  if (newCount > 0) {
    const chatUpdates = Array.from(chatMap.values()).map(c => ({
      id: c.id,
      last_message: c.last_message,
      last_message_at: c.last_message_at,
      name: c.name,
      number_id: c.number_id,
      remote_jid: c.remote_jid
    }));

    // Upsert to update just the metadata
    await supabase.from('chats').upsert(chatUpdates, { onConflict: 'number_id,remote_jid' });
  }

  return { newCount };
}

/**
 * WARM-UP SYNC:
 * Fetches the very latest global history across ALL chats.
 * This ensures the user sees something immediately in their recent chats.
 */
export async function warmUpSync(numberId, instanceId, token) {
  try {
    console.log(`[SYNC] WARM-UP starting for ${numberId}...`);

    // 1. Fetch last incoming (Global)
    const incoming = await getLastIncomingMessages(instanceId, token, 1440);

    // 2. Fetch last outgoing (Global)
    const outgoingResult = await getLastOutgoingMessages(instanceId, token);

    // Green API's lastIncoming/Outgoing usually return up to 100-200 messages total
    // We combine and process them to discover chats
    const messages = [
      ...(incoming.success ? incoming.data : []),
      ...(outgoingResult.success ? outgoingResult.data : [])
    ];

    if (messages.length === 0) return { success: true, count: 0 };

    // Sort by timestamp newest first
    messages.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    // Get current chats to avoid duplicate discovery
    const { data: currentChats } = await supabase.from('chats').select('*').eq('number_id', numberId);

    await processMessageBatch(numberId, currentChats || [], messages, instanceId, token);

    console.log(`[SYNC] WARM-UP finished. Processed ${messages.length} global messages.`);
    return { success: true, count: messages.length, messages };
  } catch (error) {
    console.error('[SYNC] Warm-up error:', error);
    return { success: false, error: error.message };
  }
}

export function getSyncStatus(numberId) {
  return activeSyncTasks.get(numberId);
}

/**
 * TRIGGER SNAPSHOT:
 * Gathers the current known state for an instance and uploads it as a JSON bundle.
 */
export async function triggerStateSnapshot(instanceId) {
  try {
    console.log(`[SNAPSHOT] Creating snapshot for ${instanceId}...`);

    // 1. Get cached chats
    const chats = loadChatsFromCache(instanceId) || [];

    // 2. Get cached avatars
    const avatarsMap = loadAvatarsFromCache(instanceId);
    const avatars = Object.fromEntries(avatarsMap);

    // 3. Get message chunks for recent chats (top 50)
    const messageChunks = {};
    const topChats = chats.slice(0, 50);

    for (const chat of topChats) {
      const cid = chat.chatId || chat.remote_jid;
      if (cid) {
        const msgs = loadMessagesFromCache(instanceId, cid);
        if (msgs && msgs.length > 0) {
          messageChunks[cid] = msgs;
        }
      }
    }

    const payload = {
      instanceId,
      timestamp: new Date().toISOString(),
      chats,
      avatars,
      messageChunks
    };

    return await uploadStateSnapshot(instanceId, payload);
  } catch (error) {
    console.error('[SNAPSHOT] Failed to trigger snapshot:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Resets chat names for a given number ID (clears them in DB)
 * This allows the sync process to try and re-discover names from Green API
 */
export async function resetChatNames(numberId) {
  try {
    const { error } = await supabase
      .from('chats')
      .update({ name: null })
      .eq('number_id', numberId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('[SYNC] Error resetting chat names:', error);
    return { success: false, error: error.message };
  }
}

/**
 * PanelMaster Unified Extraction Helper
 * Extracts content string and media_meta JSON from any Green API message structure.
 */
function extractMessageContentAndMeta(msg) {
  const type = msg.typeMessage || msg.type || '';
  let content =
    msg.textMessage ||
    msg.extendedTextMessage?.text ||
    msg.extendedTextMessageData?.text ||
    msg.message ||
    msg.conversation ||
    msg.caption ||
    msg.text ||
    '';

  let mediaMeta = null;

  if (type === 'imageMessage' || type === 'image') {
    const imageMsg = msg.imageMessage || msg;
    mediaMeta = {
      type: 'image',
      typeMessage: 'imageMessage',
      urlFile: imageMsg.urlFile || msg.urlFile || imageMsg.downloadUrl || msg.downloadUrl || imageMsg.mediaUrl || msg.mediaUrl || null,
      downloadUrl: imageMsg.downloadUrl || msg.downloadUrl || imageMsg.urlFile || msg.urlFile || imageMsg.mediaUrl || msg.mediaUrl || null,
      jpegThumbnail: imageMsg.jpegThumbnail || msg.jpegThumbnail || null,
      caption: imageMsg.caption || msg.caption || content || null,
    };
    if (!content) content = '📷 Image';
  } else if (type === 'videoMessage' || type === 'video') {
    const videoMsg = msg.videoMessage || msg;
    mediaMeta = {
      type: 'video',
      typeMessage: 'videoMessage',
      urlFile: videoMsg.urlFile || msg.urlFile || videoMsg.downloadUrl || msg.downloadUrl || videoMsg.mediaUrl || msg.mediaUrl || null,
      downloadUrl: videoMsg.downloadUrl || msg.downloadUrl || videoMsg.urlFile || msg.urlFile || videoMsg.mediaUrl || msg.mediaUrl || null,
      jpegThumbnail: videoMsg.jpegThumbnail || msg.jpegThumbnail || null,
      caption: videoMsg.caption || msg.caption || content || null,
    };
    if (!content) content = '🎥 Video';
  } else if (type === 'audioMessage' || type === 'audio' || type === 'ptt') {
    const audioMsg = msg.audioMessage || msg;
    const audioUrl = audioMsg.downloadUrl || msg.downloadUrl || audioMsg.url || msg.url || audioMsg.mediaUrl || msg.mediaUrl || null;
    const duration = audioMsg.seconds || msg.seconds || audioMsg.duration || msg.duration || audioMsg.length || msg.length || 0;
    mediaMeta = {
      type: 'audio',
      typeMessage: type === 'ptt' ? 'ptt' : 'audioMessage',
      downloadUrl: audioUrl,
      url: audioUrl,
      seconds: duration,
      duration: duration,
      mimeType: audioMsg.mimeType || msg.mimeType || 'audio/ogg; codecs=opus',
    };
    if (!content) content = '🎵 Audio';
  } else if (type === 'documentMessage' || type === 'document') {
    const docMsg = msg.documentMessage || msg;
    mediaMeta = {
      type: 'document',
      typeMessage: 'documentMessage',
      fileName: docMsg.fileName || msg.fileName || null,
      downloadUrl: docMsg.downloadUrl || msg.downloadUrl || docMsg.url || msg.url || docMsg.urlFile || msg.urlFile || null,
      caption: docMsg.caption || msg.caption || content || null,
    };
    if (!content) content = '📄 Document';
  } else if (type === 'stickerMessage') {
    mediaMeta = {
      type: 'sticker',
      typeMessage: 'stickerMessage',
      downloadUrl: msg.downloadUrl || msg.urlFile || null,
    };
    if (!content) content = '🩹 Sticker';
    if (!content) content = '📍 Location';
  } else if (type === 'contactMessage' || type === 'contactsArrayMessage') {
    const contactMsg = msg.contactMessage || msg.contactsArrayMessage || msg;
    const displayName = contactMsg.displayName || contactMsg.contacts?.[0]?.displayName || 'Contact';
    mediaMeta = {
      type: 'contact',
      typeMessage: type,
      displayName: displayName,
      vcard: contactMsg.vcard || contactMsg.contacts?.[0]?.vcard || null,
    };
    if (!content) content = `👤 Contact: ${displayName}`;
  } else if (type === 'pollCreationMessage') {
    const pollMsg = msg.pollCreationMessage || msg;
    content = `📊 Poll: ${pollMsg.name || 'Untitled Poll'}`;
    mediaMeta = {
      type: 'poll',
      typeMessage: 'pollCreationMessage',
      pollName: pollMsg.name,
      options: pollMsg.options || [],
    };
  } else if (type === 'revokedMessage') {
    content = '🚫 This message was deleted';
  } else if (type === 'reactionMessage') {
    const react = msg.reactionMessage || msg;
    content = `[Reaction] ${react.text || ''}`;
  }

  if (!content && !mediaMeta) {
    content = '[Media]';
  }

  return { content, mediaMeta };
}



