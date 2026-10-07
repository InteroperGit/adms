// Plain domain contracts keep browser code independent of validation.
export interface CarouselFocalPoint {
  x: number;
  y: number;
}

export interface CarouselPresentation {
  fontSizeRem: number;
  textColor: string;
  overlay: 'dark' | 'light';
  horizontal: 'left' | 'center' | 'right';
  vertical: 'top' | 'center' | 'bottom';
  focalPoint: CarouselFocalPoint;
  mobileFocalPoint?: CarouselFocalPoint;
}

export interface CarouselItem {
  id: number;
  enabled: boolean;
  image: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  description?: string;
  href?: string;
  linkLabel?: string;
  presentation: CarouselPresentation;
}

// All options have defaults applied by the shared build-time schema.
export interface CarouselOptions {
  enabled: boolean;
  autoplay: boolean;
  intervalMs: number;
  manualNavigation: boolean;
  arrows: boolean;
  circles: boolean;
  descriptions: boolean;
  buttons: boolean;
  animation: boolean;
  layout: 'full' | 'panel';
  imageFit: 'cover' | 'contain';
  aspectRatio: number;
  eagerFirst: boolean;
}

export interface CarouselContent {
  options: CarouselOptions;
  items: CarouselItem[];
}
