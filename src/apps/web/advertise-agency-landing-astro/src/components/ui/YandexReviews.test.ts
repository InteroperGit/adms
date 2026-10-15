// Keep a colocated smoke contract for the YandexReviews component.
// @vitest-environment node
import { expect, it } from 'vitest';
import Component from './YandexReviews.astro';

it('exports a renderable component', () => {
  expect(Component).toBeDefined();
});