import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { moduleURL } from './lib/import-typescript.mjs';
import { compileMdx } from './lib/compile-mdx.mjs';

const { contentBlocksSchema } = await import(
  await moduleURL('src/validation/content-blocks.ts')
);

const validPath = 'data/content/fixtures/content-blocks.valid.json';
const invalidPath = 'data/content/fixtures/content-blocks.invalid.json';
const valid = JSON.parse(await readFile(validPath, 'utf8'));
const invalid = JSON.parse(await readFile(invalidPath, 'utf8'));
contentBlocksSchema.parse(valid);
for (const block of invalid) {
  assert.equal(contentBlocksSchema.safeParse([block]).success, false);
}
// Cross-block errors must be validated as streams rather than single records.
for (const blocks of [
  [valid[0], valid[0]],
  [{ type: 'footnote', text: 'Missing', targetId: 'missing' }],
  [{ type: 'image-stack', images: valid[6].images }],
  [{ ...valid[5], width: 0 }],
  [{ ...valid[5], alt: ' ' }],
  [{ ...valid[0], legacy: true }],
  [{ ...valid[0], provenance: { source: 'Fixture', approvedBy: 'Editor' } }],
  [{ type: 'order-form', context: 'project', category: 'neon-signs',
    formId: 'led-letters' }],
]) {
  assert.equal(contentBlocksSchema.safeParse(blocks).success, false);
}
for (const name of ['minimal', 'project', 'service']) {
  const path = `data/content/fixtures/articles/${name}.mdx`;
  const { content } = await compileMdx(await readFile(path, 'utf8'), path);
  contentBlocksSchema.parse(content);
}
const types = new Set(valid.map((block) => block.type));
const expected = new Set([
  'paragraph', 'ordered-list', 'unordered-list', 'table', 'chart', 'image',
  'image-gallery',
  'order-form', 'quote', 'footnote',
]);

assert.deepEqual(types, expected);
assert.equal(valid.length, expected.size);
assert.ok(valid.every((block) => typeof block.id === 'string'));
assert.equal(invalid[0].type, 'unknown');
assert.ok(!expected.has(invalid[0].type));
assert.deepEqual(invalid.slice(1).map((block) => block.type), [
  'ordered-list', 'unordered-list',
]);
assert.ok(invalid.slice(1).every((block) => block.items.length === 0 ||
  block.items.some((item) => item.trim() === '')));

const table = valid.find((block) => block.type === 'table');
assert.equal(table.rows[0].cells.length, table.columns.length);
const chart = valid.find((block) => block.type === 'chart');
assert.ok(Number.isFinite(chart.series[0].points[0].value));

console.log('Content block fixtures passed.');
