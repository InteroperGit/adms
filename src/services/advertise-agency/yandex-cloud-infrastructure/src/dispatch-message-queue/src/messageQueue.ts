import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';
import type { Message } from '../../shared/types';

const client = new SQSClient({
  region: process.env.AWS_REGION || 'ru-central1',
  endpoint: process.env.AWS_ENDPOINT,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const queueUrl = process.env.QUEUE_URL || '';

export async function receiveMessagesFromQueueAsync(maxMessages = 1): Promise<Message[]> {
  const command = new ReceiveMessageCommand({
    QueueUrl: queueUrl,
    MaxNumberOfMessages: maxMessages,
    MessageAttributeNames: ['All'],
  });

  const response = await client.send(command);
  const messages = response.Messages ?? [];

  return messages.map((msg) => {
    let body: Message;
    try {
      body = JSON.parse(msg.Body ?? '{}');
    } catch {
      body = {
        type: 'UNKNOWN',
        messageId: msg.MessageId ?? '',
        timestamp: '',
        source: '',
        correlationId: '',
        version: '',
        payload: {},
      };
    }

    return {
      ...body,
      _receiptHandle: msg.ReceiptHandle,
    } as Message & { _receiptHandle?: string };
  });
}

export async function deleteMessageFromQueueAsync(receiptHandle: string): Promise<void> {
  const command = new DeleteMessageCommand({
    QueueUrl: queueUrl,
    ReceiptHandle: receiptHandle,
  });

  await client.send(command);
}
