import raw from '@data/config/blog.json';
import { z } from 'zod';

/**
 * @module config/blogConfig
 * @description Blog listing page configuration: grid description and empty label.
 */

export const BlogConfigSchema = z.object({
  /** Description shown above the blog article grid */
  gridDescription: z.string(),
  /** Label for "all cases" category (e.g., "Все") */
  allLabel: z.string(),
  /** Label for "view details" link on article cards */
  detailsLabel: z.string(),
  /** Label shown when no blog articles exist */
  emptyLabel: z.string(),
});

export type BlogConfig = z.infer<typeof BlogConfigSchema>;

/**
 * @description Parsed blog configuration from data/config/blog.json
 */
export const blogConfig = BlogConfigSchema.parse(raw);
