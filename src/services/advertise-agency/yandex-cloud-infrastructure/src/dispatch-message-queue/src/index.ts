import { logInfo, logWarn, logError } from '../../shared';
import { deleteMessageFromQueueAsync } from './messageQueue';
import { sendOrderEmail } from './sendEmail';
import type { Message } from '../../shared';
import type { OrderMessage } from '../../shared';

export interface SQSRecord {
  eventVersion: string;
  eventSource: string;
  awsRegion: string;
  eventTime: string;
  eventName: string;
  messageId: string;
  receiptHandle: string;
  body: string;
  attributes: Record<string, string>;
  messageAttributes: Record<string, unknown>;
}

export interface SQSEvent {
  Records: SQSRecord[];
}

export async function handler(event: SQSEvent): Promise<void> {
  const records = event.Records ?? [];

  if (records.length === 0) {
    logWarn('No records in trigger event');
    return;
  }

  for (const record of records) {
    let message: Message;

    try {
      message = JSON.parse(record.body) as Message;
    } catch {
      logWarn('Failed to parse message body', {
        messageId: record.messageId,
        receiptHandle: record.receiptHandle,
      });
      continue;
    }

    try {
      await dispatchMessage(message, record.receiptHandle);
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

async function dispatchMessage(message: Message, receiptHandle: string): Promise<void> {
  switch (message.type) {
    case 'ORDER_SUBMITTED':
      await processOrderMessage(message as OrderMessage, receiptHandle);
      break;

    default:
      logWarn('Unknown message type, skipping', {
        messageId: message.messageId,
        type: message.type,
      });
      break;
  }
}

async function processOrderMessage(message: OrderMessage, receiptHandle: string): Promise<void> {
  logInfo('Processing order message', {
    messageId: message.messageId,
    correlationId: message.correlationId,
    timestamp: message.timestamp,
  });

  await sendOrderEmail(message);

  await deleteMessageFromQueueAsync(receiptHandle);

  logInfo('Order message processed successfully', {
    messageId: message.messageId,
    correlationId: message.correlationId,
  });
}
