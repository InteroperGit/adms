import type { PricingContent, PricingPrice } from '../types/pricing';

/** Agency publication always excludes fictional amounts, even after edits. */
export function getPublishedPricingExamples(content: PricingContent) {
  if (!content.copyApproved) return [];
  return content.items.filter((item) =>
    item.price.context !== 'demo'
    && item.approval.specifications && item.approval.copy
    && item.approval.price && item.image?.approved);
}

/** Demo visibility uses explicit demo entries without modifying approvals. */
export function getVisiblePricingExamples(content: PricingContent) {
  if (!content.demoMode) return getPublishedPricingExamples(content);
  return content.items.filter((item) =>
    item.price.context === 'demo' && item.image);
}

const rubles = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/** Format amounts only; callers display context/conditions beside the price. */
export function formatPricingPrice(price: PricingPrice): string {
  if (price.type === 'exact') return rubles.format(price.amount);
  return `${rubles.format(price.min)} – ${rubles.format(price.max)}`;
}
