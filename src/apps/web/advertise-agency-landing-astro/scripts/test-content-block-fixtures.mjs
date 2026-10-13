import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const validPath = 'data/content/fixtures/content-blocks.valid.json';
const invalidPath = 'data/content/fixtures/content-blocks.invalid.json';
const valid = JSON.parse(await readFile(validPath, 'utf8'));
const invalid = JSON.parse(await readFile(invalidPath, 'utf8'));
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
