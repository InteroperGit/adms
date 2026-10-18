// Compile-only examples; this file is never executed.
import type * as Domain from '@/types/icons';

export const value = {
  phone: 'TEST_PHONE',
  email: 'test@example.com',
  address: 'TEST_ADDRESS',
  clock: 'TEST_CLOCK',
  arrow: 'TEST_ARROW',
  butterfly: 'TEST_BUTTERFLY',
  sparkles: 'TEST_SPARKLES',
  mail: 'TEST_MAIL',
  menu: {
    open: 'TEST_OPEN',
    close: 'TEST_CLOSE',
  },
  social: {
    youtube: 'TEST_YOUTUBE',
    telegram: 'TEST_TELEGRAM',
    vk: 'TEST_VK',
  },
} satisfies Domain.Icons;

export const invalid = {
  ...value,
  // @ts-expect-error phone must retain its domain type.
  phone: 0,
} satisfies Domain.Icons;
