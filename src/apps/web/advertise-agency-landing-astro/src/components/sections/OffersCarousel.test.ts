// Keep a colocated smoke contract for the OffersCarousel component.
// @vitest-environment node
import { expect, it } from 'vitest';
import Component from './OffersCarousel.astro';

it('exports a renderable component', () => {
  expect(Component).toBeDefined();
});