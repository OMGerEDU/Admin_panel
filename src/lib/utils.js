import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

/**
 * Remove WhatsApp JID suffix (@c.us, @g.us, etc.) from a JID string
 * @param {string} jid - The JID string (e.g., "972534564448@c.us" or "120363208848818728@g.us")
 * @returns {string} The JID without suffix (e.g., "972534564448" or "120363208848818728")
 */
export function removeJidSuffix(jid) {
    if (!jid) return jid;
    // Remove @ and everything after it
    return jid.replace(/@.*$/, '');
}

/**
 * Generate a URL to a specific chat in the web app
 * @param {string} numberId - The number ID (from numbers table)
 * @param {string} remoteJid - The remote JID (e.g., "972534564448" or "972534564448@c.us")
 * @param {string} baseUrl - Optional base URL (defaults to current origin)
 * @returns {string} Full URL to the chat
 */
export function getChatUrl(numberId, remoteJid, baseUrl = null) {
    const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
    // Extract only the number part (remove any @ suffix like @c.us, @g.us, etc.)
    const numberOnly = removeJidSuffix(remoteJid);
    return `${base}/app/chats/${numberId}/${encodeURIComponent(numberOnly)}`;
}