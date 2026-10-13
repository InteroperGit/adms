import { z } from 'astro/zod';
import type {
  ChartBlock,
  ContentBlock,
  ContentBlockProvenance,
  ContentImage,
  FootnoteBlock,
  ImageBlock,
  ImageGalleryBlock,
  OrderedListBlock,
  OrderFormBlock,
  ParagraphBlock,
  QuoteBlock,
  TableBlock,
  UnorderedListBlock,
} from '../types/content-blocks';
import { mediaSource, text } from './shared';
import type { AssertContract, SameContract } from './shared';
import { isValidOrderFormTuple } from '../content/order-form-registry';

const blockId = z.string().regex(
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  'Use a stable kebab-case block id',
).optional();

export const provenance = z.object({
  source: text,
  rights: text.nullable().optional(),
  approvedBy: text.nullable().optional(),
  approvedAt: text.nullable().optional(),
}).strict().superRefine((value, context) => {
  const hasApprover = Boolean(value.approvedBy);
  const hasApprovalDate = Boolean(value.approvedAt);
  if (hasApprover !== hasApprovalDate) {
    context.addIssue({
      code: 'custom',
      path: [hasApprover ? 'approvedAt' : 'approvedBy'],
      message: 'Approval requires both approver and approval date',
    });
  }
  if (value.approvedAt && !/^\d{4}-\d{2}-\d{2}$/.test(value.approvedAt)) {
    context.addIssue({
      code: 'custom',
      path: ['approvedAt'],
      message: 'Approval date must use YYYY-MM-DD format',
    });
  }
});

const meta = {
  id: blockId,
  provenance: provenance.optional(),
  status: z.enum(['draft', 'demo', 'published']).optional(),
};

export const paragraphBlock = z.object({
  ...meta,
  type: z.literal('paragraph'),
  heading: text.optional(),
  paragraphs: z.array(text).min(1),
}).strict();

export const orderedListBlock = z.object({
  ...meta,
  type: z.literal('ordered-list'),
  heading: text.optional(),
  items: z.array(text).min(1),
}).strict();

export const unorderedListBlock = z.object({
  ...meta,
  type: z.literal('unordered-list'),
  heading: text.optional(),
  items: z.array(text).min(1),
}).strict();

const column = z.object({ key: blockId.unwrap(), label: text }).strict();

export const tableBlock = z.object({
  ...meta,
  type: z.literal('table'),
  title: text.optional(),
  caption: text.optional(),
  columns: z.array(column).min(1),
  rows: z.array(z.object({ cells: z.array(text).min(1) }).strict()),
}).strict().superRefine((value, context) => {
  const width = value.columns.length;
  value.rows.forEach((row, index) => {
    if (row.cells.length !== width) {
      context.addIssue({
        code: 'custom',
        path: ['rows', index, 'cells'],
        message: 'Table rows must match the number of columns',
      });
    }
  });
});

const chartPoint = z.object({
  label: text,
  value: z.number().finite(),
}).strict();

export const chartBlock = z.object({
  ...meta,
  type: z.literal('chart'),
  title: text.optional(),
  caption: text.optional(),
  unit: text.optional(),
  chartType: z.enum(['bar', 'line', 'pie']),
  series: z.array(z.object({
    name: text,
    points: z.array(chartPoint).min(1),
  }).strict()).min(1),
}).strict();

const focalPoint = z.object({
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
}).strict();

export const contentImage = z.object({
  ...meta,
  src: mediaSource,
  alt: text,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  caption: text.optional(),
  kind: z.enum(['demo', 'installation']).optional(),
  cropGuidance: text.optional(),
  focalPoint: focalPoint.optional(),
  mobileFocalPoint: focalPoint.optional(),
}).strict();

export const imageBlock = contentImage.extend({
  type: z.literal('image'),
}).strict();

export const imageGalleryBlock = z.object({
  ...meta,
  type: z.literal('image-gallery'),
  caption: text.optional(),
  images: z.array(contentImage).min(1),
}).strict();

export const orderFormBlock = z.object({
  ...meta,
  type: z.literal('order-form'),
  formId: z.string(),
  context: z.enum(['project', 'service']),
  category: text.optional(),
}).strict().superRefine((value, context) => {
  if (!isValidOrderFormTuple(
    value.context,
    value.category,
    value.formId,
  )) {
    context.addIssue({
      code: 'custom',
      path: ['formId'],
      message: 'Choose a form registered for this context and category',
    });
  }
});

export const quoteBlock = z.object({
  ...meta,
  type: z.literal('quote'),
  text,
  author: text.optional(),
  source: text.optional(),
}).strict();

export const footnoteBlock = z.object({
  ...meta,
  type: z.literal('footnote'),
  text,
  reference: text.optional(),
  targetId: blockId,
}).strict();

export const contentBlockSchema = z.discriminatedUnion('type', [
  paragraphBlock,
  orderedListBlock,
  unorderedListBlock,
  tableBlock,
  chartBlock,
  imageBlock,
  imageGalleryBlock,
  orderFormBlock,
  quoteBlock,
  footnoteBlock,
]);

export const contentBlocksSchema = z.array(contentBlockSchema)
  .superRefine((blocks, context) => {
    const ids = new Set<string>();
    const knownIds = new Set<string>();
    blocks.forEach((block, index) => {
      if (!block.id) return;
      if (ids.has(block.id)) {
        context.addIssue({
          code: 'custom',
          path: [index, 'id'],
          message: `Duplicate block id: ${block.id}`,
        });
      }
      ids.add(block.id);
      knownIds.add(block.id);
    });
    blocks.forEach((block, index) => {
      if (block.type !== 'footnote' || !block.targetId) return;
      if (!knownIds.has(block.targetId)) {
        context.addIssue({
          code: 'custom',
          path: [index, 'targetId'],
          message: `Unknown footnote target: ${block.targetId}`,
        });
      }
    });
  });

export type ContentBlockContract = AssertContract<
  SameContract<z.output<typeof contentBlockSchema>, ContentBlock>
>;
export type ContentBlockProvenanceContract = AssertContract<
  SameContract<z.output<typeof provenance>, ContentBlockProvenance>
>;
export type ParagraphBlockContract = AssertContract<
  SameContract<z.output<typeof paragraphBlock>, ParagraphBlock>
>;
export type OrderedListBlockContract = AssertContract<
  SameContract<z.output<typeof orderedListBlock>, OrderedListBlock>
>;
export type UnorderedListBlockContract = AssertContract<
  SameContract<z.output<typeof unorderedListBlock>, UnorderedListBlock>
>;
export type TableBlockContract = AssertContract<
  SameContract<z.output<typeof tableBlock>, TableBlock>
>;
export type ChartBlockContract = AssertContract<
  SameContract<z.output<typeof chartBlock>, ChartBlock>
>;
export type ContentImageContract = AssertContract<
  SameContract<z.output<typeof contentImage>, ContentImage>
>;
export type ImageBlockContract = AssertContract<
  SameContract<z.output<typeof imageBlock>, ImageBlock>
>;
export type ImageGalleryBlockContract = AssertContract<
  SameContract<z.output<typeof imageGalleryBlock>, ImageGalleryBlock>
>;
export type OrderFormBlockContract = AssertContract<
  SameContract<z.output<typeof orderFormBlock>, OrderFormBlock>
>;
export type QuoteBlockContract = AssertContract<
  SameContract<z.output<typeof quoteBlock>, QuoteBlock>
>;
export type FootnoteBlockContract = AssertContract<
  SameContract<z.output<typeof footnoteBlock>, FootnoteBlock>
>;
