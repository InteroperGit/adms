import raw from '@data/sections/carouselContent.json';

export interface CarouselSectionContent {
  label: string;
}

export const carouselContent = raw satisfies CarouselSectionContent;
