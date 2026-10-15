// Keep a colocated smoke contract for the ProjectCatalogCount component.
// @vitest-environment node
import { expect, it } from 'vitest';
import Component from './ProjectCatalogCount.astro';

it('exports a renderable component', () => {
  expect(Component).toBeDefined();
});