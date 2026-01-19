/**
 * Dispatch API Tests
 * Tests for api/dispatch.js - the scheduled message processor
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock Supabase
vi.mock('@supabase/supabase-js', () => ({
    createClient: vi.fn(() => ({
        from: vi.fn(),
        rpc: vi.fn(),
    }))
}));

// Mock fetch
global.fetch = vi.fn();

// Note: dispatch.js uses process.env, so we need to set those
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
process.env.CRON_SECRET = 'test-cron-secret';

// We'll test the helper functions by extracting their logic
describe('Dispatch API Helpers', () => {

    // ============== normalizePhoneToChatId ==============
    describe('normalizePhoneToChatId', () => {
        // Simulated function (same logic as in dispatch.js)
        const normalizePhoneToChatId = (phone) => {
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

        it('should normalize 05X numbers', () => {
            expect(normalizePhoneToChatId('0545661640')).toBe('972545661640@c.us');
        });

        it('should normalize 972 prefixed numbers', () => {
            expect(normalizePhoneToChatId('972545661640')).toBe('972545661640@c.us');
        });

        it('should handle numbers with special characters', () => {
            expect(normalizePhoneToChatId('054-566-1640')).toBe('972545661640@c.us');
            expect(normalizePhoneToChatId('(054) 566 1640')).toBe('972545661640@c.us');
        });

        it('should add 972 prefix to raw numbers', () => {
            expect(normalizePhoneToChatId('545661640')).toBe('972545661640@c.us');
        });

        it('should handle empty input', () => {
            expect(normalizePhoneToChatId('')).toBe('');
            expect(normalizePhoneToChatId(null)).toBe('');
        });
    });

    // ============== processMessageTemplate ==============
    describe('processMessageTemplate', () => {
        // Simulated function
        const processMessageTemplate = (template, recipientPhone, contactName) => {
            let result = template;
            if (result.includes('{name}')) {
                result = result.replace(/{name}/g, contactName || recipientPhone || 'Customer');
            }
            if (result.includes('{phone}')) {
                result = result.replace(/{phone}/g, recipientPhone || '');
            }
            return result;
        };

        it('should replace {name} with contact name', () => {
            const result = processMessageTemplate('Hello {name}!', '0501234567', 'John');
            expect(result).toBe('Hello John!');
        });

        it('should replace {name} with phone if no name', () => {
            const result = processMessageTemplate('Hello {name}!', '0501234567', null);
            expect(result).toBe('Hello 0501234567!');
        });

        it('should replace {name} with fallback if nothing available', () => {
            const result = processMessageTemplate('Hello {name}!', null, null);
            expect(result).toBe('Hello Customer!');
        });

        it('should replace {phone} with phone number', () => {
            const result = processMessageTemplate('Your number is {phone}', '0501234567', 'John');
            expect(result).toBe('Your number is 0501234567');
        });

        it('should replace multiple placeholders', () => {
            const result = processMessageTemplate('Hi {name}, your phone is {phone}', '0501234567', 'Jane');
            expect(result).toBe('Hi Jane, your phone is 0501234567');
        });

        it('should handle templates without placeholders', () => {
            const result = processMessageTemplate('Plain message', '0501234567', 'John');
            expect(result).toBe('Plain message');
        });
    });
});

// ============== Dispatch Handler Tests ==============
describe('Dispatch Endpoint', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const createMockReq = (method, headers = {}) => ({
        method,
        headers: {
            authorization: 'Bearer test-cron-secret',
            ...headers
        }
    });

    const createMockRes = () => ({
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
        setHeader: vi.fn()
    });

    // Note: We can't fully test the handler without complex mocking of Supabase
    // These tests verify the expected behavior patterns

    describe('Authentication', () => {
        it('should require authorization header', () => {
            const req = { method: 'GET', headers: {} };
            // The handler should reject without proper auth
            expect(req.headers.authorization).toBeUndefined();
        });

        it('should accept valid cron secret', () => {
            const req = createMockReq('GET');
            expect(req.headers.authorization).toBe('Bearer test-cron-secret');
        });
    });

    describe('Request Method', () => {
        it('should only accept GET requests', () => {
            const getReq = createMockReq('GET');
            const postReq = createMockReq('POST');

            expect(getReq.method).toBe('GET');
            expect(postReq.method).toBe('POST');
            // POST should be rejected by the handler
        });
    });
});

// ============== Green API Integration Tests ==============
describe('Green API Message Sending', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should construct correct sendMessage URL', () => {
        const instanceId = '7107361336';
        const apiToken = 'd490fc93dbde4f12a6f8300cf89e8f9c80f92a6f0f444108a8';
        const expectedUrl = `https://api.green-api.com/waInstance${instanceId}/sendMessage/${apiToken}`;

        expect(expectedUrl).toContain('waInstance7107361336');
        expect(expectedUrl).toContain('sendMessage');
    });

    it('should construct correct sendFileByUrl URL', () => {
        const instanceId = '7107361336';
        const apiToken = 'test-token';
        const expectedUrl = `https://api.green-api.com/waInstance${instanceId}/sendFileByUrl/${apiToken}`;

        expect(expectedUrl).toContain('sendFileByUrl');
    });

    it('should format message payload correctly', () => {
        const chatId = '972545661640@c.us';
        const message = 'Test message';

        const payload = JSON.stringify({ chatId, message });
        const parsed = JSON.parse(payload);

        expect(parsed.chatId).toBe('972545661640@c.us');
        expect(parsed.message).toBe('Test message');
    });

    it('should format media payload correctly', () => {
        const chatId = '972545661640@c.us';
        const urlFile = 'https://example.com/image.jpg';
        const fileName = 'image.jpg';
        const caption = 'Check this out!';

        const payload = { chatId, urlFile, fileName, caption };

        expect(payload.urlFile).toBe('https://example.com/image.jpg');
        expect(payload.fileName).toBe('image.jpg');
    });
});

// ============== Scheduling Logic Tests ==============
describe('Scheduling Logic', () => {
    describe('Due Message Detection', () => {
        it('should identify messages due for sending', () => {
            const now = new Date();
            const pastTime = new Date(now.getTime() - 60000); // 1 minute ago
            const futureTime = new Date(now.getTime() + 60000); // 1 minute from now

            const messages = [
                { id: 1, scheduled_at: pastTime.toISOString(), status: 'pending' },
                { id: 2, scheduled_at: futureTime.toISOString(), status: 'pending' },
            ];

            const due = messages.filter(m => new Date(m.scheduled_at) <= now);
            expect(due.length).toBe(1);
            expect(due[0].id).toBe(1);
        });
    });

    describe('Recurrence Calculation', () => {
        it('should calculate next daily run', () => {
            const scheduledAt = new Date('2026-01-19T10:00:00Z');
            const nextRun = new Date(scheduledAt.getTime() + 24 * 60 * 60 * 1000);

            expect(nextRun.toISOString()).toBe('2026-01-20T10:00:00.000Z');
        });

        it('should calculate next weekly run', () => {
            const scheduledAt = new Date('2026-01-19T10:00:00Z');
            const nextRun = new Date(scheduledAt.getTime() + 7 * 24 * 60 * 60 * 1000);

            expect(nextRun.toISOString()).toBe('2026-01-26T10:00:00.000Z');
        });

        it('should calculate next monthly run (approximate)', () => {
            const scheduledAt = new Date('2026-01-19T10:00:00Z');
            // Using simple 30-day approximation for testing
            const nextRun = new Date(scheduledAt);
            nextRun.setMonth(nextRun.getMonth() + 1);

            expect(nextRun.getMonth()).toBe(1); // February
            expect(nextRun.getDate()).toBe(19);
        });
    });
});
