// Compile-only examples; this file is never executed.
import type * as Domain from '@/types/offer';

export const value = {
  enabled: false,
  autoplay: false,
  intervalMs: 7000,
  items: [
    {
      id: 1,
      enabled: false,
      description: 'TEST_DESCRIPTION',
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
      image: '/a.png',
      imageAlt: 'TEST_IMAGEALT',
      imageWidth: 1,
      imageHeight: 1,
      linkLabel: 'TEST_LINKLABEL',
      href: '/#order-inquiry',
    },
  ],
} satisfies Domain.Offers;

export const Offer = value.items[0] satisfies Domain.Offer;
export const OfferPresentation = value.items[0]
  .presentation satisfies Domain.OfferPresentation;
export const OfferFocalPoint = value.items[0].presentation
  .focalPoint satisfies Domain.OfferFocalPoint;

export const invalid = {
  ...value,
  // @ts-expect-error intervalMs must retain its domain type.
  intervalMs: '7000',
} satisfies Domain.Offers;
