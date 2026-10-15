// @vitest-environment node
// Content media exposes intrinsic dimensions and authored focal points.
import { expect, it } from 'vitest';
import ContentImage from './ContentImage.astro';
import { render } from '../../../tests/helpers/render';

it('renders public media with reserved geometry and metadata', async () => {
  const body = await render(ContentImage, { image: {
    src: '/fixture.webp', alt: 'Fixture', width: 800, height: 600,
    focalPoint: { x: 20, y: 30 }, caption: 'Caption',
  }, priority: true });
  const frame = body.querySelector('.content-media-frame');
  expect(frame).toHaveAttribute('data-image-state', 'loading');
  expect(frame).toHaveStyle('--media-position: 20% 30%');
  expect(body.querySelector('img')).toHaveAttribute('alt', 'Fixture');
  expect(body.querySelector('img')).toHaveAttribute('loading', 'eager');
});
