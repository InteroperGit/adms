import { logInfo, logWarn, logError } from '@shared';
import { sendOrderEmail } from '@src/senders/email/sendEmail';
import { sendTelegramNotification } from '@src/senders/telegram/sendTelegram';
import type { OrderMessage } from '@shared';

function isEnabled(envVar: string | undefined): boolean {
  return envVar?.toLowerCase() !== 'false';
}

export async function processOrderMessage(message: OrderMessage): Promise<void> {
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
    return;
  }

  const errors: string[] = [];

  if (emailEnabled) {
    try {
      await sendOrderEmail(message);
      logInfo('Email delivered', {
        messageId: message.messageId,
        correlationId: message.correlationId,
      });
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      logError('Email delivery failed', {
        messageId: message.messageId,
        correlationId: message.correlationId,
        error: msg,
      });
      errors.push(`email: ${msg}`);
    }
  }

  if (telegramEnabled) {
    try {
      await sendTelegramNotification(message);
      logInfo('Telegram delivered', {
        messageId: message.messageId,
        correlationId: message.correlationId,
      });
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      logError('Telegram delivery failed', {
        messageId: message.messageId,
        correlationId: message.correlationId,
        error: msg,
      });
      errors.push(`telegram: ${msg}`);
    }
  }

  const enabledCount = [emailEnabled, telegramEnabled].filter(Boolean).length;
  if (errors.length === enabledCount) {
    throw new Error(`All enabled deliveries failed: ${errors.join('; ')}`);
  }

  logInfo('Order message processed successfully', {
    messageId: message.messageId,
    correlationId: message.correlationId,
  });
}
