// Keep a colocated smoke contract for the ServiceArticle component.
// @vitest-environment node
import { expect, it } from 'vitest';
import Component from './ServiceArticle.astro';

it('exports a renderable component', () => {
  expect(Component).toBeDefined();
});