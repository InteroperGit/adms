import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockSend = vi.fn();

vi.doMock('@aws-sdk/client-sqs', () => ({
  SQSClient: vi.fn().mockImplementation(() => ({
    send: mockSend,
  })),
  ReceiveMessageCommand: vi.fn().mockImplementation((params) => params),
  DeleteMessageCommand: vi.fn().mockImplementation((params) => params),
}));

describe('receiveMessagesFromQueueAsync', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.AWS_REGION = 'ru-central1';
    process.env.AWS_ENDPOINT = 'https://message-queue.api.cloud.yandex.net';
    process.env.AWS_ACCESS_KEY_ID = 'test-key';
    process.env.AWS_SECRET_ACCESS_KEY = 'test-secret';
    process.env.QUEUE_URL = 'https://queue-url';
  });

  afterEach(() => {
    vi.resetModules();
  });

  it('sends ReceiveMessageCommand with correct QueueUrl', async () => {
    mockSend.mockResolvedValue({ Messages: [] });

    const { receiveMessagesFromQueueAsync } = await import('./messageQueue');
    await receiveMessagesFromQueueAsync(1);

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({ QueueUrl: 'https://queue-url' })
    );
  });

  it('returns parsed messages from SQS response', async () => {
    mockSend.mockResolvedValue({
      Messages: [
        {
          MessageId: 'msg-1',
          ReceiptHandle: 'rh-1',
          Body: JSON.stringify({
            type: 'ORDER_SUBMITTED',
            messageId: 'msg-1',
            timestamp: '',
            source: '',
            correlationId: '',
            version: '1.0',
            payload: {},
          }),
        },
      ],
    });

    const { receiveMessagesFromQueueAsync } = await import('./messageQueue');
    const messages = await receiveMessagesFromQueueAsync(1);

    expect(messages).toHaveLength(1);
    expect(messages[0].type).toBe('ORDER_SUBMITTED');
  });

  it('handles invalid JSON body gracefully', async () => {
    mockSend.mockResolvedValue({
      Messages: [{ MessageId: 'msg-2', ReceiptHandle: 'rh-2', Body: 'not-json' }],
    });

    const { receiveMessagesFromQueueAsync } = await import('./messageQueue');
    const messages = await receiveMessagesFromQueueAsync(1);

    expect(messages).toHaveLength(1);
    expect(messages[0].type).toBe('UNKNOWN');
  });

  it('returns empty array when no messages', async () => {
    mockSend.mockResolvedValue({ Messages: [] });

    const { receiveMessagesFromQueueAsync } = await import('./messageQueue');
    const messages = await receiveMessagesFromQueueAsync(1);

    expect(messages).toEqual([]);
  });
});

describe('deleteMessageFromQueueAsync', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.AWS_REGION = 'ru-central1';
    process.env.AWS_ENDPOINT = 'https://message-queue.api.cloud.yandex.net';
    process.env.AWS_ACCESS_KEY_ID = 'test-key';
    process.env.AWS_SECRET_ACCESS_KEY = 'test-secret';
    process.env.QUEUE_URL = 'https://queue-url';
  });

  afterEach(() => {
    vi.resetModules();
  });

  it('sends DeleteMessageCommand with correct ReceiptHandle', async () => {
    mockSend.mockResolvedValue({});

    const { deleteMessageFromQueueAsync } = await import('./messageQueue');
    await deleteMessageFromQueueAsync('rh-123');

    expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({ ReceiptHandle: 'rh-123' }));
  });
});
