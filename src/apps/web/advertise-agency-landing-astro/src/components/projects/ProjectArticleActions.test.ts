// Keep a colocated smoke contract for the ProjectArticleActions component.
// @vitest-environment node
import { expect, it } from 'vitest';
import Component from './ProjectArticleActions.astro';

it('exports a renderable component', () => {
  expect(Component).toBeDefined();
});