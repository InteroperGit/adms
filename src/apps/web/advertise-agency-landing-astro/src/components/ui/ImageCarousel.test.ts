// Keep a colocated smoke contract for the ImageCarousel component.
// @vitest-environment node
import { expect, it } from 'vitest';
import Component from './ImageCarousel.astro';

it('exports a renderable component', () => {
  expect(Component).toBeDefined();
});