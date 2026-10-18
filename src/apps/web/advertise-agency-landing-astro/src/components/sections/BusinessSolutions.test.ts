// @vitest-environment node
import { expect, it } from 'vitest';
import { getByRole } from '@testing-library/dom';
import Component from './BusinessSolutions.astro';
import { render } from '../../../tests/helpers/render';

it('renders solution order, provenance captions and inquiry actions',
  async () => {
    const body = await render(Component, {});
    expect(Component).toBeDefined();
    expect(getByRole(body, 'heading', { level: 2 })).toBeInTheDocument();
    expect(body.querySelectorAll('.solution-item')).not.toHaveLength(0);
    expect(body.querySelectorAll('.solution-gallery figcaption').length)
      .toBe(body.querySelectorAll('.solution-item').length);
    expect(body.querySelectorAll('.solution-inquiry')).not.toHaveLength(0);
  });
