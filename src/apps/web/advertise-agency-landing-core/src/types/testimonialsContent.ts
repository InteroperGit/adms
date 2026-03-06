import raw from '@data/testimonials-content.json';

export interface TestimonialsSectionContent {
  label: string;
  title: string;
  description: string;
}

export const testimonialsSectionContent = raw satisfies TestimonialsSectionContent;
