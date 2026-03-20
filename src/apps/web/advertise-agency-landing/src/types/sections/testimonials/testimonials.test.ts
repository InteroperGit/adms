import { describe, it, expect } from 'vitest';
import { TestimonialsSchema } from '../testimonials/testimonials';

const mockTestimonials = [
  {
    id: 1,
    name: 'Jane Doe',
    role: 'CEO',
    company: 'Example Corp',
    avatar: '/images/avatar.webp',
    avatarColor: 'bg-red-500',
    rating: 5,
    text: 'Great service!',
  },
];


const invalidTestimonials = [
  {
    id: 1,
    name: 'Jane Doe',
    role: 123, // Invalid type
    company: 'Example Corp',
    avatar: '/images/avatar.webp',
    avatarColor: 'bg-red-500',
    rating: 5,
    text: 'Great service!',
  },
];

describe('TestimonialsSchema', () => {
  it('parses without errors', () => {
    expect(() => TestimonialsSchema.parse(mockTestimonials)).not.toThrow();
  });

  it('rejects invalid data', () => {
    expect(() => TestimonialsSchema.parse(invalidTestimonials)).toThrow();
  });
});
