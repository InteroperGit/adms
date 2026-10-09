// Exercise the FAQ schema and publication boundary before UI integration.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const vitePath = require.resolve('vite', {
  paths: [dirname(require.resolve('astro/package.json'))],
});
const { createServer } = await import(pathToFileURL(vitePath).href);
const server = await createServer({
  resolve: { alias: { '@/data': resolve('data') } },
  server: { middlewareMode: true },
  appType: 'custom',
});

try {
  const { faqSchema } = await server.ssrLoadModule('/src/validation/faq.ts');
  const publication = await server.ssrLoadModule(
    '/src/content/faq-publication.ts',
  );
  const { getPublishedFaqItems, getVisibleFaqItems } = publication;
  const { faq } = await server.ssrLoadModule('/src/content/faq.ts');
  const raw = JSON.parse(await readFile('data/content/faq.json', 'utf8'));
  assert.equal(faq.items.length, 9);
  assert.deepEqual(getPublishedFaqItems(faq), []);
  assert.equal(getVisibleFaqItems(faq).length, 9);
  assert.deepEqual(getVisibleFaqItems({ ...faq, demoMode: false }), []);
  const approved = {
    state: 'approved', source: 'Test approval', approvedBy: 'Test approver',
  };
  const partial = structuredClone(raw);
  partial.approval = approved;
  partial.items[0].approval = approved;
  assert.deepEqual(
    getPublishedFaqItems(faqSchema.parse(partial)).map(item => item.id),
    ['cost'],
  );
  for (const mutate of [
    value => { value.extra = true; },
    value => { value.items[0].extra = true; },
    value => { value.items[1].id = value.items[0].id; },
    value => { value.items[0].id = 'Invalid ID'; },
    value => { value.items[0].question = ' '; },
    value => { value.items[0].answer = []; },
    value => { value.items[0].answer = [' ']; },
    value => { value.inquiryHref = 'https://example.com'; },
    value => { value.approval.state = 'approved'; },
    value => { value.items[0].approval.state = 'approved'; },
  ]) {
    const fixture = structuredClone(raw);
    mutate(fixture);
    assert.equal(faqSchema.safeParse(fixture).success, false);
  }
  const draftSection = structuredClone(partial);
  draftSection.approval = raw.approval;
  assert.deepEqual(
    getPublishedFaqItems(faqSchema.parse(draftSection)), [],
  );
  const note = await readFile(
    'docs/codex/fixed/20261009/044-faq-content.md', 'utf8',
  );
  const answers = note.split(/^### /m).slice(1, 10);
  answers.forEach((entry, index) => {
    const [question, ...lines] = entry.split('\n');
    const answer = lines.join('\n').split('\n## ')[0].trim();
    assert.equal(faq.items[index].question, question.trim());
    assert.equal(faq.items[index].answer, answer.replace(/\s+/g, ' '));
  });
  console.log('FAQ schema, loader, copy and publication checks passed.');
} finally {
  await server.close();
}
