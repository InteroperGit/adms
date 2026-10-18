// @vitest-environment node
// Quotes expose authored text and attribution with figure semantics.
import { expect, it } from 'vitest';
import QuoteBlock from './QuoteBlock.astro';
import { render } from '../../../tests/helpers/render';

it('renders quotation attribution when supplied', async () => {
  const body = await render(QuoteBlock, { block: {
    type: 'quote', text: 'A useful quote.', author: 'Author', source: 'Source',
  } });
  expect(body.querySelector('blockquote')).toHaveTextContent('A useful quote.');
  expect(body.querySelector('figcaption')).toHaveTextContent('Author');
  expect(body.querySelector('cite')).toHaveTextContent('Source');
});

it.each([
  [{ author: 'Author' }, 'Author'],
  [{ source: 'Source' }, 'Source'],
  [{}, null],
] as const)('supports optional attribution fields: %s',
  async (fields, text) => {
  const body = await render(QuoteBlock, { block: {
    type: 'quote', text: '<i>Quote</i>', ...fields,
  } });
  expect(body.querySelector('i')).toBeNull();
  if (text) {
    expect(body.querySelector('figcaption')).toBeInTheDocument();
  } else {
    expect(body.querySelector('figcaption')).toBeNull();
  }
});
