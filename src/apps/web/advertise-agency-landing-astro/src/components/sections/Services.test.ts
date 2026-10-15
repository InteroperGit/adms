// Keep a colocated smoke contract for the Services component.
// @vitest-environment node
import { expect, it } from 'vitest';
import Component from './Services.astro';

it('exports a renderable component', () => {
  expect(Component).toBeDefined();
});