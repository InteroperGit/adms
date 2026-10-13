import type { ContentBlock } from '../types/content-blocks';

export type ArticlePublication = 'draft' | 'demo' | 'published';

export interface PublicationIssue {
  block: number;
  message: string;
}

function isMedia(block: ContentBlock) {
  return block.type === 'image' || block.type === 'image-gallery';
}

function mediaItems(block: ContentBlock) {
  if (block.type === 'image') return [block];
  if (block.type === 'image-gallery') return block.images;
  return [];
}

/**
 * Enforce explicit editorial gates while keeping old, unclassified content
 * compatible. Once a block opts into status, published media must carry a
 * rights record and a complete approval pair.
 */
export function getPublicationIssues(
  blocks: ContentBlock[],
  pageStatus: ArticlePublication,
): PublicationIssue[] {
  const issues: PublicationIssue[] = [];
  blocks.forEach((block, index) => {
    if (pageStatus === 'published' && block.status === 'draft') {
      issues.push({
        block: index,
        message: 'Draft block cannot be published',
      });
    }
    if (pageStatus === 'draft' && block.status === 'published') {
      issues.push({
        block: index,
        message: 'Draft page contains published block',
      });
    }
    if (pageStatus !== 'published' || block.status !== 'published') return;
    if (!isMedia(block)) return;
    mediaItems(block).forEach((image, imageIndex) => {
      const record = image.provenance;
      if (!record?.rights?.trim()) {
        issues.push({
          block: index,
          message: `Published media ${imageIndex + 1} needs rights`,
        });
      }
      if (!record?.approvedBy || !record.approvedAt) {
        issues.push({
          block: index,
          message: `Published media ${imageIndex + 1} needs approval`,
        });
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
