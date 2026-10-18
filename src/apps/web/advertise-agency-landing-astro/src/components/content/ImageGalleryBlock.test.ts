// @vitest-environment node
// The gallery block provides a stable wrapper around the interactive gallery.
import { expect, it } from 'vitest';
import ImageGalleryBlock from './ImageGalleryBlock.astro';
import { render } from '../../../tests/helpers/render';

it('renders the gallery surface and its image links', async () => {
  const body = await render(ImageGalleryBlock, { block: {
    type: 'image-gallery', images: [{
      src: '/one.webp', alt: 'Gallery image', width: 800, height: 600,
    }],
  } });
  expect(body.querySelector('.image-gallery-block')).toBeInTheDocument();
  expect(body.querySelector('.gallery-thumbnail')).toBeInTheDocument();
});

it('passes a gallery caption through to the interactive surface', async () => {
  const body = await render(ImageGalleryBlock, { block: {
    type: 'image-gallery', caption: 'Project views', images: [{
      src: '/one.webp', alt: 'Gallery image', width: 800, height: 600,
    }],
  } });
  expect(body.querySelector('.content-gallery > figcaption'))
    .toHaveTextContent('Project views');
});
