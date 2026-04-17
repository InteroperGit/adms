import nodemailer from 'nodemailer';
import type { OrderMessage } from '@shared';
import { getTemplate, buildTemplateContext } from '@src/senders/email/emailTemplater';

interface EmailConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  to: string;
}

function getConfig(): EmailConfig {
  const host = process.env.SMTP_HOST ?? '';
  const portRaw = process.env.SMTP_PORT ?? '';
  const port = parseInt(portRaw, 10);
  const user = process.env.SMTP_USER ?? '';
  const pass = process.env.SMTP_PASSWORD ?? '';
  const from = process.env.EMAIL_FROM ?? '';
  const to = process.env.EMAIL_TO ?? '';

  const missing: string[] = [];
  if (!host) {
    missing.push('SMTP_HOST');
  }
  if (!portRaw || isNaN(port)) {
    missing.push('SMTP_PORT');
  }
  if (!user) {
    missing.push('SMTP_USER');
  }
  if (!pass) {
    missing.push('SMTP_PASSWORD');
  }
  if (!from) {
    missing.push('EMAIL_FROM');
  }
  if (!to) {
    missing.push('EMAIL_TO');
  }

  if (missing.length > 0) {
    throw new Error(`Missing required email environment variables: ${missing.join(', ')}`);
  }

  return { host, port, user, pass, from, to };
}

export async function sendOrderEmail(message: OrderMessage): Promise<void> {
  const template = getTemplate(message.type);
  if (!template) {
    throw new Error(`No email template registered for message type: ${message.type}`);
  }

  const context = buildTemplateContext(message);
  const { host, port, user, pass, from, to } = getConfig();

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.verify();

  await transporter.sendMail({
    from,
    to,
    subject: template.subject(context),
    html: template.html(context),
  });
}
