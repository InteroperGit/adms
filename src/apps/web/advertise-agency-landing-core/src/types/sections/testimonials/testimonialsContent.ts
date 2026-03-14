import raw from '@data/sections/testimonials/testimonialsContent.json';
import { z } from 'zod';

export const TestimonialsSectionContentSchema = z.object({
  label: z.string(),
  title: z.string(),
  description: z.string(),
});

export type TestimonialsSectionContent = z.infer<typeof TestimonialsSectionContentSchema>;

export const testimonialsSectionContent = TestimonialsSectionContentSchema.parse(raw);
