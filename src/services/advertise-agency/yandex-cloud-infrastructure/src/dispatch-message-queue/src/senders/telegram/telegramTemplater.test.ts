import { describe, it, expect, afterEach } from 'vitest';
import {
  getTelegramTemplate,
  registerTelegramTemplate,
  buildTelegramTemplateContext,
  escapeMarkdownV2,
  type TelegramTemplateContext,
} from '@src/senders/telegram/telegramTemplater';

function makeContext(overrides?: Partial<TelegramTemplateContext>): TelegramTemplateContext {
  return {
    correlationId: 'corr-1',
    timestamp: '2026-04-14T10:00:00.000Z',
    productType: '',
    payload: { name: 'John', phone: '+79001234567' },
    ...overrides,
  };
}

describe('escapeMarkdownV2', () => {
  it('escapes all reserved MarkdownV2 characters', () => {
    const input = '_*[]()~`>#+-=|{}.!';
    const escaped = escapeMarkdownV2(input);
    expect(escaped).toBe('\\_\\*\\[\\]\\(\\)\\~\\`\\>\\#\\+\\-\\=\\|\\{\\}\\.\\!');
  });

  it('leaves plain text unchanged', () => {
    expect(escapeMarkdownV2('Hello World')).toBe('Hello World');
  });

  it('escapes characters in the middle of text', () => {
    expect(escapeMarkdownV2('user_name')).toBe('user\\_name');
    expect(escapeMarkdownV2('price: 10.99')).toBe('price: 10\\.99');
  });
});

describe('getTelegramTemplate', () => {
  it('returns the ORDER_SUBMITTED template', () => {
    const template = getTelegramTemplate('ORDER_SUBMITTED');
    expect(template).toBeDefined();
    expect(template?.text).toBeTypeOf('function');
  });

  it('returns undefined for unknown types', () => {
    expect(getTelegramTemplate('UNKNOWN_TYPE')).toBeUndefined();
    expect(getTelegramTemplate('')).toBeUndefined();
  });
});

describe('registerTelegramTemplate', () => {
  const customType = '__test_custom_tg__';
  const originalOrderSubmitted = getTelegramTemplate('ORDER_SUBMITTED')!;

  afterEach(() => {
    registerTelegramTemplate('ORDER_SUBMITTED', originalOrderSubmitted);
    registerTelegramTemplate(customType, { text: () => '' });
  });

  it('adds a template that getTelegramTemplate can retrieve', () => {
    const template = { text: () => 'Custom text' };
    registerTelegramTemplate(customType, template);

    expect(getTelegramTemplate(customType)).toBe(template);
  });

  it('allows overriding existing templates', () => {
    const override = { text: () => 'Overridden text' };
    registerTelegramTemplate('ORDER_SUBMITTED', override);

    expect(getTelegramTemplate('ORDER_SUBMITTED')).toBe(override);
  });
});

describe('buildTelegramTemplateContext', () => {
  it('extracts correlationId, timestamp, productType, and payload from a message', () => {
    const message = {
      type: 'ORDER_SUBMITTED' as const,
      messageId: 'msg-1',
      timestamp: '2026-01-01T00:00:00.000Z',
      source: 'orders-intake' as const,
      correlationId: 'corr-xyz',
      version: '1.0' as const,
      payload: { productType: 'SEO', name: 'Alice', email: 'alice@example.com' },
    };

    const ctx = buildTelegramTemplateContext(message);
    expect(ctx.correlationId).toBe('corr-xyz');
    expect(ctx.timestamp).toBe('2026-01-01T00:00:00.000Z');
    expect(ctx.productType).toBe('SEO');
    expect(ctx.payload).toEqual({ name: 'Alice', email: 'alice@example.com' });
  });

  it('formats boolean payload fields as Yes / No', () => {
    const message = {
      type: 'ORDER_SUBMITTED' as const,
      messageId: 'msg-2',
      timestamp: '2026-01-01T00:00:00.000Z',
      source: 'orders-intake' as const,
      correlationId: 'corr-bool',
      version: '1.0' as const,
      payload: { productType: 'SMM', isUrgent: true, hasContract: false },
    };

    const ctx = buildTelegramTemplateContext(message);
    expect(ctx.payload['isUrgent']).toBe('Yes');
    expect(ctx.payload['hasContract']).toBe('No');
  });
});

describe('ORDER_SUBMITTED template', () => {
  it('renders header with bold text', () => {
    const template = getTelegramTemplate('ORDER_SUBMITTED');
    const text = template!.text(makeContext());
    expect(text).toContain('\\*New order received\\*');
  });

  it('renders payload fields as escaped key-value lines', () => {
    const template = getTelegramTemplate('ORDER_SUBMITTED');
    const text = template!.text(makeContext({ payload: { name: 'Alice', phone: '+79001112233' } }));
    expect(text).toContain('\\*name:\\* Alice');
    expect(text).toContain('\\*phone:\\* \\+79001112233');
  });

  it('includes correlation ID in monospace and timestamp in footer', () => {
    const template = getTelegramTemplate('ORDER_SUBMITTED');
    const text = template!.text(
      makeContext({ correlationId: 'corr-xyz', timestamp: '2026-01-01T00:00:00.000Z' })
    );
    expect(text).toContain('`corr\\-xyz`');
    expect(text).toContain('2026\\-01\\-01T00:00:00\\.000Z');
  });

  it('handles empty payload gracefully', () => {
    const template = getTelegramTemplate('ORDER_SUBMITTED');
    const text = template!.text(makeContext({ payload: {} }));
    expect(text).toContain('\\*New order received\\*');
    // Should still have header and footer even with no fields
    expect(text.length).toBeGreaterThan(0);
  });

  it('escapes special characters in payload values', () => {
    const template = getTelegramTemplate('ORDER_SUBMITTED');
    const text = template!.text(makeContext({ payload: { note: 'Special: _bold_ *italic*' } }));
    expect(text).toContain('Special: \\_bold\\_ \\*italic\\*');
  });

  it('renders productType near the top when set', () => {
    const template = getTelegramTemplate('ORDER_SUBMITTED');
    const text = template!.text(makeContext({ productType: 'SEO' }));
    expect(text).toContain('\\*Product:\\* SEO');
    const productIdx = text.indexOf('Product');
    const fieldIdx = text.indexOf('\\*name:');
    expect(productIdx).toBeLessThan(fieldIdx);
  });

  it('omits productType line when empty', () => {
    const template = getTelegramTemplate('ORDER_SUBMITTED');
    const text = template!.text(makeContext({ productType: '' }));
    expect(text).not.toContain('Product');
  });
});
