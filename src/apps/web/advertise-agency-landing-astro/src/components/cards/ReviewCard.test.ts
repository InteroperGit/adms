// @vitest-environment node
import { expect, it } from 'vitest';
import { getByRole } from '@testing-library/dom';
import ReviewCard from './ReviewCard.astro';
import fixtures from '../../../tests/fixtures/content/unit-contracts.json';
import { render } from '../../../tests/helpers/render';

it('renders a quotation with attributed portrait and reserved dimensions',
  async () => {
    const review = fixtures.reviews[0];
    const body = await render(ReviewCard, { review });
    const figure = getByRole(body, 'figure');
    expect(figure.querySelector('blockquote > p'))
      .toHaveTextContent(review.text);
    const caption = figure.querySelector('figcaption');
    expect(caption).toHaveTextContent(review.name);
    expect(caption).toHaveTextContent(`${review.position}, ${review.company}`);
    const image = getByRole(body, 'img', { name: review.avatarAlt });
    expect(image.closest('figcaption')).toBe(caption);
    expect(image).toHaveAttribute('src', review.avatar);
    expect(image).toHaveAttribute('width', String(review.avatarWidth));
    expect(image).toHaveAttribute('height', String(review.avatarHeight));
    expect(image).toHaveAttribute('loading', 'lazy');
    expect(image).toHaveAttribute('decoding', 'async');
  },
);

it('escapes supplied quotation and attribution as text', async () => {
  const review = { ...fixtures.reviews[0],
    text: '<script>unsafe()</script>', name: '<b>Author</b>' };
  const body = await render(ReviewCard, { review });
  expect(body.querySelector('script, b')).toBeNull();
  expect(body.querySelector('blockquote')).toHaveTextContent(review.text);
  expect(body.querySelector('figcaption')).toHaveTextContent(review.name);
});
