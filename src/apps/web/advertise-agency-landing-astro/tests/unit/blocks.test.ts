// @vitest-environment node
// Content policy checks cover nested media and fragment integrity.
import { expect, it } from 'vitest';
import { contentBlocksSchema, contentImage, provenance } from
  '../../src/validation/content-blocks';
import {
  assertPublicationPolicy, getPublicationIssues, getVisibleBlocks,
  hasDemoBlocks,
} from '../../src/content/block-publication';
import type { ContentBlock, ContentImage } from
  '../../src/types/content-blocks';

const approval = {
  source: 'Synthetic source', rights: 'Fixture rights',
  approvedBy: 'Fixture reviewer', approvedAt: '2026-10-15',
};
const image: ContentImage = {
  src: '/image.png', alt: 'Synthetic', width: 100, height: 50,
};
const paragraph: ContentBlock = { type: 'paragraph', paragraphs: ['Copy'] };
const blocks: ContentBlock[] = [
  { type: 'heading', level: 2, text: 'Heading', id: 'heading' },
  paragraph,
  { type: 'ordered-list', items: ['One'] },
  { type: 'unordered-list', items: ['One'] },
  { type: 'table', columns: [{ key: 'one', label: 'One' }],
    rows: [{ cells: ['Cell'] }] },
  { type: 'chart', chartType: 'bar', series: [
    { name: 'Series', points: [{ label: 'One', value: 0 }] },
  ] },
  { type: 'image', ...image },
  { type: 'image-gallery', images: [image] },
  { type: 'video', src: '/clip.mp4', alt: 'Clip', width: 100, height: 50 },
  { type: 'order-form', formId: 'general-inquiry', context: 'project' },
  { type: 'quote', text: 'Quote' },
  { type: 'footnote', text: 'Note', targetId: 'heading' },
];

it('validates every block type and rejects empty required collections', () => {
  // Registered form IDs are tested separately from content prose.
  const prose = blocks.filter(block => block.type !== 'order-form');
  expect(contentBlocksSchema.safeParse(prose).success).toBe(true);
  for (const block of prose) {
    expect(contentBlocksSchema.safeParse([{ ...block, type: 'unknown' }])
      .success).toBe(false);
  }
  for (const invalid of [
    { type: 'paragraph', paragraphs: [] },
    { type: 'ordered-list', items: [] },
    { type: 'image-gallery', images: [] },
    { type: 'heading', level: 7, text: 'Heading' },
    { type: 'table', columns: [{ key: 'a', label: 'A' }],
      rows: [{ cells: ['A', 'B'] }] },
    { type: 'video', ...image, src: '/clip.html' },
    { type: 'order-form', context: 'service', formId: 'unknown' },
  ]) expect(contentBlocksSchema.safeParse([invalid]).success).toBe(false);
});

it('rejects duplicate IDs, missing targets and incomplete provenance', () => {
  expect(contentBlocksSchema.safeParse([blocks[0], blocks[0]]).success)
    .toBe(false);
  expect(contentBlocksSchema.safeParse([blocks.at(-1)]).success).toBe(false);
  for (const partial of [
    { source: 'Source', approvedBy: 'Reviewer' },
    { source: 'Source', approvedAt: '2026-10-15' },
    { ...approval, approvedAt: 'yesterday' },
  ]) expect(provenance.safeParse(partial).success).toBe(false);
  expect(provenance.parse(approval)).toEqual(approval);
  expect(contentBlocksSchema.safeParse([{ type: 'video', ...image,
    src: 'https://example.test/clip.webm', status: 'demo' }]).success)
    .toBe(false);
  expect(contentBlocksSchema.safeParse([{ ...paragraph, status: 'published' }])
    .success).toBe(false);
  expect(contentImage.safeParse({ ...image, focalPoint: { x: -1, y: 101 } })
    .success).toBe(false);
  expect(contentImage.safeParse({ ...image, focalPoint: { x: 0, y: 100 } })
    .success).toBe(true);
});

it('removes drafts, empty galleries and transitive dangling notes', () => {
  const source: ContentBlock[] = [
    { ...paragraph, id: 'hidden', status: 'draft' },
    { type: 'footnote', id: 'second', text: 'B', targetId: 'first' },
    { type: 'footnote', id: 'first', text: 'A', targetId: 'hidden' },
    { type: 'image-gallery', images: [{ ...image, status: 'draft' }] },
    { type: 'image-gallery', images: [image, { ...image, status: 'draft' }] },
    { type: 'footnote', text: 'Standalone' },
  ];
  expect(getVisibleBlocks(source)).toEqual([
    { type: 'image-gallery', images: [image] }, source[5],
  ]);
  expect(source[4]).toHaveProperty('images.length', 2);
});

it('detects demo prose, video and nested images after draft filtering', () => {
  for (const block of [
    { ...paragraph, status: 'demo' },
    { type: 'video', ...image, kind: 'demo' },
    { type: 'image', ...image, kind: 'demo' },
    { type: 'image-gallery', images: [{ ...image, status: 'demo' }] },
  ] as ContentBlock[]) expect(hasDemoBlocks([block])).toBe(true);
  expect(hasDemoBlocks([{ ...paragraph, status: 'draft' }])).toBe(false);
  expect(hasDemoBlocks([])).toBe(false);
});

it('enforces approvals and individual media rights for publication', () => {
  for (const block of blocks.filter(b => b.type !== 'order-form')) {
    const published = { ...block, status: 'published', provenance: approval };
    if (published.type === 'image-gallery') {
      published.images = [{ ...image, provenance: approval }];
    }
    expect(getPublicationIssues([published as ContentBlock], 'published'))
      .toEqual([]);
    expect(getPublicationIssues([block], 'published').length)
      .toBeGreaterThan(0);
  }
  expect(getPublicationIssues([{ ...paragraph, status: 'draft' }], 'demo'))
    .toEqual([]);
  const gallery: ContentBlock = {
    type: 'image-gallery', status: 'published', provenance: approval,
    images: [image, { ...image, status: 'draft' }],
  };
  expect(getPublicationIssues([gallery], 'published').map(i => i.message))
    .toEqual(expect.arrayContaining(['Media 1 needs rights',
      'Media 1 needs approval', 'Media 2 is draft']));
  expect(() => assertPublicationPolicy([paragraph], 'demo', 'fixture'))
    .not.toThrow();
  expect(() => assertPublicationPolicy([paragraph], 'published', 'fixture'))
    .toThrow(/fixture:[\s\S]*content.0: Block needs approval/);
});
