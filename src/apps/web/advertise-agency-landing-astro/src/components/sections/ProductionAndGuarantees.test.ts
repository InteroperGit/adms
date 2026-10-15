// Keep a colocated smoke contract for the ProductionAndGuarantees component.
// @vitest-environment node
import { expect, it } from 'vitest';
import Component from './ProductionAndGuarantees.astro';

it('exports a renderable component', () => {
  expect(Component).toBeDefined();
});