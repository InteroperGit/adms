import raw from '@data/sections/carouselContent.json';
import { z } from 'zod';

export const CarouselSectionContentSchema = z.object({
  label: z.string(),
});

export type CarouselSectionContent = z.infer<typeof CarouselSectionContentSchema>;

export const carouselContent = CarouselSectionContentSchema.parse(raw);
