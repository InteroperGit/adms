// Keep a colocated smoke contract for the OrderInquiry component.
// @vitest-environment node
import { expect, it } from 'vitest';
import Component from './OrderInquiry.astro';

it('exports a renderable component', () => {
  expect(Component).toBeDefined();
});