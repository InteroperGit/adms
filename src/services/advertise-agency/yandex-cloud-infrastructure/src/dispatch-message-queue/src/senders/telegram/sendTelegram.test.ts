import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { OrderMessage } from '@shared';

const mockFetch = vi.fn();

beforeEach(() => {
  mockFetch.mockReset();
  vi.spyOn(globalThis, 'fetch').mockImplementation(mockFetch);
  vi.resetModules();
});

afterEach(() => {
  vi.restoreAllMocks();
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
    ...overrides,
  };
}

describe('sendTelegramNotification', () => {
  it('throws when TELEGRAM_BOT_TOKEN is missing', async () => {
    delete process.env.TELEGRAM_BOT_TOKEN;
    process.env.TELEGRAM_CHAT_ID = '12345';

    const { sendTelegramNotification } = await import('./sendTelegram');

    await expect(sendTelegramNotification(makeOrderMessage())).rejects.toThrow(
      'TELEGRAM_BOT_TOKEN environment variable is required'
    );
  });

  it('throws when TELEGRAM_CHAT_ID is missing', async () => {
    process.env.TELEGRAM_BOT_TOKEN = 'bot-token';
    delete process.env.TELEGRAM_CHAT_ID;

    const { sendTelegramNotification } = await import('./sendTelegram');

    await expect(sendTelegramNotification(makeOrderMessage())).rejects.toThrow(
      'TELEGRAM_CHAT_ID environment variable is required'
    );
  });

  it('calls correct Telegram API URL with correct body', async () => {
    process.env.TELEGRAM_BOT_TOKEN = 'test-bot-token';
    process.env.TELEGRAM_CHAT_ID = 'test-chat-id';
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ok: true }),
    });

    const { sendTelegramNotification } = await import('./sendTelegram');
    await sendTelegramNotification(makeOrderMessage());

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe('https://api.telegram.org/bottest-bot-token/sendMessage');
    expect(options.method).toBe('POST');
    expect(options.headers).toEqual({ 'Content-Type': 'application/json' });
    const body = JSON.parse(options.body);
    expect(body.chat_id).toBe('test-chat-id');
    expect(body.text).toContain('New order received');
    expect(body.parse_mode).toBe('MarkdownV2');
  });

  it('throws when all deliveries fail', async () => {
    process.env.TELEGRAM_BOT_TOKEN = 'test-bot-token';
    process.env.TELEGRAM_CHAT_ID = 'test-chat-id';
    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ ok: false, description: 'Bad Request: chat not found' }),
    });

    const { sendTelegramNotification } = await import('./sendTelegram');

    await expect(sendTelegramNotification(makeOrderMessage())).rejects.toThrow(
      'All Telegram notification deliveries failed'
    );
  });

  it('throws on network error (fetch rejection)', async () => {
    process.env.TELEGRAM_BOT_TOKEN = 'test-bot-token';
    process.env.TELEGRAM_CHAT_ID = 'test-chat-id';
    mockFetch.mockRejectedValue(new Error('network error'));

    const { sendTelegramNotification } = await import('./sendTelegram');

    await expect(sendTelegramNotification(makeOrderMessage())).rejects.toThrow(
      'All Telegram notification deliveries failed'
    );
  });

  it('throws when no template exists for message type', async () => {
    process.env.TELEGRAM_BOT_TOKEN = 'test-bot-token';
    process.env.TELEGRAM_CHAT_ID = 'test-chat-id';

    const { sendTelegramNotification } = await import('./sendTelegram');
    const message = makeOrderMessage({ type: 'UNKNOWN_TYPE' as never });

    await expect(sendTelegramNotification(message)).rejects.toThrow(
      'No Telegram template registered for message type: UNKNOWN_TYPE'
    );
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('sends to multiple chat IDs', async () => {
    process.env.TELEGRAM_BOT_TOKEN = 'test-bot-token';
    process.env.TELEGRAM_CHAT_ID = 'chat-1,chat-2,chat-3';
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ok: true }),
    });

    const { sendTelegramNotification } = await import('./sendTelegram');
    await sendTelegramNotification(makeOrderMessage());

    expect(mockFetch).toHaveBeenCalledTimes(3);
    const chatIds = mockFetch.mock.calls.map((call) => {
      const body = JSON.parse(call[1].body);
      return body.chat_id;
    });
    expect(chatIds).toEqual(['chat-1', 'chat-2', 'chat-3']);
  });

  it('succeeds when some deliveries fail but at least one succeeds', async () => {
    process.env.TELEGRAM_BOT_TOKEN = 'test-bot-token';
    process.env.TELEGRAM_CHAT_ID = 'chat-ok,chat-fail';
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ok: true }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ ok: false, description: 'Chat not found' }),
      });

    const { sendTelegramNotification } = await import('./sendTelegram');
    await expect(sendTelegramNotification(makeOrderMessage())).resolves.toBeUndefined();

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('throws when all multiple deliveries fail', async () => {
    process.env.TELEGRAM_BOT_TOKEN = 'test-bot-token';
    process.env.TELEGRAM_CHAT_ID = 'chat-fail-1,chat-fail-2';
    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ ok: false, description: 'Error' }),
    });

    const { sendTelegramNotification } = await import('./sendTelegram');

    await expect(sendTelegramNotification(makeOrderMessage())).rejects.toThrow(
      'All Telegram notification deliveries failed'
    );
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('trims whitespace from comma-separated chat IDs', async () => {
    process.env.TELEGRAM_BOT_TOKEN = 'test-bot-token';
    process.env.TELEGRAM_CHAT_ID = ' chat-1 , chat-2 ';
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ok: true }),
    });

    const { sendTelegramNotification } = await import('./sendTelegram');
    await sendTelegramNotification(makeOrderMessage());

    const chatIds = mockFetch.mock.calls.map((call) => {
      const body = JSON.parse(call[1].body);
      return body.chat_id;
    });
    expect(chatIds).toEqual(['chat-1', 'chat-2']);
  });
});
