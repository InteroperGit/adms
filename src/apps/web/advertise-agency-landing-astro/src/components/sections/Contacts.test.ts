// Keep a colocated smoke contract for the Contacts component.
// @vitest-environment node
import { expect, it } from 'vitest';
import Component from './Contacts.astro';

it('exports a renderable component', () => {
  expect(Component).toBeDefined();
});