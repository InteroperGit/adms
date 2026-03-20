import { describe, it, expect } from 'vitest';
import { CarouselSectionContentSchema } from '../carousel/carouselContent';

const mockCarouselContent = {
  label: 'Featured Work',
  prevLabel: 'Previous',
  nextLabel: 'Next',
  slideLabel: 'Slide {index}',
};

const invalidCarouselContent = {
  label: 'Featured Work',
  prevLabel: 123, // Invalid type
  nextLabel: 'Next',
  slideLabel: 'Slide {index}',
};

describe('CarouselSectionContentSchema', () => {
  it('parses without errors', () => {
    expect(() => CarouselSectionContentSchema.parse(mockCarouselContent)).not.toThrow();
  });

  it('rejects invalid data', () => {
    expect(() => CarouselSectionContentSchema.parse(invalidCarouselContent)).toThrow();
  });
});
