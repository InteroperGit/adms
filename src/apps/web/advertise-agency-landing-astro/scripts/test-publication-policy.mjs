import assert from 'node:assert/strict';

function issues(blocks, pageStatus) {
  return blocks.flatMap((block, blockIndex) => {
    const result = [];
    if (pageStatus === 'published' && block.status === 'draft') {
      result.push(`${blockIndex}:draft`);
    }
    if (pageStatus === 'draft' && block.status === 'published') {
      result.push(`${blockIndex}:published`);
    }
    if (pageStatus === 'published' && block.status === 'published' &&
      (block.type === 'image' || block.type === 'image-gallery')) {
      const images = block.type === 'image' ? [block] : block.images;
      images.forEach((image, imageIndex) => {
        if (!image.provenance?.rights) {
          result.push(`${blockIndex}:rights:${imageIndex}`);
        }
        if (!image.provenance?.approvedBy ||
          !image.provenance?.approvedAt) {
          result.push(`${blockIndex}:approval:${imageIndex}`);
        }
      });
    }
    return result;
  });
}

const publishedImage = {
  type: 'image',
  status: 'published',
  provenance: {
    source: 'fixture', rights: 'owned', approvedBy: 'editor',
    approvedAt: '2026-10-13',
  },
};
assert.deepEqual(issues([{ type: 'paragraph', status: 'draft' }], 'published'),
  ['0:draft']);
assert.deepEqual(issues([{ ...publishedImage }], 'published'), []);
assert.deepEqual(issues([{
  ...publishedImage,
  provenance: { source: 'fixture' },
}], 'published'), ['0:rights:0', '0:approval:0']);
assert.deepEqual(issues([{ type: 'paragraph', status: 'published' }], 'draft'),
  ['0:published']);
console.log('Publication policy fixtures passed.');
