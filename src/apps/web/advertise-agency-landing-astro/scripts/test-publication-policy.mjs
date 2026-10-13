// Exercise production policy and owner schemas through both JSON and MDX.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { moduleURL } from './lib/import-typescript.mjs';
import { compileMdx } from './lib/compile-mdx.mjs';

const policy = await import(
  await moduleURL('src/content/block-publication.ts')
);
const { contentBlocksSchema } = await import(
  await moduleURL('src/validation/content-blocks.ts')
);
const projects = await import(await moduleURL('src/validation/projects.ts'));
const projectPolicy = await import(
  await moduleURL('src/content/project-publication.ts')
);
const services = await import(await moduleURL('src/validation/services.ts'));
const servicePolicy = await import(
  await moduleURL('src/content/service-publication.ts')
);
const { getArticleFormRegistration } = await import(
  await moduleURL('src/content/article-context.ts')
);
const fixture = JSON.parse(await readFile(
  'data/content/fixtures/publication.json', 'utf8',
));
const base = JSON.parse(await readFile(
  'data/content/fixtures/content-blocks.valid.json', 'utf8',
));
const approved = base.map((block) => ({
  ...block, status: 'published', provenance: fixture.approval,
  ...(block.type === 'image-gallery' ? {
    images: block.images.map((image) => ({
      ...image, provenance: fixture.approval,
    })),
  } : {}),
}));
const records = JSON.parse(await readFile(
  'data/content/projects.json', 'utf8',
));
const { article: _source, ...metadata } = records[0];
const project = { ...metadata, status: 'published', content: approved };
projects.projectSchema.parse(project);
assert.deepEqual(policy.getPublicationIssues(approved, 'published'), []);
assert.equal(projectPolicy.isProjectPublished(project), true);

const components = {
  paragraph: 'ParagraphBlock', image: 'ImageBlock',
  'image-gallery': 'ImageGalleryBlock', footnote: 'FootnoteBlock',
  'order-form': 'OrderFormBlock',
};
async function check(blocks, valid, status = 'published') {
  const value = { ...project, status, content: blocks };
  assert.equal(projects.projectSchema.safeParse(value).success, valid);
  // Literal attributes use the same production normalization as authored MDX.
  const source = blocks.map((block) => {
    const json = JSON.stringify(block).replaceAll("'", '&#39;');
    return `<${components[block.type]} block='${json}' />`;
  }).join('\n\n');
  const result = await compileMdx(`---\nprojectId: 1\n---\n\n${source}`);
  assert.equal(projects.projectSchema.safeParse({
    ...value, content: result.content,
  }).success, valid);
}

const paragraph = approved[0];
const image = approved.find((block) => block.type === 'image');
const gallery = approved.find((block) => block.type === 'image-gallery');
await check([paragraph], true);
await check([{ ...paragraph, provenance: undefined }], false);
await check([{
  ...paragraph, status: undefined, provenance: undefined,
}], false);
await check([{ ...paragraph, status: 'draft' }], false);
await check([{ ...paragraph, status: 'demo' }], true);
await check([{ ...image, provenance: { source: 'fixture' } }], false);
await check([{ ...image, provenance: {
  ...fixture.approval, rights: undefined,
} }], false);
await check([{ ...image, status: undefined, provenance: undefined }], false);
await check([{ ...image, status: 'demo', provenance: undefined }], false,
  'demo');
await check([{ ...gallery, images: [{
  ...gallery.images[0], provenance: undefined,
}] }], false);
await check([{ ...gallery, images: [{
  ...gallery.images[0], status: 'draft',
}] }], false);
await check([{ ...paragraph, status: 'draft' }], true, 'draft');
await check([paragraph], true, 'draft');
await check([{ ...paragraph, status: 'demo', provenance: undefined }], true,
  'demo');
assert.equal(contentBlocksSchema.safeParse([{
  ...paragraph, provenance: { source: 'Fixture', approvedBy: 'Reviewer' },
}]).success, false);
assert.equal(contentBlocksSchema.safeParse([{
  ...paragraph, provenance: { source: 'Fixture', approvedAt: '2026-10-13' },
}]).success, false);

// Parent status cannot hide a nested media permission/approval requirement.
assert.equal(contentBlocksSchema.safeParse([{
  ...gallery, status: 'demo', images: [{
    ...gallery.images[0], status: 'published', provenance: undefined,
  }],
}]).success, false);
const mixed = [
  { ...paragraph, status: 'draft', id: 'private' },
  { type: 'footnote', id: 'private-note', text: 'Private note',
    targetId: 'private' },
  { type: 'footnote', text: 'Chained private note', targetId: 'private-note' },
  { ...gallery, status: 'demo', images: [
    { ...gallery.images[0], status: 'draft' }, gallery.images[0],
  ] },
];
assert.equal(policy.getVisibleBlocks(mixed).length, 1);
assert.equal(policy.getVisibleBlocks(mixed)[0].images.length, 1);
assert.equal(policy.hasDemoBlocks(mixed), true);
assert.equal(projectPolicy.isProjectPublished({
  ...project, content: mixed,
}),
  false);
assert.deepEqual(projectPolicy.getVisibleProjects([
  { ...project, status: 'draft' }, project,
]), [project]);
assert.deepEqual(projectPolicy.getPublishedProjectPaths([
  project, { ...project, id: 2, content: mixed },
]), ['/projects/1/']);

const catalog = JSON.parse(await readFile(
  'data/content/services.json', 'utf8',
));
const paths = catalog.items.map((item) => item.href);
const service = {
  ...catalog.items[0], confirmed: true, copyApproved: true,
  image: { ...catalog.items[0].image, approved: true },
  article: { title: 'Fixture', description: 'Fixture', approved: true,
    content: [paragraph, image] },
};
const serviceCatalog = {
  ...catalog, demoMode: false, copyApproved: true, items: [service],
};
services.createServicesSchema(paths).parse(serviceCatalog);
assert.deepEqual(servicePolicy.getPublishedServicePaths(serviceCatalog),
  [service.href]);
service.article.content[0] = { ...paragraph, status: 'demo' };
assert.deepEqual(servicePolicy.getPublishedServicePaths(serviceCatalog), []);
service.article.content[0] = { ...paragraph, status: 'draft' };
assert.equal(services.createServicesSchema(paths).safeParse(serviceCatalog)
  .success, false);
const form = { type: 'order-form', context: 'project',
  category: 'led-letters', formId: 'led-letters', status: 'demo' };
assert.equal(getArticleFormRegistration(form, {
  kind: 'project', projectId: 1, category: 'led-letters', published: true,
}), undefined);
console.log('Production publication policy: JSON/MDX/owners/media pass.');
