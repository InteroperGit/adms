// @vitest-environment node
// Paragraph links are generated as native anchors from authored text.
import { expect, it } from 'vitest';
import ParagraphBlock from './ParagraphBlock.astro';
import { render } from '../../../tests/helpers/render';

it('renders paragraphs and safe authored links', async () => {
  const body = await render(ParagraphBlock, { block: {
    type: 'paragraph', paragraphs: ['Read https://example.test/guide today.'],
  } });
  expect(body.querySelector('p')).toHaveTextContent('Read');
  expect(body.querySelector('a')).toHaveAttribute(
    'href', 'https://example.test/guide',
  );
});

it('keeps unsafe URL-like text escaped and preserves paragraph boundaries',
  async () => {
    const body = await render(ParagraphBlock, { block: {
      type: 'paragraph', paragraphs: [
        '<strong>unsafe</strong> javascript:alert(1)', 'Second paragraph',
      ],
    } });
    expect(body.querySelectorAll('p')).toHaveLength(2);
    expect(body.querySelector('strong')).toBeNull();
    expect(body.querySelector('a')).toBeNull();
    expect(body).toHaveTextContent('javascript:alert(1)');
  });
