import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { OrderMessage } from '@shared';

const mockVerify = vi.fn();
const mockSendMail = vi.fn();
const mockCreateTransport = vi.fn();

vi.mock('nodemailer', () => ({
  default: {
    createTransport: (...args: unknown[]) => mockCreateTransport(...args),
  },
}));

const savedEnv: Record<string, string | undefined> = {};
const ENV_KEYS = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASSWORD', 'EMAIL_FROM', 'EMAIL_TO'];

beforeEach(() => {
  for (const key of ENV_KEYS) {
    savedEnv[key] = process.env[key];
  }
  mockVerify.mockReset();
  mockSendMail.mockReset();
  mockCreateTransport.mockReset();
  mockCreateTransport.mockReturnValue({ verify: mockVerify, sendMail: mockSendMail });
  vi.resetModules();
});

afterEach(() => {
  for (const key of ENV_KEYS) {
    const val = savedEnv[key];
    if (val === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = val;
    }
  }
});

function makeOrderMessage(overrides?: Partial<OrderMessage>): OrderMessage {
  return {
    type: 'ORDER_SUBMITTED',
    messageId: 'msg-1',
    timestamp: '2026-04-14T10:00:00.000Z',
    source: 'orders-intake',
    correlationId: 'corr-1',
    version: '1.0',
    payload: { name: 'John', phone: '+79001234567' },
    consent: {
      acceptedAt: '2026-04-14T10:00:00.000Z',
      text: 'I agree to the terms.',
      links: [],
      userAgent: 'Mozilla/5.0',
      language: 'en',
      timezone: 'UTC',
      screenResolution: '1920x1080',
      referrer: null,
    },
    ...overrides,
  };
}

function setValidEnv() {
  process.env.SMTP_HOST = 'smtp.yandex.ru';
  process.env.SMTP_PORT = '465';
  process.env.SMTP_USER = 'test@yandex.ru';
  process.env.SMTP_PASSWORD = 'secret';
  process.env.EMAIL_FROM = 'test@yandex.ru';
  process.env.EMAIL_TO = 'test@yandex.ru';
}

