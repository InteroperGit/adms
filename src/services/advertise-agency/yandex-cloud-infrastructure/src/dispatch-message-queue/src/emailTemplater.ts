import type { OrderMessage } from '../../shared';

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
  const rows = Object.entries(context.payload)
    .map(
      ([key, value]) => `
      <tr>
        <td style="padding: 6px 12px 6px 0; font-weight: 600; color: #555; text-transform: capitalize; vertical-align: top;">
          ${key}
        </td>
        <td style="padding: 6px 0; color: #222; vertical-align: top;">
          ${value}
        </td>
      </tr>`
    )
    .join('');

  return `
    <div style="font-family: sans-serif; max-width: 600px; color: #222;">
      <h2 style="margin: 0 0 16px; font-size: 20px;">New order received</h2>
      <table style="border-collapse: collapse; width: 100%;">
        ${rows}
      </table>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="margin: 0; font-size: 12px; color: #999;">
        Correlation ID: ${context.correlationId}<br />
        Received at: ${context.timestamp}
      </p>
    </div>`;
}

TEMPLATES.set('ORDER_SUBMITTED', {
  subject: (ctx) => `New order — ${ctx.correlationId}`,
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
