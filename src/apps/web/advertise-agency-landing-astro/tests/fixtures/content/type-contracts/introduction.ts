// Compile-only examples; this file is never executed.
import type * as Domain from '@/types/introduction';

export const value = {
  heading: 'TEST_HEADING',
  summary: 'TEST_SUMMARY',
  location: 'TEST_LOCATION',
  copyApproved: false,
  demoMode: false,
  action: {
    label: 'TEST_LABEL',
    href: '/#order-inquiry',
  },
  photo: {
    src: 'https://example.test/test-asset',
    alt: 'TEST_ALT',
    width: 1,
    height: 1,
    source: 'TEST_SOURCE',
    projectContext: 'TEST_PROJECTCONTEXT',
    publicationPermission: 'TEST_PUBLICATIONPERMISSION',
    approved: false,
    desktopFocalPoint: {
      x: 1,
      y: 1,
    },
    mobileFocalPoint: {
      x: 1,
      y: 1,
    },
  },
} satisfies Domain.IntroductionContent;

export const IntroductionPhoto = value.photo satisfies Domain.IntroductionPhoto;
export const IntroductionFocalPoint = value.photo
  .desktopFocalPoint satisfies Domain.IntroductionFocalPoint;

export const invalid = {
  ...value,
  // @ts-expect-error photo must retain its domain type.
  photo: false,
} satisfies Domain.IntroductionContent;
