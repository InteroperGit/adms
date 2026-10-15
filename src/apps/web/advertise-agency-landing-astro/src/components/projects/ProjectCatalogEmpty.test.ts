// Keep a colocated smoke contract for the ProjectCatalogEmpty component.
// @vitest-environment node
import { expect, it } from 'vitest';
import Component from './ProjectCatalogEmpty.astro';

it('exports a renderable component', () => {
  expect(Component).toBeDefined();
});