import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handler } from '@src/handler/index';
import * as sendEmail from '@src/senders/email/sendEmail';
import * as sendTelegram from '@src/senders/telegram/sendTelegram';
import type { YMQEvent, YMQRecord } from '@shared';

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

function makeRecord(body: Record<string, unknown>, messageId = 'msg-1'): YMQRecord {
  return {
    event_metadata: {
      event_id: 'evt-1',
      event_type: 'yandex.cloud.events.messagequeue.QueueMessage',
      created_at: new Date().toISOString(),
      cloud_id: 'cloud-1',
      folder_id: 'folder-1',
    },
    details: {
      queue_id: 'queue-1',
      message: {
        message_id: messageId,
        md5_of_body: '',
        body: JSON.stringify(body),
        attributes: { SentTimestamp: '0' },
        message_attributes: {},
        md5_of_message_attributes: '',
      },
    },
  };
}

function makeEvent(records: YMQRecord[]): YMQEvent {
  return { messages: records };
}

describe('handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does nothing when no messages', async () => {
    await expect(handler(makeEvent([]))).resolves.toBeUndefined();
  });

  it('processes a valid ORDER_SUBMITTED message', async () => {
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
  });

  it('skips messages with unknown type', async () => {
    const mockSendEmail = vi.mocked(sendEmail.sendOrderEmail);
    const mockSendTelegram = vi.mocked(sendTelegram.sendTelegramNotification);

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

    expect(mockSendEmail).not.toHaveBeenCalled();
    expect(mockSendTelegram).not.toHaveBeenCalled();
  });

  it('skips messages with invalid JSON body', async () => {
    const mockSendEmail = vi.mocked(sendEmail.sendOrderEmail);

    const record = makeRecord({});
    record.details.message.body = 'not json';

    await handler(makeEvent([record]));

    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it('continues to next record after parse failure', async () => {
    const mockSendEmail = vi.mocked(sendEmail.sendOrderEmail);
    mockSendEmail.mockResolvedValue();
    const mockSendTelegram = vi.mocked(sendTelegram.sendTelegramNotification);
    mockSendTelegram.mockResolvedValue();

    const badRecord = makeRecord({}, 'msg-bad');
    badRecord.details.message.body = 'not json';

    const goodRecord = makeRecord(
      {
        type: 'ORDER_SUBMITTED',
        messageId: 'msg-good',
        timestamp: new Date().toISOString(),
        source: 'orders-intake',
        correlationId: 'corr-good',
        version: '1.0',
        payload: {},
      },
      'msg-good'
    );

    await handler(makeEvent([badRecord, goodRecord]));

    expect(mockSendEmail).toHaveBeenCalledTimes(1);
    expect(mockSendTelegram).toHaveBeenCalledTimes(1);
  });

  it('throws when both email and telegram fail', async () => {
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

    await expect(handler(makeEvent([record]))).rejects.toThrow('All enabled deliveries failed');
  });

  it('processes multiple records in one event', async () => {
    const mockSendEmail = vi.mocked(sendEmail.sendOrderEmail);
    mockSendEmail.mockResolvedValue();
    const mockSendTelegram = vi.mocked(sendTelegram.sendTelegramNotification);
    mockSendTelegram.mockResolvedValue();

    const records = [
      makeRecord(
        {
          type: 'ORDER_SUBMITTED',
          messageId: 'msg-1',
          timestamp: new Date().toISOString(),
          source: 'orders-intake',
          correlationId: 'corr-1',
          version: '1.0',
          payload: { id: 1 },
        },
        'msg-1'
      ),
      makeRecord(
        {
          type: 'ORDER_SUBMITTED',
          messageId: 'msg-2',
          timestamp: new Date().toISOString(),
          source: 'orders-intake',
          correlationId: 'corr-2',
          version: '1.0',
          payload: { id: 2 },
        },
        'msg-2'
      ),
    ];

    await handler(makeEvent(records));

    expect(mockSendEmail).toHaveBeenCalledTimes(2);
    expect(mockSendTelegram).toHaveBeenCalledTimes(2);
  });

  it('skips email when EMAIL_ENABLED=false', async () => {
    process.env.EMAIL_ENABLED = 'false';
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

    delete process.env.EMAIL_ENABLED;
  });

  it('skips telegram when TELEGRAM_ENABLED=false', async () => {
    process.env.TELEGRAM_ENABLED = 'false';
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

    delete process.env.TELEGRAM_ENABLED;
  });

  it('returns without sending when both channels are disabled', async () => {
    process.env.EMAIL_ENABLED = 'false';
    process.env.TELEGRAM_ENABLED = 'false';
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

    delete process.env.EMAIL_ENABLED;
    delete process.env.TELEGRAM_ENABLED;
  });

  it('throws when enabled email fails and telegram is disabled', async () => {
    process.env.TELEGRAM_ENABLED = 'false';
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

    await expect(handler(makeEvent([record]))).rejects.toThrow('All enabled deliveries failed');

    delete process.env.TELEGRAM_ENABLED;
  });
});
