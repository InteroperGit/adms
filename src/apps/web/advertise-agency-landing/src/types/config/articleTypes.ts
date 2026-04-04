import raw from '@data/config/articleTypes.json';
import { z } from 'zod';

/**
 * @module config/articleTypes
 * @description Supported article type definitions with display labels and icon keys.
 * Used for navigation, filtering, and UI rendering across all article types.
 */

/**
 * @description Single article type definition with key, display label, and icon identifier
 */
export const ArticleTypeItemSchema = z.object({
  /** Unique type identifier (e.g., "portfolio", "service", "news", "blog") */
  key: z.enum(['portfolio', 'service', 'news', 'blog']),
  /** Localized display label */
  label: z.string(),
  /** Icon name from section icon map (e.g., "briefcase", "wrench") */
  icon: z.string(),
});

export type ArticleTypeItem = z.infer<typeof ArticleTypeItemSchema>;

/**
 * @description Container with all article types
 */
export const ArticleTypesConfigSchema = z.object({
  types: z.array(ArticleTypeItemSchema),
});

export type ArticleTypesConfig = z.infer<typeof ArticleTypesConfigSchema>;

/**
 * @description Parsed article types configuration from data/config/articleTypes.json
 */
export const articleTypesConfig = ArticleTypesConfigSchema.parse(raw);
