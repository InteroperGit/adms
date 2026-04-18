import type { OrderConsentLink, OrderConsentRecord, OrderMessage } from '@shared';
import { getEmailTemplateConfig } from '@src/config/templateConfig';
import { normalizeOrderPayload } from '@src/senders/payloadNormalizer';

export interface TemplateContext {
  correlationId: string;
  timestamp: string;
  productType: string;
  payload: Record<string, string>;
  consent: OrderConsentRecord;
}

export interface Template {
  subject: (context: TemplateContext) => string;
  html: (context: TemplateContext) => string;
}

const TEMPLATES = new Map<string, Template>();

function buildLinkItem(link: OrderConsentLink): string {
  const meta: string[] = [];
  if (link.version) {
    meta.push(`v${link.version}`);
  }
  if (link.effectiveDate) {
    meta.push(link.effectiveDate);
  }
  const suffix = meta.length ? ` (${meta.join(', ')})` : '';
  return `<li style="margin-bottom:3px;"><a href="${link.href}" style="color:#555;">${link.label}</a>${suffix}</li>`;
}

function buildConsentHtml(consent: OrderConsentRecord): string {
  const linksBlock =
    consent.links.length > 0
      ? `<p style="margin:0 0 4px;"><strong>Agreed documents:</strong></p>
      <ul style="margin:0 0 10px;padding-left:18px;">
        ${consent.links.map(buildLinkItem).join('\n        ')}
      </ul>`
      : '';

  const referrer = consent.referrer ?? '—';

  return `<div style="margin-top:24px;padding:16px 20px;background:#f9f9f9;border-left:3px solid #ddd;font-size:13px;color:#444;">
      <p style="margin:0 0 8px;font-weight:600;font-size:14px;color:#333;">Consent record</p>
      <p style="margin:0 0 6px;"><strong>Accepted at:</strong> ${consent.acceptedAt}</p>
      <p style="margin:0 0 10px;font-style:italic;color:#555;">${consent.text}</p>
      ${linksBlock}
      <p style="margin:0;color:#888;font-size:12px;">
        <strong>Browser:</strong> ${consent.userAgent}<br/>
        <strong>Language:</strong> ${consent.language} &middot; <strong>Timezone:</strong> ${consent.timezone}<br/>
        <strong>Screen:</strong> ${consent.screenResolution}<br/>
        <strong>Referrer:</strong> ${referrer}
      </p>
    </div>`;
}

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

  const productLine = context.productType
    ? `<p style="margin:0 0 12px;font-size:15px;color:#555;">Product: <strong>${context.productType}</strong></p>`
    : '';

  return `
    <div style="${config.wrapperStyle}">
      <h2 style="${config.headerStyle}">${config.header}</h2>
      ${productLine}
      <table style="${config.tableStyle}">
        ${rows}
      </table>
      ${buildConsentHtml(context.consent)}
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
  const { productType, fields } = normalizeOrderPayload(message.payload as Record<string, unknown>);
  return {
    correlationId: message.correlationId,
    timestamp: message.timestamp,
    productType,
    payload: fields,
    consent: message.consent,
  };
}
