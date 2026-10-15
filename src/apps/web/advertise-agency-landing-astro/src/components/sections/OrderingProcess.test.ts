// Keep a colocated smoke contract for the OrderingProcess component.
// @vitest-environment node
import { expect, it } from 'vitest';
import Component from './OrderingProcess.astro';

it('exports a renderable component', () => {
  expect(Component).toBeDefined();
});