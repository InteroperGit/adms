// Verify the live result count contract rendered for screen readers.
// @vitest-environment node
import { expect, it } from 'vitest';
import { render } from '../../../tests/helpers/render';
import Component from './ProjectCatalogCount.astro';

it('renders the supplied count in a polite status region', async () => {
  const body = await render(Component, { count: 12 });
  const status = body.querySelector('[data-catalog-count]');

  expect(status?.getAttribute('role')).toBe('status');
  expect(status?.getAttribute('aria-live')).toBe('polite');
  expect(status?.querySelector('[data-catalog-count-value]')?.textContent).toBe(
    '12',
  );
});
