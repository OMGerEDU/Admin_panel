import {
  getChats,
  getChatHistory,
  getLastIncomingMessages,
  getLastOutgoingMessages,
  receiveNotification,
  deleteNotification,
  getChatMetadata,
  getContacts
} from './greenApi';
import { supabase } from '../lib/supabaseClient';
import { loadChatsFromCache, loadMessagesFromCache, loadAvatarsFromCache } from '../lib/messageLocalCache';
import { uploadStateSnapshot } from './snapshotService';
import { EvolutionApiService } from './EvolutionApiService';

// Global state for background sync status
const activeSyncTasks = new Map(); // numberId -> status object
const activeChatSyncs = new Set(); // chatRemoteId set

// GLOBAL API RATE LIMITER
let lastHistoryCallTime = 0;
const HISTORY_CALL_COOLDOWN = 4000; // 4 seconds between history calls globally
let backoffUntil = 0; // Timestamp to resume sync after 429
let isWebhookMode = false; // If true, we stop polling `receiveNotification` to avoid 400 spam

async function throttleHistoryCall() {
  const now = Date.now();

  // If we are in backoff, wait until it expires
  if (now < backoffUntil) {
    const wait = backoffUntil - now;
    console.warn(`[SYNC] API in backoff mode, waiting ${Math.round(wait / 1000)}s`);
    await new Promise(r => setTimeout(r, wait));
  }

  const timeSinceLast = Date.now() - lastHistoryCallTime;
  if (timeSinceLast < HISTORY_CALL_COOLDOWN) {
    const wait = HISTORY_CALL_COOLDOWN - timeSinceLast;
    await new Promise(r => setTimeout(r, wait));
  }
  lastHistoryCallTime = Date.now();
}

async function handleRateLimit() {
  console.error('[SYNC] 429 Detected! Triggering 60s global backoff');
  backoffUntil = Date.now() + 60000; // 1 minute pause
}

// Helper to check if a string is a Jid
const isJid = (n) => n && (n.includes('@s.whatsapp.net') || n.includes('@g.us') || n.includes('@c.us'));

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
// Helper to normalize chats from Evolution
const normalizeEvoChats = (evoChats) => {
  return (evoChats || []).map(c => ({
    id: c.remoteJid,              // Use actual JID as the ID (Green API compat)
    chatId: c.remoteJid,
    remoteJid: c.remoteJid,       // Ensure we have the real JID (123@g.us) not internal ID
    // IMPORTANT: For Evolution group chats, `pushName` may be a participant name (often last sender).
    // Never use it as the group display name; prefer subject-like fields or fallback to JID number.
    name: (typeof c.remoteJid === 'string' && c.remoteJid.includes('@g.us'))
      ? (c.subject || c.groupSubject || c.groupName || c.name || c.remoteJid?.split('@')[0] || 'Unknown')
      : (c.name || c.pushName || c.remoteJid?.split('@')[0] || 'Unknown'),
    image: c.profilePicUrl,       // Map profile pic
    avatar: c.profilePicUrl,
    unreadCount: c.unreadCount || 0,
    lastMessage: c.lastMessage || {},
    timestamp: c.updatedAt ? new Date(c.updatedAt).getTime() / 1000 : Date.now() / 1000 // Convert ISO to seconds
  }));
};

