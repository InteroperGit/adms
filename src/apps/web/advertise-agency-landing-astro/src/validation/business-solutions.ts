import { z } from 'astro/zod';
import type { BusinessSolutionsContent } from
  '../types/business-solutions';
import { mediaSource, text, uniqueValues } from './shared';
import { carouselContentSchema } from './image-carousel';
import type { AssertContract, SameContract } from './shared';

// Arrays keep long Russian paragraphs readable in the editable JSON source.
const copy = z.array(text).min(1).transform(lines => lines.join(' '));

const media = z.object({
  src: mediaSource,
  alt: text,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  source: text,
  rights: text,
}).strict();

const projectId = text.regex(/^[1-9][0-9]*$/);
const projectHref = z.string().regex(
  /^\/projects\/[1-9][0-9]*$/,
  'Project links must target an internal project route',
).nullable();

const attribution = z.object({
  customerName: text.nullable(),
  projectId: projectId.nullable(),
  href: projectHref,
  evidence: text.nullable(),
  media: z.array(media),
}).strict().superRefine((value, context) => {
  if (value.customerName && !value.evidence) {
    context.addIssue({
      code: 'custom',
      path: ['evidence'],
      message: 'Customer attribution requires an evidence reference',
    });
  }
  if (value.media.length > 0 && !value.customerName) {
    context.addIssue({
      code: 'custom',
      path: ['customerName'],
      message: 'Project media requires a named customer attribution',
    });
  }
});

const item = z.object({
  id: text.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: text,
  summary: copy,
  customerTask: copy,
  solution: copy,
  example: z.object({
    title: text,
    text: copy,
  }).strict(),
  inquiryLabel: text,
  inquiryHref: z.literal('/#order-inquiry'),
  carousel: carouselContentSchema.extend({
    itemLabel: text,
    mediaSource: text,
    mediaRights: text,
  }).strict(),
  attribution,
}).strict();

export const businessSolutionsSchema = z.object({
  heading: text,
  introduction: copy,
  items: z.array(item).length(4).superRefine((items, context) => {
    uniqueValues(items, entry => entry.id, context, 'id');
  }),
}).strict();

export type BusinessSolutionsSchemaContract = AssertContract<
  SameContract<z.output<typeof businessSolutionsSchema>,
    BusinessSolutionsContent>
>;
