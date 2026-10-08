import { z } from 'astro/zod';
import type { PricingContent, PricingExample } from '../types/pricing';
import { mediaSource, text, uniqueValues } from './shared';
import type { AssertContract, SameContract } from './shared';

// Reject impossible calendar dates as well as malformed date strings.
const date = text.regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime())
    && parsed.toISOString().slice(0, 10) === value;
}, 'Must be a real YYYY-MM-DD date');

const priceContext = {
  currency: z.literal('RUB'),
  context: z.enum(['demo', 'current', 'historical']),
  asOf: date.nullable(),
  conditions: text,
};

const price = z.discriminatedUnion('type', [
  z.object({
    ...priceContext,
    type: z.literal('exact'),
    amount: z.number().positive(),
  }).strict(),
  z.object({
    ...priceContext,
    type: z.literal('range'),
    min: z.number().positive(),
    max: z.number().positive(),
  }).strict(),
]).superRefine((value, context) => {
  if (value.type === 'range' && value.max <= value.min) {
    context.addIssue({
      code: 'custom', path: ['max'],
      message: 'Range maximum must exceed minimum; use exact if equal',
    });
  }
  if (value.context !== 'demo' && !value.asOf) {
    context.addIssue({
      code: 'custom', path: ['asOf'],
      message: 'Current and historical prices require a reference date',
    });
  }
});

// Match the existing image contract used by the service image pipeline.
const focalPoint = z.object({
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
}).strict();

const image = z.object({
  src: mediaSource,
  alt: text,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  source: text,
  projectContext: text,
  publicationPermission: text,
  approved: z.boolean(),
  desktopFocalPoint: focalPoint,
  mobileFocalPoint: focalPoint,
}).strict();

const approval = z.object({
  specifications: z.boolean(),
  copy: z.boolean(),
  price: z.boolean(),
  reference: text.nullable(),
  verifiedAt: date.nullable(),
}).strict().superRefine((value, context) => {
  if (!(value.specifications || value.copy || value.price)) return;
  for (const field of ['reference', 'verifiedAt'] as const) {
    if (!value[field]) {
      context.addIssue({
        code: 'custom', path: [field],
        message: 'Approval requires an evidence reference and review date',
      });
    }
  }
});

const example = z.object({
  id: text.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a stable slug'),
  title: text,
  description: text,
  dimensions: text,
  materials: z.array(text).min(1),
  includedWork: z.array(text).min(1),
  exclusions: z.array(text).min(1),
  source: text,
  price,
  approval,
  image: image.nullable(),
  href: text.regex(
    /^\/projects\/[1-9]\d*$/,
    'Must be an existing /projects/id route without query or fragment',
  ).optional(),
}).strict().superRefine((value, context) => {
  if (value.price.context !== 'demo') return;
  if (value.href) {
    context.addIssue({
      code: 'custom', path: ['href'],
      message: 'Fictional examples must not link to real project records',
    });
  }
  if (value.approval.specifications || value.approval.copy
    || value.approval.price || value.image?.approved) {
    context.addIssue({
      code: 'custom', path: ['approval'],
      message: 'Demo examples must retain false agency approval flags',
    });
  }
});

/** Callers supply only generated, approved agency project destinations. */
export function createPricingSchema(projectPaths: readonly string[]) {
  return z.object({
    demoMode: z.boolean(),
    demoNotice: text,
    demoPriceLabel: text,
    heading: text,
    introduction: text,
    copyApproved: z.boolean(),
    approvalSource: text.nullable(),
    costFactors: z.object({
      heading: text,
      items: z.array(text).min(1),
    }).strict(),
    estimateGuidance: z.object({ heading: text, text }).strict(),
    inquiryLabel: text,
    items: z.array(example),
  }).strict().superRefine((content, context) => {
    if (content.copyApproved && !content.approvalSource) {
      context.addIssue({
        code: 'custom', path: ['approvalSource'],
        message: 'Approved section copy requires an evidence reference',
      });
    }
    uniqueValues(content.items, item => item.id, context, 'id');
    content.items.forEach((item, index) => {
      const report = (field: string, message: string) =>
        context.addIssue({
          code: 'custom', path: ['items', index, field], message,
        });
      if (item.href && !projectPaths.includes(item.href)) {
        report('href', 'Requires a generated approved agency project route');
      }
      if (content.demoMode && item.price.context === 'demo') {
        if (!item.image) {
          report('image', 'Visible demo examples require a local test image');
        } else if (!item.image.src.startsWith('/src/assets/')) {
          report('image', 'Demo images must use local /src/assets/ originals');
        }
      }
    });
  });
}

export const pricingSchema = createPricingSchema([]);

export type PricingSchemaContract = AssertContract<
  SameContract<z.output<typeof pricingSchema>, PricingContent>
>;
export type PricingExampleSchemaContract = AssertContract<
  SameContract<z.output<typeof example>, PricingExample>
>;
