import type { Handler } from '../../shared';
import { jsonResponse, log } from '../../shared';

export const handler: Handler = async (event) => {
  log('info', 'captcha-verify handler invoked', {
    method: event.httpMethod,
    path: event.path,
  });

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { token } = body;

    if (!token) {
      return jsonResponse(400, { error: 'Missing captcha token' });
    }

    // TODO: verify token with Yandex SmartCaptcha API
    // - POST to https://smartcaptcha.yandexcloud.net/validate
    // - return verification result

    return jsonResponse(200, { success: true, verified: true });
  } catch (err) {
    log('error', 'captcha-verify handler error', { error: String(err) });
    return jsonResponse(500, { error: 'Internal server error' });
  }
};
