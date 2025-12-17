import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

/**
 * Generate a URL to a specific chat in the web app
 * @param {string} numberId - The number ID (from numbers table)
 * @param {string} chatId - The chat ID (from chats table)
 * @param {string} baseUrl - Optional base URL (defaults to current origin)
 * @returns {string} Full URL to the chat
 */
export function getChatUrl(numberId, chatId, baseUrl = null) {
    const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
    return `${base}/app/chats/${numberId}/${chatId}`;
}