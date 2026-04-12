import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockSend = vi.fn();

vi.doMock('@aws-sdk/client-sqs', () => ({
    SQSClient: vi.fn().mockImplementation(() => ({
        send: mockSend,
    })),
    SendMessageCommand: vi.fn().mockImplementation((params) => params),
}));

describe('sendMessageToQueueAsync', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.QUEUE_URL = 'https://queue.url';
        process.env.AWS_ACCESS_KEY_ID = 'test-key';
        process.env.AWS_SECRET_ACCESS_KEY = 'test-secret';
    });

    afterEach(() => {
        vi.resetModules();
    });

    it('sends the message body to the queue and returns MessageId', async () => {
        mockSend.mockResolvedValue({ MessageId: 'msg-123' });

        const { sendMessageToQueueAsync } = await import('./messageQueue');
        const result = await sendMessageToQueueAsync('{"order":1}');

        expect(result).toBe('msg-123');
        expect(mockSend).toHaveBeenCalledWith({
            QueueUrl: 'https://queue.url',
            MessageBody: '{"order":1}',
        });
    });

    it('converts non-string message bodies to string', async () => {
        mockSend.mockResolvedValue({ MessageId: 'msg-456' });

        const { sendMessageToQueueAsync } = await import('./messageQueue');
        await sendMessageToQueueAsync('hello');

        expect(mockSend).toHaveBeenCalledWith(
            expect.objectContaining({ MessageBody: 'hello' })
        );
    });
});
