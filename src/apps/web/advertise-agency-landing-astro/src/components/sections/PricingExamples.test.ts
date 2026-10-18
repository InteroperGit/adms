// @vitest-environment node
import { expect, it, vi } from 'vitest';
import Component from './PricingExamples.astro';
import { render } from '../../../tests/helpers/render';

vi.mock('@/content/pricing', () => ({
  pricing: {
    demoMode: true,
    demoNotice: 'Demo prices',
    demoPriceLabel: 'Demo amount',
    heading: 'Pricing',
    introduction: 'Examples',
    inquiryLabel: 'Ask',
    costFactors: { heading: 'Factors', items: ['Size'] },
    estimateGuidance: { heading: 'Estimate', text: 'Contact us' },
  },
  visiblePricingExamples: [{
    id: 'demo', title: 'Demo scope', description: 'Description',
    dimensions: '2m', materials: ['Aluminium'], includedWork: ['Design'],
    exclusions: ['Power'], source: 'Fixture', href: undefined,
    image: null,
    price: { type: 'exact', amount: 1000, currency: 'RUB', context: 'demo',
      asOf: null, conditions: 'Fixture only' },
    approval: { specifications: false, copy: false, price: false,
      reference: null, verifiedAt: null },
  }],
}));

it('renders visible pricing guidance and demo disclosure', async () => {
  const body = await render(Component, {});
  expect(Component).toBeDefined();
  expect(body.querySelector('section#pricing')).toBeInTheDocument();
  expect(body.querySelector('.pricing-demo')).toHaveTextContent('Demo prices');
  expect(body.querySelectorAll('.pricing-example')).toHaveLength(1);
  expect(body.querySelector('.pricing-guidance')).toBeInTheDocument();
});
