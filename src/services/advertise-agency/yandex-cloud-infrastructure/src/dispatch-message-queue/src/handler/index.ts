import { logWarn, logError } from '@shared';
import type { Message, OrderMessage, YMQEvent, YMQRecord } from '@shared';
import { processOrderMessage } from './processOrderMessage';

export async function handler(event: YMQEvent): Promise<void> {
  const messages = event.messages ?? [];

  if (messages.length === 0) {
    logWarn('No messages in trigger event');
    return;
  }

  for (const record of messages) {
    let message: Message;

    try {
      message = JSON.parse(record.details.message.body) as Message;
    } catch {
      logWarn('Failed to parse message body', {
        messageId: record.details.message.message_id,
        eventId: record.event_metadata.event_id,
      });
      continue;
    }

    try {
      await dispatchMessage(message, record);
    } catch (error) {
      logError('Failed to process message', {
        messageId: message.messageId,
        type: message.type,
        correlationId: message.correlationId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}

async function dispatchMessage(message: Message, _record: YMQRecord): Promise<void> {
  switch (message.type) {
    case 'ORDER_SUBMITTED':
      await processOrderMessage(message as OrderMessage);
      break;

    default:
      logWarn('Unknown message type, skipping', {
        messageId: message.messageId,
        type: message.type,
      });
      break;
  }
}
