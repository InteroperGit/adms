import raw from '@data/sections/portfolio/portfolioSection.json';
import { z } from 'zod';
import { ContentBlockSchema } from '@/types/blocks';
import { LabeledLinkSchema } from '@/types/shared/labeledLink';

export type { GalleryImage } from '@/types/blocks';
export type { LabeledLink } from '@/types/shared/labeledLink';

/**
 * @module portfolio/index
 * @description Portfolio case types and section content. Defines the main PortfolioCase schema
 * with content blocks, metadata, hero image/gradient, SEO, and case overview. Complements
 * blocks.ts (content block definitions) and portfolioCases.ts (glob-loaded case data).
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
  /** Label for view case details link */
  detailsLabel: z.string(),
  /** CTA button linking to portfolio page */
  cta: LabeledLinkSchema,
});

export type PortfolioSectionContent = z.infer<typeof PortfolioSectionContentSchema>;

/**
 * @description Parsed portfolio section content from JSON data
 */
export const portfolioSectionContent = PortfolioSectionContentSchema.parse(raw);

/**
 * @description Single portfolio case with all content blocks, metadata, and hero image
 */
export const PortfolioCaseSchema = z.object({
  /** Unique identifier for case (used in URL slug) */
  slug: z.string(),
  /** Publication date in YYYY-MM-DD format */
  publishDate: z.string(),
  /** Case project title */
  title: z.string(),
  /** Category slug (branding, contextual-ads, outdoor, etc.) */
  category: z.string(),
  /** Short case description/subtitle */
  description: z.string(),
  /** Hero section with background image or gradient */
  hero: z.object({
    /** Optional hero image URL */
    image: z.string().optional(),
    /** Tailwind gradient class (e.g., "bg-gradient-to-r from-blue-500 to-purple-600") */
    gradient: z.string(),
  }),
  /** Search/filter tags for the case */
  tags: z.array(z.string()),
  /** SEO metadata */
  meta: z.object({
    /** Meta title for search engines */
    title: z.string(),
    /** Meta description for search engines */
    description: z.string(),
    /** Optional Open Graph URL */
    ogUrl: z.string().optional(),
    /** Optional Open Graph image URL */
    ogImage: z.string().optional(),
  }),
  /** Quick reference info displayed in case header */
  overview: z.object({
    /** Client/company name */
    client: z.string(),
    /** Year of project completion */
    year: z.string(),
    /** Summary of services delivered */
    services: z.string(),
  }),
  /** Array of content blocks (text, images, charts, etc.) */
  content: z.array(ContentBlockSchema),
  /** Optional preview and og images for portfolio listing */
  images: z
    .object({
      /** Thumbnail image for case card */
      preview: z.string().optional(),
      /** Open Graph image for social sharing */
      og: z.string().optional(),
    })
    .optional(),
});

/**
 * @description Portfolio case type inferred from schema
 */
export type PortfolioCase = z.infer<typeof PortfolioCaseSchema>;
