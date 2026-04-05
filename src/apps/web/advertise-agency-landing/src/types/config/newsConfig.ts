import raw from '@data/config/news.json';
import { z } from 'zod';

/**
 * @module config/newsConfig
 * @description News listing page configuration: grid description and empty label.
 */

export const NewsConfigSchema = z.object({
  /** Description shown above the news article grid */
  gridDescription: z.string(),
  /** Label shown when no news articles exist */
  emptyLabel: z.string(),
});

export type NewsConfig = z.infer<typeof NewsConfigSchema>;

/**
 * @description Parsed news configuration from data/config/news.json
 */
export const newsConfig = NewsConfigSchema.parse(raw);
