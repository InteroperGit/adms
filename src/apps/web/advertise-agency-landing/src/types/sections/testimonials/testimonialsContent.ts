import raw from '@data/sections/testimonials/testimonialsContent.json';
import { z } from 'zod';

/**
 * @module sections/testimonials/testimonialsContent
 * @description Testimonials section header and intro text.
 */

/**
 * @description Testimonials section header with title and description
 */
export const TestimonialsSectionContentSchema = z.object({
  /** Section label (e.g., "Testimonials") */
  label: z.string(),
  /** Main section title */
  title: z.string(),
  /** Section description/intro */
  description: z.string(),
});

export type TestimonialsSectionContent = z.infer<typeof TestimonialsSectionContentSchema>;

/**
 * @description Parsed testimonials section content from JSON data
 */
export const testimonialsSectionContent = TestimonialsSectionContentSchema.parse(raw);
