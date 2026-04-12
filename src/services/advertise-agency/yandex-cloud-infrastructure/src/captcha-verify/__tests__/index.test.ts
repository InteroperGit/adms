import { describe, it, expect } from 'vitest';
import { handler } from '../src';

describe('captcha-verify handler', () => {
  it('returns 405 for non-POST methods', async () => {
    const result = await handler(
      { httpMethod: 'GET', path: '/captcha-verify', headers: {}, isBase64Encoded: false },
      {}
    );
    expect(result.statusCode).toBe(405);
  });

  it('returns 400 when token is missing', async () => {
    const result = await handler(
      {
        httpMethod: 'POST',
        path: '/captcha-verify',
        headers: {},
        body: JSON.stringify({}),
        isBase64Encoded: false,
      },
      {}
    );
    expect(result.statusCode).toBe(400);
  });

  it('returns 200 for valid POST with token', async () => {
    const result = await handler(
      {
        httpMethod: 'POST',
        path: '/captcha-verify',
        headers: {},
        body: JSON.stringify({ token: 'test-token' }),
        isBase64Encoded: false,
      },
      {}
    );
    expect(result.statusCode).toBe(200);
  });
});
