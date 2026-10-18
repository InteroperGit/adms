// @vitest-environment node
import { expect, it } from 'vitest';
import { getByRole } from '@testing-library/dom';
import Component from './OrderingProcess.astro';
import { render } from '../../../tests/helpers/render';

it('renders the authored sequence, responsibilities and inquiry action',
  async () => {
    const body = await render(Component, {});
    expect(Component).toBeDefined();
    expect(getByRole(body, 'heading', { level: 2 })).toBeInTheDocument();
    expect(body.querySelectorAll('ol.ordering-steps > li'))
      .not.toHaveLength(0);
    expect(body.querySelectorAll('.ordering-card h3').length)
      .toBe(body.querySelectorAll('ol.ordering-steps > li').length);
    expect(getByRole(body, 'link', { name: /обсудить задачу/i }))
      .toHaveAttribute('href', '/#order-inquiry');
  });
