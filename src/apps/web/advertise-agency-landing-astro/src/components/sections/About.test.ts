// Keep a colocated smoke contract for the About component.
// @vitest-environment node
import { expect, it } from 'vitest';
import Component from './About.astro';

it('exports a renderable component', () => {
  expect(Component).toBeDefined();
});