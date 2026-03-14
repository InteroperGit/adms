import data from '@data/config/seo.json';
import { z } from 'zod';

/**
 * @module config/seo
 * @description SEO metadata: canonical URL, site name, locale, Twitter card, default OG image.
 */

/**
 * @description SEO and social media metadata configuration
 */
export const SeoConfigSchema = z.object({
  /** Canonical site URL (e.g., "https://example.com") */
  siteUrl: z.string(),
  /** Site name for Open Graph tags */
  siteName: z.string(),
  /** HTML lang attribute (e.g., "ru", "en") */
  locale: z.string(),
  /** Twitter card type (e.g., "summary_large_image") */
  twitterCard: z.string(),
  /** Default Open Graph image URL used if no page-specific image */
  defaultOgImage: z.string(),
});

/**
 * @description Parsed and validated SEO configuration
 */
export type SeoConfig = z.infer<typeof SeoConfigSchema>;

/**
 * @description Exported SEO config constant parsed from data/config/seo.json
 */
export const seoConfig = SeoConfigSchema.parse(data);
