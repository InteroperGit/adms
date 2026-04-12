import { describe, it, expect } from 'vitest';
import { handler } from '../src';

describe('order-form handler', () => {
  it('returns 405 for non-POST methods', async () => {
    const result = await handler(
      { httpMethod: 'GET', path: '/order-form', headers: {}, isBase64Encoded: false },
      {}
    );
    expect(result.statusCode).toBe(405);
  });

  it('returns 200 for valid POST', async () => {
    const result = await handler(
      {
        httpMethod: 'POST',
        path: '/order-form',
        headers: {},
        body: JSON.stringify({ name: 'Test' }),
        isBase64Encoded: false,
      },
      {}
    );
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({
      success: true,
      message: 'Order submitted',
    });
  });
});
