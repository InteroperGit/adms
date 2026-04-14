import nodemailer from 'nodemailer';
import type { OrderMessage } from '../../shared';

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

function buildOrderEmailHtml(message: OrderMessage): string {
  const payload = message.payload as Record<string, string>;
  const rows = Object.entries(payload)
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
        Correlation ID: ${message.correlationId}<br />
        Received at: ${message.timestamp}
      </p>
    </div>`;
}

export async function sendOrderEmail(message: OrderMessage): Promise<void> {
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
    subject: `New order — ${message.correlationId}`,
    html: buildOrderEmailHtml(message),
  });
}
