// Compile-only examples; this file is never executed.
import type * as Domain from '@/types/faq';

export const value = {
  demoMode: false,
  demoNotice: 'TEST_DEMONOTICE',
  heading: 'TEST_HEADING',
  inquiryLabel: 'TEST_INQUIRYLABEL',
  inquiryHref: '/#order-inquiry',
  approval: {
    state: 'draft',
    source: null,
    approvedBy: null,
  },
  items: [
    {
      id: 'sample',
      question: 'TEST_QUESTION',
      answer: 'TEST_ANSWER',
      approval: {
        state: 'draft',
        source: null,
        approvedBy: null,
      },
    },
  ],
} satisfies Domain.FaqContent;

export const FaqItem = value.items[0] satisfies Domain.FaqItem;
export const FaqApproval = value.approval satisfies Domain.FaqApproval;

export const invalid = {
  ...value,
  // @ts-expect-error inquiryHref must retain its domain type.
  inquiryHref: '/wrong',
} satisfies Domain.FaqContent;
