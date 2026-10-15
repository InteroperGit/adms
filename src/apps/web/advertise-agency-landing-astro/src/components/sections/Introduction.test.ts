// Keep a colocated smoke contract for the Introduction component.
// @vitest-environment node
import { expect, it } from 'vitest';
import Component from './Introduction.astro';

it('exports a renderable component', () => {
  expect(Component).toBeDefined();
});