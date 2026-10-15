// @vitest-environment node
// Gallery links remain usable when the client enhancement is unavailable.
import { expect, it } from 'vitest';
import ImageGallery from './ImageGallery.astro';
import { render } from '../../../tests/helpers/render';

it('renders a main image and one native link per gallery image', async () => {
  const image = (src: string) => ({
    src, alt: 'Gallery image', width: 800, height: 600,
  });
  const body = await render(ImageGallery, { block: {
    type: 'image-gallery', images: [image('/one.webp'), image('/two.webp')],
  } });
  expect(body.querySelector('.gallery-main')).toBeInTheDocument();
  expect(body.querySelectorAll('.gallery-thumbnail')).toHaveLength(2);
  expect(body.querySelector('[data-gallery-dialog]')).toBeInTheDocument();
});
