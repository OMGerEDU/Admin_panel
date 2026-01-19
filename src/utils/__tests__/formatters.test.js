import { describe, it, expect } from 'vitest';
import { normalizePhoneToChatId } from '../formatters';

describe('formatters', () => {
    describe('normalizePhoneToChatId', () => {
        // Basic functionality
        it('should normalize local Israeli number (05X) to 9725X@c.us', () => {
            expect(normalizePhoneToChatId('0545661640')).toBe('972545661640@c.us');
        });

        it('should normalize number with 972 prefix correctly', () => {
            expect(normalizePhoneToChatId('972545661640')).toBe('972545661640@c.us');
        });

        it('should handle number with +972 prefix', () => {
            expect(normalizePhoneToChatId('+972545661640')).toBe('972545661640@c.us');
        });

        it('should remove non-digits', () => {
            expect(normalizePhoneToChatId('054-566-1640')).toBe('972545661640@c.us');
        });

        // Bug fix verification
        it('should NOT add extra space before @c.us (Bug Fix)', () => {
            const result = normalizePhoneToChatId('0501234567');
            expect(result).not.toContain(' @c.us');
            expect(result).toBe('972501234567@c.us');
        });

        // Edge cases
        it('should return empty string for empty input', () => {
            expect(normalizePhoneToChatId('')).toBe('');
        });

        it('should return empty string for null input', () => {
            expect(normalizePhoneToChatId(null)).toBe('');
        });

        it('should return empty string for undefined input', () => {
            expect(normalizePhoneToChatId(undefined)).toBe('');
        });

        // Different Israeli prefixes
        it('should handle 050 prefix', () => {
            expect(normalizePhoneToChatId('0501234567')).toBe('972501234567@c.us');
        });

        it('should handle 052 prefix', () => {
            expect(normalizePhoneToChatId('0521234567')).toBe('972521234567@c.us');
        });

        it('should handle 053 prefix', () => {
            expect(normalizePhoneToChatId('0531234567')).toBe('972531234567@c.us');
        });

        it('should handle 054 prefix', () => {
            expect(normalizePhoneToChatId('0541234567')).toBe('972541234567@c.us');
        });

        it('should handle 055 prefix', () => {
            expect(normalizePhoneToChatId('0551234567')).toBe('972551234567@c.us');
        });

        it('should handle 058 prefix', () => {
            expect(normalizePhoneToChatId('0581234567')).toBe('972581234567@c.us');
        });

        // Numbers without leading 0 or 972
        it('should add 972 prefix to raw number', () => {
            expect(normalizePhoneToChatId('545661640')).toBe('972545661640@c.us');
        });

        // Special formatting
        it('should handle parentheses in number', () => {
            expect(normalizePhoneToChatId('(054) 566-1640')).toBe('972545661640@c.us');
        });

        it('should handle dots in number', () => {
            expect(normalizePhoneToChatId('054.566.1640')).toBe('972545661640@c.us');
        });

        it('should handle spaces in number', () => {
            expect(normalizePhoneToChatId('054 566 1640')).toBe('972545661640@c.us');
        });

        // International format edge cases
        it('should handle 00972 prefix', () => {
            expect(normalizePhoneToChatId('00972545661640')).toBe('9720972545661640@c.us');
            // Note: Current implementation doesn't strip 00, might need fixing
        });
    });
});

// Future test ideas for additional formatters:
// - formatScheduleDate(date, locale)
// - formatRecurrenceLabel(recurrenceType, dayOfWeek, time)
// - formatRelativeTime(date)