export async function syncChatsToSupabase(numberId, instanceId, token, enrichNames = false, provider = 'green-api') {
  console.log('[SYNC] syncChatsToSupabase called with:', { numberId, instanceId, provider });
  try {
    let result = { success: false, data: [] };

    // 1) Fetch chats list from Provider
    if (provider === 'evolution-api') {
      const evoRes = await EvolutionApiService.fetchChats(instanceId); // instanceId is the name here
      if (evoRes.success) {
        result = { success: true, data: normalizeEvoChats(evoRes.data) };
      } else {
        result = { success: false, error: evoRes.error || 'Failed to fetch Evolution chats' };
      }
    } else {
      result = await getChats(instanceId, token);
    }

    if (!result.success) {
      return result;
    }
    const chats = result.data;
    if (!chats.length) {
      return { success: true, data: [] };
    }

    // 2) Prepare for Supabase
    // We map GreenAPI/Evolution fields to our DB schema
    const toUpsert = chats.map(c => ({
      number_id: numberId,
      chat_id: c.id, // Green API uses 'id', we map to chat_id
      remote_jid: c.id,
      name: c.name || c.contactName || c.formattedName || c.id.split('@')[0],
      image_url: c.image || c.avatar,
      last_message: c.lastMessage || null,
      last_message_at: c.timestamp ? new Date(c.timestamp * 1000).toISOString() : new Date().toISOString(),
      unread_count: c.unreadCount || 0,
      metadata: c // Store full raw object just in case
    }));

    // 3) Upsert to Supabase
    const { data: upserted, error } = await supabase
      .from('chats')
      .upsert(toUpsert, {
        onConflict: 'number_id,remote_jid',
        ignoreDuplicates: false
      })
      .select();

    if (error) throw error;

    console.log(`[SYNC] Synced ${upserted?.length || 0} chats`);
    return { success: true, data: upserted || [] };
  } catch (error) {
    console.error('syncChatsToSupabase error:', error);
    return { success: false, error: error.message || 'Failed to sync chats' };
  }
}

// Helper to normalize message from Evolution (Baileys) to Green API structure
const normalizeEvoMessage = (msg) => {
  if (!msg || !msg.key) return null;

  let m = msg.message || {};
  const key = msg.key || {};

  // 1. Unwrap common Baileys nested wrappers
  // Logic from Baileys source: find the inner message if it's wrapped
  if (m.viewOnceMessage) m = m.viewOnceMessage.message || {};
  if (m.viewOnceMessageV2) m = m.viewOnceMessageV2.message || {};
  if (m.viewOnceMessageV2Extension) m = m.viewOnceMessageV2Extension.message || {};
  if (m.ephemeralMessage) m = m.ephemeralMessage.message || {};
  if (m.encryptedRecipientMessage) m = m.encryptedRecipientMessage.message || {};
  if (m.documentWithCaptionMessage) m = m.documentWithCaptionMessage.message || {};
  if (m.groupMentionedMessage) m = m.groupMentionedMessage.message || {};

  // Determine type
  let typeMessage = 'textMessage';
  if (m.imageMessage) typeMessage = 'imageMessage';
  else if (m.videoMessage) typeMessage = 'videoMessage';
  else if (m.audioMessage) typeMessage = 'audioMessage';
  else if (m.documentMessage) typeMessage = 'documentMessage';
  else if (m.stickerMessage) typeMessage = 'stickerMessage';
  else if (m.contactMessage || m.contactsArrayMessage) typeMessage = 'contactMessage';
  else if (m.locationMessage) typeMessage = 'locationMessage';
  else if (m.extendedTextMessage) typeMessage = 'textMessage';
  else if (m.conversation) typeMessage = 'textMessage';
  else if (m.protocolMessage) typeMessage = 'protocolMessage';
  else if (m.reactionMessage) typeMessage = 'reactionMessage';
  else if (m.pollCreationMessage || m.pollCreationMessageV2 || m.pollCreationMessageV3) typeMessage = 'pollCreationMessage';

  // Extract text message content
  const textContent = m.conversation ||
    m.extendedTextMessage?.text ||
    m.imageMessage?.caption ||
    m.videoMessage?.caption ||
    m.documentMessage?.caption ||
    "";

  return {
    idMessage: key.id,
    chatId: key.remoteJid,
    timestamp: msg.messageTimestamp, // Usually seconds in Baileys
    type: key.fromMe ? 'outgoing' : 'incoming',
    fromMe: key.fromMe,
    typeMessage,
    textMessage: textContent,
    extendedTextMessage: m.extendedTextMessage,
    imageMessage: m.imageMessage,
    videoMessage: m.videoMessage,
    audioMessage: m.audioMessage,
    documentMessage: m.documentMessage,
    contactMessage: m.contactMessage || m.contactsArrayMessage,
    stickerMessage: m.stickerMessage,
    locationMessage: m.locationMessage,
    reactionMessage: m.reactionMessage,
    pollCreationMessage: m.pollCreationMessage || m.pollCreationMessageV2 || m.pollCreationMessageV3,
    // Pass raw just in case
    _raw: msg
  };
};

