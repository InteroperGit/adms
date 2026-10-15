// @vitest-environment node
// Public formatting and visibility share synthetic approved/draft records.
import { expect, it } from 'vitest';
import fixtures from '../fixtures/content/unit-contracts.json';
import {
  formatPricingPrice, getPublishedPricingExamples, getVisiblePricingExamples,
} from '../../src/content/pricing-publication';
import { pricingSchema } from '../../src/validation/pricing';
import { getProjectCategory } from '../../src/content/project-categories';

it('formats exact and range RUB amounts with Russian separators', () => {
  const price = pricingSchema.parse(fixtures.pricing).items[0].price;
  expect(formatPricingPrice({ ...price, type: 'exact', amount: 1234.5 }))
    .toBe('1\u00a0234,5\u00a0₽');
  expect(formatPricingPrice({ ...price, type: 'range', min: 1000, max: 2000 }))
    .toBe('1\u00a0000\u00a0₽ – 2\u00a0000\u00a0₽');
});

it('keeps demo prices separate from approved agency examples', () => {
  const content = pricingSchema.parse(fixtures.pricing);
  expect(getPublishedPricingExamples(content)).toEqual([]);
  expect(getVisiblePricingExamples(content)).toEqual([]);
  content.demoMode = true;
  expect(getVisiblePricingExamples(content)).toEqual(content.items);
  content.demoMode = false;
  content.copyApproved = true;
  const item = content.items[0];
  item.price.context = 'historical';
  item.approval = { specifications: true, copy: true, price: true,
    reference: 'Fixture', verifiedAt: '2026-10-15' };
  item.image!.approved = true;
  expect(getPublishedPricingExamples(content)).toEqual([item]);
  for (const key of ['specifications', 'copy', 'price'] as const) {
    item.approval[key] = false;
    expect(getPublishedPricingExamples(content)).toEqual([]);
    item.approval[key] = true;
  }
  item.image = null;
  expect(getPublishedPricingExamples(content)).toEqual([]);
});

it('looks up category labels and safely ignores unclassified records', () => {
  expect(getProjectCategory('sample')).toEqual(fixtures.categories[0]);
  for (const slug of [null, undefined, '', 'unknown']) {
    expect(getProjectCategory(slug)).toBeUndefined();
  }
});
