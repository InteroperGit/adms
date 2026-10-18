// Verify pagination links, boundary states, and query preservation.
// @vitest-environment node
import { expect, it } from 'vitest';
import { render } from '../../../tests/helpers/render';
import Component from './ProjectCatalogPagination.astro';

const pageHref = (page: number) =>
  `/projects/page/${page}/?q=neon&category=signs`;

it('renders the first page boundary and current-page marker', async () => {
  const body = await render(Component, {
    items: [1, 2, 3],
    currentPage: 1,
    pageCount: 3,
    pageHref,
    pageSize: 8,
  });
  const links = [...body.querySelectorAll<HTMLAnchorElement>('a')];

  expect(body.querySelector('nav')?.getAttribute('data-page-size')).toBe('8');
  expect(body.querySelector('nav')?.hasAttribute('hidden')).toBe(false);
  expect(links[0]?.hasAttribute('href')).toBe(false);
  expect(links[0]?.getAttribute('aria-disabled')).toBe('true');
  expect(links[1]?.getAttribute('aria-current')).toBe('page');
  expect(links[2]?.href).toContain('?q=neon&category=signs');
});

it('renders ellipses, middle pages, and a last-page boundary', async () => {
  const body = await render(Component, {
    items: [1, 'ellipsis', 4, 5, 6, 'ellipsis', 10],
    currentPage: 10,
    pageCount: 10,
    pageHref,
    pageSize: 8,
  });
  const nav = body.querySelector('nav');
  const links = [...body.querySelectorAll<HTMLAnchorElement>('a')];

  expect(nav?.querySelectorAll('[aria-hidden="true"]')).toHaveLength(2);
  expect(links.map((link) => link.textContent)).toEqual([
    '←',
    '1',
    '4',
    '5',
    '6',
    '10',
    '→',
  ]);
  expect(links[1]?.href).toContain('/projects/page/1/');
  expect(links[4]?.href).toContain('/projects/page/6/');
  expect(links[5]?.getAttribute('aria-current')).toBe('page');
  expect(links.at(-1)?.hasAttribute('href')).toBe(false);
  expect(links.at(-1)?.getAttribute('aria-disabled')).toBe('true');
});

it('hides pagination when the catalog has one page', async () => {
  const body = await render(Component, {
    items: [1],
    currentPage: 1,
    pageCount: 1,
    pageHref,
    pageSize: 8,
  });

  expect(body.querySelector('nav')?.hasAttribute('hidden')).toBe(true);
});
