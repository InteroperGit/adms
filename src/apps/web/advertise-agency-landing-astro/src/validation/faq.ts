import { z } from 'astro/zod';
import type { FaqContent } from '../types/faq';
import { text, uniqueValues } from './shared';
import type { AssertContract, SameContract } from './shared';

const approval = z.object({
  state: z.enum(['draft', 'approved']),
  source: text.nullable(),
  approvedBy: text.nullable(),
}).strict().superRefine((value, context) => {
  if (value.state !== 'approved') return;
  for (const field of ['source', 'approvedBy'] as const) {
    if (!value[field]) {
      context.addIssue({
        code: 'custom',
        path: [field],
        message: 'Approved FAQ copy requires a source and an approver',
      });
    }
  }
});

const item = z.object({
  id: text.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  question: text,
  // Source lines keep JSON readable; consumers receive complete answer text.
  answer: z.array(text).min(1).transform(lines => lines.join(' ')),
  approval,
}).strict();

export const faqSchema = z.object({
  demoMode: z.boolean(),
  demoNotice: text,
  heading: text,
  inquiryLabel: text,
  inquiryHref: z.literal('/#order-inquiry'),
  approval,
  items: z.array(item).min(1).superRefine((items, context) => {
    uniqueValues(items, entry => entry.id, context, 'id');
  }),
}).strict();

export type FaqSchemaContract = AssertContract<
  SameContract<z.output<typeof faqSchema>, FaqContent>
>;
