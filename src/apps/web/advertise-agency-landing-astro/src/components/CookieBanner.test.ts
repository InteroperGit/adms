// Keep a colocated smoke contract for the CookieBanner component.
// @vitest-environment node
import { expect, it } from 'vitest';
import Component from './CookieBanner.astro';

it('exports a renderable component', () => {
  expect(Component).toBeDefined();
});