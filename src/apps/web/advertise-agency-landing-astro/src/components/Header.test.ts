// Keep a colocated smoke contract for the Header component.
// @vitest-environment node
import { expect, it } from 'vitest';
import Component from './Header.astro';

it('exports a renderable component', () => {
  expect(Component).toBeDefined();
});