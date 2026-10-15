// Keep a colocated smoke contract for the NavLinks component.
// @vitest-environment node
import { expect, it } from 'vitest';
import Component from './NavLinks.astro';

it('exports a renderable component', () => {
  expect(Component).toBeDefined();
});