describe('sendOrderEmail', () => {
  it('creates transport with correct config, verifies, and sends mail', async () => {
    setValidEnv();
    mockVerify.mockResolvedValue(undefined);
    mockSendMail.mockResolvedValue({ messageId: 'sent-1' });

    const { sendOrderEmail } = await import('./sendEmail');
    const message = makeOrderMessage();
    await sendOrderEmail(message);

    expect(mockCreateTransport).toHaveBeenCalledWith({
      host: 'smtp.yandex.ru',
      port: 465,
      secure: true,
      auth: { user: 'test@yandex.ru', pass: 'secret' },
    });
    expect(mockVerify).toHaveBeenCalledTimes(1);
    expect(mockSendMail).toHaveBeenCalledTimes(1);

    const mailOptions = mockSendMail.mock.calls[0][0];
    expect(mailOptions.from).toBe('test@yandex.ru');
    expect(mailOptions.to).toBe('test@yandex.ru');
    expect(mailOptions.subject).toBe('New order — corr-1');
    expect(mailOptions.html).toContain('New order received');
  });

  it('throws when SMTP_USER is missing', async () => {
    setValidEnv();
    delete process.env.SMTP_USER;

    const { sendOrderEmail } = await import('./sendEmail');
    await expect(sendOrderEmail(makeOrderMessage())).rejects.toThrow('SMTP_USER');
  });

  it('throws when SMTP_PASSWORD is missing', async () => {
    setValidEnv();
    delete process.env.SMTP_PASSWORD;

    const { sendOrderEmail } = await import('./sendEmail');
    await expect(sendOrderEmail(makeOrderMessage())).rejects.toThrow('SMTP_PASSWORD');
  });

  it('throws when SMTP_HOST is missing', async () => {
    setValidEnv();
    delete process.env.SMTP_HOST;

    const { sendOrderEmail } = await import('./sendEmail');
    await expect(sendOrderEmail(makeOrderMessage())).rejects.toThrow('SMTP_HOST');
  });

  it('throws when SMTP_PORT is missing', async () => {
    setValidEnv();
    delete process.env.SMTP_PORT;

    const { sendOrderEmail } = await import('./sendEmail');
    await expect(sendOrderEmail(makeOrderMessage())).rejects.toThrow('SMTP_PORT');
  });

  it('throws when SMTP_PORT is not a number', async () => {
    setValidEnv();
    process.env.SMTP_PORT = 'abc';

    const { sendOrderEmail } = await import('./sendEmail');
    await expect(sendOrderEmail(makeOrderMessage())).rejects.toThrow('SMTP_PORT');
  });

  it('throws when EMAIL_FROM is missing', async () => {
    setValidEnv();
    delete process.env.EMAIL_FROM;

    const { sendOrderEmail } = await import('./sendEmail');
    await expect(sendOrderEmail(makeOrderMessage())).rejects.toThrow('EMAIL_FROM');
  });

  it('throws when EMAIL_TO is missing', async () => {
    setValidEnv();
    delete process.env.EMAIL_TO;

    const { sendOrderEmail } = await import('./sendEmail');
    await expect(sendOrderEmail(makeOrderMessage())).rejects.toThrow('EMAIL_TO');
  });

  it('error lists all missing variables at once', async () => {
    for (const key of ENV_KEYS) {
      delete process.env[key];
    }

    const { sendOrderEmail } = await import('./sendEmail');
    await expect(sendOrderEmail(makeOrderMessage())).rejects.toThrow(
      'Missing required email environment variables: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, EMAIL_FROM, EMAIL_TO'
    );
  });

  it('uses custom SMTP env values', async () => {
    process.env.SMTP_HOST = 'smtp.custom.ru';
    process.env.SMTP_PORT = '587';
    process.env.SMTP_USER = 'user@custom.ru';
    process.env.SMTP_PASSWORD = 'pass123';
    process.env.EMAIL_FROM = 'noreply@custom.ru';
    process.env.EMAIL_TO = 'admin@custom.ru';
    mockVerify.mockResolvedValue(undefined);
    mockSendMail.mockResolvedValue({});

    const { sendOrderEmail } = await import('./sendEmail');
    await sendOrderEmail(makeOrderMessage());

    expect(mockCreateTransport).toHaveBeenCalledWith({
      host: 'smtp.custom.ru',
      port: 587,
      secure: false,
      auth: { user: 'user@custom.ru', pass: 'pass123' },
    });

    const mailOptions = mockSendMail.mock.calls[0][0];
    expect(mailOptions.from).toBe('noreply@custom.ru');
    expect(mailOptions.to).toBe('admin@custom.ru');
  });

  it('uses port 465 with secure=true', async () => {
    setValidEnv();
    mockVerify.mockResolvedValue(undefined);
    mockSendMail.mockResolvedValue({});

    const { sendOrderEmail } = await import('./sendEmail');
    await sendOrderEmail(makeOrderMessage());

    expect(mockCreateTransport).toHaveBeenCalledWith(
      expect.objectContaining({ port: 465, secure: true })
    );
  });

  it('throws when transport.verify fails', async () => {
    setValidEnv();
    mockVerify.mockRejectedValue(new Error('Connection refused'));

    const { sendOrderEmail } = await import('./sendEmail');
    await expect(sendOrderEmail(makeOrderMessage())).rejects.toThrow('Connection refused');
    expect(mockSendMail).not.toHaveBeenCalled();
  });

  it('throws when sendMail fails', async () => {
    setValidEnv();
    mockVerify.mockResolvedValue(undefined);
    mockSendMail.mockRejectedValue(new Error('Recipient rejected'));

    const { sendOrderEmail } = await import('./sendEmail');
    await expect(sendOrderEmail(makeOrderMessage())).rejects.toThrow('Recipient rejected');
  });

  it('throws when no template exists for message type', async () => {
    setValidEnv();

    const { sendOrderEmail } = await import('./sendEmail');
    const message = makeOrderMessage({ type: 'UNKNOWN_TYPE' as never });

    await expect(sendOrderEmail(message)).rejects.toThrow(
      'No email template registered for message type: UNKNOWN_TYPE'
    );
    expect(mockCreateTransport).not.toHaveBeenCalled();
  });

  it('sends to multiple recipients when EMAIL_TO is comma-separated', async () => {
    setValidEnv();
    process.env.EMAIL_TO = 'admin@agency.ru,manager@agency.ru,sales@agency.ru';
    mockVerify.mockResolvedValue(undefined);
    mockSendMail.mockResolvedValue({});

    const { sendOrderEmail } = await import('./sendEmail');
    await sendOrderEmail(makeOrderMessage());

    const mailOptions = mockSendMail.mock.calls[0][0];
    expect(mailOptions.to).toBe('admin@agency.ru,manager@agency.ru,sales@agency.ru');
  });
});
