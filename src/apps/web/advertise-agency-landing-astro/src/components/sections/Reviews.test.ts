// @vitest-environment node
import { expect, it } from 'vitest';
import { getByRole } from '@testing-library/dom';
import Component from './Reviews.astro';
import { render } from '../../../tests/helpers/render';

it('renders the configured review provider branch and section heading',
  async () => {
    const body = await render(Component, {});
    expect(Component).toBeDefined();
    expect(getByRole(body, 'heading', { level: 2 })).toBeInTheDocument();
    expect(body.querySelector('.yandex-reviews')).toBeInTheDocument();
    expect(body.querySelector(
      '.yandex-reviews-frame, .yandex-reviews-placeholder',
    ))
      .toBeInTheDocument();
  });
