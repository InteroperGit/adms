// Compile-only examples; this file is never executed.
import type * as Domain from '@/types/image-carousel';

export const value = {
  options: {
    enabled: false,
    autoplay: false,
    intervalMs: 7000,
    manualNavigation: false,
    arrows: false,
    circles: false,
    descriptions: false,
    buttons: false,
    animation: false,
    layout: 'full',
    imageFit: 'cover',
    aspectRatio: 1,
    eagerFirst: false,
  },
  items: [
    {
      id: 1,
      enabled: false,
      image: '/a.png',
      imageAlt: 'TEST_IMAGEALT',
      imageWidth: 1,
      imageHeight: 1,
      presentation: {
        fontSizeRem: 1,
        textColor: '#ffffff',
        horizontal: 'left',
        vertical: 'bottom',
        overlay: 'dark',
        focalPoint: {
          x: 1,
          y: 1,
        },
        mobileFocalPoint: {
          x: 1,
          y: 1,
        },
      },
    },
  ],
} satisfies Domain.CarouselContent;

export const CarouselOptions = value.options satisfies Domain.CarouselOptions;
export const CarouselItem = value.items[0] satisfies Domain.CarouselItem;
export const CarouselPresentation = value.items[0]
  .presentation satisfies Domain.CarouselPresentation;
export const CarouselFocalPoint = value.items[0].presentation
  .focalPoint satisfies Domain.CarouselFocalPoint;

export const invalid = {
  ...value,
  // @ts-expect-error items must retain its domain type.
  items: [false],
} satisfies Domain.CarouselContent;
