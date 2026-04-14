import { logInfo, logWarn, logError } from '@shared';
import { deleteMessageFromQueueAsync } from '@src/queue/messageQueue';
import { sendOrderEmail } from '@src/senders/email/sendEmail';
import { sendTelegramNotification } from '@src/senders/telegram/sendTelegram';
import type { OrderMessage } from '@shared';

function isEnabled(envVar: string | undefined): boolean {
  return envVar?.toLowerCase() !== 'false';
}

export async function processOrderMessage(
  message: OrderMessage,
  receiptHandle: string
): Promise<void> {
  logInfo('Processing order message', {
    messageId: message.messageId,
    correlationId: message.correlationId,
    timestamp: message.timestamp,
  });

  const emailEnabled = isEnabled(process.env.EMAIL_ENABLED);
  const telegramEnabled = isEnabled(process.env.TELEGRAM_ENABLED);

  if (!emailEnabled && !telegramEnabled) {
    logWarn('All notification channels are disabled, skipping', {
      messageId: message.messageId,
      correlationId: message.correlationId,
    });
    await deleteMessageFromQueueAsync(receiptHandle);
    return;
  }

  let anyEnabledOk = false;

  if (emailEnabled) {
    try {
      await sendOrderEmail(message);
      anyEnabledOk = true;
    } catch (error) {
      logError('Email delivery failed', {
        messageId: message.messageId,
        correlationId: message.correlationId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  if (telegramEnabled) {
    try {
      await sendTelegramNotification(message);
      anyEnabledOk = true;
    } catch (error) {
      logError('Telegram delivery failed', {
        messageId: message.messageId,
        correlationId: message.correlationId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  if (!anyEnabledOk) {
    throw new Error('One or more enabled notification deliveries failed');
  }

  await deleteMessageFromQueueAsync(receiptHandle);

  logInfo('Order message processed successfully', {
    messageId: message.messageId,
    correlationId: message.correlationId,
  });
}
