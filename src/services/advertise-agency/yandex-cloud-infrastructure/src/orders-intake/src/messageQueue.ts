import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import type { Message } from '../../shared/types';

const QUEUE_URL = process.env.QUEUE_URL;
if (!QUEUE_URL) {
  throw new Error('QUEUE_URL environment variable is required');
}

const sqs = new SQSClient({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  },
});

export async function sendMessageToQueueAsync(message: Message): Promise<string | undefined> {
  const result = await sqs.send(
    new SendMessageCommand({
      QueueUrl: QUEUE_URL,
      MessageBody: JSON.stringify(message),
    })
  );

  return result.MessageId;
}
