// Keep a colocated smoke contract for the ImageCarouselSlide component.
// @vitest-environment node
import { expect, it } from 'vitest';
import Component from './ImageCarouselSlide.astro';

it('exports a renderable component', () => {
  expect(Component).toBeDefined();
});