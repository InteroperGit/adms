// Prices require calendar dates, evidence and approved project destinations.
import { expect, it } from 'vitest';
import fixtures from '../../tests/fixtures/content/unit-contracts.json';
import { createPricingSchema, pricingSchema } from './pricing';

const source = fixtures.pricing;
const item = source.items[0];
const schema = createPricingSchema(['/projects/1']);
const withItem = (change: object) => ({
  ...source, items: [{ ...item, ...change }],
});

it('accepts exact, range and empty catalogs', () => {
  expect(pricingSchema.parse(source)).toEqual(source);
  expect(schema.safeParse({ ...source, items: [] }).success).toBe(true);
  expect(schema.safeParse(withItem({ price: {
    type: 'range', min: 1, max: 2, currency: 'RUB', context: 'current',
    asOf: '2024-02-29', conditions: 'Estimate',
  }, href: '/projects/1' })).success).toBe(true);
});

it.each(['2025-02-29', '2026-02-30', '2026-13-01', 'not-a-date'])(
  'rejects invalid reference date %s', asOf => {
    expect(schema.safeParse(withItem({
      price: { ...item.price, asOf },
    })).success).toBe(false);
  },
);

it('rejects missing dates, nonpositive prices and reversed ranges', () => {
  for (const price of [
    { ...item.price, context: 'current' },
    { ...item.price, context: 'historical' },
    { ...item.price, amount: 0 },
    { ...item.price, type: 'range', min: 2, max: 2, amount: undefined },
    { ...item.price, type: 'range', min: 3, max: 2, amount: undefined },
  ]) {
    expect(schema.safeParse(withItem({ price })).success).toBe(false);
  }
});

it('requires evidence and review dates for every approval flag', () => {
  for (const field of ['copy', 'specifications', 'price']) {
    expect(schema.safeParse(withItem({
      approval: { ...item.approval, [field]: true },
    })).success).toBe(false);
  }
  expect(schema.safeParse(withItem({
    price: { ...item.price, context: 'historical', asOf: '2026-10-01' },
    approval: { ...item.approval, copy: true,
      reference: 'Evidence', verifiedAt: '2026-10-01' },
  })).success).toBe(true);
});

it('rejects demo approvals and links independently', () => {
  for (const change of [
    { href: '/projects/1' },
    { image: { ...item.image, approved: true } },
    { approval: { ...item.approval, copy: true,
      reference: 'Evidence', verifiedAt: '2026-10-01' } },
  ]) {
    expect(schema.safeParse(withItem(change)).success).toBe(false);
  }
});

it('requires local originals for visible demos', () => {
  for (const image of [null, item.image]) {
    expect(schema.safeParse({
      ...withItem({ image }), demoMode: true,
    }).success).toBe(false);
  }
  expect(schema.safeParse({
    ...withItem({ image: { ...item.image, src: '/src/assets/demo.png' } }),
    demoMode: true,
  }).success).toBe(true);
});

it('checks section approval, uniqueness, project paths and image geometry',
  () => {
    expect(schema.safeParse({ ...source, copyApproved: true }).success)
      .toBe(false);
    expect(schema.safeParse({
      ...source, copyApproved: true, approvalSource: 'Evidence',
    }).success).toBe(true);
    expect(schema.safeParse({ ...source, items: [item, item] }).success)
      .toBe(false);
    for (const href of ['/projects/999', '/projects/0', '/projects/1?q=x']) {
      expect(schema.safeParse(withItem({
        href, price: { ...item.price, context: 'current',
          asOf: '2026-10-01' },
      })).success).toBe(false);
    }
    for (const change of [
      { width: 0 }, { mobileFocalPoint: { x: -1, y: 101 } },
      { src: 'javascript:alert(1)' }, { extra: true },
    ]) {
      expect(schema.safeParse(withItem({
        image: { ...item.image, ...change },
      })).success).toBe(false);
    }
  },
);
