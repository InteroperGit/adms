// Keep a colocated smoke contract for the MobileMenuDialog component.
// @vitest-environment node
import { expect, it } from 'vitest';
import Component from './MobileMenuDialog.astro';

it('exports a renderable component', () => {
  expect(Component).toBeDefined();
});