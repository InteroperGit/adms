// Keep a colocated smoke contract for the MaxLogo component.
// @vitest-environment node
import { expect, it } from 'vitest';
import Component from './MaxLogo.astro';

it('exports a renderable component', () => {
  expect(Component).toBeDefined();
});