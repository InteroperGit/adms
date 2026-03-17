import raw from '@data/sections/advantages/advantagesContent.json';
import { z } from 'zod';

/**
 * @module sections/advantages/advantagesContent
 * @description Advantages section header and intro text.
 */

/**
 * @description Advantages section header with title and description
 */
export const AdvantagesSectionContentSchema = z.object({
  /** Section label (e.g., "Why Us") */
  label: z.string(),
  /** Main section title */
  title: z.string(),
  /** Text fragment to highlight in primary color */
  titleHighlight: z.string(),
  /** Section description/intro */
  description: z.string(),
});

export type AdvantagesSectionContent = z.infer<typeof AdvantagesSectionContentSchema>;

/**
 * @description Parsed advantages section content from JSON data
 */
export const advantagesContent = AdvantagesSectionContentSchema.parse(raw);
