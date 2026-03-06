import data from '@data/sections/carousel.json';

export interface CarouselSlide {
  id: number;
  image: string;
  alt: string;
  gradient: string;
  title: string;
  subtitle: string;
}

export const carouselSlides = data satisfies CarouselSlide[];
