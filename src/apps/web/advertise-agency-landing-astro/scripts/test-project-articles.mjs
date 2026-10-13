// Compare authored project MDX with the complete historical source and build.
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { moduleURL } from './lib/import-typescript.mjs';
import { compileMdx } from './lib/compile-mdx.mjs';

const validation = await import(await moduleURL('src/validation/projects.ts'));
const { contentBlocksSchema } = await import(
  await moduleURL('src/validation/content-blocks.ts')
);
const publication = await import(
  await moduleURL('src/content/project-publication.ts')
);
const { getArticleFormRegistration } = await import(
  await moduleURL('src/content/article-context.ts')
);
const before = JSON.parse(await readFile(
  'data/content/fixtures/projects-before-blocks.json', 'utf8',
));
const records = validation.projectRecordsSchema.parse(JSON.parse(
  await readFile('data/content/projects.json', 'utf8'),
));
assert.equal(records.length, before.length);
const projects = [];
for (const [index, record] of records.entries()) {
  const previous = before[index];
  const { article, ...metadata } = record;
  const {
    shortDescription, fullDescription, story, expectedBenefits, details,
    manufacturing, installation, photos, resultPhotos, result, ...oldMetadata
  } = previous;
  assert.deepEqual(metadata, { ...oldMetadata, description: shortDescription });
  assert.equal(article.format, 'mdx');
  assert.equal(article.entry, String(record.id));
  const path = `data/content/articles/projects/${article.entry}.mdx`;
  const compiled = await compileMdx(await readFile(path, 'utf8'), path);
  validation.projectArticleMetadataSchema.parse(compiled.frontmatter);
  assert.equal(compiled.frontmatter.projectId, record.id);
  const project = validation.projectSchema.parse({
    ...metadata, content: compiled.content,
  });
  const blocks = new Map(project.content.map((block) => [block.id, block]));
  assert.equal(project.content[0].id, 'photos');
  assert.deepEqual(blocks.get('overview').paragraphs, [fullDescription]);
  assert.deepEqual(blocks.get('story').paragraphs, story);
  assert.deepEqual(blocks.get('expected-benefits').items, expectedBenefits);
  for (const [id, field] of [
    ['customer-task', 'customerTask'],
    ['installation-context', 'installationContext'],
  ]) assert.deepEqual(blocks.get(id).paragraphs, [details[field]]);
  for (const [id, field] of [
    ['constraints', 'constraints'], ['materials', 'materials'],
    ['included-work', 'includedWork'],
  ]) assert.deepEqual(blocks.get(id).items, details[field]);
  assert.deepEqual(blocks.get('manufacturing').paragraphs,
    manufacturing.paragraphs);
  assert.deepEqual(blocks.get('installation').paragraphs,
    installation.paragraphs);
  for (const [id, group] of [
    ['photos', photos], ['manufacturing-images', manufacturing.photos],
    ['installation-images', installation.photos],
    ['result-images', resultPhotos],
  ]) {
    assert.equal(blocks.get(id).type, 'image-gallery');
    const images = blocks.get(id).images;
    // Preserve historical media and allow additional authored demo photos.
    assert.ok(images.length >= 2);
    assert.equal(new Set(images.map((image) => image.src)).size,
      images.length);
    assert.deepEqual(images.slice(0, group.length), group.map((photo) => ({
      src: photo.src, alt: photo.alt,
      width: photo.width, height: photo.height, caption: photo.caption,
      kind: photo.kind, cropGuidance: photo.cropGuidance,
      focalPoint: photo.focalPoint,
      provenance: {
        source: photo.source, rights: photo.rights,
        approvedBy: photo.approval?.approvedBy ?? null,
        approvedAt: photo.approval?.approvedAt ?? null,
      },
    })));
  }
  const units = { m: 'м', cm: 'см', mm: 'мм' };
  assert.deepEqual(blocks.get('dimensions').rows,
    details.dimensions.map((item) => ({ cells: [item.label,
      `${item.value.toLocaleString('ru-RU', { maximumFractionDigits: 20 })} ${
        units[item.unit]}`] })));
  const timing = blocks.get('timing').rows.map((row) => row.cells[1]);
  assert.ok(timing.includes(details.timing.design));
  assert.ok(timing.includes(details.timing.installation));
  assert.ok(timing.includes(details.timing.totalDelivery));
  assert.ok(timing.some((text) =>
    text.includes(details.timing.production.basis)));
  assert.ok(!blocks.has('details'));
  assert.equal(blocks.has('result'), Boolean(result));
  const html = await readFile(`dist/projects/${project.id}/index.html`, 'utf8');
  assert.match(html, /name="robots" content="noindex, follow"/);
  assert.ok(html.includes(project.notice));
  assert.ok(!html.includes('id="led-letters"'));
  assert.ok(html.includes('/#order-inquiry'));
  assert.ok(!html.includes('/src/assets/'));
  for (const match of html.matchAll(/(?:src|href)="(\/_astro\/[^"?#]+)"/g)) {
    await access(`dist${match[1]}`);
  }
  for (const block of project.content) {
    if (block.type !== 'paragraph') continue;
    for (const paragraph of block.paragraphs) {
      assert.ok(html.includes(paragraph));
    }
  }
  projects.push(project);
}
validation.projectsSchema.parse(projects);
assert.deepEqual(publication.getPublishedProjectPaths(projects), []);
const first = structuredClone(projects[0]);
first.status = 'published';
assert.deepEqual(
  publication.getPublishedProjectPaths([first]), ['/projects/1/'],
);
first.status = 'draft';
assert.deepEqual(publication.getVisibleProjects([first]), []);
const fallback = {
  ...records[0], article: {
    format: 'json', reason: 'Recorded editorial decision after MDX failure',
    content: projects[0].content,
  },
};
validation.projectRecordsSchema.parse([fallback]);
assert.deepEqual(fallback.article.content, projects[0].content);
fallback.article.reason = ' ';
assert.equal(
  validation.projectRecordsSchema.safeParse([fallback]).success, false,
);
for (const field of ['photos', 'details', 'story', 'shortDescription']) {
  assert.equal(validation.projectRecordsSchema.safeParse([
    { ...records[0], [field]: before[0][field] },
  ]).success, false);
}
const form = {
  type: 'order-form', formId: 'led-letters',
  context: 'project', category: 'led-letters',
};
const owner = {
  kind: 'project', projectId: 2, category: 'led-letters', published: true,
};
assert.equal(getArticleFormRegistration(form, owner)?.formId, 'led-letters');
for (const context of [undefined, { ...owner, published: false },
  { ...owner, category: null }, { ...owner, category: 'neon-signs' },
  { kind: 'service', category: 'svetovye-bukvy', published: true }]) {
  assert.equal(getArticleFormRegistration(form, context), undefined);
}
assert.equal(validation.projectSchema.safeParse({
  ...projects[0], content: [form],
}).success, false);
assert.equal(contentBlocksSchema.safeParse([
  { type: 'image-stack', images: projects[0].content[0].images },
]).success, false);
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
assert.ok(!/\/projects\/\d+\//.test(sitemap));
console.log('All 27 project MDX migrations and production contracts pass.');
