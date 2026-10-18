// @vitest-environment node
import { expect, it } from 'vitest';
import { getByRole } from '@testing-library/dom';
import Component from './Introduction.astro';
import { render } from '../../../tests/helpers/render';

it('renders the heading, location, action and optional photo branch',
  async () => {
    const body = await render(Component, {});
    expect(Component).toBeDefined();
    expect(getByRole(body, 'heading', { level: 1 })).toBeInTheDocument();
    expect(body.querySelector('.introduction-summary')).toBeInTheDocument();
    expect(body.querySelector('.introduction-location')).toBeInTheDocument();
    expect(getByRole(body, 'link')).toHaveAttribute('href');
    expect(body.querySelector('.introduction-photo, img')).toBeNull();
  });
