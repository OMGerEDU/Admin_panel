import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs))
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
    // Extract only the number part (remove @c.us if present)
    const numberOnly = remoteJid.replace('@c.us', '');
    return `${base}/app/chats/${numberId}/${encodeURIComponent(numberOnly)}`;
}