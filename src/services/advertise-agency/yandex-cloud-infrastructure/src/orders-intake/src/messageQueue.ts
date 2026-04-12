import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

const sqs = new SQSClient({
    region: 'ru-central1',
    endpoint: 'https://message-queue.api.cloud.yandex.net',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
    },
});

const QUEUE_URL = process.env.QUEUE_URL;

export async function sendMessageToQueueAsync(messageBody: string): Promise<string | undefined> {
    const result = await sqs.send(
        new SendMessageCommand({
            QueueUrl: QUEUE_URL,
            MessageBody: String(messageBody),
        })
    );

    return result.MessageId;
}
