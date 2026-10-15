// Keep a colocated smoke contract for the Footer component.
// @vitest-environment node
import { expect, it } from 'vitest';
import Component from './Footer.astro';

it('exports a renderable component', () => {
  expect(Component).toBeDefined();
});