// @vitest-environment node
import { expect, it } from 'vitest';
import { getByRole } from '@testing-library/dom';
import Component from './Projects.astro';
import { render } from '../../../tests/helpers/render';

it('renders featured projects and the complete catalogue action', async () => {
  const body = await render(Component, {});
  expect(Component).toBeDefined();
  expect(getByRole(body, 'heading', { level: 2 })).toBeInTheDocument();
  expect(body.querySelectorAll('.project-card').length).toBeLessThanOrEqual(3);
  expect(getByRole(body, 'link', { name: /все проекты/i }))
    .toHaveAttribute('href', '/projects/');
});
