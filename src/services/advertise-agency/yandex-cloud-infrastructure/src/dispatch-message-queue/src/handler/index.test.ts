import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handler } from '@src/handler/index';
import * as messageQueue from '@src/queue/messageQueue';
import * as sendEmail from '@src/senders/email/sendEmail';
import * as sendTelegram from '@src/senders/telegram/sendTelegram';
import type { SQSEvent, SQSRecord } from '@src/handler/index';

vi.mock('@src/queue/messageQueue', () => ({
  deleteMessageFromQueueAsync: vi.fn(),
}));

vi.mock('@src/senders/email/sendEmail', () => ({
  sendOrderEmail: vi.fn(),
}));

vi.mock('@src/senders/telegram/sendTelegram', () => ({
  sendTelegramNotification: vi.fn(),
}));

vi.mock('@shared', () => ({
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
    const mockSendTelegram = vi.mocked(sendTelegram.sendTelegramNotification);
    mockSendTelegram.mockResolvedValue();

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
    expect(mockSendTelegram).toHaveBeenCalledTimes(1);
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

  it('deletes message when email fails but telegram succeeds', async () => {
    const mockDelete = vi.mocked(messageQueue.deleteMessageFromQueueAsync);
    mockDelete.mockResolvedValue();
    const mockSendEmail = vi.mocked(sendEmail.sendOrderEmail);
    mockSendEmail.mockRejectedValue(new Error('SMTP connection failed'));
    const mockSendTelegram = vi.mocked(sendTelegram.sendTelegramNotification);
    mockSendTelegram.mockResolvedValue();

    const record = makeRecord({
      type: 'ORDER_SUBMITTED',
      messageId: 'msg-3',
      timestamp: new Date().toISOString(),
      source: 'orders-intake',
      correlationId: 'corr-3',
      version: '1.0',
      payload: {},
    });

    await expect(handler(makeEvent([record]))).resolves.toBeUndefined();
    expect(mockDelete).toHaveBeenCalledWith('rh-123');
  });

  it('deletes message when telegram fails but email succeeds', async () => {
    const mockDelete = vi.mocked(messageQueue.deleteMessageFromQueueAsync);
    mockDelete.mockResolvedValue();
    const mockSendEmail = vi.mocked(sendEmail.sendOrderEmail);
    mockSendEmail.mockResolvedValue();
    const mockSendTelegram = vi.mocked(sendTelegram.sendTelegramNotification);
    mockSendTelegram.mockRejectedValue(new Error('Telegram API error'));

    const record = makeRecord({
      type: 'ORDER_SUBMITTED',
      messageId: 'msg-4',
      timestamp: new Date().toISOString(),
      source: 'orders-intake',
      correlationId: 'corr-4',
      version: '1.0',
      payload: {},
    });

    await expect(handler(makeEvent([record]))).resolves.toBeUndefined();
    expect(mockDelete).toHaveBeenCalledWith('rh-123');
  });

  it('throws when both email and telegram fail', async () => {
    const mockDelete = vi.mocked(messageQueue.deleteMessageFromQueueAsync);
    const mockSendEmail = vi.mocked(sendEmail.sendOrderEmail);
    mockSendEmail.mockRejectedValue(new Error('SMTP error'));
    const mockSendTelegram = vi.mocked(sendTelegram.sendTelegramNotification);
    mockSendTelegram.mockRejectedValue(new Error('Telegram error'));

    const record = makeRecord({
      type: 'ORDER_SUBMITTED',
      messageId: 'msg-5',
      timestamp: new Date().toISOString(),
      source: 'orders-intake',
      correlationId: 'corr-5',
      version: '1.0',
      payload: {},
    });

    await expect(handler(makeEvent([record]))).rejects.toThrow(
      'One or more enabled notification deliveries failed'
    );
    expect(mockDelete).not.toHaveBeenCalled();
  });

  it('processes multiple records in one event', async () => {
    const mockDelete = vi.mocked(messageQueue.deleteMessageFromQueueAsync);
    mockDelete.mockResolvedValue();
    const mockSendEmail = vi.mocked(sendEmail.sendOrderEmail);
    mockSendEmail.mockResolvedValue();
    const mockSendTelegram = vi.mocked(sendTelegram.sendTelegramNotification);
    mockSendTelegram.mockResolvedValue();

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
    expect(mockSendTelegram).toHaveBeenCalledTimes(2);
    expect(mockDelete).toHaveBeenCalledTimes(2);
  });

  it('skips email when EMAIL_ENABLED=false, deletes on telegram success', async () => {
    process.env.EMAIL_ENABLED = 'false';
    const mockDelete = vi.mocked(messageQueue.deleteMessageFromQueueAsync);
    mockDelete.mockResolvedValue();
    const mockSendEmail = vi.mocked(sendEmail.sendOrderEmail);
    mockSendEmail.mockResolvedValue();
    const mockSendTelegram = vi.mocked(sendTelegram.sendTelegramNotification);
    mockSendTelegram.mockResolvedValue();

    const record = makeRecord({
      type: 'ORDER_SUBMITTED',
      messageId: 'msg-6',
      timestamp: new Date().toISOString(),
      source: 'orders-intake',
      correlationId: 'corr-6',
      version: '1.0',
      payload: {},
    });

    await handler(makeEvent([record]));

    expect(mockSendEmail).not.toHaveBeenCalled();
    expect(mockSendTelegram).toHaveBeenCalledTimes(1);
    expect(mockDelete).toHaveBeenCalledWith('rh-123');

    delete process.env.EMAIL_ENABLED;
  });

  it('skips telegram when TELEGRAM_ENABLED=false, deletes on email success', async () => {
    process.env.TELEGRAM_ENABLED = 'false';
    const mockDelete = vi.mocked(messageQueue.deleteMessageFromQueueAsync);
    mockDelete.mockResolvedValue();
    const mockSendEmail = vi.mocked(sendEmail.sendOrderEmail);
    mockSendEmail.mockResolvedValue();
    const mockSendTelegram = vi.mocked(sendTelegram.sendTelegramNotification);
    mockSendTelegram.mockResolvedValue();

    const record = makeRecord({
      type: 'ORDER_SUBMITTED',
      messageId: 'msg-7',
      timestamp: new Date().toISOString(),
      source: 'orders-intake',
      correlationId: 'corr-7',
      version: '1.0',
      payload: {},
    });

    await handler(makeEvent([record]));

    expect(mockSendEmail).toHaveBeenCalledTimes(1);
    expect(mockSendTelegram).not.toHaveBeenCalled();
    expect(mockDelete).toHaveBeenCalledWith('rh-123');

    delete process.env.TELEGRAM_ENABLED;
  });

  it('deletes message without sending when both channels are disabled', async () => {
    process.env.EMAIL_ENABLED = 'false';
    process.env.TELEGRAM_ENABLED = 'false';
    const mockDelete = vi.mocked(messageQueue.deleteMessageFromQueueAsync);
    mockDelete.mockResolvedValue();
    const mockSendEmail = vi.mocked(sendEmail.sendOrderEmail);
    const mockSendTelegram = vi.mocked(sendTelegram.sendTelegramNotification);

    const record = makeRecord({
      type: 'ORDER_SUBMITTED',
      messageId: 'msg-8',
      timestamp: new Date().toISOString(),
      source: 'orders-intake',
      correlationId: 'corr-8',
      version: '1.0',
      payload: {},
    });

    await handler(makeEvent([record]));

    expect(mockSendEmail).not.toHaveBeenCalled();
    expect(mockSendTelegram).not.toHaveBeenCalled();
    expect(mockDelete).toHaveBeenCalledWith('rh-123');

    delete process.env.EMAIL_ENABLED;
    delete process.env.TELEGRAM_ENABLED;
  });

  it('throws when enabled email fails and telegram is disabled', async () => {
    process.env.TELEGRAM_ENABLED = 'false';
    const mockDelete = vi.mocked(messageQueue.deleteMessageFromQueueAsync);
    const mockSendEmail = vi.mocked(sendEmail.sendOrderEmail);
    mockSendEmail.mockRejectedValue(new Error('SMTP error'));

    const record = makeRecord({
      type: 'ORDER_SUBMITTED',
      messageId: 'msg-9',
      timestamp: new Date().toISOString(),
      source: 'orders-intake',
      correlationId: 'corr-9',
      version: '1.0',
      payload: {},
    });

    await expect(handler(makeEvent([record]))).rejects.toThrow(
      'One or more enabled notification deliveries failed'
    );
    expect(mockDelete).not.toHaveBeenCalled();

    delete process.env.TELEGRAM_ENABLED;
  });
});
