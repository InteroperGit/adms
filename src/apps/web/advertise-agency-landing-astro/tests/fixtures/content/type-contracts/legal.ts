// Compile-only examples; this file is never executed.
import type * as Domain from '@/types/legal';

export const value = {
  title: 'TEST_TITLE',
  description: 'TEST_DESCRIPTION',
  effectiveDate: 'TEST_EFFECTIVEDATE',
  sections: [
    {
      heading: 'TEST_HEADING',
      content: 'TEST_CONTENT',
    },
  ],
} satisfies Domain.LegalDocument;

export const LegalSection = value.sections[0] satisfies Domain.LegalSection;

export const invalid = {
  ...value,
  // @ts-expect-error title must retain its domain type.
  title: 0,
} satisfies Domain.LegalDocument;
