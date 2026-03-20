import { describe, it, expect } from 'vitest';
import { TestimonialsSectionContentSchema } from '../testimonials/testimonialsContent';

const mockTestimonialsSectionContent = {
  label: 'Clients Love Us',
  title: 'What Clients Say',
  description: 'Hear from our happy customers.',
  reviewsTitle: 'Yandex Reviews Widget',
};


const invalidTestimonialsSectionContent = {
  label: 'Clients Love Us',
  title: 123, // Invalid type
  description: 'Hear from our happy customers.',
  reviewsTitle: 'Yandex Reviews Widget',
};

describe('TestimonialsSectionContentSchema', () => {
  it('parses without errors', () => {
    expect(() => TestimonialsSectionContentSchema.parse(mockTestimonialsSectionContent)).not.toThrow();
  });

  it('rejects invalid data', () => {
    expect(() => TestimonialsSectionContentSchema.parse(invalidTestimonialsSectionContent)).toThrow();
  });
});
