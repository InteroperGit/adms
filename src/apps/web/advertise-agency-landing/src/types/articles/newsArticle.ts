import { BaseArticleSchema } from './article';
import { z } from 'zod';

/**
 * @module articles/newsArticle
 * @description News-specific article schema extending BaseArticleSchema
 * with an optional `source` field.
 */

export const NewsArticleSchema = BaseArticleSchema.extend({
  source: z.string().optional(),
});

export type NewsArticle = z.infer<typeof NewsArticleSchema>;
