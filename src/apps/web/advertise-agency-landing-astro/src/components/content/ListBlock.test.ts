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
