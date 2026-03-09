import raw from '@data/sections/carousel-content.json';

export interface CarouselSectionContent {
  label: string;
}

export const carouselContent = raw satisfies CarouselSectionContent;
