// Keep a colocated smoke contract for the CarouselControl component.
// @vitest-environment node
import { expect, it } from 'vitest';
import Component from './CarouselControl.astro';

it('exports a renderable component', () => {
  expect(Component).toBeDefined();
});