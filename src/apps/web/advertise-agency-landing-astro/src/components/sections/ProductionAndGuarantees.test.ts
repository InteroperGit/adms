// @vitest-environment node
import { expect, it } from 'vitest';
import { getByRole } from '@testing-library/dom';
import Component from './ProductionAndGuarantees.astro';
import { render } from '../../../tests/helpers/render';

it('renders guidance and keeps unapproved production evidence hidden',
  async () => {
    const body = await render(Component, {});
    expect(Component).toBeDefined();
    expect(getByRole(body, 'heading', { level: 2 })).toBeInTheDocument();
    expect(body.querySelectorAll('.production-guidance .production-card'))
      .not.toHaveLength(0);
    expect(body.querySelector('.production-photos')).toBeNull();
    expect(body.querySelector('.production-groups')).toBeInTheDocument();
    expect(body.querySelector('.production-action a'))
      .toHaveAttribute('href');
  });
