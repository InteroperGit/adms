// @vitest-environment node
import { expect, it } from 'vitest';
import YandexReviews from './YandexReviews.astro';
import { render } from '../../../tests/helpers/render';

const props = {
  organizationId: '123456',
  companyName: 'North Studio',
  reviewsUrl: 'https://yandex.ru/maps/org/123456/reviews/',
  placeholder: {
    src: '/reviews.webp',
    alt: 'Recent customer reviews',
    width: 760,
    height: 700,
  },
};

it('embeds the live reviews widget and keeps its direct link', async () => {
  const body = await render(YandexReviews, { ...props, enabled: true });
  expect(body.querySelector('iframe')).toHaveAttribute(
    'src',
    'https://yandex.ru/maps-reviews-widget/123456?comments',
  );
  expect(body.querySelector('iframe')).toHaveAttribute('loading', 'lazy');
  expect(body.querySelector('img')).toBeNull();
  expect(body.querySelector('a')).toHaveAttribute('href', props.reviewsUrl);
});

it('renders the local placeholder when the widget is disabled', async () => {
  const body = await render(YandexReviews, { ...props, enabled: false });
  expect(body.querySelector('iframe')).toBeNull();
  expect(body.querySelector('img')).toHaveAttribute('src', '/reviews.webp');
  expect(body.querySelector('img')).toHaveAttribute(
    'alt',
    'Recent customer reviews',
  );
});

it('rejects a nonnumeric organization ID', async () => {
  await expect(
    render(YandexReviews, {
      ...props,
      enabled: true,
      organizationId: 'bad-id',
    }),
  ).rejects.toThrow('numeric organization ID');
});
