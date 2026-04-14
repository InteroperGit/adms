import { logError, badRequest, serverError, jsonResponse } from '../../shared';
import { receiveMessagesFromQueueAsync, deleteMessageFromQueueAsync } from './messageQueue';
import { parseBody, getRequestId } from './utils';
import type { APIGatewayProxyResult } from '../../shared';

export async function handler(event: Record<string, unknown>): Promise<APIGatewayProxyResult> {
  const requestId = getRequestId(event);

  try {
    const body = parseBody(event);
    const action = body?.action as string | undefined;

    if (!action) {
      return badRequest('Missing required field: action');
    }

    switch (action) {
      case 'poll': {
        const maxMessages = typeof body?.maxMessages === 'number' ? body.maxMessages : 1;
        const messages = await receiveMessagesFromQueueAsync(maxMessages);

        if (messages.length === 0) {
          return jsonResponse(200, { ok: true, messages: [] });
        }

        return jsonResponse(200, { ok: true, messages });
      }

      case 'delete': {
        const receiptHandle = body?.receiptHandle as string | undefined;
        if (!receiptHandle) {
          return badRequest('Missing required field: receiptHandle');
        }

        await deleteMessageFromQueueAsync(receiptHandle);
        return jsonResponse(200, { ok: true });
      }

      default:
        return badRequest(`Unknown action: ${action}`);
    }
  } catch (error) {
    logError('dispatch-queue-messages handler error', {
      requestId,
      error: error instanceof Error ? error.message : String(error),
    });
    return serverError(error instanceof Error ? error : String(error));
  }
}
