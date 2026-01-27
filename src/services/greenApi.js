// Green API service - core WhatsApp messaging features
// This module is used by both the admin panel and (optionally) the extension.

import { logger } from '../lib/logger';

const GREEN_API_BASE = 'https://api.green-api.com';

/**
 * Generic Green API call with basic retry and 429 (rate limit) handling.
 */
async function greenApiCall(instanceId, token, endpoint, options = {}) {
  if (!instanceId || !token) {
    await logger.warn('Green API call missing credentials', { endpoint });
    return { success: false, error: 'Missing Green API instanceId or token' };
  }

  // Validate format to prevent garbage requests (e.g. accidental Hebrew or backticks)
  if (!/^\d{10}$/.test(instanceId)) {
    console.warn('Invalid instance ID format:', instanceId);
    return { success: false, error: 'Invalid instance ID format (must be 10 digits)' };
  }
  // Token is usually 50 chars alphanumeric, but let's just ensure it's safe chars
  if (!/^[a-zA-Z0-9]+$/.test(token)) {
    console.warn('Invalid token format');
    return { success: false, error: 'Invalid token format' };
  }

  // Handle query parameters
  let queryStr = '';
  if (options.queryParams) {
    const params = new URLSearchParams(options.queryParams);
    queryStr = `?${params.toString()}`;
  }

  // Handle endpoints that already might have query strings (legacy support)
  // If endpoint has '?', we split it. But ideally we use options.queryParams.
  let cleanEndpoint = endpoint;
  if (endpoint.includes('?')) {
    const parts = endpoint.split('?');
    cleanEndpoint = parts[0];
    if (!queryStr) {
      queryStr = `?${parts[1]}`;
    } else {
      queryStr += `&${parts[1]}`;
    }
  }

  const url = `${GREEN_API_BASE}/waInstance${instanceId}/${cleanEndpoint}/${token}${queryStr}`;

  const config = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  let retries = 3;
  let backoff = 1000;

  while (retries > 0) {
    try {
      const response = await fetch(url, config);

      if (response.status === 429) {
        const retryAfterHeader = response.headers.get('Retry-After');
        const retryAfter =
          retryAfterHeader != null ? parseInt(retryAfterHeader, 10) : 5;
        await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
        retries -= 1;
        continue;
      }

      if (!response.ok) {
        const errorText = await response.text();
        await logger.error('Green API HTTP error', {
          status: response.status,
          endpoint: cleanEndpoint,
          errorText: errorText.slice(0, 500),
        });
        throw new Error(`Green API ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('WhatsApp API error:', error);
      if (retries <= 1) {
        await logger.error('Green API request failed after retries', {
          endpoint: cleanEndpoint,
          error: error.message || 'Green API error',
        });
      }
      retries -= 1;
      if (retries <= 0) {
        return { success: false, error: error.message || 'Green API error' };
      }
      await new Promise((resolve) => setTimeout(resolve, backoff));
      backoff *= 2;
    }
  }

  return { success: false, error: 'Green API request failed' };
}

// 1. Chat list
export async function getChats(instanceId, token) {
  // Endpoint name may differ depending on Green API version; adjust if needed.
  return greenApiCall(instanceId, token, 'getChats');
}

// 2. Chat history
export async function getChatHistory(instanceId, token, chatId, count = 100, idMessage = null) {
  const body = { chatId, count };
  if (idMessage) body.idMessage = idMessage;

  return greenApiCall(instanceId, token, 'getChatHistory', {
    method: 'POST',
    body,
  });
}

// 3. Incoming notifications (new messages, events)
export async function receiveNotification(instanceId, token) {
  return greenApiCall(instanceId, token, 'receiveNotification');
}

// 4. Delete processed notification
export async function deleteNotification(instanceId, token, receiptId) {
  return greenApiCall(instanceId, token, `deleteNotification/${receiptId}`, {
    method: 'DELETE',
  });
}

// 5. Send text message
export async function sendMessage(instanceId, token, chatId, message) {
  return greenApiCall(instanceId, token, 'sendMessage', {
    method: 'POST',
    body: {
      chatId,
      message,
    },
  });
}

// 6. Send media via URL
export async function sendFileByUrl(
  instanceId,
  token,
  chatId,
  url,
  fileName,
  caption = '',
) {
  return greenApiCall(instanceId, token, 'sendFileByUrl', {
    method: 'POST',
    body: {
      chatId,
      urlFile: url,
      fileName,
      caption,
    },
  });
}

// 6b. Send contact card
export async function sendContact(
  instanceId,
  token,
  chatId,
  contact = {},
) {
  return greenApiCall(instanceId, token, 'sendContact', {
    method: 'POST',
    body: {
      chatId,
      contact,
    },
  });
}

// 7. Contact info
export async function getContactInfo(instanceId, token, chatId) {
  return greenApiCall(instanceId, token, 'getContactInfo', {
    method: 'POST',
    body: { chatId },
  });
}

// 7a. Get All Contacts (Batch)
export async function getContacts(instanceId, token) {
  return greenApiCall(instanceId, token, 'getContacts');
}

// 7b. Group info
export async function getGroupData(instanceId, token, groupId) {
  return greenApiCall(instanceId, token, 'getGroupData', {
    method: 'POST',
    body: { groupId },
  });
}

/**
 * Unified helper to get chat metadata (either contact or group)
 */
export async function getChatMetadata(instanceId, token, chatId) {
  if (chatId.endsWith('@g.us')) {
    return getGroupData(instanceId, token, chatId);
  } else {
    return getContactInfo(instanceId, token, chatId);
  }
}

// 8. Avatar
export async function getAvatar(instanceId, token, chatId) {
  return greenApiCall(instanceId, token, 'getAvatar', {
    method: 'POST',
    body: { chatId },
  });
}

// 9. Check WhatsApp number
export async function checkWhatsApp(instanceId, token, phoneNumber) {
  return greenApiCall(instanceId, token, 'checkWhatsapp', {
    method: 'POST',
    body: { phoneNumber },
  });
}

// 10. Message status
export async function getMessageStatus(instanceId, token, chatId, messageId) {
  return greenApiCall(instanceId, token, 'getMessageStatus', {
    method: 'POST',
    body: { chatId, idMessage: messageId },
  });
}

// 11. Get Instance Status (Health Check)
export async function getStatusInstance(instanceId, token) {
  return greenApiCall(instanceId, token, 'getStatusInstance');
}

// 12. Download media file - get downloadUrl for media messages
export async function downloadFile(instanceId, token, chatId, idMessage) {
  return greenApiCall(instanceId, token, 'downloadFile', {
    method: 'POST',
    body: { chatId, idMessage },
  });
}

// Phone normalization helper (Israeli-focused, similar to extension behavior)
export function normalizePhoneNumber(phone) {
  let cleaned = phone.replace(/\D/g, '');

  if (cleaned.startsWith('0')) {
    cleaned = '972' + cleaned.substring(1);
  }

  if (!cleaned.startsWith('972')) {
    cleaned = '972' + cleaned;
  }

  return `${cleaned}@c.us`;
}

// Phone normalization function from extension (for API calls)
export function normalizePhoneForAPI(raw) {
  if (!raw) return "";

  let input = String(raw);

  // ניקוי תווים לא רלוונטיים
  input = input.replace(/[^0-9+]/g, "");

  // אם מתחיל עם +
  if (input.startsWith("+")) {
    input = input.substring(1);
  }

  // אם מתחיל עם 0 → ישראל (ממיר ל-972)
  if (input.startsWith("0")) {
    input = "972" + input.substring(1);
  }

  // אם מתחיל עם 972 → השאר
  if (!input.startsWith("972")) {
    // מניח שישראל ברירת מחדל
    input = "972" + input;
  }

  return input;
}

// Get last incoming messages (like extension)
export async function getLastIncomingMessages(instanceId, token, minutes = 1440) {
  return greenApiCall(instanceId, token, 'lastIncomingMessages', {
    queryParams: { minutes },
  });
}

// Get last outgoing messages (like extension)
export async function getLastOutgoingMessages(instanceId, token) {
  return greenApiCall(instanceId, token, 'lastOutgoingMessages');
}

// Convenience helper: load chats with basic enrichment (name/avatar where possible)
export async function loadFullChats(instanceId, token) {
  const chatsResult = await getChats(instanceId, token);

  if (!chatsResult.success) {
    return chatsResult;
  }

  const chats = chatsResult.data || [];

  const enrichedChats = await Promise.all(
    chats.map(async (chat) => {
      try {
        const [infoResult, avatarResult] = await Promise.all([
          getChatMetadata(instanceId, token, chat.id || chat.chatId || chat.chatIdString),
          getAvatar(instanceId, token, chat.id || chat.chatId || chat.chatIdString).catch(
            () => ({ success: false }),
          ),
        ]);

        return {
          ...chat,
          // Try a few possible shapes based on Green API docs / existing extension
          name:
            (infoResult.success && (infoResult.data?.name || infoResult.data?.chatName)) ||
            chat.name ||
            chat.id ||
            chat.chatId ||
            chat.chatIdString,
          avatar: avatarResult.success ? avatarResult.data?.urlAvatar : null,
        };
      } catch (error) {
        console.error('Failed to enrich chat:', error);
        return {
          ...chat,
          name: chat.name || chat.id || chat.chatId || chat.chatIdString,
        };
      }
    }),
  );

  return { success: true, data: enrichedChats };
}

export { greenApiCall };


