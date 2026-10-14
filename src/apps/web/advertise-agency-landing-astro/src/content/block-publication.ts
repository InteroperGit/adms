// Share editorial gates between validators, renderers and indexable routes.
import type {
  ContentBlock,
  ContentBlockMeta,
  ContentImage,
} from '../types/content-blocks';

export type ArticlePublication = 'draft' | 'demo' | 'published';

export interface PublicationIssue {
  block: number;
  message: string;
}

function mediaItems(block: ContentBlock): ContentImage[] {
  if (block.type === 'image') return [block];
  if (block.type === 'image-gallery') return block.images;
  return [];
}

/** Hide nested drafts too; suppress empty galleries and dangling footnotes. */
export function getVisibleBlocks(blocks: ContentBlock[]): ContentBlock[] {
  const visible = blocks.flatMap((block): ContentBlock[] => {
    if (block.status === 'draft') return [];
    if (block.type !== 'image-gallery') return [block];
    const images = block.images.filter((image) => image.status !== 'draft');
    return images.length ? [{ ...block, images }] : [];
  });
  // Repeat when a note targets another removed note, keeping every surviving
  // native fragment valid after draft filtering without changing source IDs.
  let result = visible;
  while (true) {
    const ids = new Set(result.map((block) => block.id));
    const next = result.filter((block) => block.type !== 'footnote'
      || !block.targetId || ids.has(block.targetId));
    if (next.length === result.length) return next;
    result = next;
  }
}

/** Demo media cannot become an indexable claim through its parent article. */
export function hasDemoBlocks(blocks: ContentBlock[]): boolean {
  return getVisibleBlocks(blocks).some((block) => block.status === 'demo'
    || (block.type === 'video' && block.kind === 'demo')
    || mediaItems(block).some((image) => image.status === 'demo'
      || image.kind === 'demo'));
}

export const blockDemoNotice =
  'Демонстрационный материал. Сведения не являются подтверждённым кейсом.';

/**
 * Explicit published blocks always require approval. An indexable article
 * also requires approval for inherited, unclassified content. Drafts may be
 * edited on demo/draft pages, but are rejected in approved articles. Demo
 * content remains visible with a notice and makes the whole page noindex.
 */
export function getPublicationIssues(
  blocks: ContentBlock[],
  pageStatus: ArticlePublication,
): PublicationIssue[] {
  const issues: PublicationIssue[] = [];
  blocks.forEach((block, index) => {
    const issue = (message: string) => issues.push({ block: index, message });
    const check = (value: ContentBlockMeta, label: string) => {
      if (value.status === 'draft') {
        if (pageStatus === 'published') issue(`${label} is draft`);
        return;
      }
      const needsApproval = value.status === 'published'
        || (pageStatus === 'published' && value.status !== 'demo');
      if (needsApproval && (!value.provenance?.approvedBy?.trim()
        || !value.provenance.approvedAt?.trim())) {
        issue(`${label} needs approval`);
      }
    };
    check(block, 'Block');
    if (block.status === 'draft') return;
    if (block.type === 'video') {
      const needsRights = block.status === 'published'
        || block.status === 'demo' || block.kind === 'demo'
        || pageStatus === 'published';
      if (needsRights && !block.provenance?.rights?.trim()) {
        issue('Video needs rights');
      }
    }
    mediaItems(block).forEach((image, imageIndex) => {
      const label = `Media ${imageIndex + 1}`;
      if (block.type === 'image-gallery') check(image, label);
      const needsRights = image.status === 'published'
        || image.status === 'demo' || block.status === 'demo'
        || block.status === 'published' || pageStatus === 'published';
      if (image.status !== 'draft' && needsRights
        && !image.provenance?.rights?.trim()) issue(`${label} needs rights`);
      // A gallery approval never substitutes for the individual media review.
      if (image.status !== 'draft' && block.status === 'published'
        && (!image.provenance?.approvedBy?.trim()
          || !image.provenance.approvedAt?.trim())) {
        issue(`${label} needs approval`);
      }
    });
  });
  return issues;
}

/** Throw a source-labelled error when publication policy is violated. */
export function assertPublicationPolicy(
  blocks: ContentBlock[],
  pageStatus: ArticlePublication,
  source: string,
) {
  const issues = getPublicationIssues(blocks, pageStatus);
  if (!issues.length) return;
  throw new Error([
    `Publication policy failed in ${source}:`,
    ...issues.map(({ block, message }) => `content.${block}: ${message}`),
  ].join('\n'));
}
