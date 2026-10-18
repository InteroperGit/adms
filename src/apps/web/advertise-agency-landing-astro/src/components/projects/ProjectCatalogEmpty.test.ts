// Verify both initial catalog and filtered search empty states.
// @vitest-environment node
import { expect, it } from 'vitest';
import { render } from '../../../tests/helpers/render';
import Component from './ProjectCatalogEmpty.astro';

it('renders the catalog empty message by default', async () => {
  const body = await render(Component, { type: 'catalog' });
  const section = body.querySelector('section');

  expect(section?.hasAttribute('hidden')).toBe(false);
  expect(section?.hasAttribute('data-catalog-search-empty')).toBe(false);
  expect(section?.getAttribute('aria-labelledby')).toBe('catalog-empty-title');
  expect(section?.querySelector('button')).toBeNull();
});

it('renders the requested hidden search state and reset action', async () => {
  const body = await render(Component, { type: 'search', hidden: true });
  const section = body.querySelector('section');
  const title = section?.querySelector('h2');

  expect(section?.hasAttribute('hidden')).toBe(true);
  expect(section?.hasAttribute('data-catalog-search-empty')).toBe(true);
  expect(section?.getAttribute('aria-labelledby')).toBe(
    'catalog-search-empty-title',
  );
  expect(title?.id).toBe('catalog-search-empty-title');
  expect(
    section?.querySelector('[data-catalog-reset]')?.getAttribute('type'),
  ).toBe('button');
});