export async function syncMessagesToSupabase(
  chatId,
  instanceId,
  token,
  remoteJid,
  limit = 100,
  provider = 'green-api'
) {
  try {
    // 1. SMART SKIP: If we have synced this chat in the last 10 seconds, skip API call
    const meta = loadMessagesFromCache(instanceId, remoteJid); // misuse of cache to check history
    // (Actually using a dedicated sync meta is better, but let's just use the throttler for now)

    await throttleHistoryCall();

    let result = { success: false, data: [] };

    if (provider === 'evolution-api') {
      const evoRes = await EvolutionApiService.fetchMessages(instanceId, remoteJid, limit);
      if (evoRes.success) {
        // Normalize messages
        const normalized = (evoRes.data || []).map(normalizeEvoMessage).filter(Boolean);
        result = { success: true, data: normalized };
      } else {
        result = { success: false, error: evoRes.error };
      }
    } else {
      result = await getChatHistory(instanceId, token, remoteJid, limit);
    }

    if (result.success && result.data) {
      const messages = result.data || [];
      if (messages.length === 0) return { success: true, data: [] };

      // 2. BATCH DB CHECK: Get all existing green_ids for these messages
      const idsToCheck = messages.map(m => m.idMessage || m.id).filter(Boolean);
      const { data: existingMsgs } = await supabase
        .from('messages')
        .select('green_id')
        .eq('chat_id', chatId)
        .in('green_id', idsToCheck);

      const existingIds = new Set(existingMsgs?.map(m => m.green_id) || []);

      const toInsert = [];
      for (const msg of messages) {
        const greenId = msg.idMessage || msg.id;
        if (existingIds.has(greenId)) continue;

        const ts = msg.timestamp != null
          ? new Date(msg.timestamp * 1000).toISOString()
          : new Date().toISOString();

        const { content, mediaMeta } = extractMessageContentAndMeta(msg);
        toInsert.push({
          chat_id: chatId,
          content,
          is_from_me: msg.type === 'outgoing' || msg.type === 'outgoingMessage' || msg.fromMe === true,
          timestamp: ts,
          media_meta: mediaMeta,
          green_id: greenId
        });
      }

      if (toInsert.length > 0) {
        console.log(`[SYNC] Inserting ${toInsert.length} new messages for ${remoteJid}`);
        await supabase.from('messages').insert(toInsert);
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

    // Return in chronological order (oldest first)
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
export async function fullSync(numberId, instanceId, token, messageLimit = 50, provider = 'green-api') {
  const chatsResult = await syncChatsToSupabase(numberId, instanceId, token, false, provider); // Don't enrich all names

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
      provider
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
    // If we know this instance uses webhooks, skip `receiveNotification` entirely
    // and just use the history fallback (but throttled)
    if (isWebhookMode) {
      await throttleHistoryCall(); // Ensure we don't spam 
      // Fallback: Check last 2 minutes (covering the query param user saw failing)
      const historyResult = await getLastIncomingMessages(instanceId, token, 2);

      if (historyResult.success && Array.isArray(historyResult.data)) {
        // Filter for very recent messages (last 60 seconds to be safe)
        const nowSeconds = Math.floor(Date.now() / 1000);
        const cutoff = nowSeconds - 60;

        const recentMessages = historyResult.data.filter(msg => {
          const ts = msg.timestamp || 0;
          return ts >= cutoff;
        });

        if (recentMessages.length > 0 && onNewMessage) {
          await onNewMessage(recentMessages[0], null);
        }
        return { success: true, fallback: true, count: recentMessages.length };
      }
      return { success: true, count: 0 };
    }

    const result = await receiveNotification(instanceId, token);

    // FAILURE CASE: Check for Webhook conflict
    if (!result.success) {
      // If error indicates custom webhook is set (400 Bad Request)
      if (result.error && (result.error.includes('custom webhook url') || result.error.includes('400'))) {
        console.warn('[POLLING] Custom webhook detected! Switching to Webhook Mode (History Polling).');
        isWebhookMode = true; // PERMANENTLY SWITCH for this session
        return { success: false, error: 'Switched to webhook mode' };
      }
      return { success: false, error: result.error };
    }

    // 3. STANDARD POLLING PATH
    if (!result.data) {
      return { success: true };
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

      // PHASE 2: Deep dive into Top 20 most active chats
      // We do this ONCE per sync session to populate recent context
      status.phase = `deep_sync_top_20`;
      const top20 = chats.slice(0, 20);
      for (let i = 0; i < top20.length; i++) {
        const chat = top20[i];
        status.completedChats = i;
        status.totalChats = top20.length;
        status.currentChat = chat.name || chat.remote_jid;
        await syncFullChatHistory(chat, instanceId, token, 2); // Only 2 pages deep in bg
        // Large delay between chats to be extremely safe
        await new Promise(r => setTimeout(r, 6000 + Math.random() * 4000));
      }

      // PHASE 3: Discovery Blocks (Extend sweep up to 180 days)
      let daysBack = 0;
      let hasMoreHistory = true;

      while (hasMoreHistory && daysBack < 180) {
        daysBack += 7;
        status.phase = `discovery_${daysBack}_days`;
        console.log(`[SYNC] Scanning: ${daysBack - 7} to ${daysBack} days ago`);

        const minutes = daysBack * 24 * 60;
        const result = await getLastIncomingMessages(instanceId, token, minutes);

        if (result.success && result.data && result.data.length > 0) {
          await processMessageBatch(numberId, chats, result.data, instanceId, token);

          // Periodically update chat list if many discovered
          if (result.data.length > 50) {
            await syncChatsToSupabase(numberId, instanceId, token, false);
          }
        }

        // Stop scanning blocks only if we get persistent emptiness (try one more block)
        if (!result.success || !result.data || result.data.length === 0) {
          if (daysBack > 30) hasMoreHistory = false;
        }

        await new Promise(r => setTimeout(r, 4000)); // Pause between discovery blocks
      }

      // PHASE 4: Universal Sweep for empty chats
      status.phase = 'universal_sweep';
      const { data: emptyChats } = await supabase
        .from('chats')
        .select('*')
        .eq('number_id', numberId)
        .order('last_message_at', { ascending: false });

      const needingSync = (emptyChats || []).filter(c => !c.last_message);
      console.log(`[SYNC] Found ${needingSync.length} empty chats for universal sweep`);

      for (let i = 0; i < Math.min(needingSync.length, 10); i++) {
        const chat = needingSync[i];
        status.phase = `sweep_${i}_10`;
        await syncFullChatHistory(chat, instanceId, token, 1); // Only 1 page for sweep
        await new Promise(r => setTimeout(r, 8000));
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

export async function syncFullChatHistory(chat, instanceId, token, maxPages = 5) {
  const syncKey = `${chat.number_id}:${chat.remote_jid}`;
  if (activeChatSyncs.has(syncKey)) return;
  activeChatSyncs.add(syncKey);

  console.log(`[SYNC] Starting full sync for chat: ${chat.remote_jid}`);

  try {
    let hasMore = true;
    let retryCount = 0;
    let pages = 0;

    while (hasMore && pages < maxPages) {
      pages++;
      // Get oldest message we have in DB to fetch before it

      // OPTIMIZATION: Throttled Call
      await throttleHistoryCall();
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
          await handleRateLimit();
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
  let nameUpdatedCount = 0;

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

    // IN-STREAM NAME UPDATE: If we have a pushName or senderName and current chat name is bad, update it
    const senderName = msg.senderName || msg.senderContactName || msg.pushName;
    const isBadName = !chat.name || isJid(chat.name) || /^\d+$/.test(chat.name);

    if (senderName && isBadName && !isJid(senderName)) {
      console.log(`[SYNC] In-stream name update for ${chat.remote_jid}: ${senderName}`);
      chat.name = senderName;
      nameUpdatedCount++;
    }

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
        media_meta: mediaMeta,
        green_id: msg.idMessage || msg.id
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

  // Final metadata update: ensure chats table reflects discovery or name updates
  if (newCount > 0 || nameUpdatedCount > 0) {
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
export async function warmUpSync(numberId, instanceId, token, provider = 'green-api') {
  try {
    if (provider === 'evolution-api') {
      // Evolution API doesn't support global history lookup the same way yet.
      // We rely on standard syncChatsToSupabase for discovery.
      console.log(`[SYNC] WARM-UP skipped for Evolution API (not supported/needed).`);
      return { success: true, count: 0 };
    }

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

  // Robust text extraction
  let content =
    msg.textMessage ||
    msg.text ||
    msg.content ||
    msg.message ||
    msg.conversation ||
    msg.extendedTextMessage?.text ||
    msg.extendedTextMessageData?.text ||
    msg.caption ||
    '';

  let mediaMeta = null;

  if (type === 'imageMessage' || type === 'image') {
    const imageMsg = msg.imageMessage || msg;
    const caption = imageMsg.caption || msg.caption || content || null;
    mediaMeta = {
      type: 'image',
      typeMessage: 'imageMessage',
      urlFile: imageMsg.urlFile || msg.urlFile || imageMsg.downloadUrl || msg.downloadUrl || imageMsg.mediaUrl || msg.mediaUrl || null,
      downloadUrl: imageMsg.downloadUrl || msg.downloadUrl || imageMsg.urlFile || msg.urlFile || imageMsg.mediaUrl || msg.mediaUrl || null,
      jpegThumbnail: imageMsg.jpegThumbnail || msg.jpegThumbnail || null,
      caption: caption,
    };
    content = caption || '📷 Image';
  } else if (type === 'videoMessage' || type === 'video') {
    const videoMsg = msg.videoMessage || msg;
    const caption = videoMsg.caption || msg.caption || content || null;
    mediaMeta = {
      type: 'video',
      typeMessage: 'videoMessage',
      urlFile: videoMsg.urlFile || msg.urlFile || videoMsg.downloadUrl || msg.downloadUrl || videoMsg.mediaUrl || msg.mediaUrl || null,
      downloadUrl: videoMsg.downloadUrl || msg.downloadUrl || videoMsg.urlFile || msg.urlFile || videoMsg.mediaUrl || msg.mediaUrl || null,
      jpegThumbnail: videoMsg.jpegThumbnail || msg.jpegThumbnail || null,
      caption: caption,
    };
    content = caption || '🎥 Video';
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
    content = '🎵 Audio';
  } else if (type === 'documentMessage' || type === 'document') {
    const docMsg = msg.documentMessage || msg;
    const caption = docMsg.caption || msg.caption || content || null;
    mediaMeta = {
      type: 'document',
      typeMessage: 'documentMessage',
      fileName: docMsg.fileName || msg.fileName || null,
      downloadUrl: docMsg.downloadUrl || msg.downloadUrl || docMsg.url || msg.url || docMsg.urlFile || msg.urlFile || null,
      caption: caption,
    };
    content = caption || docMsg.fileName || '📄 Document';
  } else if (type === 'stickerMessage' || type === 'sticker') {
    mediaMeta = {
      type: 'sticker',
      typeMessage: 'stickerMessage',
      downloadUrl: msg.downloadUrl || msg.urlFile || null,
    };
    content = '🩹 Sticker';
  } else if (type === 'contactMessage' || type === 'contactsArrayMessage' || type === 'contacts') {
    const contactMsg = msg.contactMessage || msg.contactsArrayMessage || msg;
    const displayName = contactMsg.displayName || contactMsg.contacts?.[0]?.displayName || 'Contact';
    mediaMeta = {
      type: 'contact',
      typeMessage: type,
      displayName: displayName,
      vcard: contactMsg.vcard || contactMsg.contacts?.[0]?.vcard || null,
    };
    content = `👤 Contact: ${displayName}`;
  } else if (type === 'pollCreationMessage' || type === 'poll') {
    const pollMsg = msg.pollCreationMessage || msg;
    content = `📊 Poll: ${pollMsg.name || 'Untitled Poll'}`;
    mediaMeta = {
      type: 'poll',
      typeMessage: 'pollCreationMessage',
      pollName: pollMsg.name,
      options: pollMsg.options || [],
    };
  } else if (type === 'revokedMessage' || type === 'deletedMessage') {
    content = '🚫 This message was deleted';
  } else if (type === 'reactionMessage') {
    const react = msg.reactionMessage || msg;
    content = `[Reaction] ${react.text || react.emoji || ''}`;
  }

  // Final fallback if absolutely nothing found
  if (!content && !mediaMeta) {
    content = '[Media]';
  }

  // Preserve raw Evolution data for media downloading if available
  if (msg._raw) {
    if (!mediaMeta) mediaMeta = {};
    mediaMeta.raw = msg._raw;
  }

  return { content, mediaMeta };
}
