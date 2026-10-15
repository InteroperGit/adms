// Keep a colocated smoke contract for the Logo component.
// @vitest-environment node
import { expect, it } from 'vitest';
import Component from './Logo.astro';

it('exports a renderable component', () => {
  expect(Component).toBeDefined();
});