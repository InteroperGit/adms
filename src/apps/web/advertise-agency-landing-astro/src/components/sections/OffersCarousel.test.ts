// @vitest-environment node
import { expect, it } from 'vitest';
import Component from './OffersCarousel.astro';
import { render } from '../../../tests/helpers/render';

it('renders enabled offers through the shared carousel contract', async () => {
  const body = await render(Component, {});
  expect(Component).toBeDefined();
  expect(body.querySelector('section#offers')).toBeInTheDocument();
  expect(body.querySelector('image-carousel[role="region"]'))
    .toBeInTheDocument();
  expect(body.querySelectorAll('.carousel-list > *')).not.toHaveLength(0);
});
