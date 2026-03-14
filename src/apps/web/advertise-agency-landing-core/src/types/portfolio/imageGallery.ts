import raw from '@data/sections/portfolio/imageGallery.json';
import { z } from 'zod';

export const ImageGalleryContentSchema = z.object({
  prevLabel: z.string(),
  nextLabel: z.string(),
  counter: z.string(),
  closeLabel: z.string(),
});

export type ImageGalleryContent = z.infer<typeof ImageGalleryContentSchema>;

export const imageGalleryContent = ImageGalleryContentSchema.parse(raw);
