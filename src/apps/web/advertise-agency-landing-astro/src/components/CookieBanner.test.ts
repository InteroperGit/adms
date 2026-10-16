// Keep a colocated smoke contract for the CookieBanner component.
// @vitest-environment node
import { expect, it } from 'vitest';
import Component from './CookieBanner.astro';
import { render } from '../../tests/helpers/render';

it('renders two labelled choices and both policy links', async () => {
  const body = await render(Component);
  const banner = body.querySelector('#cookie-banner');

  expect(Component).toBeDefined();
  expect(banner).toBeInTheDocument();
  expect(banner).toHaveAttribute('aria-label');
  expect(banner?.querySelectorAll('[data-cookie-choice]')).toHaveLength(2);
  expect(banner?.querySelector('[data-cookie-choice="declined"]'))
    .toBeInTheDocument();
  expect(banner?.querySelector('[data-cookie-choice="accepted"]'))
    .toBeInTheDocument();
  expect(banner?.querySelector('a[href="/privacy-policy"]'))
    .toBeInTheDocument();
  expect(banner?.querySelector('a[href="/terms-of-use"]'))
    .toBeInTheDocument();
});
