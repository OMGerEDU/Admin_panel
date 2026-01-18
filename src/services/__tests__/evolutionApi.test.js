import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import evolutionApi, {
    instanceController,
    chatController,
    groupController,
    messageController
} from '../evolutionApi';

// Mock global fetch
const mockFetch = vi.spyOn(global, 'fetch');
const TEST_NUMBER = '972545661640';
const MOCK_TOKEN = 'test-token';
const MOCK_INSTANCE = 'test-instance';

describe('Evolution API Service (QA)', () => {

    beforeEach(() => {
        mockFetch.mockReset();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('Instance Controller', () => {
        it('should create an instance correctly', async () => {
            // Arrange
            const instanceName = 'Sasha';
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ instance: { instanceName } })
            });

            // Act
            const result = await instanceController.create(MOCK_TOKEN, instanceName);

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining('/instance/create'),
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.objectContaining({ 'apikey': MOCK_TOKEN }),
                    body: JSON.stringify({ instanceName })
                })
            );
            expect(result.success).toBe(true);
            expect(result.data.instance.instanceName).toBe(instanceName);
        });

        it('should fetch instances', async () => {
            // Arrange
            const mockInstances = [{ instanceName: 'Sasha' }];
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockInstances
            });

            // Act
            const result = await instanceController.fetchInstances(MOCK_TOKEN);

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining('/instances'),
                expect.anything()
            );
            expect(result.success).toBe(true);
            expect(result.data).toEqual(mockInstances);
        });
    });

    describe('Chat Controller', () => {
        it('should check WhatsApp number validity', async () => {
            // Arrange
            const numbers = [TEST_NUMBER];
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ([{ exists: true }])
            });

            // Act
            const result = await chatController.checkWhatsApp(MOCK_INSTANCE, MOCK_TOKEN, numbers);

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining(`/chat/whatsappNumbers/${MOCK_INSTANCE}`),
                expect.objectContaining({
                    body: JSON.stringify({ numbers })
                })
            );
            expect(result.success).toBe(true);
        });
    });

    describe('Message Controller', () => {
        it('should send a text message to the QA number', async () => {
            // Arrange
            const message = 'Hello QA';
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ key: { id: '123' } })
            });

            // Act
            const result = await messageController.sendText(MOCK_INSTANCE, MOCK_TOKEN, TEST_NUMBER, { text: message });

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining(`/message/sendText/${MOCK_INSTANCE}`),
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({ number: TEST_NUMBER, text: message })
                })
            );
            expect(result.success).toBe(true);
        });

        it('should handle API errors gracefully', async () => {
            // Arrange
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 400,
                text: async () => 'Bad Request'
            });

            // Act
            const result = await messageController.sendText(MOCK_INSTANCE, MOCK_TOKEN, TEST_NUMBER, { text: 'fail' });

            // Assert
            expect(result.success).toBe(false);
            expect(result.error).toContain('HTTP 400');
        });
    });

    describe('Group Controller', () => {
        it('should create a group', async () => {
            // Arrange
            const subject = 'QA Group';
            const participants = [TEST_NUMBER];
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ id: 'group-id' })
            });

            // Act
            const result = await groupController.create(MOCK_INSTANCE, MOCK_TOKEN, subject, participants);

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining(`/group/create/${MOCK_INSTANCE}`),
                expect.objectContaining({
                    body: JSON.stringify({ subject, participants })
                })
            );
            expect(result.success).toBe(true);
        });
    });

    describe('Integrations', () => {
        it('should fetch Typebot settings', async () => {
            // Arrange
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ enabled: true })
            });

            // Act
            const result = await evolutionApi.integrations.typebot.find(MOCK_INSTANCE, MOCK_TOKEN);

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining(`/typebot/find/${MOCK_INSTANCE}`),
                expect.anything()
            );
            expect(result.success).toBe(true);
        });
    });
});
