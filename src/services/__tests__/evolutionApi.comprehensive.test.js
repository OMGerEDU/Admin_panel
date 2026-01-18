
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    instanceController,
    messageController,
    chatController,
    groupController,
    profileSettings,
    settingsController,
    webhookController,
    integrations
} from '../evolutionApi';

// Mock the logger to avoid console noise
vi.mock('../../lib/logger', () => ({
    logger: {
        error: vi.fn(),
        info: vi.fn(),
        warn: vi.fn(),
    }
}));

// Mock global fetch
const globalFetch = vi.fn();
global.fetch = globalFetch;

describe('Evolution API Comprehensive Service Tests', () => {
    const API_TOKEN = 'test-token-123';
    const INSTANCE_NAME = 'test-instance';
    const TEST_NUMBER = '5511999999999';
    const BASE_URL = 'http://localhost:8080'; // Default fallback

    beforeEach(() => {
        vi.resetAllMocks();
        // Reset environment if needed, though we rely on default fallback or mocked env in real scenarios
        // For these tests, we assume getBaseUrl defaults to localhost:8080 or we can mock process.env
        process.env.VITE_EVOLUTION_API_URL = BASE_URL;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    // Helper to verify fetch calls
    const verifyFetch = (endpoint, method = 'GET', body = null) => {
        const expectedUrl = `${BASE_URL}/${endpoint}`;
        expect(globalFetch).toHaveBeenCalledWith(expectedUrl, expect.objectContaining({
            method,
            headers: expect.objectContaining({
                'apikey': API_TOKEN,
                'Content-Type': 'application/json'
            })
        }));

        if (body) {
            expect(globalFetch).toHaveBeenCalledWith(expectedUrl, expect.objectContaining({
                body: JSON.stringify(body)
            }));
        }
    };

    // Helper to mock successful response
    const mockSuccess = (data = {}) => {
        globalFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => data
        });
    };

    describe('Instance Controller', () => {
        it('create: should POST to /instance/create', async () => {
            mockSuccess({ instance: { name: INSTANCE_NAME } });
            await instanceController.create(API_TOKEN, INSTANCE_NAME, { description: 'test' });
            verifyFetch('instance/create', 'POST', { instanceName: INSTANCE_NAME, description: 'test' });
        });

        it('fetchInstances: should GET /instances', async () => {
            mockSuccess([]);
            await instanceController.fetchInstances(API_TOKEN);
            verifyFetch('instances', 'GET');
        });

        it('connect: should GET /instance/connect/{instance}', async () => {
            mockSuccess();
            await instanceController.connect(INSTANCE_NAME, API_TOKEN);
            verifyFetch(`instance/connect/${INSTANCE_NAME}`, 'GET');
        });

        it('connectionState: should GET /instances/{instance} and map response', async () => {
            mockSuccess({ connectionStatus: 'open', name: INSTANCE_NAME });
            const result = await instanceController.connectionState(INSTANCE_NAME, API_TOKEN);

            verifyFetch(`instances/${INSTANCE_NAME}`, 'GET'); // Updated path based on previous findings
            expect(result.success).toBe(true);
            expect(result.data.instance.state).toBe('open');
        });

        it('logout: should DELETE /instance/logout/{instance}', async () => {
            mockSuccess();
            await instanceController.logout(INSTANCE_NAME, API_TOKEN);
            verifyFetch(`instance/logout/${INSTANCE_NAME}`, 'DELETE');
        });

        it('delete: should DELETE /instance/delete/{instance}', async () => {
            mockSuccess();
            await instanceController.delete(INSTANCE_NAME, API_TOKEN);
            verifyFetch(`instance/delete/${INSTANCE_NAME}`, 'DELETE');
        });

        it('restart: should PUT /instance/restart/{instance}', async () => {
            mockSuccess();
            await instanceController.restart(INSTANCE_NAME, API_TOKEN);
            verifyFetch(`instance/restart/${INSTANCE_NAME}`, 'PUT');
        });

        it('setPresence: should POST to /instance/setPresence/{instance}', async () => {
            mockSuccess();
            await instanceController.setPresence(INSTANCE_NAME, API_TOKEN, 'available');
            verifyFetch(`instance/setPresence/${INSTANCE_NAME}`, 'POST', { presence: 'available' });
        });
    });

    describe('Message Controller', () => {
        it('sendText: should POST to /message/sendText/{instance}', async () => {
            mockSuccess({ key: { id: 'msg-id' } });
            const options = { text: 'Hello', delay: 1200 };
            await messageController.sendText(INSTANCE_NAME, API_TOKEN, TEST_NUMBER, options);
            verifyFetch(`message/sendText/${INSTANCE_NAME}`, 'POST', { number: TEST_NUMBER, ...options });
        });

        it('sendMedia: should POST to /message/sendMedia/{instance}', async () => {
            mockSuccess();
            const options = { mediatype: 'image', media: 'base64str' };
            await messageController.sendMedia(INSTANCE_NAME, API_TOKEN, TEST_NUMBER, options);
            verifyFetch(`message/sendMedia/${INSTANCE_NAME}`, 'POST', { number: TEST_NUMBER, ...options });
        });

        it('sendAudio: should POST to /message/sendWhatsAppAudio/{instance}', async () => {
            mockSuccess();
            await messageController.sendAudio(INSTANCE_NAME, API_TOKEN, TEST_NUMBER, 'http://audio.url');
            verifyFetch(`message/sendWhatsAppAudio/${INSTANCE_NAME}`, 'POST', { number: TEST_NUMBER, audio: 'http://audio.url' });
        });

        it('sendSticker: should POST to /message/sendSticker/{instance}', async () => {
            mockSuccess();
            await messageController.sendSticker(INSTANCE_NAME, API_TOKEN, TEST_NUMBER, 'http://sticker.url');
            verifyFetch(`message/sendSticker/${INSTANCE_NAME}`, 'POST', { number: TEST_NUMBER, sticker: 'http://sticker.url' });
        });

        it('sendLocation: should POST to /message/sendLocation/{instance}', async () => {
            mockSuccess();
            const loc = { latitude: 123, longitude: 456 };
            await messageController.sendLocation(INSTANCE_NAME, API_TOKEN, TEST_NUMBER, loc);
            verifyFetch(`message/sendLocation/${INSTANCE_NAME}`, 'POST', { number: TEST_NUMBER, ...loc });
        });

        // Add other message types as needed...
    });

    describe('Chat Controller', () => {
        it('checkWhatsApp: should POST to /chat/whatsappNumbers/{instance}', async () => {
            mockSuccess();
            const numbers = ['123', '456'];
            await chatController.checkWhatsApp(INSTANCE_NAME, API_TOKEN, numbers);
            verifyFetch(`chat/whatsappNumbers/${INSTANCE_NAME}`, 'POST', { numbers });
        });

        it('markMessageAsRead: should PUT /chat/markMessageAsRead/{instance}', async () => {
            mockSuccess();
            await chatController.markMessageAsRead(INSTANCE_NAME, API_TOKEN, 'chat-id');
            verifyFetch(`chat/markMessageAsRead/${INSTANCE_NAME}`, 'PUT', { readMessages: ['chat-id'] });
        });

        // ... more chat tests as needed (abbreviated for brevity in this step, but covering key ones)

        it('archiveChat: should PUT /chat/archiveChat/{instance}', async () => {
            mockSuccess();
            await chatController.archiveChat(INSTANCE_NAME, API_TOKEN, 'chat-id', true);
            verifyFetch(`chat/archiveChat/${INSTANCE_NAME}`, 'PUT', { chatId: 'chat-id', archive: true });
        });
    });

    describe('Group Controller', () => {
        it('create: should POST to /group/create/{instance}', async () => {
            mockSuccess();
            await groupController.create(INSTANCE_NAME, API_TOKEN, 'New Group', ['123']);
            verifyFetch(`group/create/${INSTANCE_NAME}`, 'POST', { subject: 'New Group', participants: ['123'] });
        });

        it('fetchAllGroups: should GET /group/fetchAllGroups/{instance}', async () => {
            mockSuccess();
            await groupController.fetchAllGroups(INSTANCE_NAME, API_TOKEN, true);
            // Verify query params logic if implemented in evolutionApiCall or mocked fetch
            // The service constructs url with query params.
            // basic check:
            const expectedUrl = `${BASE_URL}/group/fetchAllGroups/${INSTANCE_NAME}?getParticipants=true`;
            expect(globalFetch).toHaveBeenCalledWith(expectedUrl, expect.anything());
        });

        it('leaveGroup: should DELETE /group/leaveGroup/{instance}', async () => {
            mockSuccess();
            await groupController.leaveGroup(INSTANCE_NAME, API_TOKEN, 'group-jid');
            verifyFetch(`group/leaveGroup/${INSTANCE_NAME}`, 'DELETE', { groupJid: 'group-jid' });
        });
    });

    describe('Profile & Settings Controllers', () => {
        it('fetchProfile: should POST to /chat/fetchProfile/{instance}', async () => {
            mockSuccess();
            await profileSettings.fetchProfile(INSTANCE_NAME, API_TOKEN, TEST_NUMBER);
            verifyFetch(`chat/fetchProfile/${INSTANCE_NAME}`, 'POST', { number: TEST_NUMBER });
        });

        it('updateProfileName: should POST to /chat/updateProfileName/{instance}', async () => {
            mockSuccess();
            await profileSettings.updateProfileName(INSTANCE_NAME, API_TOKEN, 'New Name');
            verifyFetch(`chat/updateProfileName/${INSTANCE_NAME}`, 'POST', { name: 'New Name' });
        });

        it('settings.find: should GET /settings/find/{instance}', async () => {
            mockSuccess();
            await settingsController.find(INSTANCE_NAME, API_TOKEN);
            verifyFetch(`settings/find/${INSTANCE_NAME}`, 'GET');
        });

        it('webhook.set: should POST to /webhook/set/{instance}', async () => {
            mockSuccess();
            const hook = { url: 'http://hook.com', saved: true };
            await webhookController.set(INSTANCE_NAME, API_TOKEN, hook);
            verifyFetch(`webhook/set/${INSTANCE_NAME}`, 'POST', hook);
        });
    });

    describe('Integrations', () => {
        it('typebot.find: should GET /typebot/find/{instance}', async () => {
            mockSuccess();
            await integrations.typebot.find(INSTANCE_NAME, API_TOKEN);
            verifyFetch(`typebot/find/${INSTANCE_NAME}`, 'GET');
        });
    });

});
