/** Safe image crop coordinates in percentages. */
export interface OfferFocalPoint {
  x: number;
  y: number;
}

/** Validated presentation; omitted JSON settings receive defaults. */
export interface OfferPresentation {
  fontSizeRem: number;
  textColor: string;
  overlay: 'dark' | 'light';
  horizontal: 'left' | 'center' | 'right';
  vertical: 'top' | 'center' | 'bottom';
  focalPoint: OfferFocalPoint;
  mobileFocalPoint?: OfferFocalPoint;
}

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
