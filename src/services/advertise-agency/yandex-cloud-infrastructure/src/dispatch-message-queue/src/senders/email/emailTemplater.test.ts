import { describe, it, expect, afterEach } from 'vitest';
import {
  getTemplate,
  registerTemplate,
  buildTemplateContext,
  type TemplateContext,
} from '@src/senders/email/emailTemplater';
import type { OrderConsentRecord } from '@shared';

function makeConsent(overrides?: Partial<OrderConsentRecord>): OrderConsentRecord {
  return {
    acceptedAt: '2026-04-14T10:00:00.000Z',
    text: 'I agree to the terms.',
    links: [
      {
        label: 'Privacy Policy',
        href: 'https://example.com/privacy',
        version: '1.0',
        effectiveDate: '2026-01-01',
      },
    ],
    userAgent: 'Mozilla/5.0',
    language: 'en',
    timezone: 'UTC',
    screenResolution: '1920x1080',
    referrer: null,
    ...overrides,
  };
}

function makeContext(overrides?: Partial<TemplateContext>): TemplateContext {
  return {
    correlationId: 'corr-1',
    timestamp: '2026-04-14T10:00:00.000Z',
    productType: '',
    payload: { name: 'John', phone: '+79001234567' },
    consent: makeConsent(),
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
  const consent = makeConsent();

  it('extracts correlationId, timestamp, productType, payload, and consent from a message', () => {
    const message = {
      type: 'ORDER_SUBMITTED' as const,
      messageId: 'msg-1',
      timestamp: '2026-01-01T00:00:00.000Z',
      source: 'orders-intake' as const,
      correlationId: 'corr-xyz',
      version: '1.0' as const,
      payload: { productType: 'SEO', name: 'Alice', email: 'alice@example.com' },
      consent,
    };

    const ctx = buildTemplateContext(message);
    expect(ctx.correlationId).toBe('corr-xyz');
    expect(ctx.timestamp).toBe('2026-01-01T00:00:00.000Z');
    expect(ctx.productType).toBe('SEO');
    expect(ctx.payload).toEqual({ name: 'Alice', email: 'alice@example.com' });
    expect(ctx.consent).toBe(consent);
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
      consent,
    };

    const ctx = buildTemplateContext(message);
    expect(ctx.payload['isUrgent']).toBe('Yes');
    expect(ctx.payload['hasContract']).toBe('No');
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

  it('renders productType subtitle when set', () => {
    const template = getTemplate('ORDER_SUBMITTED');
    const html = template!.html(makeContext({ productType: 'SEO' }));
    expect(html).toContain('Product:');
    expect(html).toContain('SEO');
  });

  it('omits productType subtitle when empty', () => {
    const template = getTemplate('ORDER_SUBMITTED');
    const html = template!.html(makeContext({ productType: '' }));
    expect(html).not.toContain('Product:');
  });
});

describe('ORDER_SUBMITTED consent block', () => {
  const template = getTemplate('ORDER_SUBMITTED')!;

  it('renders acceptedAt timestamp', () => {
    const html = template.html(
      makeContext({ consent: makeConsent({ acceptedAt: '2026-04-14T10:00:00.000Z' }) })
    );
    expect(html).toContain('2026-04-14T10:00:00.000Z');
    expect(html).toContain('Accepted at:');
  });

  it('renders consent text', () => {
    const html = template.html(
      makeContext({ consent: makeConsent({ text: 'I accept all conditions.' }) })
    );
    expect(html).toContain('I accept all conditions.');
  });

  it('renders agreed document with label and href', () => {
    const html = template.html(
      makeContext({
        consent: makeConsent({
          links: [{ label: 'Privacy Policy', href: 'https://example.com/privacy' }],
        }),
      })
    );
    expect(html).toContain('href="https://example.com/privacy"');
    expect(html).toContain('Privacy Policy');
  });

  it('renders version and effectiveDate when present', () => {
    const html = template.html(
      makeContext({
        consent: makeConsent({
          links: [
            {
              label: 'Terms',
              href: 'https://example.com/terms',
              version: '2.1',
              effectiveDate: '2026-03-01',
            },
          ],
        }),
      })
    );
    expect(html).toContain('v2.1');
    expect(html).toContain('2026-03-01');
  });

  it('omits version/effectiveDate meta when absent', () => {
    const html = template.html(
      makeContext({
        consent: makeConsent({
          links: [{ label: 'Terms', href: 'https://example.com/terms' }],
        }),
      })
    );
    expect(html).not.toMatch(/\(v/);
  });

  it('renders technical detail fields', () => {
    const html = template.html(
      makeContext({
        consent: makeConsent({
          userAgent: 'TestBrowser/1.0',
          language: 'ru',
          timezone: 'Europe/Moscow',
          screenResolution: '1280x720',
        }),
      })
    );
    expect(html).toContain('TestBrowser/1.0');
    expect(html).toContain('ru');
    expect(html).toContain('Europe/Moscow');
    expect(html).toContain('1280x720');
  });

  it('shows referrer when provided', () => {
    const html = template.html(
      makeContext({ consent: makeConsent({ referrer: 'https://google.com' }) })
    );
    expect(html).toContain('https://google.com');
  });

  it('falls back to em-dash when referrer is null', () => {
    const html = template.html(makeContext({ consent: makeConsent({ referrer: null }) }));
    expect(html).toContain('Referrer:');
    expect(html).toContain('—');
  });

  it('omits agreed-documents section when links array is empty', () => {
    const html = template.html(makeContext({ consent: makeConsent({ links: [] }) }));
    expect(html).not.toContain('Agreed documents:');
  });
});
