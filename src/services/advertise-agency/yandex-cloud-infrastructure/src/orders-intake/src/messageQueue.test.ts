import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MESSAGE_SOURCE, MESSAGE_VERSION, buildOrderMessage } from '../../shared/types';

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
    delete process.env.QUEUE_URL;
    delete process.env.AWS_ACCESS_KEY_ID;
    delete process.env.AWS_SECRET_ACCESS_KEY;
    vi.resetModules();
  });

  it('sends the OrderMessage as JSON to the queue and returns MessageId', async () => {
    mockSend.mockResolvedValue({ MessageId: 'msg-123' });

    const { sendMessageToQueueAsync } = await import('./messageQueue');
    const message = {
      type: 'ORDER_SUBMITTED',
      messageId: 'uuid-1',
      timestamp: '2026-04-13T00:00:00.000Z',
      source: MESSAGE_SOURCE,
      correlationId: 'corr-1',
      version: MESSAGE_VERSION,
      payload: { name: 'John' },
    };
    const result = await sendMessageToQueueAsync(message);

    expect(result).toBe('msg-123');
    expect(mockSend).toHaveBeenCalledWith({
      QueueUrl: 'https://queue.url',
      MessageBody: JSON.stringify(message),
    });
  });
});

describe('buildOrderMessage', () => {
  it('wraps order payload in a structured message', () => {
    const order = { name: 'John', phone: '+79991234567' };
    const msg = buildOrderMessage(order, 'req-abc');

    expect(msg.type).toBe('ORDER_SUBMITTED');
    expect(msg.source).toBe(MESSAGE_SOURCE);
    expect(msg.correlationId).toBe('req-abc');
    expect(msg.version).toBe(MESSAGE_VERSION);
    expect(msg.payload).toBe(order);
    expect(typeof msg.messageId).toBe('string');
    expect(typeof msg.timestamp).toBe('string');
  });

  it('generates a unique messageId per call', () => {
    const msg1 = buildOrderMessage({}, 'req-1');
    const msg2 = buildOrderMessage({}, 'req-1');

    expect(msg1.messageId).not.toBe(msg2.messageId);
  });

  it('uses ISO timestamp for timestamp field', () => {
    const msg = buildOrderMessage({}, 'req-1');

    expect(() => new Date(msg.timestamp)).not.toThrow();
  });
});
