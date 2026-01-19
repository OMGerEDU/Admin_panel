
/**
 * Normalize phone number to Green API chatId format (phone@c.us).
 * Ensures 972 prefix for Israeli numbers and removes non-digits.
 * @param {string} phone - The input phone number
 * @returns {string} - The formatted chatId
 */
export const normalizePhoneToChatId = (phone) => {
    if (!phone) return '';
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
        cleaned = '972' + cleaned.substring(1);
    }
    if (!cleaned.startsWith('972')) {
        cleaned = '972' + cleaned;
    }
    return `${cleaned}@c.us`;
};
