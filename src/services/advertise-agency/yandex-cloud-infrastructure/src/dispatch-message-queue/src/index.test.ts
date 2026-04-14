import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handler } from './index';
import * as messageQueue from './messageQueue';
import * as sendEmail from './sendEmail';
import type { SQSEvent, SQSRecord } from './index';

vi.mock('./messageQueue', () => ({
  deleteMessageFromQueueAsync: vi.fn(),
}));

vi.mock('./sendEmail', () => ({
  sendOrderEmail: vi.fn(),
}));

vi.mock('../../shared', () => ({
  logInfo: vi.fn(),
  logWarn: vi.fn(),
  logError: vi.fn(),
}));

function makeRecord(body: Record<string, unknown>, overrides?: Partial<SQSRecord>): SQSRecord {
  return {
    eventVersion: '1.0',
    eventSource: 'aws:sqs',
    awsRegion: 'ru-central1',
    eventTime: new Date().toISOString(),
    eventName: 'ObjectCreated:Put',
    messageId: 'msg-1',
    receiptHandle: 'rh-123',
    body: JSON.stringify(body),
    attributes: {},
    messageAttributes: {},
    ...overrides,
  };
}

function makeEvent(records: SQSRecord[]): SQSEvent {
  return { Records: records };
}

describe('handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does nothing when no records', async () => {
    await expect(handler(makeEvent([]))).resolves.toBeUndefined();
  });

  it('processes a valid ORDER_SUBMITTED message', async () => {
    const mockDelete = vi.mocked(messageQueue.deleteMessageFromQueueAsync);
    mockDelete.mockResolvedValue();
    const mockSendEmail = vi.mocked(sendEmail.sendOrderEmail);
    mockSendEmail.mockResolvedValue();

    const record = makeRecord({
      type: 'ORDER_SUBMITTED',
      messageId: 'msg-1',
      timestamp: new Date().toISOString(),
      source: 'orders-intake',
      correlationId: 'corr-1',
      version: '1.0',
      payload: { name: 'Test' },
    });

    await handler(makeEvent([record]));

    expect(mockSendEmail).toHaveBeenCalledTimes(1);
    expect(mockDelete).toHaveBeenCalledWith('rh-123');
  });

  it('skips messages with unknown type', async () => {
    const mockDelete = vi.mocked(messageQueue.deleteMessageFromQueueAsync);

    const record = makeRecord({
      type: 'UNKNOWN_TYPE',
      messageId: 'msg-2',
      timestamp: '',
      source: '',
      correlationId: '',
      version: '',
      payload: {},
    });

    await handler(makeEvent([record]));

    expect(mockDelete).not.toHaveBeenCalled();
  });

  it('skips messages with invalid JSON body', async () => {
    const mockDelete = vi.mocked(messageQueue.deleteMessageFromQueueAsync);

    const record = makeRecord({} as Record<string, unknown>, { body: 'not json' });

    await handler(makeEvent([record]));

    expect(mockDelete).not.toHaveBeenCalled();
  });

  it('throws on processing error', async () => {
    const mockSendEmail = vi.mocked(sendEmail.sendOrderEmail);
    mockSendEmail.mockRejectedValue(new Error('SMTP connection failed'));

    const record = makeRecord({
      type: 'ORDER_SUBMITTED',
      messageId: 'msg-3',
      timestamp: new Date().toISOString(),
      source: 'orders-intake',
      correlationId: 'corr-3',
      version: '1.0',
      payload: {},
    });

    await expect(handler(makeEvent([record]))).rejects.toThrow('SMTP connection failed');
  });

  it('processes multiple records in one event', async () => {
    const mockDelete = vi.mocked(messageQueue.deleteMessageFromQueueAsync);
    mockDelete.mockResolvedValue();
    const mockSendEmail = vi.mocked(sendEmail.sendOrderEmail);
    mockSendEmail.mockResolvedValue();

    const records = [
      makeRecord({
        type: 'ORDER_SUBMITTED',
        messageId: 'msg-1',
        timestamp: new Date().toISOString(),
        source: 'orders-intake',
        correlationId: 'corr-1',
        version: '1.0',
        payload: { id: 1 },
      }),
      makeRecord({
        type: 'ORDER_SUBMITTED',
        messageId: 'msg-2',
        timestamp: new Date().toISOString(),
        source: 'orders-intake',
        correlationId: 'corr-2',
        version: '1.0',
        payload: { id: 2 },
      }),
    ];

    await handler(makeEvent(records));

    expect(mockSendEmail).toHaveBeenCalledTimes(2);
    expect(mockDelete).toHaveBeenCalledTimes(2);
  });
});
