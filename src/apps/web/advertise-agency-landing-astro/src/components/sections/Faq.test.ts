// Keep a colocated smoke contract for the Faq component.
// @vitest-environment node
import { expect, it } from 'vitest';
import Component from './Faq.astro';

it('exports a renderable component', () => {
  expect(Component).toBeDefined();
});