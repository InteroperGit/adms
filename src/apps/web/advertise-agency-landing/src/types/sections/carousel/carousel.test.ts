import { describe, it, expect } from 'vitest';
import { CarouselSlidesSchema } from '../carousel/carousel';

const mockCarousel = [
  {
    id: 1,
    image: '/images/slide1.webp',
    alt: 'Slide 1',
    gradient: 'from-blue-500 to-indigo-500',
    title: 'Slide 1 Title',
    subtitle: 'Slide 1 Subtitle',
  },
];


const invalidCarousel = [
  {
    id: 1,
    image: 123, // Invalid type
    alt: 'Slide 1',
    gradient: 'from-blue-500 to-indigo-500',
    title: 'Slide 1 Title',
    subtitle: 'Slide 1 Subtitle',
  },
];

describe('CarouselSlidesSchema', () => {
  it('parses without errors', () => {
    expect(() => CarouselSlidesSchema.parse(mockCarousel)).not.toThrow();
  });

  it('rejects invalid data', () => {
    expect(() => CarouselSlidesSchema.parse(invalidCarousel)).toThrow();
  });
});
