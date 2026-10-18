// Compile-only examples; this file is never executed.
import type * as Domain from '@/types/business-solutions';

export const value = {
  heading: 'TEST_HEADING',
  introduction: 'Fixture introduction',
  items: [
    {
      id: 'solution-0',
      title: 'TEST_TITLE',
      summary: 'TEST_SUMMARY',
      customerTask: 'TEST_CUSTOMERTASK',
      solution: 'TEST_SOLUTION',
      example: {
        title: 'TEST_TITLE',
        text: 'TEST_TEXT',
      },
      inquiryLabel: 'TEST_INQUIRYLABEL',
      inquiryHref: '/#order-inquiry',
      carousel: {
        itemLabel: 'TEST_ITEMLABEL',
        mediaSource: 'TEST_MEDIASOURCE',
        mediaRights: 'TEST_MEDIARIGHTS',
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
            description: 'TEST_DESCRIPTION',
            presentation: {
              fontSizeRem: 1,
              textColor: '#ffffff',
              overlay: 'dark',
              horizontal: 'left',
              vertical: 'bottom',
              focalPoint: {
                x: 1,
                y: 1,
              },
            },
          },
        ],
      },
      attribution: {
        customerName: null,
        projectId: null,
        href: null,
        evidence: null,
        media: [],
      },
    },
  ],
} satisfies Domain.BusinessSolutionsContent;

export const BusinessSolutionItem = value
  .items[0] satisfies Domain.BusinessSolutionItem;
export const BusinessSolutionCarousel = value.items[0]
  .carousel satisfies Domain.BusinessSolutionCarousel;
export const BusinessSolutionAttribution = value.items[0]
  .attribution satisfies Domain.BusinessSolutionAttribution;
export const BusinessSolutionMedia = {
  src: '/fixture.svg',
  alt: 'Fixture',
  width: 1,
  height: 1,
  source: 'Fixture owner',
  rights: 'Fixture permission',
} satisfies Domain.BusinessSolutionMedia;

export const invalid = {
  ...value,
  // @ts-expect-error heading must retain its domain type.
  heading: 0,
} satisfies Domain.BusinessSolutionsContent;
