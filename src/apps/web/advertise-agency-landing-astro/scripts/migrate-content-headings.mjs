// Migrate restored authored streams; default to a fully validated dry run.
// No templates, publication changes or missing-file generation are involved.
import assert from 'node:assert/strict';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { moduleURL } from './lib/import-typescript.mjs';
import { compileMdx } from './lib/compile-mdx.mjs';

const { contentBlocksSchema } = await import(
  await moduleURL('src/validation/content-blocks.ts')
);
const fields = new Map([
  ['paragraph', 'heading'], ['ordered-list', 'heading'],
  ['unordered-list', 'heading'], ['table', 'title'], ['chart', 'title'],
]);
const args = process.argv.slice(2);
assert.ok(args.every((arg) => arg === '--write'), 'Only --write is supported');
const pending = [];
let headingCount = 0;

async function files(root) {
  const result = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) result.push(...await files(path));
    else if (/\.(json|mdx)$/.test(path)) result.push(path);
  }
  return result.sort();
}

function splitHeadings(blocks, reserved = new Set(
  blocks.map((block) => block.id).filter(Boolean),
)) {
  return blocks.flatMap((block) => {
    const field = fields.get(block.type);
    if (!field || !Object.hasOwn(block, field)) return [block];
    const text = block[field];
    assert.ok(typeof text === 'string' && text.trim(), 'Empty legacy heading');
    const heading = { type: 'heading', level: 2, text };
    if (block.id) {
      const base = `${block.id}-heading`;
      let id = base;
      let suffix = 2;
      while (reserved.has(id)) id = `${base}-${suffix++}`;
      reserved.add(id);
      heading.id = id;
    }
    // A hidden or explicitly approved group keeps the same editorial state.
    for (const key of ['status', 'provenance']) {
      if (Object.hasOwn(block, key)) heading[key] = structuredClone(block[key]);
    }
    const content = { ...block };
    delete content[field];
    // Reconstruct the original payload to prove that only structure changed.
    assert.deepEqual({ ...content, [field]: heading.text }, block);
    return [heading, content];
  });
}

function migrateJson(value) {
  if (Array.isArray(value)) {
    if (value.length && value.every((item) => item && typeof item === 'object'
      && typeof item.type === 'string')) return splitHeadings(value);
    return value.map(migrateJson);
  }
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).map(([key, child]) =>
    [key, migrateJson(child)]));
}

function validateStreams(value) {
  if (Array.isArray(value)) {
    if (value.length && value.every((item) => item && typeof item === 'object'
      && typeof item.type === 'string')) {
      // This private fixture stores long paragraphs as lossless fragments.
      const normalized = value.map((block) => block.type === 'paragraph'
        ? { ...block, paragraphs: block.paragraphs.map((paragraph) =>
          Array.isArray(paragraph) ? paragraph.join('') : paragraph) }
        : block);
      contentBlocksSchema.parse(normalized);
    } else value.forEach(validateStreams);
  } else if (value && typeof value === 'object') {
    Object.values(value).forEach(validateStreams);
  }
}

for (const path of await files('data/content')) {
  // Negative fixtures and historical source contracts must stay historical.
  if (/\.invalid\.json$|before-blocks\.json$/.test(path)) continue;
  const original = await readFile(path, 'utf8');
  let updated;
  let count = 0;
  if (path.endsWith('.mdx')) {
    const before = await compileMdx(original, path);
    const reserved = new Set(before.content.map((block) => block.id)
      .filter(Boolean));
    const expected = splitHeadings(before.content);
    // Preserve all Markdown/frontmatter and untouched payload bytes verbatim.
    updated = original.replace(
      /<(\w+Block)\s+block='([\s\S]*?)'\s*\/>/g,
      (source, component, payload) => {
        const block = JSON.parse(payload);
        const parts = splitHeadings([block], reserved);
        if (parts.length === 1) return source;
        count++;
        const field = fields.get(block.type);
        const newline = source.includes('\r\n') ? '\r\n' : '\n';
        // Legacy fields are single JSON property lines in restored articles.
        const pattern = new RegExp(`^ *"${field}":.*\\r?\\n`, 'm');
        const cleaned = payload.replace(pattern, '');
        assert.notEqual(cleaned, payload, `Cannot remove ${field}: ${path}`);
        assert.deepEqual(JSON.parse(cleaned), parts[1]);
        const heading = JSON.stringify(parts[0], null, 2)
          .replaceAll("'", '&apos;').replaceAll('\n', newline);
        return `<HeadingBlock block='${heading}' />${newline}${newline}`
          + `<${component} block='${cleaned}' />`;
      },
    );
    const after = await compileMdx(updated, path);
    assert.deepEqual(after.frontmatter, before.frontmatter);
    assert.deepEqual(after.content, expected, `Article changed: ${path}`);
    contentBlocksSchema.parse(after.content);
    assert.deepEqual(splitHeadings(after.content), after.content);
  } else {
    const before = JSON.parse(original);
    const after = migrateJson(before);
    validateStreams(after);
    assert.deepEqual(migrateJson(after), after, `Not idempotent: ${path}`);
    if (JSON.stringify(before) === JSON.stringify(after)) continue;
    // Count only legacy content fields, never page or catalog headings.
    const collect = (value) => {
      if (Array.isArray(value)) return value.reduce((sum, item) =>
        sum + collect(item), 0);
      if (!value || typeof value !== 'object') return 0;
      const field = fields.get(value.type);
      return Number(Boolean(field && Object.hasOwn(value, field)))
        + Object.values(value).reduce((sum, child) => sum + collect(child), 0);
    };
    count = collect(before);
    updated = JSON.stringify(after, null, 2) + '\n';
  }
  if (updated !== original) {
    pending.push({ path, original, updated, count });
    headingCount += count;
  }
}

// Validate every file first and reject concurrent edits before any write.
for (const change of pending) {
  assert.equal(await readFile(change.path, 'utf8'), change.original,
    `Concurrent content edit: ${change.path}`);
}
if (args.includes('--write')) {
  for (const change of pending) await writeFile(change.path, change.updated);
}
console.log(JSON.stringify({
  mode: args.includes('--write') ? 'write' : 'dry-run',
  files: pending.map(({ path, count }) => ({ path, headings: count })),
  headings: headingCount,
}, null, 2));
