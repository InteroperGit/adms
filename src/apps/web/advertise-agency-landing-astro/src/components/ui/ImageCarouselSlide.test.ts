// @vitest-environment node
import { expect, it } from 'vitest';
import ImageCarouselSlide from './ImageCarouselSlide.astro';
import { render } from '../../../tests/helpers/render';

const item = {
  id: 7,
  enabled: true,
  image: '/fixture.webp',
  imageAlt: 'Shop sign',
  imageWidth: 1200,
  imageHeight: 800,
  description: 'Made for the shop',
  href: '/projects/shop',
  linkLabel: 'View project',
  presentation: {
    focalPoint: { x: 62, y: 38 },
    mobileFocalPoint: { x: 48, y: 70 },
    fontSizeRem: 1.25,
    textColor: '#ffffff',
    overlay: 'dark',
    horizontal: 'right',
    vertical: 'top',
  },
};
const options = {
  enabled: true,
  autoplay: true,
  intervalMs: 7000,
  manualNavigation: true,
  arrows: true,
  circles: true,
  descriptions: true,
  buttons: true,
  animation: true,
  layout: 'panel' as const,
  imageFit: 'contain' as const,
  aspectRatio: 4 / 3,
  eagerFirst: true,
};

it('renders image loading, focal crops and enabled copy', async () => {
  const body = await render(ImageCarouselSlide, {
    id: 'slide-7',
    item,
    index: 0,
    total: 2,
    itemLabel: 'Image',
    options,
  });
  const slide = body.querySelector('article');
  const image = body.querySelector('img');

  expect(slide).toHaveAttribute('id', 'slide-7');
  expect(slide).toHaveStyle({
    '--focal-point': '62% 38%',
    '--mobile-focal-point': '48% 70%',
  });
  expect(image).toHaveAttribute('loading', 'eager');
  expect(image).toHaveAttribute('alt', 'Shop sign');
  expect(body.querySelector('.carousel-stage')).toHaveAttribute(
    'data-horizontal',
    'right',
  );
  expect(body.querySelector('.carousel-copy')).toHaveTextContent(
    'Made for the shop',
  );
  expect(body.querySelector('a')).toHaveAttribute('href', '/projects/shop');
});

it('lazy-loads later slides and omits disabled copy options', async () => {
  const body = await render(ImageCarouselSlide, {
    id: 'slide-8',
    item,
    index: 1,
    total: 2,
    itemLabel: 'Image',
    options: {
      ...options,
      eagerFirst: true,
      descriptions: false,
      buttons: false,
    },
  });
  expect(body.querySelector('img')).toHaveAttribute('loading', 'lazy');
  expect(body.querySelector('.carousel-stage')).toBeNull();
});

it('uses desktop focal point when there is no mobile override', async () => {
  const noMobileCrop = {
    ...item,
    presentation: { ...item.presentation, mobileFocalPoint: undefined },
  };
  const body = await render(ImageCarouselSlide, {
    id: 'slide-9',
    item: noMobileCrop,
    index: 1,
    total: 3,
    itemLabel: 'Image',
    options: { ...options, eagerFirst: false },
  });
  expect(body.querySelector('img')).toHaveAttribute('loading', 'lazy');
  expect(body.querySelector('article')).toHaveStyle({
    '--focal-point': '62% 38%',
    '--mobile-focal-point': '62% 38%',
  });
});

it('omits the call to action when no link is supplied', async () => {
  const noLink = { ...item, href: undefined, linkLabel: undefined };
  const body = await render(ImageCarouselSlide, {
    id: 'slide-10',
    item: noLink,
    index: 0,
    total: 1,
    itemLabel: 'Image',
    options,
  });
  expect(body.querySelector('.carousel-copy')).toHaveTextContent(
    'Made for the shop',
  );
  expect(body.querySelector('a')).toBeNull();
});
