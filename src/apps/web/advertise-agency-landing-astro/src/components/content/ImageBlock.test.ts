// @vitest-environment node
// Image blocks keep captions adjacent to their responsive media.
import { expect, it } from 'vitest';
import ImageBlock from './ImageBlock.astro';
import { render } from '../../../tests/helpers/render';

it('renders image alt text, caption and service crop state', async () => {
  const body = await render(ImageBlock, { block: {
    type: 'image', src: '/fixture.webp', alt: 'Fixture', width: 800,
    height: 600, caption: 'Fixture caption',
  }, serviceCrop: true });
  expect(body.querySelector('img')).toHaveAttribute('alt', 'Fixture');
  expect(body.querySelector('figcaption')).toHaveTextContent('Fixture caption');
  expect(body.querySelector('.content-media-service')).toBeInTheDocument();
});
