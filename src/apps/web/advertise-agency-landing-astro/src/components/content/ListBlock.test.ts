// @vitest-environment node
// List blocks select native ordered or unordered semantics from the type.
import { expect, it } from 'vitest';
import ListBlock from './ListBlock.astro';
import { render } from '../../../tests/helpers/render';

it('renders ordered items with native list semantics', async () => {
  const body = await render(ListBlock, { block: {
    type: 'ordered-list', items: ['First', 'Second'],
  } });
  expect(body.querySelectorAll('ol > li')).toHaveLength(2);
  expect(body.querySelector('ul')).toBeNull();
});

it('renders unordered items as escaped native list content', async () => {
  const body = await render(ListBlock, { block: {
    type: 'unordered-list', items: ['<b>First</b>', 'Second'],
  } });
  expect(body.querySelectorAll('ul > li')).toHaveLength(2);
  expect(body.querySelector('ol')).toBeNull();
  expect(body.querySelector('b')).toBeNull();
  expect(body).toHaveTextContent('<b>First</b>');
});
