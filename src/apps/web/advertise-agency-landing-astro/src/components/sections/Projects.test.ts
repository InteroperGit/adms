// Keep a colocated smoke contract for the Projects component.
// @vitest-environment node
import { expect, it, vi } from 'vitest';

vi.mock('@/data/content/projects.json', () => ({ default: [] }));

import Component from './Projects.astro';

it('exports a renderable component', () => {
  expect(Component).toBeDefined();
});
