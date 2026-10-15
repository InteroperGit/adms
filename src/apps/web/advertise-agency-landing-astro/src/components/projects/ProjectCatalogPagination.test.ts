// Keep a colocated smoke contract for the ProjectCatalogPagination component.
// @vitest-environment node
import { expect, it } from 'vitest';
import Component from './ProjectCatalogPagination.astro';

it('exports a renderable component', () => {
  expect(Component).toBeDefined();
});