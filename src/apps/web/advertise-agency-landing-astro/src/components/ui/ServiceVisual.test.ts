// @vitest-environment node
import { expect, it } from 'vitest';
import ServiceVisual from './ServiceVisual.astro';
import { render } from '../../../tests/helpers/render';

const image = {
  src: '/fixture.webp',
  alt: 'Illuminated shop sign',
  width: 1200,
  height: 900,
  source: 'Project photo',
  projectContext: 'Street shop',
  publicationPermission: 'Approved',
  approved: true,
  desktopFocalPoint: { x: 64, y: 35 },
  mobileFocalPoint: { x: 45, y: 72 },
};

it('uses lazy loading and configured focal crops by default', async () => {
  const body = await render(ServiceVisual, { image });
  expect(body.querySelector('img')).toHaveAttribute('loading', 'lazy');
  expect(body.querySelector('img')).toHaveAttribute('fetchpriority', 'auto');
  expect(body.querySelector('.service-photo')).toHaveStyle({
    '--desktop-focal-point': '64% 35%',
    '--mobile-focal-point': '45% 72%',
  });
});

it('eager-loads priority service imagery', async () => {
  const body = await render(ServiceVisual, { image, eager: true });
  expect(body.querySelector('img')).toHaveAttribute('loading', 'eager');
  expect(body.querySelector('img')).toHaveAttribute('fetchpriority', 'high');
});
