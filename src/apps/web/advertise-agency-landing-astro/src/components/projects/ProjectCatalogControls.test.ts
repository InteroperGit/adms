// Verify the rendered search and category controls contract.
// @vitest-environment node
import { expect, it } from 'vitest';
import { render } from '../../../tests/helpers/render';
import { projectCategories } from '@/content/project-categories';
import Component from './ProjectCatalogControls.astro';

it('renders labeled search and category filters from config', async () => {
  const body = await render(Component, {
    categories: projectCategories.slice(0, 2),
  });

  const form = body.querySelector('form[role="search"]');
  const search = body.querySelector<HTMLInputElement>('#project-search');
  const select = body.querySelector<HTMLSelectElement>('#project-category');

  expect(form?.hasAttribute('data-catalog-controls')).toBe(true);
  expect(form?.hasAttribute('hidden')).toBe(true);
  expect(search?.name).toBe('q');
  expect(search?.type).toBe('search');
  expect(body.querySelector('label[for="project-search"]')).not.toBeNull();
  expect(select?.name).toBe('category');
  expect(select?.options[0]?.value).toBe('');
  expect([...select!.options].slice(1).map((option) => option.value)).toEqual(
    projectCategories.slice(0, 2).map((category) => category.slug),
  );
});
