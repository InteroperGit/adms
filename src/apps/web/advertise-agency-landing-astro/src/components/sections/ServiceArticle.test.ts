// @vitest-environment node
import { expect, it } from 'vitest';
import { getByRole } from '@testing-library/dom';
import Component from './ServiceArticle.astro';
import { render } from '../../../tests/helpers/render';

it('renders a known demo service with article blocks and disclosure',
  async () => {
    const body = await render(Component, { serviceId: 'svetovye-bukvy' });
    expect(Component).toBeDefined();
    expect(getByRole(body, 'heading', { level: 1 })).toBeInTheDocument();
    expect(body.querySelector('.service-demo')).toBeInTheDocument();
    expect(body.querySelector('.content-block')).toBeInTheDocument();
    expect(body.querySelectorAll('.service-actions a')).not.toHaveLength(0);
    expect(body.querySelector('.service-demo')).toHaveTextContent(/demo/i);
  });

it('fails the render for an unknown service identifier', async () => {
  await expect(render(Component, { serviceId: 'missing-service' }))
    .rejects.toThrow('Unknown service: missing-service');
});
