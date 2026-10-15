// Keep a colocated smoke contract for the PricingExamples component.
// @vitest-environment node
import { expect, it, vi } from 'vitest';

vi.mock('@/data/content/projects.json', () => ({ default: [] }));
vi.mock('@/content/pricing', () => ({
  pricing: {},
  visiblePricingExamples: [],
}));

import Component from './PricingExamples.astro';

it('exports a renderable component', () => {
  expect(Component).toBeDefined();
});
