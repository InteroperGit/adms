// Keep a colocated smoke contract for the ProjectCatalogGrid component.
// @vitest-environment node
import { expect, it } from 'vitest';
import Component from './ProjectCatalogGrid.astro';

it('exports a renderable component', () => {
  expect(Component).toBeDefined();
});