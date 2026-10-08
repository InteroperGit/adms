import { z } from 'astro/zod';
import type { OrderingProcessContent } from '../types/ordering-process';
import { mediaSource, text, uniqueValues } from './shared';
import type { AssertContract, SameContract } from './shared';

const step = z.object({
  id: text.regex(/^[a-z0-9-]+$/),
  icon: mediaSource,
  title: text,
  description: text,
  customerProvides: z.array(text).min(1),
  agencyHandles: z.array(text).min(1),
}).strict();

export const orderingProcessSchema = z.object({
  demoMode: z.boolean(),
  demoNotice: text,
  heading: text,
  introduction: text,
  copyApproved: z.boolean(),
  approvalSource: text.nullable(),
  pendingInputs: z.array(text).min(1),
  steps: z.array(step).length(5).superRefine((items, context) => {
    uniqueValues(items, item => item.id, context, 'id');
  }),
}).strict().superRefine((value, context) => {
  if (value.copyApproved && !value.approvalSource) {
    context.addIssue({
      code: 'custom',
      path: ['approvalSource'],
      message: 'Approved copy requires an evidence reference',
    });
  }
});

export type OrderingProcessSchemaContract = AssertContract<
  SameContract<z.output<typeof orderingProcessSchema>, OrderingProcessContent>
>;
