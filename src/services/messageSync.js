import { supabase } from '../lib/supabaseClient';
import {
  getChats,
  getChatHistory,
  receiveNotification,
  deleteNotification,
  getChatInfo,
} from './greenApi';

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

    // 3) Build rows to upsert (no per-chat SELECTs)
    for (const chat of chats) {
      const chatRemoteId =
        chat.id || chat.chatId || chat.chatIdString || chat.remoteJid;

      if (!chatRemoteId) continue;

      const lastText =
        chat.lastMessage?.textMessage ||
        chat.lastMessage?.extendedTextMessage?.text ||
        chat.lastMessage?.message ||
        null;

      const lastTs =
        chat.lastMessage?.timestamp != null
          ? new Date(chat.lastMessage.timestamp * 1000).toISOString()
          : null;

      const existing = existingMap.get(chatRemoteId);

      let displayName =
        existing?.name ||
        chat.name ||
        chat.chatName ||
        chat.pushName ||
        chatRemoteId;

      // Optional enrichment for names when explicitly requested (e.g. for a single chat)
      if (enrichNames && !existing?.name) {
        try {
          const infoResult = await getChatInfo(instanceId, token, chatRemoteId);
          if (infoResult.success) {
            displayName =
              infoResult.data?.name ||
              infoResult.data?.chatName ||
              displayName;
          }
        } catch {
          // Ignore enrichment errors – we still upsert basic info
        }
      }

      rows.push({
        id: existing?.id, // when present, Supabase will update instead of insert
        number_id: numberId,
        remote_jid: chatRemoteId,
        name: displayName,
        last_message: lastText,
        last_message_at: lastTs,
      });
    }

    if (rows.length === 0) {
      return { success: true, data: [] };
    }

    // 4) Upsert all chats in a single call
    const { data: upserted, error: upsertError } = await supabase
      .from('chats')
      .upsert(rows)
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

    if (!result.success) {
      return result;
    }

    const messages = result.data || [];
    const synced = [];

    for (const msg of messages) {
      const ts =
        msg.timestamp != null
          ? new Date(msg.timestamp * 1000).toISOString()
          : new Date().toISOString();

      const { data: existing, error: fetchError } = await supabase
        .from('messages')
        .select('id')
        .eq('chat_id', chatId)
        .eq('timestamp', ts)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching existing message during sync:', fetchError);
        continue;
      }

      if (existing?.id) {
        continue;
      }

      const isOutgoing =
        msg.type === 'outgoing' ||
        msg.type === 'outgoingMessage' ||
        msg.fromMe === true;

      // Green API sometimes uses type + typeMessage, sometimes only one of them
      const type = msg.typeMessage || msg.type || '';

      // Text / caption first (exactly like extension)
      let content =
        msg.textMessage ||
        msg.extendedTextMessage?.text ||
        msg.extendedTextMessageData?.text ||
        msg.message ||
        msg.conversation ||
        msg.caption ||
        '';

      // Build media metadata (exactly like extension's makeBubble)
      let mediaMeta = null;
      
      if (type === 'imageMessage' || type === 'image') {
        // Image message - save all media info (handle nested imageMessage object)
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
        // Video message (handle nested videoMessage object)
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
        // Audio/voice message (handle nested audioMessage object)
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
        // Document message (handle nested documentMessage object)
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
      } else if (type === 'locationMessage') {
        mediaMeta = {
          type: 'location',
          typeMessage: 'locationMessage',
          latitude: msg.latitude || msg.locationMessage?.latitude || null,
          longitude: msg.longitude || msg.locationMessage?.longitude || null,
        };
        if (!content) content = '📍 Location';
      }

      // If we still don't have text, use generic media label
      if (!content && !mediaMeta) {
        content = '[Media]';
      }

      const { data, error } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          content,
          is_from_me: isOutgoing,
          timestamp: ts,
          media_meta: mediaMeta, // Store media metadata (exactly like extension)
        })
        .select()
        .single();

      if (!error && data) synced.push(data);
    }

    return { success: true, data: synced };
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

    if (!result.success || !result.data) {
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


