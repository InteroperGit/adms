import raw from '@data/sections/testimonialsContent.json';

export interface TestimonialsSectionContent {
  label: string;
  title: string;
  description: string;
}

export const testimonialsSectionContent = raw satisfies TestimonialsSectionContent;
