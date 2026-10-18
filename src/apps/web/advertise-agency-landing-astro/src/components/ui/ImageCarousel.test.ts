// @vitest-environment node
import { expect, it } from 'vitest';
import ImageCarousel from './ImageCarousel.astro';
import { render } from '../../../tests/helpers/render';

const items = [
  {
    id: 1,
    image: '/one.webp',
    imageAlt: 'First',
    imageWidth: 800,
    imageHeight: 600,
    enabled: true,
  },
  {
    id: 2,
    image: '/two.webp',
    imageAlt: 'Second',
    imageWidth: 800,
    imageHeight: 600,
    enabled: false,
  },
  {
    id: 3,
    image: '/three.webp',
    imageAlt: 'Third',
    imageWidth: 800,
    imageHeight: 600,
    enabled: true,
  },
];

it('filters slides and maps controls to enabled slide IDs', async () => {
  const body = await render(ImageCarousel, {
    id: 'work-carousel',
    label: 'Selected work',
    slideIdPrefix: 'work',
    items,
  });
  const carousel = body.querySelector('image-carousel');

  expect(carousel).toHaveAttribute('aria-label', 'Selected work');
  expect(body.querySelectorAll('.carousel-slide')).toHaveLength(2);
  expect(body.querySelector('#work-1')).toBeInTheDocument();
  expect(body.querySelector('#work-2')).not.toBeInTheDocument();
  expect(body.querySelector('#work-3')).toBeInTheDocument();
  expect(body.querySelectorAll('.carousel-dot')).toHaveLength(2);
  expect(body.querySelector('[aria-controls="work-3"]')).toBeInTheDocument();
});

it('uses passive dots and omits hidden or disabled controls', async () => {
  const passive = await render(ImageCarousel, {
    id: 'passive',
    label: 'Passive',
    items,
    options: { manualNavigation: false, arrows: true },
  });
  expect(passive.querySelectorAll('button.carousel-arrow')).toHaveLength(0);
  expect(passive.querySelector('.carousel-dots')).toHaveAttribute(
    'aria-hidden',
    'true',
  );

  const disabled = await render(ImageCarousel, {
    id: 'disabled',
    label: 'Disabled',
    items,
    options: { enabled: false },
  });
  expect(disabled.querySelector('image-carousel')).toBeNull();
});

it('uses the default slide prefix and omits one-slide controls', async () => {
  const body = await render(ImageCarousel, {
    id: 'single',
    label: 'Single image',
    items: [items[0]],
  });
  expect(body.querySelector('#single-slide-1')).toBeInTheDocument();
  expect(body.querySelector('.carousel-controls')).toBeNull();
  expect(body.querySelector('[role="status"]')).toBeNull();
});

it('renders runtime options and independent control settings', async () => {
  const body = await render(ImageCarousel, {
    id: 'options',
    label: 'Options',
    items,
    options: {
      autoplay: false,
      intervalMs: 9000,
      arrows: false,
      circles: true,
      animation: false,
      layout: 'panel',
      imageFit: 'contain',
      aspectRatio: 1.5,
    },
  });
  const carousel = body.querySelector('image-carousel');
  expect(carousel).toHaveAttribute('data-autoplay', 'false');
  expect(carousel).toHaveAttribute('data-interval', '9000');
  expect(carousel).toHaveAttribute('data-animation', 'false');
  expect(carousel).toHaveAttribute('data-layout', 'panel');
  expect(carousel).toHaveAttribute('data-arrows', 'false');
  expect(carousel).toHaveAttribute('data-circles', 'true');
  expect(carousel).toHaveStyle({
    '--image-fit': 'contain',
    '--panel-ratio': '1.5',
  });
  expect(body.querySelectorAll('.carousel-dot')).toHaveLength(2);
  expect(body.querySelector('.carousel-arrow')).toBeNull();
});

it.each([
  { id: '', label: 'Named carousel' },
  { id: 'valid-id', label: '   ' },
])('rejects invalid carousel identity %#', async ({ id, label }) => {
  await expect(render(ImageCarousel, { id, label, items })).rejects.toThrow(
    'unique HTML id and a label',
  );
});

it('renders no carousel when every item is disabled', async () => {
  const body = await render(ImageCarousel, {
    id: 'empty',
    label: 'Empty',
    items: [items[1]],
  });
  expect(body.querySelector('image-carousel')).toBeNull();
});
