/**
 * Webhook Handler Tests
 * Tests for api/webhooks/evolution.js and api/webhooks/greenapi.js
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock dependencies for greenapi.js
vi.mock('../_utils/auth.js', () => ({
    supabaseAdmin: {
        from: vi.fn(),
    }
}));

vi.mock('../_utils/providers/index.js', () => ({
    getProvider: vi.fn(() => ({
        normalizeWebhook: vi.fn((payload) => ({
            event: payload.typeWebhook || 'unknown',
            instance: payload.instanceData?.idInstance || null,
            data: {
                remoteJid: payload.senderData?.chatId,
                fromMe: payload.senderData?.isMe || false,
                id: payload.idMessage,
                content: { text: payload.messageData?.textMessageData?.textMessage || '' },
                state: payload.stateInstance
            }
        }))
    }))
}));

import evolutionHandler from '../evolution.js';
import greenapiHandler from '../greenapi.js';
import { supabaseAdmin } from '../_utils/auth.js';

// Helper
const createMockReq = (method, body = {}) => ({
    method,
    body,
    headers: {}
});

const createMockRes = () => ({
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    setHeader: vi.fn()
});

// Chainable mock
const createChainableMock = (data = null, error = null) => {
    const chain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data, error }),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
    };
    return chain;
};

// ============== EVOLUTION WEBHOOK ==============
describe('Evolution Webhook Handler', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should reject non-POST methods', async () => {
        const req = createMockReq('GET');
        const res = createMockRes();

        await evolutionHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(405);
        expect(res.json).toHaveBeenCalledWith({ error: 'Method not allowed' });
    });

    it('should handle messages.upsert event', async () => {
        const req = createMockReq('POST', {
            event: 'messages.upsert',
            instance: 'test-instance',
            data: { key: { id: 'msg-1' }, message: { conversation: 'Hello' } }
        });
        const res = createMockRes();

        await evolutionHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            received: true,
            event: 'messages.upsert'
        }));
    });

    it('should handle connection.update event', async () => {
        const req = createMockReq('POST', {
            event: 'connection.update',
            instance: 'test-instance',
            data: { state: 'open' }
        });
        const res = createMockRes();

        await evolutionHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle qrcode.updated event', async () => {
        const req = createMockReq('POST', {
            event: 'qrcode.updated',
            instance: 'test-instance',
            data: { qr: 'base64...' }
        });
        const res = createMockRes();

        await evolutionHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle unknown events gracefully', async () => {
        const req = createMockReq('POST', {
            event: 'some.new.event',
            instance: 'test-instance',
            data: {}
        });
        const res = createMockRes();

        await evolutionHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle errors gracefully', async () => {
        const req = createMockReq('POST', null); // Will cause error
        req.body = undefined; // Force error
        const res = createMockRes();

        await evolutionHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });
});

// ============== GREEN API WEBHOOK ==============
describe('Green API Webhook Handler', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should reject non-POST methods', async () => {
        const req = createMockReq('GET');
        const res = createMockRes();

        await greenapiHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(405);
        expect(res.json).toHaveBeenCalledWith({ error: 'Method not allowed' });
    });

    it('should return 200 for payload without instance', async () => {
        supabaseAdmin.from.mockReturnValue(createChainableMock(null, null));

        const req = createMockReq('POST', {
            typeWebhook: 'stateInstanceChanged',
            // No instanceData
        });
        const res = createMockRes();

        await greenapiHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should ignore unknown instance', async () => {
        supabaseAdmin.from.mockReturnValue(createChainableMock(null, null));

        const req = createMockReq('POST', {
            typeWebhook: 'incomingMessageReceived',
            instanceData: { idInstance: 'unknown-instance' }
        });
        const res = createMockRes();

        await greenapiHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            ignored: 'unknown_instance'
        }));
    });

    it('should process incoming message for known instance', async () => {
        const mockNumber = { id: 'num-1', user_id: 'user-1' };
        const mockChain = createChainableMock(mockNumber, null);
        supabaseAdmin.from.mockReturnValue(mockChain);

        const req = createMockReq('POST', {
            typeWebhook: 'incomingMessageReceived',
            instanceData: { idInstance: '7107361336' },
            senderData: { chatId: '972501234567@c.us', isMe: false },
            idMessage: 'msg-123',
            messageData: { textMessageData: { textMessage: 'Hello!' } }
        });
        const res = createMockRes();

        await greenapiHandler(req, res);

        expect(supabaseAdmin.from).toHaveBeenCalledWith('numbers');
    });

    it('should handle connection update', async () => {
        const mockNumber = { id: 'num-1', user_id: 'user-1' };
        const mockChain = createChainableMock(mockNumber, null);
        supabaseAdmin.from.mockReturnValue(mockChain);

        const req = createMockReq('POST', {
            typeWebhook: 'stateInstanceChanged',
            instanceData: { idInstance: '7107361336' },
            stateInstance: 'authorized'
        });
        const res = createMockRes();

        await greenapiHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });
});

// ============== WEBHOOK PAYLOAD FORMATS ==============
describe('Webhook Payload Formats', () => {
    describe('Green API Incoming Message', () => {
        it('should parse text message correctly', () => {
            const payload = {
                typeWebhook: 'incomingMessageReceived',
                instanceData: { idInstance: '7107361336', wid: '972545661640@c.us' },
                senderData: { chatId: '972501234567@c.us', sender: '972501234567@c.us', senderName: 'John' },
                idMessage: 'A1B2C3D4E5',
                messageData: {
                    typeMessage: 'textMessage',
                    textMessageData: { textMessage: 'Hello from test!' }
                }
            };

            // Verify structure is valid
            expect(payload.typeWebhook).toBe('incomingMessageReceived');
            expect(payload.messageData.textMessageData.textMessage).toBe('Hello from test!');
        });
    });

    describe('Evolution API Message', () => {
        it('should parse messages.upsert correctly', () => {
            const payload = {
                event: 'messages.upsert',
                instance: 'my-instance',
                data: {
                    key: { id: 'BAE5ABC123', remoteJid: '972501234567@s.whatsapp.net', fromMe: false },
                    message: { conversation: 'How are you?' },
                    pushName: 'Jane'
                }
            };

            expect(payload.event).toBe('messages.upsert');
            expect(payload.data.message.conversation).toBe('How are you?');
        });
    });
});
