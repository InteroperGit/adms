// One-time migration from the archived legacy source; never used by the app.
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { moduleURL } from './lib/import-typescript.mjs';
import { blockComponentTypes } from '../src/content/mdx-blocks.mjs';

const fixture = 'tests/fixtures/content/projects-before-blocks.json';
const catalogPath = 'data/content/config/projects.json';
// Archive before removing any legacy fields; subsequent runs use the archive.
try {
  await access(fixture);
} catch {
  const raw = await readFile(catalogPath, 'utf8');
  const records = JSON.parse(raw);
  if (!records.every((record) => 'shortDescription' in record)) {
    throw new Error('Migration needs the original legacy project source');
  }
  await writeFile(fixture, readableJSON(records));
}
const before = JSON.parse(await readFile(fixture, 'utf8'));
const { toUniversalProjectRecord } = await import(
  await moduleURL('scripts/lib/legacy-project-content.ts')
);
const { projectRecordsSchema, projectsSchema } = await import(
  await moduleURL('src/validation/projects.ts')
);
const components = new Map(Object.entries(blockComponentTypes)
  .map(([component, type]) => [type, component]));
const directory = 'data/content/articles/projects';
await mkdir(directory, { recursive: true });
const catalog = [];
const resolved = [];
for (const old of before) {
  const project = toUniversalProjectRecord(old);
  // Retain every editorial evidence slot without making it visitor copy.
  project.evidence = old.evidence;
  const photoGroups = {
    photos: old.photos,
    'manufacturing-images': old.manufacturing?.photos,
    'installation-images': old.installation?.photos,
    'result-images': old.resultPhotos,
  };
  for (const block of project.content) {
    if (block.type !== 'image-gallery') continue;
    block.images = photoGroups[block.id].map((photo) => ({
      src: photo.src, alt: photo.alt,
      width: photo.width, height: photo.height,
      caption: photo.caption, kind: photo.kind,
      cropGuidance: photo.cropGuidance, focalPoint: photo.focalPoint,
      provenance: {
        source: photo.source, rights: photo.rights,
        approvedBy: photo.approval?.approvedBy ?? null,
        approvedAt: photo.approval?.approvedAt ?? null,
      },
    }));
  }
  if (!project.content.some((block) => block.type === 'order-form')) {
    project.content.push({
      type: 'order-form', id: 'order-form', formId: 'general-inquiry',
      context: 'project',
      ...(project.category ? { category: project.category } : {}),
    });
  }
  const { content, ...metadata } = project;
  const body = content.map((block) => {
    const component = components.get(block.type);
    if (!component) throw new Error(`Unsupported migration: ${block.type}`);
    const json = readableJSON(block).trimEnd()
      .replaceAll('&', '&amp;').replaceAll("'", '&apos;');
    return `<${component} block='${json}' />`;
  }).join('\n\n');
  await writeFile(`${directory}/${old.id}.mdx`,
    `---\nprojectId: ${old.id}\n---\n\n${body}\n`);
  catalog.push({ ...metadata, article: { format: 'mdx', entry: `${old.id}` } });
  resolved.push(project);
}
projectRecordsSchema.parse(catalog);
projectsSchema.parse(resolved);
await writeFile(catalogPath, readableJSON(catalog));
console.log(`Migrated ${catalog.length} project articles to MDX.`);

// Wrap JSON whitespace while retaining the exact text of every string value.
function readableJSON(value) {
  return JSON.stringify(value, null, 2).split('\n').map((line) => {
    if (line.length <= 80) return line;
    const colon = line.indexOf(': ');
    if (colon !== -1) {
      return `${line.slice(0, colon + 1)}\n${line.slice(colon + 2)}`;
    }
    return line.trimStart();
  }).join('\n') + '\n';
}
