import { z } from 'astro/zod';
import type { OrderInquiryContent } from '../types/order-inquiry';
import { text } from './shared';
import type { AssertContract, SameContract } from './shared';

const field = z.object({
  label: text,
  hint: text,
  required: z.boolean(),
  maxLength: z.number().int().positive(),
}).strict();

// Allow only explicit local paths or credential-free HTTPS delivery URLs.
function safeEndpoint(value: string): boolean {
  if (/^[\/]($|\/)/.test(value)) return false;
  if (/[\u0000-\u0020\u007f\\#]/.test(value)) return false;
  if (value.startsWith('/')) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password;
  } catch {
    return false;
  }
}

export const orderInquirySchema = z.object({
  title: text,
  subtitle: text,
  requiredNote: text,
  privacyLabel: text,
  submitLabel: text,
  consent: z.object({
    approved: z.boolean(),
    label: text,
  }).strict(),
  submission: z.object({
    enabled: z.boolean(),
    endpoint: z.string(),
    timeoutMs: z.number().int().min(1000).max(30000),
  }).strict(),
  fields: z.object({
    name: field.extend({
      required: z.literal(true),
      maxLength: z.number().int().min(1).max(120),
    }),
    email: field.extend({
      required: z.literal(true),
      maxLength: z.number().int().min(1).max(254),
    }),
    phone: field.extend({
      required: z.literal(false),
      maxLength: z.number().int().min(1).max(40),
    }),
    message: field.extend({
      required: z.literal(true),
      maxLength: z.number().int().min(1).max(5000),
    }),
  }).strict(),
  feedback: z.object({
    unavailable: text,
    noJavaScript: text,
    invalid: text,
    sending: text,
    success: text,
    failure: text,
    required: text,
    email: text,
    tooLong: text,
  }).strict(),
}).strict().superRefine((value, context) => {
  if (value.submission.endpoint && !safeEndpoint(value.submission.endpoint)) {
    context.addIssue({
      code: 'custom',
      path: ['submission', 'endpoint'],
      message: 'Use a local path or a credential-free HTTPS URL',
    });
  }
  if (value.submission.enabled) {
    if (!value.submission.endpoint) {
      context.addIssue({
        code: 'custom',
        path: ['submission', 'endpoint'],
        message: 'Enabled delivery requires an approved endpoint',
      });
    }
    if (!value.consent.approved || !value.consent.label.trim()) {
      context.addIssue({
        code: 'custom',
        path: ['consent'],
        message: 'Approve nonblank consent copy before enabling delivery',
      });
    }
  }
});

export type OrderInquirySchemaContract = AssertContract<
  SameContract<z.output<typeof orderInquirySchema>, OrderInquiryContent>
>;
