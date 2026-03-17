import { z } from 'zod';

/**
 * @module blocks/galleryImage
 * @description Single image in a gallery block with optional caption
 */

export const GalleryImageSchema = z.object({
  /** Image URL */
  src: z.string(),
  /** Optional image caption or alt description */
  description: z.string().optional(),
});

export type GalleryImage = z.infer<typeof GalleryImageSchema>;
