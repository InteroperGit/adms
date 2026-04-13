import { describe, it, expect } from 'vitest';
import { parseBody, getRequestId } from './utils';

describe('parseBody', () => {
  it('parses a valid JSON string body', () => {
    const event = { body: '{"action":"poll"}' };
    expect(parseBody(event)).toEqual({ action: 'poll' });
  });

  it('returns empty object for undefined body', () => {
    expect(parseBody({})).toEqual({});
  });

  it('returns the body as-is when it is already an object', () => {
    const body = { action: 'delete' };
    expect(parseBody({ body })).toBe(body);
  });

  it('throws on invalid JSON', () => {
    expect(() => parseBody({ body: 'not-json' })).toThrow();
  });
});

describe('getRequestId', () => {
  it('returns requestContext.requestId when present', () => {
    const event = { requestContext: { requestId: 'req-123' } };
    expect(getRequestId(event)).toBe('req-123');
  });

  it('falls back to event.requestId', () => {
    const event = { requestId: 'fallback-id' };
    expect(getRequestId(event)).toBe('fallback-id');
  });

  it('generates a UUID when no requestId is available', () => {
    const result = getRequestId({});
    expect(result).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  });
});
