import data from '@data/sections/carousel/carousel.json';
import { z } from 'zod';

export const CarouselSlideSchema = z.object({
  id: z.number(),
  image: z.string(),
  alt: z.string(),
  gradient: z.string(),
  title: z.string(),
  subtitle: z.string(),
});

export type CarouselSlide = z.infer<typeof CarouselSlideSchema>;

export const CarouselSlidesSchema = z.array(CarouselSlideSchema);

export const carouselSlides = CarouselSlidesSchema.parse(data);
