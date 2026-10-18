// @vitest-environment node
// Offer contracts cover editorial defaults, media and CTA destinations.
import { expect, it } from 'vitest';
import fixtures from '../../tests/fixtures/content/unit-contracts.json';
import { expectContentContract } from '../../tests/helpers/content-contract';
import {
  offerFocalPointSchema,
  offerPresentationSchema,
  offerSchema,
  offersSchema,
  offerTextContrast,
} from './offers';

const offer = fixtures.offers.items[0];

it('enforces the offers root contract', () => {
  expectContentContract(offersSchema, fixtures.offers, ['intervalMs']);
});

it('parses offer exports and supplies presentation and timing defaults', () => {
  expect(offerSchema.parse(offer)).toEqual(offer);
  expect(offerFocalPointSchema.parse({})).toEqual({ x: 50, y: 50 });
  expect(offerPresentationSchema.parse({}).textColor).toBe('#ffffff');
  expect(offerTextContrast('#ffffff', 'dark')).toBe(21);
  expect(
    offersSchema.parse({
      ...fixtures.offers,
      intervalMs: undefined,
      items: [{ ...offer, presentation: undefined }],
    }).intervalMs,
  ).toBe(7000);
  expect(offersSchema.parse({ ...fixtures.offers, items: [] }).items).toEqual(
    [],
  );
});

it.each(['', ' '])('allows image-only copy: %j', (description) => {
  expect(
    offerSchema.safeParse({ ...offer, description, imageAlt: '' }).success,
  ).toBe(true);
});

it.each(['/asset.png', 'http://example.test/a', 'https://example.test/a'])(
  'accepts media destination %s',
  (image) => {
    expect(offerSchema.safeParse({ ...offer, image }).success).toBe(true);
  },
);

it.each([
  '//host/a',
  '/bad path',
  '/bad\\path',
  '#image',
  'https://user:pass@example.test/a',
  'javascript:alert(1)',
])('rejects unsafe image %s', (image) => {
  expect(offerSchema.safeParse({ ...offer, image }).success).toBe(false);
});

it('checks CTA fragments, dimensions, contrast, IDs and strict keys', () => {
  expect(offerSchema.safeParse({ ...offer, href: '#order' }).success).toBe(
    true,
  );
  for (const change of [
    { href: '#' },
    { imageAlt: ' ' },
    { imageWidth: 0 },
    { imageHeight: 1.5 },
    { extra: true },
    { id: 0 },
    { presentation: { textColor: '#000000', overlay: 'dark' } },
  ]) {
    expect(offerSchema.safeParse({ ...offer, ...change }).success).toBe(false);
  }
  expect(offerFocalPointSchema.safeParse({ x: -1, y: 101 }).success).toBe(
    false,
  );
  expect(offerFocalPointSchema.parse({ x: 0, y: 100 })).toEqual({
    x: 0,
    y: 100,
  });
  expect(
    offersSchema.safeParse({
      ...fixtures.offers,
      items: [offer, offer],
    }).success,
  ).toBe(false);
  expect(
    offersSchema.safeParse({
      ...fixtures.offers,
      intervalMs: 4999,
    }).success,
  ).toBe(false);
});
