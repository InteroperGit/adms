// @vitest-environment node
// Footnotes retain a native fragment link for keyboard and no-JS use.
import { expect, it } from 'vitest';
import FootnoteBlock from './FootnoteBlock.astro';
import { render } from '../../../tests/helpers/render';

it('renders reference text and a backlink when a target exists', async () => {
  const body = await render(FootnoteBlock, { block: {
    type: 'footnote', reference: '1', text: 'Source note', targetId: 'intro',
  } });
  expect(body.querySelector('[role="note"]')).toHaveTextContent('Source note');
  expect(body.querySelector('.footnote-backlink'))
    .toHaveAttribute('href', '#intro');
});

it('omits optional reference and backlink fields when absent', async () => {
  const body = await render(FootnoteBlock, { block: {
    type: 'footnote', reference: '', text: '<b>Note</b>', targetId: '',
  } });
  expect(body.querySelector('strong, a')).toBeNull();
  expect(body.querySelector('b')).toBeNull();
  expect(body).toHaveTextContent('<b>Note</b>');
});
