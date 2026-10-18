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

it('escapes heading text and supports the document boundary levels',
  async () => {
    const body = await render(HeadingBlock, { block: {
      type: 'heading', level: 6, id: 'safe', text: '<em>Details</em>',
    } });
    expect(body.querySelector('h6#safe')).toHaveTextContent(
      '<em>Details</em>',
    );
    expect(body.querySelector('em')).toBeNull();
  });
