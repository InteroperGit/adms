import data from '@data/testimonials.json';

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar: string;
  avatarColor: string;
  rating: number;
  text: string;
}

export const testimonials: Testimonial[] = data;
