// @vitest-environment node
import { expect, it } from 'vitest';
import { getByRole, getAllByRole } from '@testing-library/dom';
import Breadcrumbs from '../../../src/components/ui/Breadcrumbs.astro';
import { render } from '../../helpers/render';

it('renders ordered ancestors and one nonlinked current page', async () => {
  const body = await render(Breadcrumbs, {
    items: [{ label: 'Home', href: '/' },
      { label: 'Projects', href: '/projects/' }], current: 'Sample',
  });
  const nav = getByRole(body, 'navigation');
  expect(nav).toHaveAccessibleName('Хлебные крошки');
  expect(getAllByRole(getByRole(nav, 'list'), 'listitem')).toHaveLength(3);
  const links = getAllByRole(nav, 'link');
  expect(links[0]).toHaveAttribute('href', '/');
  expect(links[0]).not.toHaveAttribute('data-project-catalog-return');
  expect(links[1]).toHaveAttribute('href', '/projects/');
  expect(links[1]).toHaveAttribute('data-project-catalog-return');
  const current = nav.querySelector('[aria-current="page"]');
  expect(current).toHaveTextContent('Sample');
  expect(current?.querySelector('a')).toBeNull();
});

it('supports an empty ancestor collection', async () => {
  const body = await render(Breadcrumbs, { items: [], current: 'Home' });
  expect(getAllByRole(body, 'listitem')).toHaveLength(1);
  expect(body.querySelector('a')).toBeNull();
  expect(body.querySelector('[aria-current]')).toHaveTextContent('Home');
});
