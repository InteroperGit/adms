// Compile-only examples; this file is never executed.
import type * as Domain from '@/types/about';

export const value = {
  description1: 'TEST_DESCRIPTION1',
  description2: 'TEST_DESCRIPTION2',
  stats: [
    {
      value: 'TEST_VALUE',
      label: 'TEST_LABEL',
    },
  ],
  icon: 'TEST_ICON',
} satisfies Domain.AboutContent;

export const Stat = value.stats[0] satisfies Domain.Stat;

export const invalid = {
  ...value,
  // @ts-expect-error description1 must retain its domain type.
  description1: 0,
} satisfies Domain.AboutContent;
