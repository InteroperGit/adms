import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import type { Message } from '../../shared/types';

export { buildOrderMessage } from '../../shared/types';

const sqs = new SQSClient({
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_ENDPOINT,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
    },
});

const QUEUE_URL = process.env.QUEUE_URL;

export async function sendMessageToQueueAsync(message: Message): Promise<string | undefined> {
    const result = await sqs.send(
        new SendMessageCommand({
            QueueUrl: QUEUE_URL,
            MessageBody: JSON.stringify(message),
        })
    );

    return result.MessageId;
}
