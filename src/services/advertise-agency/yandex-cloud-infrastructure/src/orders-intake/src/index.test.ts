import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MESSAGE_SOURCE, MESSAGE_VERSION } from '@shared/types';

// Set env vars before any module mocking so vi.importActual in the mock factory succeeds
process.env.QUEUE_URL = 'https://queue.url';
process.env.AWS_ACCESS_KEY_ID = 'test-key';
process.env.AWS_SECRET_ACCESS_KEY = 'test-secret';

const mockCheckCaptchaAsync = vi.fn();
const mockSendMessageToQueueAsync = vi.fn();
const mockLogWarn = vi.fn();
const mockLogError = vi.fn();

vi.doMock('./smartCaptcha', () => ({
  checkCaptchaAsync: mockCheckCaptchaAsync,
}));

vi.doMock('./messageQueue', async () => {
  const actual = await vi.importActual<typeof import('./messageQueue')>('./messageQueue');
  return {
    ...actual,
    sendMessageToQueueAsync: mockSendMessageToQueueAsync,
  };
});

vi.doMock('@shared', async () => {
  const actual = await vi.importActual<typeof import('@shared')>('@shared');
  return {
    ...actual,
    logWarn: mockLogWarn,
    logError: mockLogError,
  };
});

describe('handler', () => {
  const consent = {
    acceptedAt: '2026-04-18T10:00:00.000Z',
    text: 'I agree to the processing of personal data.',
    links: [
      {
        label: 'Consent',
        href: 'https://example.com/consent',
        version: 'v1',
        effectiveDate: '2026-04-01',
      },
    ],
    userAgent: 'Mozilla/5.0',
    language: 'ru-RU',
    timezone: 'Europe/Moscow',
    screenResolution: '1920x1080',
    referrer: 'https://example.com',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetModules();
  });

  async function importHandler() {
    const mod = await import('./index');
    return mod.handler;
  }

  it('returns 400 when body is not valid JSON', async () => {
    const handler = await importHandler();
    const res = await handler({ body: 'not-json' });

    expect(res.statusCode).toBe(400);
    expect(mockLogWarn).toHaveBeenCalledWith('Invalid JSON body', expect.any(Object));
  });

  it('returns 400 when captchaToken is missing', async () => {
    const handler = await importHandler();
    const res = await handler({ body: JSON.stringify({ order: { name: 'test' }, consent }) });

    expect(res.statusCode).toBe(400);
    expect(mockLogWarn).toHaveBeenCalledWith('Captcha token is required', expect.any(Object));
  });

  it('returns 400 when order is missing', async () => {
    const handler = await importHandler();
    const res = await handler({ body: JSON.stringify({ captchaToken: 'abc', consent }) });

    expect(res.statusCode).toBe(400);
    expect(mockLogWarn).toHaveBeenCalledWith('Order is required', expect.any(Object));
  });

  it('returns 400 when order is not an object', async () => {
    const handler = await importHandler();
    const res = await handler({
      body: JSON.stringify({ captchaToken: 'abc', order: 'string', consent }),
    });

    expect(res.statusCode).toBe(400);
  });

  it('returns 400 when consent is missing', async () => {
    const handler = await importHandler();
    const res = await handler({
      body: JSON.stringify({ captchaToken: 'abc', order: { name: 'test' } }),
    });

    expect(res.statusCode).toBe(400);
    expect(mockLogWarn).toHaveBeenCalledWith('Consent is required', expect.any(Object));
  });

  it('returns 400 when consent is not an object', async () => {
    const handler = await importHandler();
    const res = await handler({
      body: JSON.stringify({ captchaToken: 'abc', order: { name: 'test' }, consent: 'string' }),
    });

    expect(res.statusCode).toBe(400);
    expect(mockLogWarn).toHaveBeenCalledWith('Consent is required', expect.any(Object));
  });

  it('returns 400 when captcha validation fails', async () => {
    mockCheckCaptchaAsync.mockResolvedValue(false);

    const handler = await importHandler();
    const res = await handler({
      body: JSON.stringify({ captchaToken: 'abc', order: { name: 'test' }, consent }),
      requestContext: { identity: { sourceIp: '1.2.3.4' }, requestId: 'req-1' },
    });

    expect(res.statusCode).toBe(400);
    expect(mockLogWarn).toHaveBeenCalledWith('Captcha validation failed', { requestId: 'req-1' });
  });

  it('sends order to queue and returns 200 on success', async () => {
    mockCheckCaptchaAsync.mockResolvedValue(true);
    mockSendMessageToQueueAsync.mockResolvedValue('msg-123');

    const handler = await importHandler();
    const order = { productType: 'landing', name: 'John', phone: '+79991234567' };
    const res = await handler({
      body: JSON.stringify({ captchaToken: 'valid-token', order, consent }),
      requestContext: { identity: { sourceIp: '1.2.3.4' }, requestId: 'req-2' },
    });

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual({ messageId: 'msg-123' });
    expect(mockSendMessageToQueueAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'ORDER_SUBMITTED',
        source: MESSAGE_SOURCE,
        correlationId: 'req-2',
        version: MESSAGE_VERSION,
        payload: order,
        consent,
      })
    );
  });

  it('returns 500 when sendMessageToQueueAsync throws', async () => {
    mockCheckCaptchaAsync.mockResolvedValue(true);
    mockSendMessageToQueueAsync.mockRejectedValue(new Error('SQS error'));

    const handler = await importHandler();
    const res = await handler({
      body: JSON.stringify({
        captchaToken: 'abc',
        order: { productType: 'landing', name: 'test' },
        consent,
      }),
      requestContext: { identity: { sourceIp: '1.2.3.4' }, requestId: 'req-3' },
    });

    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res.body)).toEqual({ ok: false, error: 'SQS error' });
    expect(mockLogError).toHaveBeenCalledWith('SQS error', { requestId: 'req-3' });
  });
});
