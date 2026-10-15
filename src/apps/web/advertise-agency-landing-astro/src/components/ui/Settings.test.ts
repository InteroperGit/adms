// Keep a colocated smoke contract for the Settings component.
// @vitest-environment node
import { expect, it } from 'vitest';
import Component from './Settings.astro';

it('exports a renderable component', () => {
  expect(Component).toBeDefined();
});