import raw from '@data/sections/portfolio/imageGallery.json';
import { z } from 'zod';

/**
 * @module shared/imageGallery
 * @description UI labels for lightbox gallery navigation and controls.
 */

/**
 * @description UI labels for lightbox gallery component
 */
export const ImageGalleryContentSchema = z.object({
  /** Label for previous button */
  prevLabel: z.string(),
  /** Label for next button */
  nextLabel: z.string(),
  /** Counter text template (e.g., "{current} of {total}") */
  counter: z.string(),
  /** Label for close button */
  closeLabel: z.string(),
});

export type ImageGalleryContent = z.infer<typeof ImageGalleryContentSchema>;

/**
 * @description Parsed image gallery UI content
 */
export const imageGalleryContent = ImageGalleryContentSchema.parse(raw);
