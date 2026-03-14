import data from '@data/sections/carousel/carousel.json';
import { z } from 'zod';

/**
 * @module sections/carousel/carousel
 * @description Carousel slide data including background image/gradient and overlay text.
 */

/**
 * @description Single carousel slide with image and overlay text
 */
export const CarouselSlideSchema = z.object({
  /** Unique slide identifier */
  id: z.number(),
  /** Slide background image URL */
  image: z.string(),
  /** Alt text for image accessibility */
  alt: z.string(),
  /** Fallback Tailwind gradient if image unavailable */
  gradient: z.string(),
  /** Slide headline text */
  title: z.string(),
  /** Slide description/subtitle */
  subtitle: z.string(),
});

export type CarouselSlide = z.infer<typeof CarouselSlideSchema>;

/**
 * @description Array of carousel slides
 */
export const CarouselSlidesSchema = z.array(CarouselSlideSchema);

/**
 * @description Parsed carousel slides from JSON data
 */
export const carouselSlides = CarouselSlidesSchema.parse(data);
