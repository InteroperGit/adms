// Generate deterministic base JSON content for a new site.
import { access, mkdir, readdir, readFile, rename, rm, writeFile } from
  'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, isAbsolute, join, normalize, relative, resolve } from
  'node:path';

const SCHEMA_VERSION = '1.0.0';
const FORBIDDEN = [
  /data[\\/]content/i,
  /(?:api[_-]?key|secret|token|password)["']?\s*[:=]/i,
  /(^|\s)\/\/[^\s]+/,
  /\b(?:javascript|data|file):/i,
  /\$\{/,
  /<script\b/i,
  /(^|\n)\s*(?:import|export)\s/m,
];
const MEDIA_KEYS = new Set([
  'src', 'avatar', 'mapSrc', 'image', 'thumbnail', 'media', 'poster',
]);

function fail(message) {
  throw new Error(`Content catalog generation failed: ${message}`);
}

function within(root, candidate) {
  const path = resolve(root, candidate);
  const distance = relative(root, path);
  return distance === '' || (!distance.startsWith('..')
    && !isAbsolute(distance));
}

function validateRelativePath(value, label) {
  if (typeof value !== 'string' || !value || isAbsolute(value)) {
    fail(`${label} must be a relative path`);
  }
  const cleaned = normalize(value).replaceAll('\\', '/');
  if (cleaned.startsWith('../') || cleaned.includes('/../')) {
    fail(`${label} may not escape the source directory`);
  }
  return cleaned;
}

function scanForbidden(value, source) {
  for (const pattern of FORBIDDEN) {
    if (pattern.test(value)) fail(`forbidden value in ${source}`);
  }
}

function normalizeMedia(value) {
  if (!value.startsWith('/') && !value.startsWith('http://')
    && !value.startsWith('https://')) {
    return `/${value.replace(/^\.\//, '')}`;
  }
  return value;
}

function normalizeJson(value, key) {
  if (typeof value === 'string') {
    return MEDIA_KEYS.has(key) && !value.startsWith('http')
      ? normalizeMedia(value) : value;
  }
  if (Array.isArray(value)) return value.map(item => normalizeJson(item, key));
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).map(([childKey, child]) => [
    childKey, normalizeJson(child, childKey),
  ]));
}

async function readManifest(sourceRoot) {
  const manifestPath = join(sourceRoot, 'manifest.json');
  let manifest;
  let rawManifest;
  try {
    rawManifest = await readFile(manifestPath, 'utf8');
    scanForbidden(rawManifest, 'manifest.json');
    manifest = JSON.parse(rawManifest);
  } catch (error) {
    fail(`cannot read manifest.json: ${error.message}`);
  }
  if (manifest.schemaVersion !== SCHEMA_VERSION) {
    fail(`unsupported schemaVersion: ${manifest.schemaVersion ?? 'missing'}`);
  }
  if (!Array.isArray(manifest.files) || manifest.files.length === 0) {
    fail('manifest.files must contain at least one JSON file');
  }
  const seen = new Set();
  const outputs = new Set();
  const entries = manifest.files.map((entry, index) => {
    if (!entry || !['json', 'mdx'].includes(entry.kind)) {
      fail(`files[${index}].kind must be json or mdx`);
    }
    const path = validateRelativePath(entry.path, `files[${index}].path`);
    const output = validateRelativePath(
      entry.output ?? entry.path, `files[${index}].output`,
    );
    if (seen.has(path)) fail(`duplicate manifest path: ${path}`);
    if (outputs.has(output)) fail(`duplicate manifest output: ${output}`);
    if (output === 'manifest.json') {
      fail('manifest output may not replace generated manifest.json');
    }
    seen.add(path);
    outputs.add(output);
    return { kind: entry.kind, output, path };
  }).sort((left, right) => left.path.localeCompare(right.path));
  return { entries };
}

async function readEntry(sourceRoot, entry) {
  const inputPath = resolve(sourceRoot, entry.path);
  if (!within(sourceRoot, inputPath)) {
    fail(`path escapes source: ${entry.path}`);
  }
  let raw;
  try {
    raw = await readFile(inputPath, 'utf8');
  } catch (error) {
    fail(`missing ${entry.path}: ${error.code ?? error.message}`);
  }
  if (!raw.trim()) fail(`empty file: ${entry.path}`);
  if (entry.kind === 'json') {
    scanForbidden(raw, entry.path);
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      fail(`invalid JSON in ${entry.path}: ${error.message}`);
    }
    return `${JSON.stringify(normalizeJson(parsed, ''), null, 2)}\n`;
  }
  return raw.replaceAll('\r\n', '\n').replaceAll('\r', '\n');
}

export async function generateContentCatalog(source, output, options = {}) {
  const sourceRoot = resolve(source);
  const outputRoot = resolve(output);
  if (sourceRoot === outputRoot || within(sourceRoot, outputRoot)
    || within(outputRoot, sourceRoot)) {
    fail('output must be outside the template source directory');
  }
  if (!options.force) {
    try {
      const existing = await readdir(outputRoot, { recursive: true });
      if (existing.length > 0) {
        fail(`output is not empty: ${output}; use --force intentionally`);
      }
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  await access(sourceRoot).catch(() => fail(
    `source does not exist: ${source}`,
  ));
  const manifestInput = await readManifest(sourceRoot);
  const entries = manifestInput.entries;
  const files = new Map();
  for (const entry of entries) files.set(entry.output, await readEntry(
    sourceRoot, entry,
  ));
  const tempRoot = `${outputRoot}.tmp-${process.pid}`;
  await rm(tempRoot, { recursive: true, force: true });
  await mkdir(tempRoot, { recursive: true });
  const manifest = {
    files: entries.map(entry => ({
      kind: entry.kind, output: entry.output, source: entry.path,
    })),
    schemaVersion: SCHEMA_VERSION,
  };
  await writeFile(join(tempRoot, 'manifest.json'), `${JSON.stringify(
    manifest, null, 2,
  )}\n`);
  for (const [file, content] of files) {
    const destination = join(tempRoot, file);
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, content);
  }
  const backupRoot = `${outputRoot}.backup-${process.pid}`;
  await rm(backupRoot, { recursive: true, force: true });
  await mkdir(dirname(outputRoot), { recursive: true });
  let movedExisting = false;
  try {
    await rename(outputRoot, backupRoot);
    movedExisting = true;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  try {
    await rename(tempRoot, outputRoot);
  } catch (error) {
    if (movedExisting) await rename(backupRoot, outputRoot);
    throw error;
  }
  if (movedExisting) await rm(backupRoot, { recursive: true, force: true });
  return manifest;
}

async function main() {
  const sourceIndex = process.argv.indexOf('--source');
  const outputIndex = process.argv.indexOf('--output');
  const force = process.argv.includes('--force');
  if (sourceIndex < 0 || outputIndex < 0) {
    fail('usage: node scripts/generate-content-catalog.mjs '
      + '--source <dir> --output <dir>');
  }
  const manifest = await generateContentCatalog(
    process.argv[sourceIndex + 1], process.argv[outputIndex + 1], { force },
  );
  console.log(`Generated ${manifest.files.length} content files.`);
}

if (fileURLToPath(import.meta.url) === resolve(process.argv[1])) await main();
