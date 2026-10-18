// Verify project order, search fields, category markers, and page slicing.
// @vitest-environment node
import { expect, it } from 'vitest';
import { buildProject } from '../../../tests/helpers/fixtures';
import { render } from '../../../tests/helpers/render';
import { projectCategories } from '@/content/project-categories';
import Component from './ProjectCatalogGrid.astro';

const firstCategory = projectCategories[0];

it('renders ordered cards with search and category markers', async () => {
  const projects = [
    buildProject({
      id: 21,
      category: firstCategory.slug,
      title: 'North sign',
      client: 'North client',
      description: 'Bright entrance',
    }),
    buildProject({
      id: 22,
      category: null,
      title: 'South sign',
      client: 'South client',
      description: 'Office facade',
    }),
  ];
  const body = await render(Component, { projects, page: 1, pageSize: 10 });
  const cards = [...body.querySelectorAll('[data-project-card]')];

  expect(cards).toHaveLength(2);
  expect(cards.map((card) => card.querySelector('h3')?.textContent)).toEqual([
    'North sign',
    'South sign',
  ]);
  expect(cards[0]?.getAttribute('data-category')).toBe(firstCategory.slug);
  expect(cards[0]?.getAttribute('data-search')).toContain('North sign');
  expect(cards[0]?.getAttribute('data-search')).toContain('North client');
  expect(cards[0]?.getAttribute('data-search')).toContain('Bright entrance');
  expect(cards[0]?.getAttribute('data-search')).toContain(firstCategory.label);
  expect(cards[1]?.getAttribute('data-category')).toBe('');
  expect(cards[1]?.getAttribute('data-search')).not.toContain('undefined');
});

it('hides cards outside the requested server-rendered page', async () => {
  const projects = [11, 12, 13].map((id) => buildProject({ id }));
  const body = await render(Component, { projects, page: 2, pageSize: 2 });
  const cards = [...body.querySelectorAll('[data-project-card]')];

  expect(cards.map((card) => card.hasAttribute('hidden'))).toEqual([
    true,
    true,
    false,
  ]);
});
