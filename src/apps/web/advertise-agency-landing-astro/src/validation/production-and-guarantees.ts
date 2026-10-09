import { z } from 'astro/zod';
import type { ProductionAndGuaranteesContent } from
  '../types/production-and-guarantees';
import { mediaSource, text, uniqueValues } from './shared';
import type { AssertContract, SameContract } from './shared';

const approval = z.enum(['draft', 'approved']);
const item = z.object({
  id: text.regex(/^[a-z0-9-]+$/),
  title: text,
  description: text,
  evidence: text,
  approval,
}).strict();

const photo = z.object({
  src: mediaSource,
  alt: text,
  caption: text,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  source: text,
  rights: text,
  approval,
}).strict();

const warranty = z.object({
  id: text.regex(/^[a-z0-9-]+$/),
  title: text,
  coverage: text,
  duration: text,
  starts: text,
  conditions: z.array(text).min(1),
  exclusions: z.array(text).min(1),
  claimRoute: text,
  sourceType: z.enum([
    'agency-workmanship',
    'manufacturer-component',
    'pending',
  ]),
  source: text,
  approval,
}).strict().superRefine((value, context) => {
  if (value.approval === 'approved' && value.sourceType === 'pending') {
    context.addIssue({
      code: 'custom',
      path: ['sourceType'],
      message: 'Approved warranty requires an identified source type',
    });
  }
});

const maintenance = z.object({
  scope: z.array(text).min(1),
  customerResponsibilities: z.array(text).min(1),
  pricing: text,
  requestRoute: text,
  approval,
}).strict();

export const productionAndGuaranteesSchema = z.object({
  demoMode: z.boolean(),
  demoNotice: text,
  heading: text,
  introduction: text,
  guidance: z.array(z.object({
    title: text,
    description: text,
    icon: z.enum([
      '/images/guarantees/design-approval.svg',
      '/images/guarantees/inquiry.svg',
      '/images/guarantees/installation.svg',
      '/images/guarantees/measurements.svg',
      '/images/guarantees/production.svg',
    ]),
  }).strict()).min(1),
  copyApproved: z.boolean(),
  approvalSource: text.nullable(),
  pendingInputs: z.array(text),
  productionOperations: z.array(item).min(1),
  materials: z.array(item).min(1),
  qualityChecks: z.array(item).min(1),
  photos: z.array(photo),
  warrantyTerms: z.array(warranty).min(1),
  maintenance,
  inquiryHref: z.literal('/#order-inquiry'),
}).strict().superRefine((value, context) => {
  uniqueValues(value.productionOperations, entry => entry.id, context,
    'productionOperations.id');
  uniqueValues(value.materials, entry => entry.id, context, 'materials.id');
  uniqueValues(value.qualityChecks, entry => entry.id, context,
    'qualityChecks.id');
  uniqueValues(value.warrantyTerms, entry => entry.id, context,
    'warrantyTerms.id');
  if (value.copyApproved && !value.approvalSource) {
    context.addIssue({
      code: 'custom',
      path: ['approvalSource'],
      message: 'Approved copy requires an evidence reference',
    });
  }
  if (value.copyApproved && value.demoMode) {
    context.addIssue({
      code: 'custom',
      path: ['demoMode'],
      message: 'Approved copy cannot remain in demo mode',
    });
  }
  if (!value.copyApproved && value.pendingInputs.length === 0) {
    context.addIssue({
      code: 'custom',
      path: ['pendingInputs'],
      message: 'Draft content requires pending agency inputs',
    });
  }
});

export type ProductionAndGuaranteesSchemaContract = AssertContract<
  SameContract<
    z.output<typeof productionAndGuaranteesSchema>,
    ProductionAndGuaranteesContent
  >
>;
