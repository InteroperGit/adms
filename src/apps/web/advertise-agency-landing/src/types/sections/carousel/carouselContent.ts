import raw from '@data/sections/carousel/carouselContent.json';
import { z } from 'zod';

/**
 * @module sections/carousel/carouselContent
 * @description UI labels for carousel navigation controls and slide counter.
 */

/**
 * @description UI labels for carousel controls and navigation
 */
export const CarouselSectionContentSchema = z.object({
  /** Section label (e.g., "Featured Work") */
  label: z.string(),
  /** Previous button label */
  prevLabel: z.string(),
  /** Next button label */
  nextLabel: z.string(),
  /** Slide counter template with "{index}" placeholder (e.g., "Slide {index}") */
  slideLabel: z.string(),
});

export type CarouselSectionContent = z.infer<typeof CarouselSectionContentSchema>;

/**
 * @description Parsed carousel UI content from JSON data
 */
export const carouselContent = CarouselSectionContentSchema.parse(raw);
