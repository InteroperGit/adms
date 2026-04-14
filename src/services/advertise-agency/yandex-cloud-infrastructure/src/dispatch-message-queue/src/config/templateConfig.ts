import emailConfig from '@data/email-template-config.json';
import telegramConfig from '@data/telegram-template-config.json';

export interface EmailTemplateConfig {
  subject: string;
  header: string;
  footerCorrelationLabel: string;
  footerTimestampLabel: string;
  wrapperStyle: string;
  headerStyle: string;
  tableStyle: string;
  keyCellStyle: string;
  valueCellStyle: string;
  dividerStyle: string;
  footerStyle: string;
}

export interface TelegramTemplateConfig {
  header: string;
  footerSeparator: string;
}

export function getEmailTemplateConfig(): EmailTemplateConfig {
  return emailConfig as unknown as EmailTemplateConfig;
}

export function getTelegramTemplateConfig(): TelegramTemplateConfig {
  return telegramConfig as unknown as TelegramTemplateConfig;
}
