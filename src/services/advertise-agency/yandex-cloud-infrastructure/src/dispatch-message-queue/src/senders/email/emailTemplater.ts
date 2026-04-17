import type { OrderMessage } from '@shared';
import { getEmailTemplateConfig } from '@src/config/templateConfig';

export interface TemplateContext {
  correlationId: string;
  timestamp: string;
  payload: Record<string, string>;
}

export interface Template {
  subject: (context: TemplateContext) => string;
  html: (context: TemplateContext) => string;
}

const TEMPLATES = new Map<string, Template>();

function buildOrderEmailHtml(context: TemplateContext): string {
  const config = getEmailTemplateConfig();

  const rows = Object.entries(context.payload)
    .map(
      ([key, value], index) => `
      <tr style="background-color: ${index % 2 === 0 ? config.rowEvenBg : config.rowOddBg};">
        <td style="${config.keyCellStyle}">
          ${key}
        </td>
        <td style="${config.valueCellStyle}">
          ${value}
        </td>
      </tr>`
    )
    .join('');

  return `
    <div style="${config.wrapperStyle}">
      <h2 style="${config.headerStyle}">${config.header}</h2>
      <table style="${config.tableStyle}">
        ${rows}
      </table>
      <hr style="${config.dividerStyle}" />
      <p style="${config.footerStyle}">
        ${config.footerCorrelationLabel}: ${context.correlationId}<br />
        ${config.footerTimestampLabel}: ${context.timestamp}
      </p>
    </div>`;
}

TEMPLATES.set('ORDER_SUBMITTED', {
  subject: (ctx) => {
    const config = getEmailTemplateConfig();
    return config.subject.replace('{correlationId}', ctx.correlationId);
  },
  html: buildOrderEmailHtml,
});

export function getTemplate(type: string): Template | undefined {
  return TEMPLATES.get(type);
}

export function registerTemplate(type: string, template: Template): void {
  TEMPLATES.set(type, template);
}

export function buildTemplateContext(message: OrderMessage): TemplateContext {
  return {
    correlationId: message.correlationId,
    timestamp: message.timestamp,
    payload: message.payload as Record<string, string>,
  };
}
