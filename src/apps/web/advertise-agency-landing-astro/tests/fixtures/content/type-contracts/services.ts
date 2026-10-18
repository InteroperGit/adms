// Compile-only examples; this file is never executed.
import type * as Domain from '@/types/services';

export const value = {
  heading: 'TEST_HEADING',
  introduction: 'TEST_INTRODUCTION',
  copyApproved: false,
  items: [
    {
      id: 'sample',
      name: 'TEST_NAME',
      description: 'TEST_DESCRIPTION',
      claimSource: 'TEST_CLAIMSOURCE',
      confirmed: false,
      copyApproved: false,
      image: {
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
      href: '/services/sample/',
      article: {
        title: 'Sample',
        description: 'Synthetic article',
        approved: false,
        content: [
          {
            type: 'paragraph',
            paragraphs: ['Synthetic copy'],
          },
        ],
      },
    },
  ],
  demoMode: false,
  demoNotice: 'TEST_DEMONOTICE',
} satisfies Domain.ServicesContent;

export const Service = value.items[0] satisfies Domain.Service;
export const ServiceImage = value.items[0].image satisfies Domain.ServiceImage;
export const ServiceFocalPoint = value.items[0].image
  .desktopFocalPoint satisfies Domain.ServiceFocalPoint;

export const invalid = {
  ...value,
  // @ts-expect-error copyApproved must retain its domain type.
  copyApproved: 'yes',
} satisfies Domain.ServicesContent;
