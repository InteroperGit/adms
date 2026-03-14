import data from '@data/sections/testimonials/testimonials.json';
import { z } from 'zod';

export const TestimonialSchema = z.object({
  id: z.number(),
  name: z.string(),
  role: z.string(),
  company: z.string(),
  avatar: z.string(),
  avatarColor: z.string(),
  rating: z.number(),
  text: z.string(),
});

export type Testimonial = z.infer<typeof TestimonialSchema>;

export const TestimonialsSchema = z.array(TestimonialSchema);

export const testimonials = TestimonialsSchema.parse(data);
