// @vitest-environment node
import { expect, it } from 'vitest';
import { getByRole } from '@testing-library/dom';
import Component from './Services.astro';
import { render } from '../../../tests/helpers/render';

it('renders the visible service collection in source order', async () => {
  const body = await render(Component, { items: [
    { id: 'one', name: 'First service', description: 'First', href: '/one/' },
    { id: 'two', name: 'Second service', description: 'Second', href: '/two/' },
  ] });
  expect(Component).toBeDefined();
  expect(getByRole(body, 'heading', { level: 2 })).toBeInTheDocument();
  expect(body.querySelectorAll('.service-card')).toHaveLength(2);
  expect(body.querySelectorAll('.service-title a')[0])
    .toHaveAttribute('href', '/one/');
  expect(body.querySelectorAll('.service-title a')[1])
    .toHaveAttribute('href', '/two/');
});

it('omits the section when the supplied collection is empty', async () => {
  const body = await render(Component, { items: [] });
  expect(body.querySelector('section#services')).toBeNull();
});
