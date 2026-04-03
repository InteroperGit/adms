import { z } from 'zod';
import { ContentBlockSchema } from '@/types/blocks';

/**
 * @module articles/article
 * @description Base article schema that all content types extend.
 * Defines the common fields shared by portfolio, service, news, and blog articles.
 *
 * ArticleType is inferred from file path, not from JSON content.
 */

export const BaseArticleSchema = z.object({
  slug: z.string(),
  publishedAt: z.string(), // ISO datetime (e.g., "2024-08-01T00:00:00Z")
  updatedAt: z.string().optional(),
  title: z.string(),
  description: z.string(),
  hero: z.object({
    image: z.string().optional(),
    gradient: z.string(),
  }),
  tags: z.array(z.string()),
  category: z.string(),
  author: z
    .object({
      name: z.string(),
      avatar: z.string().optional(),
      title: z.string().optional(),
    })
    .optional(),
  readTime: z.number().optional(),
  meta: z.object({
    title: z.string(),
    description: z.string(),
    ogUrl: z.string().optional(),
    ogImage: z.string().optional(),
  }),
  content: z.array(ContentBlockSchema),
  images: z
    .object({
      preview: z.string().optional(),
      og: z.string().optional(),
    })
    .optional(),
});

export type BaseArticle = z.infer<typeof BaseArticleSchema>;

export type ArticleType = 'portfolio' | 'service' | 'news' | 'blog';
