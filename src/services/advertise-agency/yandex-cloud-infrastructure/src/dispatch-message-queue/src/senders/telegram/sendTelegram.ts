import type { OrderMessage } from '@shared';
import {
  getTelegramTemplate,
  buildTelegramTemplateContext,
} from '@src/senders/telegram/telegramTemplater';
import { logInfo, logError, logWarn } from '@shared';

function getChatIds(): string[] {
  const raw = process.env.TELEGRAM_CHAT_ID;
  if (!raw) {
    return [];
  }
  return raw
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
}

export async function sendTelegramNotification(message: OrderMessage): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatIds = getChatIds();

  if (!token) {
    throw new Error('TELEGRAM_BOT_TOKEN environment variable is required');
  }
  if (chatIds.length === 0) {
    throw new Error('TELEGRAM_CHAT_ID environment variable is required');
  }

  const template = getTelegramTemplate(message.type);
  if (!template) {
    throw new Error(`No Telegram template registered for message type: ${message.type}`);
  }

  const context = buildTelegramTemplateContext(message);
  const text = template.text(context);
  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  logInfo('Sending Telegram notification', {
    messageId: message.messageId,
    correlationId: message.correlationId,
    chatCount: chatIds.length,
  });

  const results = await Promise.allSettled(
    chatIds.map(async (chatId) => {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'MarkdownV2',
        }),
      });

      const result = (await response.json()) as { ok: boolean; description?: string };

      if (!result.ok) {
        logError('Telegram API returned error', {
          messageId: message.messageId,
          correlationId: message.correlationId,
          chatId,
          description: result.description,
        });
        throw new Error(result.description ?? 'Telegram API error');
      }

      logInfo('Telegram notification sent successfully', {
        messageId: message.messageId,
        correlationId: message.correlationId,
        chatId,
      });
    })
  );

  const successCount = results.filter((r) => r.status === 'fulfilled').length;
  const failedCount = results.filter((r) => r.status === 'rejected').length;

  if (successCount === 0) {
    throw new Error('All Telegram notification deliveries failed');
  }

  if (failedCount > 0) {
    logWarn('Some Telegram deliveries failed', {
      messageId: message.messageId,
      correlationId: message.correlationId,
      successCount,
      totalCount: chatIds.length,
    });
  }
}
