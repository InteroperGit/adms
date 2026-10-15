// @vitest-environment node
// Heading blocks preserve the authored level and fragment target.
import { expect, it } from 'vitest';
import HeadingBlock from './HeadingBlock.astro';
import { render } from '../../../tests/helpers/render';

it('renders the requested heading level and id', async () => {
  const body = await render(HeadingBlock, { block: {
    type: 'heading', level: 3, id: 'details', text: 'Details',
  } });
  expect(body.querySelector('h3#details')).toHaveTextContent('Details');
});
