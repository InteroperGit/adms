// MDX frontmatter and JSON fallback share metadata and block validation.
import { z } from 'astro/zod';
import { contentBlocksSchema } from './content-blocks';
import { text } from './shared';

export const serviceArticleMetadataSchema = z.object({
  title: text,
  description: text,
  approved: z.boolean(),
}).strict();

export const serviceArticleSchema = serviceArticleMetadataSchema.extend({
  content: contentBlocksSchema.min(1),
}).strict();

// A fallback is deliberate and auditable; malformed MDX fails the build.
export const serviceArticleSourceSchema = z.discriminatedUnion('format', [
  z.object({
    format: z.literal('mdx'),
    entry: text.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  }).strict(),
  z.object({
    format: z.literal('json'),
    reason: text,
    ...serviceArticleSchema.shape,
  }).strict(),
]);
