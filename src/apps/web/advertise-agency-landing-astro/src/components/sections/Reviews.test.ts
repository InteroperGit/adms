// Keep a colocated smoke contract for the Reviews component.
// @vitest-environment node
import { expect, it } from 'vitest';
import Component from './Reviews.astro';

it('exports a renderable component', () => {
  expect(Component).toBeDefined();
});