// Verify native return and contact actions for project article pages.
// @vitest-environment node
import { expect, it } from 'vitest';
import { render } from '../../../tests/helpers/render';
import Component from './ProjectArticleActions.astro';

it('renders the catalog fallback and supplied contact label', async () => {
  const body = await render(Component, { contactLabel: 'Discuss a project' });
  const links = [...body.querySelectorAll<HTMLAnchorElement>('a')];

  expect(links[0]?.getAttribute('href')).toBe('/projects/');
  expect(links[0]?.hasAttribute('data-project-catalog-return')).toBe(true);
  expect(links[1]?.getAttribute('href')).toBe('/#contacts');
  expect(links[1]?.textContent).toBe('Discuss a project');
});
