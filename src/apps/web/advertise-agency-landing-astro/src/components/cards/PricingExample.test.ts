// @vitest-environment node
import { expect, it } from 'vitest';
import { getByRole, getAllByRole } from '@testing-library/dom';
import PricingExample from './PricingExample.astro';
import { pricingSchema } from '../../../src/validation/pricing';
import fixtures from '../../../tests/fixtures/content/unit-contracts.json';
import { render } from '../../../tests/helpers/render';

const example = () => pricingSchema.parse(fixtures.pricing).items[0];
const labels = { demoPriceLabel: 'Demo price', inquiryLabel: 'Get estimate' };

it('renders specifications, work lists, demo context and named inquiry',
  async () => {
    const item = example();
    item.href = '/projects/42/';
    const body = await render(PricingExample, { example: item, ...labels });
    expect(getByRole(body, 'article')).toHaveAccessibleName(item.title);
    expect(getByRole(body, 'heading', { level: 3 }))
      .toHaveTextContent(item.title);
    expect(body).toHaveTextContent(item.description);
    expect(body).toHaveTextContent(item.dimensions);
    expect(body).toHaveTextContent(item.materials.join(', '));
    const lists = getAllByRole(body, 'list');
    expect(lists[0]).toHaveTextContent(item.includedWork[0]);
    expect(lists[1]).toHaveTextContent(item.exclusions[0]);
    expect(body.querySelector('.pricing-amount'))
      .toHaveTextContent('1 000 ₽');
    expect(body.querySelector('.pricing-context'))
      .toHaveTextContent('Demo price');
    expect(body).toHaveTextContent(item.price.conditions);
    expect(body.querySelector('time')).toBeNull();
    expect(getByRole(body, 'link', { name: `Get estimate: ${item.title}` }))
      .toHaveAttribute('href', '/#order-inquiry');
    expect(getByRole(body, 'link', { name: 'Подробнее о проекте' }))
      .toHaveAttribute('href', item.href);
    const image = getByRole(body, 'img', { name: item.image!.alt });
    expect(image).toHaveAttribute('src', item.image!.src);
    expect(image).toHaveAttribute('width', String(item.image!.width));
    expect(image).toHaveAttribute('height', String(item.image!.height));
    expect(image).toHaveAttribute('loading', 'lazy');
    expect(image).toHaveAttribute('decoding', 'async');
  },
);

it.each([
  ['historical', 'Стоимость выполненного проекта'],
  ['current', 'Ориентировочная стоимость'],
] as const)('shows %s range prices with their reference date',
  async (context, text) => {
    const item = example();
    item.price = { type: 'range', min: 1200, max: 2500, currency: 'RUB',
      context, asOf: '2026-10-15', conditions: 'Before installation' };
    item.image = null;
    const body = await render(PricingExample, { example: item, ...labels });
    expect(body.querySelector('.pricing-amount'))
      .toHaveTextContent('1 200 ₽ – 2 500 ₽');
    expect(body.querySelector('.pricing-context')).toHaveTextContent(text);
    expect(body.querySelector('time'))
      .toHaveAttribute('datetime', '2026-10-15');
    expect(body.querySelector('time')).toHaveTextContent('15.10.2026');
    expect(body.querySelector('img, .pricing-photo')).toBeNull();
    expect(getAllByRole(body, 'link')).toHaveLength(1);
  },
);

it('omits an absent reference date for current estimates', async () => {
  const item = example();
  item.price.context = 'current';
  const body = await render(PricingExample, { example: item, ...labels });
  expect(body.querySelector('time')).toBeNull();
  expect(body.querySelector('.pricing-context'))
    .toHaveTextContent('Ориентировочная стоимость');
});

it('renders a bundled photo with responsive sources and focal points',
  async () => {
    const item = example();
    item.image!.src = '/src/assets/introduction/storefront-sign.webp';
    const body = await render(PricingExample, { example: item, ...labels });
    const image = getByRole(body, 'img');
    expect(image.getAttribute('srcset')).toContain('320w');
    expect(image.getAttribute('sizes')).toContain('360px');
    expect(image.parentElement?.getAttribute('style'))
      .toContain('--desktop-focal-point:1% 1%');
  },
);

it('rejects a missing bundled image with example context', async () => {
  const item = example();
  item.image!.src = '/src/assets/missing.webp';
  await expect(render(PricingExample, { example: item, ...labels }))
    .rejects.toThrow(`Pricing image missing (${item.id})`);
});
