// Exercise actual MDX compilation, production Zod schemas and built routes.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { moduleURL } from './lib/import-typescript.mjs';
import { compileMdx } from './lib/compile-mdx.mjs';

const validation = await import(await moduleURL('src/validation/services.ts'));
const articleValidation = await import(
  await moduleURL('src/validation/service-articles.ts')
);
const publication = await import(
  await moduleURL('src/content/service-publication.ts')
);
const before = JSON.parse(await readFile(
  'data/content/fixtures/services-before-blocks.json', 'utf8',
));
const catalog = JSON.parse(await readFile(
  'data/content/services.json', 'utf8',
));
const paths = before.items.map((service) => service.href);
validation.createServiceRecordsSchema(paths).parse(catalog);
async function compile(source, path = 'fixture.mdx') {
  const { frontmatter, content } = await compileMdx(source, path);
  return articleValidation.serviceArticleSchema.parse({
    ...frontmatter, content,
  });
}

const items = [];
for (const record of catalog.items) {
  const previous = before.items.find((item) => item.id === record.id);
  const { article: _old, ...oldMetadata } = previous;
  const { article: _new, ...newMetadata } = record;
  assert.deepEqual(newMetadata, oldMetadata, 'Catalog metadata changed');
  const path = `data/content/articles/services/${record.id}.mdx`;
  const article = await compile(await readFile(path, 'utf8'), path);
  const paragraphs = article.content.filter((block) =>
    block.type === 'paragraph');
  assert.deepEqual(paragraphs.flatMap((block) => block.paragraphs), [
    previous.article.lead,
    ...previous.article.sections.flatMap((section) => section.paragraphs),
  ]);
  assert.deepEqual(article.content.filter((block) => block.type === 'heading')
    .slice(0, previous.article.sections.length).map((block) => block.text),
    previous.article.sections
    .map((section) => section.heading));
  assert.deepEqual(article.content.find((block) =>
    block.type === 'unordered-list').items, previous.article.inquiry);
  assert.equal(article.title, previous.article.title);
  assert.equal(article.description, previous.article.description);
  assert.equal(article.approved, previous.article.approved);
  const image = article.content.find((block) => block.type === 'image');
  for (const key of ['src', 'alt', 'width', 'height']) {
    assert.equal(image[key], previous.image[key]);
  }
  assert.deepEqual(image.provenance, {
    source: previous.image.source,
    rights: previous.image.publicationPermission,
  });
  assert.equal(image.provenance.approvedBy, undefined);
  const order = article.content.find((block) => block.type === 'order-form');
  assert.equal(order.context, 'service');
  assert.equal(order.category, record.id);
  assert.equal(order.formId, record.id === 'svetovye-bukvy'
    ? 'led-letters' : 'general-inquiry');
  const html = await readFile(`dist${record.href}index.html`, 'utf8');
  assert.match(html, /name="robots" content="noindex, follow"/);
  assert.ok(html.includes(catalog.demoNotice));
  assert.ok(!html.includes('src="/src/assets/'));
  assert.ok(html.includes('/_astro/'));
  assert.ok(html.includes('/#order-inquiry'));
  assert.ok(!html.includes('id="led-letters"'));
  for (const paragraph of paragraphs.flatMap((block) => block.paragraphs)) {
    assert.ok(html.includes(paragraph), `${record.id}: missing rendered copy`);
  }
  items.push({ ...record, article });
}
const normalized = validation.createServicesSchema(paths).parse({
  ...catalog, items,
});
assert.equal(normalized.items.length, 5);
assert.deepEqual(publication.getPublishedServicePaths(normalized), []);
assert.equal(publication.getVisibleServices(normalized).length, 5);

const header = '---\ntitle: Test\ndescription: Test\napproved: false\n---\n';
const minimal = await compile(`${header}\nA minimal article.\n`);
assert.equal(minimal.content.length, 1);
for (const body of [
  'import Evil from "evil";\n\nHello.',
  '{alert(1)}',
  '<script>alert(1)</script>',
  '<ImageBlock block={dangerous()} />',
  '## Empty heading',
  '3. A list starting at three',
  '<ImageStackBlock block=\'{"type":"image-stack","images":[]}\' />',
  '<ImageBlock block=\'{"type":"quote","text":"Wrong"}\' />',
]) {
  await assert.rejects(() => compile(`${header}\n${body}\n`));
}
for (const field of ['lead', 'sections', 'inquiry']) {
  assert.equal(articleValidation.serviceArticleSchema.safeParse({
    ...minimal, [field]: before.items[0].article[field],
  }).success, false);
}
assert.equal(articleValidation.serviceArticleSchema.safeParse({
  ...minimal, content: [],
}).success, false);
assert.equal(articleValidation.serviceArticleMetadataSchema.safeParse({
  title: 'Test', description: 'Test', approved: false, extra: true,
}).success, false);
const fallback = {
  format: 'json', reason: 'MDX validation failure recorded in editorial review',
  ...minimal,
};
articleValidation.serviceArticleSourceSchema.parse(fallback);
const fallbackCatalog = structuredClone(catalog);
fallbackCatalog.items[0].article = fallback;
validation.createServiceRecordsSchema(paths).parse(fallbackCatalog);
assert.equal(articleValidation.serviceArticleSourceSchema.safeParse({
  ...fallback, reason: ' ',
}).success, false);

const mismatched = structuredClone(normalized);
mismatched.items[1].article.content.push({
  type: 'order-form', formId: 'led-letters',
  context: 'service', category: 'svetovye-bukvy',
});
assert.equal(validation.createServicesSchema(paths).safeParse(mismatched)
  .success, false);
for (const content of [
  [{ type: 'image', src: 'javascript:alert(1)', alt: 'Unsafe',
    width: 1, height: 1 }],
  [{ type: 'paragraph', id: 'same', paragraphs: ['First'] },
    { type: 'paragraph', id: 'same', paragraphs: ['Second'] }],
  [{ type: 'footnote', text: 'Missing', targetId: 'missing' }],
  [{ type: 'paragraph', paragraphs: ['Test'],
    provenance: { source: 'Test', approvedBy: 'Agency' } }],
]) {
  assert.equal(articleValidation.serviceArticleSchema.safeParse({
    ...minimal, content,
  }).success, false);
}
assert.equal(articleValidation.serviceArticleSourceSchema.safeParse({
  ...fallback, content: [{ type: 'order-form', formId: 'led-letters',
    context: 'service', category: 'neon' }],
}).success, false);

// A missing optional image is valid outside demo mode but cannot publish.
const withheld = structuredClone(normalized);
withheld.demoMode = false;
withheld.items[0].image = null;
withheld.items[0].article = minimal;
validation.createServicesSchema(paths).parse(withheld);
assert.deepEqual(publication.getVisibleServices(withheld), []);
assert.deepEqual(publication.getPublishedServicePaths(withheld), []);
const approved = structuredClone(normalized);
approved.demoMode = false;
approved.copyApproved = true;
const service = approved.items[0];
service.confirmed = true;
service.copyApproved = true;
service.image.approved = true;
service.article.approved = true;
assert.deepEqual(
  publication.getPublishedServicePaths(approved), [service.href],
);
service.article.approved = false;
assert.deepEqual(publication.getPublishedServicePaths(approved), []);
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
assert.ok(!sitemap.includes('/services/'));
console.log('Service MDX, schema, migration and publication checks pass.');
