import { BaseArticleSchema } from './article';
import { z } from 'zod';

/**
 * @module articles/portfolioArticle
 * @description Portfolio-specific article schema extending BaseArticleSchema
 * with an `overview` object containing client, year, and services fields.
 */

export const PortfolioArticleSchema = BaseArticleSchema.extend({
  overview: z.object({
    client: z.string(),
    year: z.string(),
    services: z.string(),
  }),
});

export type PortfolioArticle = z.infer<typeof PortfolioArticleSchema>;
