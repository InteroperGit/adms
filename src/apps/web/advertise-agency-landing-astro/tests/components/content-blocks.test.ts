// @vitest-environment node
// Component coverage keeps every content block's semantic and fallback output.
import { expect, it } from 'vitest';
import {
  getAllByRole,
  getByRole,
  queryByRole,
} from '@testing-library/dom';
import ContentBlocks from '../../src/components/content/ContentBlocks.astro';
import fixture from '../fixtures/content/content-blocks.json';
import type { ContentBlock } from '../../src/types/content-blocks';
import { render } from '../helpers/render';

const blocks = fixture as ContentBlock[];

it('renders every block with semantic output and safe links', async () => {
  const body = await render(ContentBlocks, { blocks });

  expect(body.querySelector('h2.content-heading'))
    .toHaveTextContent('Fixture heading');
  expect(getAllByRole(body, 'list')).toHaveLength(3);
  expect(body.querySelector('.content-chart__legend'))
    .toHaveTextContent('Reach');
  expect(getByRole(body, 'table', { name: 'Fixture comparison' }))
    .toHaveTextContent('24');
  expect(getByRole(body, 'img', { name: 'Fixture image' }))
    .toHaveAttribute('alt', 'Fixture image');
  expect(body.querySelector('.content-chart')).toHaveTextContent('12 %');
  expect(body.querySelector('video')).toHaveAttribute('controls');
  expect(getByRole(body, 'blockquote')).toHaveTextContent('A fixture quote.');
  expect(getByRole(body, 'note')).toHaveTextContent('Fixture note.');
  expect(body.querySelector('.footnote-backlink'))
    .toHaveAttribute('href', '#intro');
  expect(getByRole(body, 'link', { name: 'https://example.test/guide' }))
    .toHaveAttribute('href', 'https://example.test/guide');
  expect(body.querySelector('a[href^="javascript:"]')).toBeNull();
  expect(body.querySelector('.content-order-form h2'))
    .toBeInTheDocument();
  expect(body).toHaveTextContent('Fixture transcript');
  expect(body).toHaveTextContent('Fixture gallery');
});

it('keeps drafts out and discloses demo media in the stream', async () => {
  const gallery = blocks[7] as Extract<ContentBlock, {
    type: 'image-gallery';
  }>;
  const demoBlocks: ContentBlock[] = [
    { ...blocks[0], status: 'draft' },
    { ...blocks[6], status: 'demo' },
    { ...gallery, images: [
      { ...gallery.images[0], status: 'draft' },
      { ...gallery.images[1], status: 'demo' },
    ] },
  ];
  const body = await render(ContentBlocks, { blocks: demoBlocks });

  expect(queryByRole(body, 'heading', { name: 'Fixture heading' }))
    .toBeNull();
  expect(body.querySelector('.block-demo-notice')).toBeInTheDocument();
  expect(body.querySelectorAll('img[alt="Two"]')).not.toHaveLength(0);
  expect(queryByRole(body, 'img', { name: 'One' })).toBeNull();
});

it('uses general inquiry when article ownership is absent', async () => {
  const specialized: ContentBlock = {
    type: 'order-form', id: 'specialized', formId: 'led-letters',
    context: 'project', category: 'led-letters', status: 'published',
  };
  const body = await render(ContentBlocks, {
    blocks: [specialized],
    context: { kind: 'project', projectId: 42, category: 'other',
      published: true },
  });

  expect(body.querySelector('.inquiry-link'))
    .toHaveAttribute('href', '/#order-inquiry');
  expect(queryByRole(body, 'form')).toBeNull();
});
