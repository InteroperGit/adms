import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handler } from './index';
import * as messageQueue from './messageQueue';

vi.mock('./messageQueue', () => ({
  receiveMessagesFromQueueAsync: vi.fn(),
  deleteMessageFromQueueAsync: vi.fn(),
}));

vi.mock('../../shared', () => ({
  logError: vi.fn(),
  logInfo: vi.fn(),
  logWarn: vi.fn(),
  badRequest: (error: string) => ({
    statusCode: 400,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: false, error }),
  }),
  serverError: (error: string | Error) => ({
    statusCode: 500,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: false, error: error instanceof Error ? error.message : error }),
  }),
  jsonResponse: (statusCode: number, payload: unknown) => ({
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }),
}));

function makeEvent(body: Record<string, unknown>) {
  return {
    body: JSON.stringify(body),
    requestContext: { requestId: 'test-req-id' },
  };
}

describe('handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 when action is missing', async () => {
    const result = await handler(makeEvent({}));
    expect(result.statusCode).toBe(400);
    const payload = JSON.parse(result.body);
    expect(payload.error).toContain('action');
  });

  it('returns 400 for unknown action', async () => {
    const result = await handler(makeEvent({ action: 'unknown' }));
    expect(result.statusCode).toBe(400);
    const payload = JSON.parse(result.body);
    expect(payload.error).toContain('Unknown action');
  });

  it('returns 200 with empty messages on poll', async () => {
    const mockReceive = vi.mocked(messageQueue.receiveMessagesFromQueueAsync);
    mockReceive.mockResolvedValue([]);
    const result = await handler(makeEvent({ action: 'poll' }));
    expect(result.statusCode).toBe(200);
    const payload = JSON.parse(result.body);
    expect(payload.ok).toBe(true);
    expect(payload.messages).toEqual([]);
  });

  it('returns 200 with messages on poll', async () => {
    const mockReceive = vi.mocked(messageQueue.receiveMessagesFromQueueAsync);
    mockReceive.mockResolvedValue([
      {
        type: 'ORDER_SUBMITTED',
        messageId: 'msg-1',
        timestamp: '',
        source: '',
        correlationId: '',
        version: '1.0',
        payload: {},
      },
    ] as unknown as import('../../shared/types').Message[]);
    const result = await handler(makeEvent({ action: 'poll' }));
    expect(result.statusCode).toBe(200);
    const payload = JSON.parse(result.body);
    expect(payload.messages).toHaveLength(1);
    expect(payload.messages[0].messageId).toBe('msg-1');
  });

  it('returns 400 on delete without receiptHandle', async () => {
    const result = await handler(makeEvent({ action: 'delete' }));
    expect(result.statusCode).toBe(400);
    const payload = JSON.parse(result.body);
    expect(payload.error).toContain('receiptHandle');
  });

  it('returns 200 on successful delete', async () => {
    const mockDelete = vi.mocked(messageQueue.deleteMessageFromQueueAsync);
    mockDelete.mockResolvedValue();
    const result = await handler(makeEvent({ action: 'delete', receiptHandle: 'rh-123' }));
    expect(result.statusCode).toBe(200);
    const payload = JSON.parse(result.body);
    expect(payload.ok).toBe(true);
  });

  it('returns 500 on unhandled error', async () => {
    const mockReceive = vi.mocked(messageQueue.receiveMessagesFromQueueAsync);
    mockReceive.mockRejectedValue(new Error('SQS down'));
    const result = await handler(makeEvent({ action: 'poll' }));
    expect(result.statusCode).toBe(500);
    const payload = JSON.parse(result.body);
    expect(payload.error).toBe('SQS down');
  });
});
