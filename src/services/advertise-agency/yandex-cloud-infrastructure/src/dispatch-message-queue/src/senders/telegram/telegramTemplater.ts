import type { OrderMessage } from '@shared';
import { getTelegramTemplateConfig } from '@src/config/templateConfig';
import { normalizeOrderPayload } from '@src/senders/payloadNormalizer';

export interface TelegramTemplateContext {
  correlationId: string;
  timestamp: string;
  productType: string;
  payload: Record<string, string>;
}

export interface TelegramTemplate {
  text: (context: TelegramTemplateContext) => string;
}

const TELEGRAM_TEMPLATES = new Map<string, TelegramTemplate>();

// Escape all reserved MarkdownV2 characters
export function escapeMarkdownV2(text: string): string {
  return text.replace(/([_*[\]()~`>#+=|{}.!-])/g, '\\$1');
}

function buildOrderTelegramText(context: TelegramTemplateContext): string {
  const config = getTelegramTemplateConfig();
  const header = `\\*${escapeMarkdownV2(config.header)}\\*`;

  const productLine = context.productType
    ? `\\*${escapeMarkdownV2('Product')}:\\* ${escapeMarkdownV2(context.productType)}`
    : '';

  const fields = Object.entries(context.payload)
    .map(([key, value]) => `\\*${escapeMarkdownV2(key)}:\\* ${escapeMarkdownV2(value)}`)
    .join('\n');

  const footer = `\`${escapeMarkdownV2(context.correlationId)}\`${config.footerSeparator}${escapeMarkdownV2(context.timestamp)}`;

  return [header, productLine, fields, footer].filter(Boolean).join('\n\n');
}

TELEGRAM_TEMPLATES.set('ORDER_SUBMITTED', {
  text: buildOrderTelegramText,
});

export function getTelegramTemplate(type: string): TelegramTemplate | undefined {
  return TELEGRAM_TEMPLATES.get(type);
}

export function registerTelegramTemplate(type: string, template: TelegramTemplate): void {
  TELEGRAM_TEMPLATES.set(type, template);
}

export function buildTelegramTemplateContext(message: OrderMessage): TelegramTemplateContext {
  const { productType, fields } = normalizeOrderPayload(message.payload as Record<string, unknown>);
  return {
    correlationId: message.correlationId,
    timestamp: message.timestamp,
    productType,
    payload: fields,
  };
}
