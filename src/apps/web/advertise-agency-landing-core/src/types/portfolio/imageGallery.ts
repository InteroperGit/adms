import raw from '@data/sections/imageGallery.json';

export interface ImageGalleryContent {
  prevLabel: string;
  nextLabel: string;
  counter: string;
}

export const imageGalleryContent = raw satisfies ImageGalleryContent;
