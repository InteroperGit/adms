// @vitest-environment node
import { expect, it } from 'vitest';
import { getByRole } from '@testing-library/dom';
import ServiceCard from '../../../src/components/cards/ServiceCard.astro';
import { createServicesSchema } from '../../../src/validation/services';
import fixtures from '../../fixtures/content/unit-contracts.json';
import { render } from '../../helpers/render';

const service = () => createServicesSchema(['/services/sample/'])
  .parse(fixtures.services).items[0];

it('labels the article and preserves its title link and copy', async () => {
  const item = service();
  const body = await render(ServiceCard, { service: item });
  expect(getByRole(body, 'article')).toHaveAccessibleName(item.name);
  expect(getByRole(body, 'heading', { level: 3 })).toHaveTextContent(item.name);
  expect(getByRole(body, 'link')).toHaveAttribute('href', item.href);
  expect(body).toHaveTextContent(item.description);
  const image = getByRole(body, 'img', { name: item.image!.alt });
  expect(image).toHaveAttribute('src', item.image!.src);
  expect(image).toHaveAttribute('width', String(item.image!.width));
  expect(image).toHaveAttribute('height', String(item.image!.height));
  expect(image).toHaveAttribute('loading', 'lazy');
  expect(image).toHaveAttribute('decoding', 'async');
  expect(image.parentElement?.getAttribute('style'))
    .toContain('--mobile-focal-point:1% 1%');
});

it('omits the photo frame and link for a text-only service', async () => {
  const item = service();
  item.image = null;
  delete item.href;
  const body = await render(ServiceCard, { service: item });
  expect(body.querySelector('img, .service-photo, a')).toBeNull();
  expect(getByRole(body, 'heading')).toHaveTextContent(item.name);
  expect(body).toHaveTextContent(item.description);
});

it('builds responsive sources for a bundled image', async () => {
  const item = service();
  item.image!.src = '/src/assets/introduction/storefront-sign.webp';
  const body = await render(ServiceCard, { service: item });
  const image = getByRole(body, 'img');
  expect(image.getAttribute('srcset')).toContain('320w');
  expect(image.getAttribute('sizes')).toContain('380px');
  expect(image).toHaveAttribute('alt', item.image!.alt);
});

it('rejects a missing bundled asset with service context', async () => {
  const item = service();
  item.image!.src = '/src/assets/missing.webp';
  await expect(render(ServiceCard, { service: item })).rejects.toThrow(
    `Service image not found (${item.id})`,
  );
});
