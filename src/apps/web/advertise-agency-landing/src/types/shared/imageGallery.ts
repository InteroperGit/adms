import raw from '@data/config/imageGallery.json';
import { z } from 'zod';

/**
 * @module shared/imageGallery
 * @description UI labels for lightbox gallery navigation and controls.
 */

/**
 * @description UI labels and alt-text template for image gallery component
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
  /**
   * Alt text template for gallery images. Supports `{title}` and `{index}` placeholders
   * resolved at render time via `interpolate` (e.g. `"{title} — фото {index}"`).
   */
  photoAltTemplate: z.string(),
});

export type ImageGalleryContent = z.infer<typeof ImageGalleryContentSchema>;

/**
 * @description Parsed image gallery UI content
 */
export const imageGalleryContent = ImageGalleryContentSchema.parse(raw);
