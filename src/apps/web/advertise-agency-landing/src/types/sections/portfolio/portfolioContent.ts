import raw from '@data/sections/portfolio/portfolioSection.json';
import { z } from 'zod';
import { LabeledLinkSchema } from '@/types/shared/labeledLink';

export type { GalleryImage } from '@/types/blocks';
export type { LabeledLink } from '@/types/shared/labeledLink';

/**
 * @module portfolio/index
 * @description Portfolio section content and type compatibility layer.
 * Defines the PortfolioSectionContent schema for white-label section headers.
 * Re-exports PortfolioArticle types for backward compatibility after schema consolidation.
 */

/**
 * @description Portfolio section header and metadata displayed on the portfolio listing page
 */
export const PortfolioSectionContentSchema = z.object({
  /** Section label (e.g., "Portfolio") */
  label: z.string(),
  /** Main section title */
  title: z.string(),
  /** Text fragment highlighted in primary color */
  description: z.string(),
  /** Label for "all cases" category view */
  allCategory: z.string(),
  /** CTA button linking to portfolio page */
  cta: LabeledLinkSchema,
});

export type PortfolioSectionContent = z.infer<typeof PortfolioSectionContentSchema>;

/**
 * @description Parsed portfolio section content from JSON data
 */
export const portfolioSectionContent = PortfolioSectionContentSchema.parse(raw);
