// @vitest-environment node
import { expect, it } from 'vitest';
import { getByRole } from '@testing-library/dom';
import Component from './Contacts.astro';
import { render } from '../../../tests/helpers/render';

it('renders contact links and the configured map branch', async () => {
  const body = await render(Component, {});
  expect(Component).toBeDefined();
  expect(getByRole(body, 'heading', { level: 2 })).toBeInTheDocument();
  expect(body.querySelector('.contact-info')).toBeInTheDocument();
  expect(body.querySelector('a[href^="tel:"]')).toBeInTheDocument();
  expect(body.querySelector('a[href^="mailto:"]')).toBeInTheDocument();
  expect(body.querySelector('.contact-map iframe, .contact-map img'))
    .toBeInTheDocument();
});
