import { z } from 'astro/zod';
import type {
  Service,
  ServiceFocalPoint,
  ServiceImage,
  ServicesContent,
} from '../types/services';
import { mediaSource, text } from './shared';
import type { AssertContract, SameContract } from './shared';

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

const service = z.object({
  id: text.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a stable slug'),
  name: text,
  description: text,
  claimSource: text,
  confirmed: z.boolean(),
  copyApproved: z.boolean(),
  image: image.nullable(),
  href: text.regex(
    /^\/services\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/,
    'Must be a dedicated /services/slug/ route without query or fragment',
  ).optional(),
  article: z.object({
    title: text,
    description: text,
    lead: text,
    sections: z.array(z.object({
      heading: text,
      paragraphs: z.array(text).min(1),
    }).strict()).min(1),
    inquiry: z.array(text).min(1),
    approved: z.boolean(),
  }).strict(),
}).strict();

/** Only allow links to static service pages discovered by the loader. */
export function createServicesSchema(publishedPaths: readonly string[]) {
  return z.object({
    demoMode: z.boolean(),
    demoNotice: text,
    heading: text,
    introduction: text,
    copyApproved: z.boolean(),
    items: z.array(service).superRefine((items, context) => {
      const seen = new Set<string>();
      items.forEach((item, index) => {
        if (seen.has(item.id)) {
          context.addIssue({
            code: 'custom',
            path: [index, 'id'],
            message: `Duplicate id: ${item.id}`,
          });
        }
        seen.add(item.id);
        if (item.href && !publishedPaths.includes(item.href)) {
          context.addIssue({
            code: 'custom',
            path: [index, 'href'],
            message: 'Service page does not exist; omit href until published',
          });
        }
      });
    }),
  }).strict().superRefine((content, context) => {
    if (!content.demoMode) return;
    content.items.forEach((item, index) => {
      for (const field of ['image', 'href'] as const) {
        if (!item[field]) {
          context.addIssue({
            code: 'custom',
            path: ['items', index, field],
            message: 'Demo cards require an image and a detail page',
          });
        }
      }
    });
  });
}

export const servicesSchema = createServicesSchema([]);

export type ServicesSchemaContract = AssertContract<
  SameContract<z.output<typeof servicesSchema>, ServicesContent>
>;

export type ServiceSchemaContract = AssertContract<
  SameContract<z.output<typeof service>, Service>
>;

export type ServiceImageSchemaContract = AssertContract<
  SameContract<z.output<typeof image>, ServiceImage>
>;

export type ServiceFocalPointSchemaContract = AssertContract<
  SameContract<z.output<typeof focalPoint>, ServiceFocalPoint>
>;
