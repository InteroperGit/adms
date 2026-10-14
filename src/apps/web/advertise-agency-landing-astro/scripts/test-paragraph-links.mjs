// Check destination safety and exact plain-text preservation during linking.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { moduleURL } from './lib/import-typescript.mjs';

const { paragraphLinks } = await import(
  await moduleURL('src/content/paragraph-links.ts')
);
const fixtures = JSON.parse(await readFile(
  'data/content/fixtures/paragraph-links.json', 'utf8',
));
for (const fixture of fixtures) {
  const input = fixture.input.join('');
  const segments = paragraphLinks(input);
  assert.equal(segments.map((segment) => segment.text).join(''), input);
  assert.deepEqual(segments.filter((segment) => segment.href)
    .map((segment) => segment.href), fixture.links);
}
console.log('Paragraph link safety and text preservation pass.');
