// @vitest-environment node
import { describe, expect, it } from 'vitest';
import fixtures from '../../tests/fixtures/content/unit-contracts.json';
import {
  carouselContentSchema,
  carouselItemSchema,
  carouselOptionsSchema,
  carouselPresentationSchema,
  carouselTextContrast,
  safeCarouselUrl,
} from './image-carousel';

describe('image carousel contracts', () => {
  it('accepts the versioned carousel fixture', () => {
    expect(
      carouselContentSchema.safeParse(fixtures['about-carousel']).success,
    ).toBe(true);
  });

  it('applies safe defaults and validates interval boundaries', () => {
    expect(carouselOptionsSchema.parse({}).intervalMs).toBe(7000);
    expect(carouselOptionsSchema.safeParse({ intervalMs: 4999 }).success).toBe(
      false,
    );
  });

  it('requires readable colors with sufficient contrast', () => {
    expect(carouselTextContrast('#ffffff', 'dark')).toBe(21);
    expect(carouselTextContrast('#000000', 'light')).toBe(21);
    expect(
      carouselPresentationSchema.safeParse({ textColor: '#000000' }).success,
    ).toBe(false);
    expect(
      carouselPresentationSchema.safeParse({ textColor: '#zzzzzz' }).success,
    ).toBe(false);
  });

  it.each([
    '//host',
    '/bad path',
    '/bad\\path',
    ' #a',
    '#',
    'javascript:alert(1)',
    'https://u:p@example.test',
    'https://[bad',
  ])('rejects unsafe carousel URL %s', (value) => {
    expect(safeCarouselUrl(value, true)).toBe(false);
  });

  it.each(['/asset', '#a', 'https://example.test/a'])(
    'accepts safe carousel URL %s',
    (value) => {
      expect(safeCarouselUrl(value, true)).toBe(true);
    },
  );

  it('allows decorative images but rejects incomplete links', () => {
    const item = {
      id: 1,
      image: '/a.png',
      imageAlt: '',
      imageWidth: 1,
      imageHeight: 1,
    };
    expect(carouselItemSchema.safeParse(item).success).toBe(true);
    expect(carouselItemSchema.safeParse({ ...item, href: '/a' }).success).toBe(
      false,
    );
  });
});
