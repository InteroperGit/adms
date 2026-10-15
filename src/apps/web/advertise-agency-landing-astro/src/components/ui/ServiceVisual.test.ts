// Keep a colocated smoke contract for the ServiceVisual component.
// @vitest-environment node
import { expect, it } from 'vitest';
import Component from './ServiceVisual.astro';

it('exports a renderable component', () => {
  expect(Component).toBeDefined();
});