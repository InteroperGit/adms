// Keep a colocated smoke contract for the ProjectCatalogControls component.
// @vitest-environment node
import { expect, it } from 'vitest';
import Component from './ProjectCatalogControls.astro';

it('exports a renderable component', () => {
  expect(Component).toBeDefined();
});