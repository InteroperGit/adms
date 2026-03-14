import raw from '@data/sections/about/aboutContent.json';
import { z } from 'zod';

/**
 * @module sections/about/aboutContent
 * @description About section header, description text, and metrics card (NPS, company stats).
 */

/**
 * @description About section with agency description and key metrics card
 */
export const AboutSectionContentSchema = z.object({
  /** Section label (e.g., "About") */
  label: z.string(),
  /** Main section title */
  title: z.string(),
  /** Text fragment to highlight in primary color */
  titleHighlight: z.string(),
  /** Array of paragraph texts */
  text: z.array(z.string()),
  /** Side card with company stats and NPS score */
  card: z.object({
    /** Card headline/tagline */
    tagline: z.string(),
    /** Array of stat/metric pairs (label and value) */
    stats: z.array(z.object({ label: z.string(), value: z.string() })),
    /** NPS score display (Net Promoter Score) */
    nps: z.object({ label: z.string(), value: z.string() }),
  }),
});

export type AboutSectionContent = z.infer<typeof AboutSectionContentSchema>;

/**
 * @description Parsed about section content from JSON data
 */
export const aboutContent = AboutSectionContentSchema.parse(raw);
