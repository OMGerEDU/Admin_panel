/**
 * V1 API Endpoint Tests
 * Tests all endpoints in api/v1.js
 * 
 * Base URL: https://ferns.builders-tech.com/app/api/v1
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock dependencies
vi.mock('../_utils/auth.js', () => ({
    authenticate: vi.fn(),
    supabaseAdmin: {
        from: vi.fn(),
    }
}));

vi.mock('../_utils/providers/index.js', () => ({
    getProviderByName: vi.fn(() => ({
        setSettings: vi.fn().mockResolvedValue({ success: true })
    })),
    getProvider: vi.fn(() => ({
        normalizeWebhook: vi.fn()
    }))
}));

// Mock fetch globally
global.fetch = vi.fn();

import handler from '../v1.js';
import { authenticate, supabaseAdmin } from '../_utils/auth.js';

// Helper to create mock request/response
const createMockReq = (method, route, query = {}, body = {}) => ({
    method,
    query: { route, ...query },
    body,
    headers: {
        'x-forwarded-proto': 'https',
        'host': 'ferns.builders-tech.com'
    }
});

const createMockRes = () => {
    const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
        setHeader: vi.fn(),
    };
    return res;
};

// Chainable Supabase mock
const createChainableMock = (data = null, error = null) => ({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    lt: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data, error }),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
});

describe('V1 API Endpoints', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        authenticate.mockResolvedValue({ userId: 'test-user-123' });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    // ============== AUTHENTICATION ==============
    describe('Authentication', () => {
        it('should return early if authentication fails', async () => {
            authenticate.mockResolvedValue(null);
            const req = createMockReq('GET', 'whoami');
            const res = createMockRes();

            await handler(req, res);

            expect(authenticate).toHaveBeenCalledWith(req, res);
            expect(res.status).not.toHaveBeenCalled();
        });
    });

    // ============== GET /whoami ==============
    describe('GET /whoami', () => {
        it('should return user info', async () => {
            const mockProfile = { full_name: 'Test User', email: 'test@example.com' };
            supabaseAdmin.from.mockReturnValue(createChainableMock(mockProfile, null));

            const req = createMockReq('GET', 'whoami');
            const res = createMockRes();

            await handler(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                user_id: 'test-user-123',
                full_name: 'Test User',
                email: 'test@example.com'
            }));
        });

        it('should handle database error', async () => {
            supabaseAdmin.from.mockReturnValue(createChainableMock(null, { message: 'DB Error' }));

            const req = createMockReq('GET', 'whoami');
            const res = createMockRes();

            await handler(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'DB Error' });
        });
    });

    // ============== GET /numbers ==============
    describe('GET /numbers', () => {
        it('should return user numbers', async () => {
            const mockNumbers = [
                { id: 'num-1', phone_number: '972501234567', instance_id: 'inst-1', status: 'active', last_seen: '2026-01-19' }
            ];
            const mockChain = createChainableMock(mockNumbers, null);
            mockChain.eq = vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ data: mockNumbers, error: null })
            });
            supabaseAdmin.from.mockReturnValue(mockChain);

            const req = createMockReq('GET', 'numbers');
            const res = createMockRes();

            await handler(req, res);

            expect(supabaseAdmin.from).toHaveBeenCalledWith('numbers');
        });
    });

    // ============== POST /numbers/configure ==============
    describe('POST /numbers/configure', () => {
        it('should require number_id', async () => {
            const req = createMockReq('POST', 'numbers/configure', {}, {});
            const res = createMockRes();

            await handler(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Missing number_id' });
        });

        it('should return 404 if number not found', async () => {
            supabaseAdmin.from.mockReturnValue(createChainableMock(null, { message: 'Not found' }));

            const req = createMockReq('POST', 'numbers/configure', {}, { number_id: 'invalid-id' });
            const res = createMockRes();

            await handler(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    // ============== GET /chats ==============
    describe('GET /chats', () => {
        it('should fetch chats for user', async () => {
            const mockChats = [
                { id: 'chat-1', name: 'John', remote_jid: '972501234567@c.us', last_message: 'Hello', last_message_at: '2026-01-19', number_id: 'num-1' }
            ];
            const mockChain = createChainableMock(mockChats, null);
            mockChain.limit = vi.fn().mockResolvedValue({ data: mockChats, error: null });
            supabaseAdmin.from.mockReturnValue(mockChain);

            const req = createMockReq('GET', 'chats', { limit: '20' });
            const res = createMockRes();

            await handler(req, res);

            expect(supabaseAdmin.from).toHaveBeenCalledWith('chats');
        });

        it('should limit results to max 100', async () => {
            const mockChain = createChainableMock([], null);
            mockChain.limit = vi.fn().mockResolvedValue({ data: [], error: null });
            supabaseAdmin.from.mockReturnValue(mockChain);

            const req = createMockReq('GET', 'chats', { limit: '500' });
            const res = createMockRes();

            await handler(req, res);

            // The limit should be capped at 100
            expect(mockChain.limit).toHaveBeenCalledWith(100);
        });
    });

    // ============== POST /messages/send ==============
    describe('POST /messages/send', () => {
        it('should require number_id and to', async () => {
            const req = createMockReq('POST', 'messages/send', {}, { message: 'Hello' });
            const res = createMockRes();

            await handler(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields: number_id, to' });
        });

        it('should send text message via Green API', async () => {
            const mockNumber = { id: 'num-1', instance_id: 'inst-123', api_token: 'token-abc' };
            supabaseAdmin.from.mockReturnValue(createChainableMock(mockNumber, null));

            global.fetch.mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({ idMessage: 'msg-123' })
            });

            const req = createMockReq('POST', 'messages/send', {}, {
                number_id: 'num-1',
                to: '0501234567',
                message: 'Hello World'
            });
            const res = createMockRes();

            await handler(req, res);

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('sendMessage'),
                expect.objectContaining({
                    method: 'POST',
                    body: expect.stringContaining('972501234567@c.us')
                })
            );
        });

        it('should send media message when media_url provided', async () => {
            const mockNumber = { id: 'num-1', instance_id: 'inst-123', api_token: 'token-abc' };
            supabaseAdmin.from.mockReturnValue(createChainableMock(mockNumber, null));

            global.fetch.mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({ idMessage: 'msg-456' })
            });

            const req = createMockReq('POST', 'messages/send', {}, {
                number_id: 'num-1',
                to: '0501234567',
                media_url: 'https://example.com/image.jpg',
                media_filename: 'image.jpg',
                caption: 'Check this out'
            });
            const res = createMockRes();

            await handler(req, res);

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('sendFileByUrl'),
                expect.objectContaining({ method: 'POST' })
            );
        });
    });

    // ============== GET /scheduled ==============
    describe('GET /scheduled', () => {
        it('should fetch scheduled messages', async () => {
            const mockScheduled = [
                { id: 'sched-1', message: 'Reminder', scheduled_at: '2026-01-20T10:00:00Z', status: 'pending' }
            ];
            const mockChain = createChainableMock(mockScheduled, null);
            mockChain.limit = vi.fn().mockResolvedValue({ data: mockScheduled, error: null });
            supabaseAdmin.from.mockReturnValue(mockChain);

            const req = createMockReq('GET', 'scheduled');
            const res = createMockRes();

            await handler(req, res);

            expect(supabaseAdmin.from).toHaveBeenCalledWith('scheduled_messages');
        });

        it('should filter by status if provided', async () => {
            const mockChain = createChainableMock([], null);
            mockChain.limit = vi.fn().mockResolvedValue({ data: [], error: null });
            supabaseAdmin.from.mockReturnValue(mockChain);

            const req = createMockReq('GET', 'scheduled', { status: 'pending' });
            const res = createMockRes();

            await handler(req, res);

            expect(mockChain.eq).toHaveBeenCalled();
        });
    });

    // ============== POST /scheduled ==============
    describe('POST /scheduled', () => {
        it('should require number_id, to, and scheduled_at', async () => {
            const req = createMockReq('POST', 'scheduled', {}, { message: 'Test' });
            const res = createMockRes();

            await handler(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Missing required fields: number_id, to, scheduled_at'
            });
        });

        it('should deny access if number not owned by user', async () => {
            supabaseAdmin.from.mockReturnValue(createChainableMock(null, null));

            const req = createMockReq('POST', 'scheduled', {}, {
                number_id: 'num-other',
                to: '0501234567',
                scheduled_at: '2026-01-20T10:00:00Z'
            });
            const res = createMockRes();

            await handler(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
        });
    });

    // ============== DELETE /scheduled ==============
    describe('DELETE /scheduled', () => {
        it('should require id param', async () => {
            const req = createMockReq('DELETE', 'scheduled', {});
            const res = createMockRes();

            await handler(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Missing id param' });
        });
    });

    // ============== GET / (index) ==============
    describe('GET / (index)', () => {
        it('should return API info', async () => {
            const req = createMockReq('GET', '');
            const res = createMockRes();

            await handler(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'ok',
                version: 'v1 (consolidated)',
                endpoints: expect.arrayContaining(['/whoami', '/numbers', '/chats'])
            }));
        });
    });

    // ============== 404 ==============
    describe('Unknown routes', () => {
        it('should return 404 for unknown route', async () => {
            const req = createMockReq('GET', 'unknown/endpoint');
            const res = createMockRes();

            await handler(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'API Endpoint not found' });
        });
    });
});

// ============== PHONE NUMBER NORMALIZATION ==============
describe('normalizePhoneToChatId (v1.js logic)', () => {
    // The function is tested indirectly through messages/send
    // But we can test the expected output format

    it('should format chatId correctly in send request', async () => {
        const mockNumber = { id: 'num-1', instance_id: 'inst-123', api_token: 'token-abc' };
        supabaseAdmin.from.mockReturnValue(createChainableMock(mockNumber, null));
        authenticate.mockResolvedValue({ userId: 'test-user-123' });

        global.fetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ idMessage: 'msg-123' })
        });

        const req = createMockReq('POST', 'messages/send', {}, {
            number_id: 'num-1',
            to: '054-566-1640',  // With dashes
            message: 'Test'
        });
        const res = createMockRes();

        await handler(req, res);

        // Verify fetch was called with properly formatted chatId
        const fetchCall = global.fetch.mock.calls[0];
        const body = JSON.parse(fetchCall[1].body);
        expect(body.chatId).toBe('972545661640@c.us');  // No dashes, has @c.us
    });
});
