import type { Handler } from '../../shared';
import { jsonResponse, log } from '../../shared';

export const handler: Handler = async (event) => {
  log('info', 'order-form handler invoked', {
    method: event.httpMethod,
    path: event.path,
  });

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};

    // TODO: implement order form submission logic
    // - validate payload
    // - submit to external API
    // - return confirmation

    return jsonResponse(200, { success: true, message: 'Order submitted' });
  } catch (err) {
    log('error', 'order-form handler error', { error: String(err) });
    return jsonResponse(500, { error: 'Internal server error' });
  }
};
