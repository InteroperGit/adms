// Offers keep their content contract while sharing carousel presentation.
import type {
  CarouselFocalPoint, CarouselPresentation,
} from './image-carousel';
export type OfferFocalPoint = CarouselFocalPoint;
export type OfferPresentation = CarouselPresentation;

export interface Offer {
  id: number;
  enabled: boolean;
  description: string;
  presentation: OfferPresentation;
  image: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  linkLabel: string;
  href: string;
}

/** Validated settings include intervalMs after its default is applied. */
export interface Offers {
  enabled: boolean;
  autoplay: boolean;
  intervalMs: number;
  items: Offer[];
}
