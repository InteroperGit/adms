// @vitest-environment node
// Boundary coverage for every content-block schema and its union.
import { describe, expect, it } from 'vitest';
import f from '../../tests/fixtures/content/content-block-boundaries.json';
import type { ContentBlock } from '../types/content-blocks';
import {
  chartBlock,
  contentBlockSchema,
  contentBlocksSchema,
  contentImage,
  footnoteBlock,
  headingBlock,
  imageBlock,
  imageGalleryBlock,
  orderFormBlock,
  orderedListBlock,
  paragraphBlock,
  provenance,
  quoteBlock,
  tableBlock,
  unorderedListBlock,
  videoBlock,
} from './content-blocks';

const blocks = f as ContentBlock[];

describe('content block contracts', () => {
  it('accepts the versioned fixture through the discriminated union', () => {
    expect(contentBlocksSchema.parse(blocks)).toEqual(blocks);
  });

  it('keeps schema output assignable to the domain block union', () => {
    const output = contentBlockSchema.parse(blocks[0]);
    const typed: ContentBlock = output;
    expect(typed.type).toBe('heading');
  });

  it.each([
    ['heading', headingBlock],
    ['paragraph', paragraphBlock],
    ['ordered list', orderedListBlock],
    ['unordered list', unorderedListBlock],
    ['table', tableBlock],
    ['chart', chartBlock],
    ['image', imageBlock],
    ['gallery', imageGalleryBlock],
    ['video', videoBlock],
    ['order form', orderFormBlock],
    ['quote', quoteBlock],
    ['footnote', footnoteBlock],
  ] as const)('accepts a valid %s', (_name, schema) => {
    const block = blocks.find((item) => schema.safeParse(item).success);
    expect(block).toBeDefined();
    expect(schema.safeParse(block).success).toBe(true);
  });
});

describe('content block boundaries', () => {
  it.each([
    { type: 'heading', level: 0, text: 'Heading' },
    { type: 'paragraph', paragraphs: [] },
    { type: 'ordered-list', items: [' '] },
    { type: 'unordered-list', items: [] },
    { type: 'table', columns: [], rows: [] },
    { type: 'chart', chartType: 'bar', series: [] },
    { type: 'image', src: '/a.png', alt: ' ', width: 1, height: 1 },
    { type: 'image-gallery', images: [] },
    { type: 'video', src: '/a.txt', alt: 'Video', width: 1, height: 1 },
    { type: 'order-form', formId: 'missing', context: 'project' },
    { type: 'quote', text: '' },
    { type: 'footnote', text: 'Note', targetId: 'bad id' },
  ])('rejects an invalid block: $type', (block) => {
    expect(contentBlockSchema.safeParse(block).success).toBe(false);
  });

  it('rejects unknown keys and unsafe media URLs', () => {
    expect(
      contentBlockSchema.safeParse({
        type: 'paragraph',
        paragraphs: ['Copy'],
        extra: true,
      }).success,
    ).toBe(false);
    expect(
      contentImage.safeParse({
        src: 'javascript:alert(1)',
        alt: 'Image',
        width: 1,
        height: 1,
      }).success,
    ).toBe(false);
  });

  it('checks table widths and provenance approval pairs', () => {
    expect(
      tableBlock.safeParse({
        type: 'table',
        columns: [{ key: 'one', label: 'One' }],
        rows: [{ cells: ['One', 'Two'] }],
      }).success,
    ).toBe(false);
    expect(
      provenance.safeParse({
        source: 'Source',
        approvedBy: 'Reviewer',
      }).success,
    ).toBe(false);
    expect(
      provenance.safeParse({
        source: 'Source',
        approvedBy: 'Reviewer',
        approvedAt: 'yesterday',
      }).success,
    ).toBe(false);
  });

  it('rejects duplicate IDs and malformed media status', () => {
    expect(
      contentBlocksSchema.safeParse([
        { type: 'paragraph', id: 'copy', paragraphs: ['One'] },
        { type: 'paragraph', id: 'copy', paragraphs: ['Two'] },
      ]).success,
    ).toBe(false);
    expect(
      contentBlocksSchema.safeParse([
        {
          ...blocks[8],
          status: 'demo',
        },
      ]).success,
    ).toBe(false);
    expect(
      contentBlocksSchema.safeParse([
        {
          type: 'paragraph',
          paragraphs: ['Copy'],
          status: 'published',
        },
      ]).success,
    ).toBe(false);
  });

  it('checks duplicate IDs and missing footnote targets', () => {
    expect(
      contentBlocksSchema.safeParse([
        { type: 'paragraph', id: 'copy', paragraphs: ['One'] },
        { type: 'paragraph', id: 'copy', paragraphs: ['Two'] },
      ]).success,
    ).toBe(false);
    expect(
      contentBlocksSchema.safeParse([
        {
          type: 'footnote',
          text: 'Note',
          targetId: 'missing',
        },
      ]).success,
    ).toBe(false);
  });

  it('reports publication issues during array validation', () => {
    const result = contentBlocksSchema.safeParse([
      {
        type: 'paragraph',
        paragraphs: ['Draft copy'],
        status: 'published',
      },
    ]);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toMatch(/approval/);
    }
  });
});
