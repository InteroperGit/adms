// Prepare isolated fixture streams without mutating Astro's cached MDX module.
import { contentBlocksSchema } from '@/validation/content-blocks';
import { getPublicationIssues } from '@/content/block-publication';
import type { ContentBlock } from '@/types/content-blocks';
import fixture from '../../tests/fixtures/content/publication.json';

export function acceptanceBlocks(input: ContentBlock[], id: string) {
  const blocks = contentBlocksSchema.parse(structuredClone(input));
  // Vary only test streams; authored media stays in data/content fixtures.
  const gallerySize = id === 'gallery-one' ? 1 : id === 'gallery-many' ? 7 : 0;
  if (gallerySize) {
    const gallery = blocks.find((block) => block.type === 'image-gallery');
    if (gallery?.type === 'image-gallery') {
      const images = gallery.images;
      gallery.images = Array.from({ length: gallerySize }, (_, index) => ({
        ...images[index % images.length], caption: `Image ${index + 1}`,
      }));
    }
  }
  if (id === 'published-project' || id === 'published-service') {
    blocks.forEach((block) => {
      block.provenance = fixture.approval;
      if (block.type === 'image-gallery') {
        block.images.forEach((image) => {
          image.provenance = fixture.approval;
        });
      }
    });
    if (getPublicationIssues(blocks, 'published').length) {
      throw new Error('Approved fixture violates publication policy');
    }
  }
  if (id === 'block-policy') {
    blocks.unshift({ type: 'paragraph', status: 'draft', id: 'hidden-draft',
      paragraphs: [fixture.draftText] });
    blocks.push({ type: 'paragraph', status: 'demo',
      paragraphs: [fixture.demoText] });
    const gallery = blocks.find((block) => block.type === 'image-gallery');
    if (gallery?.type === 'image-gallery') {
      gallery.images.unshift({ ...gallery.images[0], status: 'draft',
        alt: fixture.draftAlt });
    }
  }
  return blocks;
}
