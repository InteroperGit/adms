// Compile-only examples; this file is never executed.
import type * as Domain from '@/types/review';

export const value = {
  id: 1,
  name: 'TEST_NAME',
  position: 'TEST_POSITION',
  company: 'TEST_COMPANY',
  text: 'TEST_TEXT',
  avatar: '/review.png',
  avatarAlt: 'TEST_AVATARALT',
  avatarWidth: 1,
  avatarHeight: 1,
} satisfies Domain.Review;

export const invalid = {
  ...value,
  // @ts-expect-error id must retain its domain type.
  id: '1',
} satisfies Domain.Review;
