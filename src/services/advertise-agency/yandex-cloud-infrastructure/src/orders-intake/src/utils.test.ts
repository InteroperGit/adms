import { describe, it, expect } from 'vitest';
import { parseBody, getCaptchaToken, getClientIp, getOrder, getRequestId } from './utils';

describe('parseBody', () => {
    it('parses a valid JSON string body', () => {
        const event = { body: '{"foo":"bar"}' };
        expect(parseBody(event)).toEqual({ foo: 'bar' });
    });

    it('returns empty object for undefined body', () => {
        expect(parseBody({})).toEqual({});
    });

    it('returns the body as-is when it is already an object', () => {
        const body = { key: 'value' };
        expect(parseBody({ body })).toBe(body);
    });

    it('throws on invalid JSON', () => {
        expect(() => parseBody({ body: 'not-json' })).toThrow();
    });
});

describe('getCaptchaToken', () => {
    it('returns the captchaToken when present', () => {
        expect(getCaptchaToken({ captchaToken: 'abc123' })).toBe('abc123');
    });

    it('returns undefined when captchaToken is missing', () => {
        expect(getCaptchaToken({})).toBeUndefined();
    });
});

describe('getClientIp', () => {
    it('returns sourceIp from requestContext.identity (REST API)', () => {
        const event = { requestContext: { identity: { sourceIp: '1.2.3.4' } } };
        expect(getClientIp(event)).toBe('1.2.3.4');
    });

    it('returns sourceIp from requestContext.http (HTTP API)', () => {
        const event = { requestContext: { http: { sourceIp: '5.6.7.8' } } };
        expect(getClientIp(event)).toBe('5.6.7.8');
    });

    it('prefers identity sourceIp over http sourceIp', () => {
        const event = {
            requestContext: {
                identity: { sourceIp: '1.1.1.1' },
                http: { sourceIp: '2.2.2.2' },
            },
        };
        expect(getClientIp(event)).toBe('1.1.1.1');
    });

    it('returns undefined when no sourceIp is available', () => {
        expect(getClientIp({})).toBeUndefined();
    });
});

describe('getOrder', () => {
    it('returns the order field', () => {
        const order = { name: 'Test' };
        expect(getOrder({ order })).toBe(order);
    });

    it('returns undefined when order is missing', () => {
        expect(getOrder({})).toBeUndefined();
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
