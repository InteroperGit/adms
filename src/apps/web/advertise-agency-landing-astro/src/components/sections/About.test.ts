// @vitest-environment node
import { expect, it } from 'vitest';
import { getByRole } from '@testing-library/dom';
import Component from './About.astro';
import { render } from '../../../tests/helpers/render';

it('renders agency copy, actions and supplied statistics', async () => {
  const body = await render(Component, {});
  expect(Component).toBeDefined();
  expect(getByRole(body, 'heading', { level: 2 })).toBeInTheDocument();
  expect(body.querySelectorAll('.opening-stats dt')).not.toHaveLength(0);
  expect(body.querySelectorAll('.opening-stats dd')).not.toHaveLength(0);
  expect(body.querySelectorAll('.opening-actions a')).toHaveLength(1);
  expect(body.querySelector('.opening-actions a'))
    .toHaveAttribute('href', '/#contacts');
});
