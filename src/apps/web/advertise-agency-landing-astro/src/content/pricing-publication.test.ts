// Fictional prices stay separate from approved current and historical prices.
import { expect, it } from 'vitest';
import { buildContract } from '../../tests/helpers/fixtures';
import { pricingSchema } from '../validation/pricing';
import {
  formatPricingPrice, getPublishedPricingExamples, getVisiblePricingExamples,
} from './pricing-publication';

it('requires every section, item and image approval for real prices', () => {
  const content = pricingSchema.parse(buildContract('pricing'));
  const item = content.items[0];
  item.price.context = 'current';
  item.approval = { ...item.approval,
    copy: true, price: true, specifications: true };
  item.image!.approved = true;
  expect(getPublishedPricingExamples(content)).toEqual([]);
  content.copyApproved = true;
  expect(getPublishedPricingExamples(content)).toEqual([item]);
  expect(getVisiblePricingExamples(content)).toEqual([item]);
  for (const key of ['copy', 'price', 'specifications'] as const) {
    item.approval[key] = false;
    expect(getPublishedPricingExamples(content)).toEqual([]);
    item.approval[key] = true;
  }
  item.image!.approved = false;
  expect(getPublishedPricingExamples(content)).toEqual([]);
  item.image = null;
  expect(getPublishedPricingExamples(content)).toEqual([]);
  content.items = [];
  expect(getVisiblePricingExamples(content)).toEqual([]);
});

it('previews only demo entries with images, retaining false approvals', () => {
  const content = pricingSchema.parse(buildContract('pricing'));
  const item = content.items[0];
  content.copyApproved = true;
  content.demoMode = true;
  content.items = [item, { ...item, image: null },
    { ...item, price: { ...item.price, context: 'historical' } }];
  expect(getPublishedPricingExamples(content)).toEqual([]);
  expect(getVisiblePricingExamples(content)).toEqual([item]);
  expect(item.approval.copy).toBe(false);
});

it('formats exact, fractional and range amounts as Russian rubles', () => {
  const { price } = pricingSchema.parse(buildContract('pricing')).items[0];
  expect(formatPricingPrice({ ...price, type: 'exact', amount: 1234.56 }))
    .toBe('1\u00a0234,56\u00a0₽');
  expect(formatPricingPrice({ ...price, type: 'exact', amount: 1000 }))
    .toBe('1\u00a0000\u00a0₽');
  expect(formatPricingPrice({ ...price, type: 'range', min: 1, max: 2.5 }))
    .toBe('1\u00a0₽ – 2,5\u00a0₽');
});
