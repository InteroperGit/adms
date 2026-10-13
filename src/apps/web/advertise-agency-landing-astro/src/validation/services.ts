import { z } from 'astro/zod';
import type {
  Service,
  ServiceFocalPoint,
  ServiceImage,
  ServicesContent,
} from '../types/services';
import { mediaSource, text, uniqueValues } from './shared';
import {
  serviceArticleSchema,
  serviceArticleSourceSchema,
} from './service-articles';
import type { AssertContract, SameContract } from './shared';
import { getPublicationIssues } from '../content/block-publication';
import { isServicePublished } from '../content/service-publication';

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
  article: serviceArticleSchema,
}).strict();

/** Only allow links to static service pages discovered by the loader. */
export function createServicesSchema(publishedPaths: readonly string[]) {
  return createCatalogSchema(publishedPaths, service).superRefine(
    (catalog, context) => {
      catalog.items.forEach((item, itemIndex) => {
        const status = !catalog.demoMode && isServicePublished(catalog, item)
          && item.article.approved ? 'published' : 'demo';
        getPublicationIssues(item.article.content, status)
          .forEach(({ block, message }) => context.addIssue({
            code: 'custom',
            path: ['items', itemIndex, 'article', 'content', block],
            message,
          }));
        item.article.content.forEach((block, blockIndex) => {
          if (block.type !== 'order-form') return;
          if (block.context !== 'service'
            || (block.category && block.category !== item.id)) {
            context.addIssue({
              code: 'custom',
              path: ['items', itemIndex, 'article', 'content', blockIndex],
              message: 'Service form context/category must match its article',
            });
          }
        });
      });
    },
  );
}

/** Validate source references before resolving MDX; reject legacy fields. */
export function createServiceRecordsSchema(paths: readonly string[]) {
  return createCatalogSchema(paths, service.extend({
    article: serviceArticleSourceSchema,
  }));
}

function createCatalogSchema<Shape extends z.ZodType<{
  id: string;
  href?: string;
  image: unknown;
}>>(
  publishedPaths: readonly string[],
  itemSchema: Shape,
) {
  return z.object({
    demoMode: z.boolean(),
    demoNotice: text,
    heading: text,
    introduction: text,
    copyApproved: z.boolean(),
    items: z.array(itemSchema).superRefine((items, context) => {
      uniqueValues(items, item => item.id, context, 'id');
      items.forEach((item, index) => {
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
