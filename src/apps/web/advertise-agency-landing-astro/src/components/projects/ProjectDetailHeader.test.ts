// Keep a colocated smoke contract for the ProjectDetailHeader component.
// @vitest-environment node
import { expect, it } from 'vitest';
import Component from './ProjectDetailHeader.astro';

it('exports a renderable component', () => {
  expect(Component).toBeDefined();
});