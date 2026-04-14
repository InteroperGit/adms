import { describe, it, expect, afterEach } from 'vitest';
import {
  getTemplate,
  registerTemplate,
  buildTemplateContext,
  type TemplateContext,
} from '@src/senders/email/emailTemplater';

function makeContext(overrides?: Partial<TemplateContext>): TemplateContext {
  return {
    correlationId: 'corr-1',
    timestamp: '2026-04-14T10:00:00.000Z',
    payload: { name: 'John', phone: '+79001234567' },
    ...overrides,
  };
}

describe('getTemplate', () => {
  it('returns the ORDER_SUBMITTED template', () => {
    const template = getTemplate('ORDER_SUBMITTED');
    expect(template).toBeDefined();
    expect(template?.subject).toBeTypeOf('function');
    expect(template?.html).toBeTypeOf('function');
  });

  it('returns undefined for unknown types', () => {
    expect(getTemplate('UNKNOWN_TYPE')).toBeUndefined();
    expect(getTemplate('')).toBeUndefined();
  });
});

describe('registerTemplate', () => {
  const customType = '__test_custom__';
  const originalOrderSubmitted = getTemplate('ORDER_SUBMITTED')!;

  afterEach(() => {
    // Restore the built-in ORDER_SUBMITTED template in case it was overridden
    registerTemplate('ORDER_SUBMITTED', originalOrderSubmitted);
    // Clean up custom template
    registerTemplate(customType, {
      subject: () => '',
      html: () => '',
    });
  });

  it('adds a template that getTemplate can retrieve', () => {
    const template = {
      subject: () => 'Custom subject',
      html: () => '<p>Custom HTML</p>',
    };
    registerTemplate(customType, template);

    expect(getTemplate(customType)).toBe(template);
  });

  it('allows overriding existing templates', () => {
    const override = {
      subject: () => 'Overridden',
      html: () => '<p>Overridden</p>',
    };
    registerTemplate('ORDER_SUBMITTED', override);

    expect(getTemplate('ORDER_SUBMITTED')).toBe(override);
  });
});

describe('buildTemplateContext', () => {
  it('extracts correlationId, timestamp, and payload from a message', () => {
    const message = {
      type: 'ORDER_SUBMITTED' as const,
      messageId: 'msg-1',
      timestamp: '2026-01-01T00:00:00.000Z',
      source: 'orders-intake' as const,
      correlationId: 'corr-xyz',
      version: '1.0' as const,
      payload: { name: 'Alice', email: 'alice@example.com' },
    };

    const ctx = buildTemplateContext(message);
    expect(ctx.correlationId).toBe('corr-xyz');
    expect(ctx.timestamp).toBe('2026-01-01T00:00:00.000Z');
    expect(ctx.payload).toEqual({ name: 'Alice', email: 'alice@example.com' });
  });
});

describe('ORDER_SUBMITTED template', () => {
  it('renders subject with correlation ID', () => {
    const template = getTemplate('ORDER_SUBMITTED');
    expect(template).toBeDefined();
    const subject = template!.subject(makeContext({ correlationId: 'corr-abc' }));
    expect(subject).toBe('New order — corr-abc');
  });

  it('renders payload fields as table rows', () => {
    const template = getTemplate('ORDER_SUBMITTED');
    const html = template!.html(
      makeContext({
        payload: { name: 'Alice', phone: '+79001112233' },
      })
    );
    expect(html).toContain('<td');
    expect(html).toContain('name');
    expect(html).toContain('Alice');
    expect(html).toContain('phone');
    expect(html).toContain('+79001112233');
  });

  it('includes correlation ID and timestamp in footer', () => {
    const template = getTemplate('ORDER_SUBMITTED');
    const html = template!.html(
      makeContext({
        correlationId: 'corr-xyz',
        timestamp: '2026-01-01T00:00:00.000Z',
      })
    );
    expect(html).toContain('corr-xyz');
    expect(html).toContain('2026-01-01T00:00:00.000Z');
  });

  it('handles empty payload', () => {
    const template = getTemplate('ORDER_SUBMITTED');
    const html = template!.html(makeContext({ payload: {} }));
    expect(html).toContain('New order received');
    expect(html).toContain('<table');
    expect(html).not.toMatch(/<td.*<\/td>/);
  });

  it('handles payload with many fields', () => {
    const template = getTemplate('ORDER_SUBMITTED');
    const html = template!.html(
      makeContext({
        payload: { a: '1', b: '2', c: '3', d: '4' },
      })
    );
    const tdMatches = html.match(/<td/g);
    expect(tdMatches).toHaveLength(8); // 4 fields x 2 cells each
  });
});
