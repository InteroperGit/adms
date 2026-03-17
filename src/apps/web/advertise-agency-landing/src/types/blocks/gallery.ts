import { z } from 'zod';
import { GalleryImageSchema } from './galleryImage';

/**
 * @module blocks/gallery
 * @description Gallery block with multiple images and lightbox support
 */

export const GalleryBlockSchema = z.object({
  __component: z.literal('gallery'),
  /** Array of images in gallery */
  images: z.array(GalleryImageSchema),
});

export type GalleryBlock = z.infer<typeof GalleryBlockSchema>;
