import data from '@data/sections/testimonials/testimonials.json';
import { z } from 'zod';

/**
 * @module sections/testimonials/testimonials
 * @description Client testimonials with ratings, quotes, and avatar information.
 */

/**
 * @description Client testimonial with rating and quote
 */
export const TestimonialSchema = z.object({
  /** Unique testimonial identifier */
  id: z.number(),
  /** Client name */
  name: z.string(),
  /** Client role/title */
  role: z.string(),
  /** Client company */
  company: z.string(),
  /** Avatar image URL */
  avatar: z.string(),
  /** Avatar background color (hex or Tailwind class) */
  avatarColor: z.string(),
  /** Star rating (1-5) */
  rating: z.number(),
  /** Testimonial quote text */
  text: z.string(),
});

export type Testimonial = z.infer<typeof TestimonialSchema>;

/**
 * @description Array of testimonials
 */
export const TestimonialsSchema = z.array(TestimonialSchema);

/**
 * @description Parsed testimonials from JSON data
 */
export const testimonials = TestimonialsSchema.parse(data);
