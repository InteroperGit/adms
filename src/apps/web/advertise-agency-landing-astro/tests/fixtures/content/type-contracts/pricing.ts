// Compile-only examples; this file is never executed.
import type * as Domain from '@/types/pricing';

export const value = {
  demoMode: false,
  demoNotice: 'TEST_DEMONOTICE',
  demoPriceLabel: 'TEST_DEMOPRICELABEL',
  heading: 'TEST_HEADING',
  introduction: 'TEST_INTRODUCTION',
  copyApproved: false,
  approvalSource: null,
  costFactors: {
    heading: 'TEST_HEADING',
    items: ['TEST_ITEMS'],
  },
  estimateGuidance: {
    heading: 'TEST_HEADING',
    text: 'TEST_TEXT',
  },
  inquiryLabel: 'TEST_INQUIRYLABEL',
  items: [
    {
      id: 'sample',
      title: 'TEST_TITLE',
      description: 'TEST_DESCRIPTION',
      dimensions: 'TEST_DIMENSIONS',
      materials: ['TEST_MATERIALS'],
      includedWork: ['TEST_INCLUDEDWORK'],
      exclusions: ['TEST_EXCLUSIONS'],
      source: 'TEST_SOURCE',
      price: {
        type: 'exact',
        amount: 1000,
        currency: 'RUB',
        context: 'demo',
        asOf: null,
        conditions: 'Synthetic estimate',
      },
      approval: {
        specifications: false,
        copy: false,
        price: false,
        reference: null,
        verifiedAt: null,
      },
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
    },
  ],
} satisfies Domain.PricingContent;

export const range = {
  type: 'range',
  min: 100,
  max: 200,
} satisfies Domain.PricingAmount;
export const exact = {
  type: 'exact',
  amount: 100,
} satisfies Domain.PricingAmount;
const missingBound = {
  type: 'range' as const,
  min: 100,
};
// @ts-expect-error A range requires both bounds.
export const missingMaximum = missingBound satisfies Domain.PricingAmount;

export const PricingExample = value.items[0] satisfies Domain.PricingExample;
export const PricingPrice = value.items[0].price satisfies Domain.PricingPrice;
export const PricingAmount = value.items[0]
  .price satisfies Domain.PricingAmount;
export const PricingApproval = value.items[0]
  .approval satisfies Domain.PricingApproval;

export const invalid = {
  ...value,
  // @ts-expect-error demoMode must retain its domain type.
  demoMode: 'yes',
} satisfies Domain.PricingContent;
