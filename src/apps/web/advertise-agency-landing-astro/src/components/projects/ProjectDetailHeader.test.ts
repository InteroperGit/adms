// Verify project title, attribution fields, and optional milestone date.
// @vitest-environment node
import { expect, it } from 'vitest';
import { buildProject } from '../../../tests/helpers/fixtures';
import { render } from '../../../tests/helpers/render';
import Component from './ProjectDetailHeader.astro';

it('renders the supplied title, client, and valid date metadata', async () => {
  const project = buildProject({
    title: 'Storefront refresh',
    client: 'North Market',
    date: '2025-04-18',
  });
  const body = await render(Component, { project });

  expect(body.querySelector('h1')?.textContent).toBe('Storefront refresh');
  expect(body.querySelector('dt')?.textContent).toBe('Заказчик');
  expect(body.querySelector('dd')?.textContent).toBe('North Market');
  expect(body.querySelector('time')?.getAttribute('datetime')).toBe(
    '2025-04-18',
  );
  expect(body.querySelector('time')?.textContent).toBe('2025-04-18');
});

it('shows the fallback when a project date is not provided', async () => {
  const body = await render(Component, {
    project: buildProject({ date: undefined }),
  });

  expect(body.querySelector('time')).toBeNull();
  expect(body.textContent).toContain('Уточняется');
});
