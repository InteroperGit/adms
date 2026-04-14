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
  const host = process.env.SMTP_HOST ?? 'smtp.yandex.ru';
  const port = parseInt(process.env.SMTP_PORT ?? '465', 10);
  const user = process.env.SMTP_USER ?? '';
  const pass = process.env.SMTP_PASSWORD ?? '';
  const from = process.env.EMAIL_FROM ?? user;
  const to = process.env.EMAIL_TO ?? user;

  if (!user || !pass) {
    throw new Error('SMTP_USER and SMTP_PASSWORD environment variables are required');
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
