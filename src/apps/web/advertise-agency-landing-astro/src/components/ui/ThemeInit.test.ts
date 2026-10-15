// Keep a colocated smoke contract for the ThemeInit component.
// @vitest-environment node
import { expect, it } from 'vitest';
import Component from './ThemeInit.astro';

it('exports a renderable component', () => {
  expect(Component).toBeDefined();
});