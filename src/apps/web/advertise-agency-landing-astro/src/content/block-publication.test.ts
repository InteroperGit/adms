// Editorial gates must preserve safe visibility and independent media review.
import { expect, it } from 'vitest';
import { buildContentBlocks } from '../../tests/helpers/fixtures';
import type { ContentBlock } from '../types/content-blocks';
import {
  assertPublicationPolicy, blockDemoNotice, getPublicationIssues,
  getVisibleBlocks, hasDemoBlocks,
} from './block-publication';

const approved = {
  source: 'Evidence',
  approvedBy: 'Reviewer', approvedAt: '2026-10-16', rights: 'Licensed',
};
const paragraph: ContentBlock = { type: 'paragraph', paragraphs: ['Copy'] };

it('removes nested drafts, empty galleries and dangling note chains', () => {
  const gallery = buildContentBlocks().find(b => b.type === 'image-gallery')!;
  if (gallery.type !== 'image-gallery') throw new Error('Missing gallery');
  gallery.images[0].status = 'draft';
  const blocks: ContentBlock[] = [
    { ...paragraph, id: 'hidden', status: 'draft' },
    gallery,
    { ...gallery, id: 'empty', images: [gallery.images[0]] },
    { type: 'footnote', id: 'first', text: 'Note', targetId: 'hidden' },
    { type: 'footnote', id: 'second', text: 'Note', targetId: 'first' },
    { type: 'footnote', text: 'Independent' },
    { type: 'footnote', text: 'Gallery note', targetId: gallery.id },
  ];
  const snapshot = structuredClone(blocks);
  expect(getVisibleBlocks(blocks)).toEqual([
    { ...gallery, images: [gallery.images[1]] }, blocks[5], blocks[6],
  ]);
  expect(blocks).toEqual(snapshot);
  expect(getVisibleBlocks([])).toEqual([]);
});

it('detects visible demo metadata, video kind and nested media kind', () => {
  expect(hasDemoBlocks([])).toBe(false);
  expect(hasDemoBlocks([{ ...paragraph, status: 'draft' }])).toBe(false);
  expect(hasDemoBlocks([{ ...paragraph, status: 'demo' }])).toBe(true);
  expect(hasDemoBlocks([paragraph])).toBe(false);
  for (const type of ['image', 'image-gallery', 'video']) {
    const block = buildContentBlocks().find(b => b.type === type)!;
    expect(hasDemoBlocks([block])).toBe(false);
    if (block.type === 'image-gallery') {
      block.images[0].kind = 'demo';
    } else if (block.type === 'image' || block.type === 'video') {
      block.kind = 'demo';
    }
    expect(hasDemoBlocks([block])).toBe(true);
    block.status = 'draft';
    expect(hasDemoBlocks([block])).toBe(false);
  }
  expect(blockDemoNotice).toBe(
    'Демонстрационный материал. Сведения не являются подтверждённым кейсом.',
  );
});

it('requires explicit and inherited approval but permits demo copy', () => {
  expect(getPublicationIssues([], 'published')).toEqual([]);
  expect(getPublicationIssues([paragraph], 'draft')).toEqual([]);
  expect(getPublicationIssues([paragraph], 'published')).toEqual([
    { block: 0, message: 'Block needs approval' },
  ]);
  for (const provenance of [
    undefined, { source: 'Evidence', approvedBy: ' ' },
    { source: 'Evidence', approvedBy: 'A', approvedAt: ' ' },
  ]) {
    expect(getPublicationIssues([
      { ...paragraph, status: 'published', provenance },
    ], 'demo')).toEqual([{ block: 0, message: 'Block needs approval' }]);
  }
  expect(getPublicationIssues([
    { ...paragraph, provenance: approved },
    { ...paragraph, status: 'demo' },
  ], 'published')).toEqual([]);
  const draft = { ...paragraph, status: 'draft' as const };
  expect(getPublicationIssues([draft], 'demo')).toEqual([]);
  expect(getPublicationIssues([draft], 'published')).toEqual([
    { block: 0, message: 'Block is draft' },
  ]);
});

it('checks video rights for each publication trigger and skips drafts', () => {
  const video = buildContentBlocks().find(b => b.type === 'video')!;
  expect(getPublicationIssues([video], 'draft')).toEqual([]);
  for (const block of [
    { ...video, status: 'demo' as const },
    { ...video, kind: 'demo' as const },
    { ...video, status: 'published' as const },
  ]) {
    expect(getPublicationIssues([block], 'draft')).toContainEqual(
      { block: 0, message: 'Video needs rights' },
    );
  }
  expect(getPublicationIssues([video], 'published')).toContainEqual(
    { block: 0, message: 'Video needs rights' },
  );
  expect(getPublicationIssues([
    { ...video, status: 'draft' },
  ], 'draft')).toEqual([]);
  expect(getPublicationIssues([
    { ...video, provenance: approved },
  ], 'published')).toEqual([]);
});

it('requires individual media approvals and rights with source indexes', () => {
  const gallery = buildContentBlocks().find(b => b.type === 'image-gallery')!;
  if (gallery.type !== 'image-gallery') throw new Error('Missing gallery');
  gallery.status = 'published';
  gallery.provenance = approved;
  gallery.images[0].status = 'draft';
  expect(getPublicationIssues([paragraph, gallery], 'demo')).toEqual([
    { block: 1, message: 'Media 2 needs rights' },
    { block: 1, message: 'Media 2 needs approval' },
  ]);
  gallery.images[1].provenance = approved;
  expect(getPublicationIssues([gallery], 'draft')).toEqual([]);
  gallery.status = 'demo';
  gallery.images[1].provenance = { source: 'Evidence', rights: ' ' };
  expect(getPublicationIssues([gallery], 'demo')).toEqual([
    { block: 0, message: 'Media 2 needs rights' },
  ]);
  const image = buildContentBlocks().find(b => b.type === 'image')!;
  expect(getPublicationIssues([image], 'draft')).toEqual([]);
  expect(getPublicationIssues([
    { ...image, status: 'demo' },
  ], 'demo')).toEqual([{ block: 0, message: 'Media 1 needs rights' }]);
});

it('throws source-labelled diagnostics and accepts valid copy', () => {
  expect(() => assertPublicationPolicy([], 'draft', 'empty')).not.toThrow();
  expect(() => assertPublicationPolicy([paragraph], 'published', 'case.mdx'))
    .toThrow('Publication policy failed in case.mdx:\n'
      + 'content.0: Block needs approval');
});
