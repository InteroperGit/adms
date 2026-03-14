import raw from '@data/config/categories.json';
import { z } from 'zod';

/**
 * @module config/categories
 * @description Portfolio category definitions with display names and URL slugs.
 * Used for category navigation, filtering, and URL generation.
 */

/**
 * @description Portfolio category with display name and URL slug
 */
export const CategorySchema = z.object({
  /** Display name shown in navigation (must match PortfolioCase.category) */
  name: z.string(),
  /** URL path segment (e.g., "branding") */
  slug: z.string(),
});

/**
 * @description Portfolio category with name and slug
 */
export type Category = z.infer<typeof CategorySchema>;

/**
 * @description Array of all portfolio categories
 */
export const CategoriesSchema = z.array(CategorySchema);

/**
 * @description Exported categories array parsed from data/config/categories.json
 */
export const categories = CategoriesSchema.parse(raw);
