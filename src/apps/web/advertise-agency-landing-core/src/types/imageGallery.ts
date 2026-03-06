import raw from '@data/image-gallery.json';

export interface ImageGalleryContent {
  prevLabel: string;
  nextLabel: string;
  counter: string;
}

export const imageGalleryContent = raw satisfies ImageGalleryContent;
