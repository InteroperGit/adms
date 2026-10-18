// Verify runtime-content boundaries and template safety before a commit.
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const root = resolve('.');
const templateRoot = resolve('data/templates');
const forbidden = [
  /data[\\/]content/i,
  /(?:api[_-]?key|secret|token|password)["']?\s*[:=]/i,
  /\b(?:javascript|data|file):/i,
  /<script\b/i,
  /(^|\n)\s*(?:import|export)\s/m,
];

function git(...args) {
  return execFileSync(
    'git',
    ['-c', 'safe.directory=D:/Projects/adms', ...args],
    { cwd: root, encoding: 'utf8' },
  );
}

function fail(message) {
  throw new Error(`Content boundary check failed: ${message}`);
}

const changed = [
  ...git('diff', '--name-only').split(/\r?\n/),
  ...git('diff', '--cached', '--name-only').split(/\r?\n/),
  ...git('ls-files', '--others', '--exclude-standard').split(/\r?\n/),
]
  .filter(Boolean)
  .map((path) => path.replaceAll('\\', '/'));
const runtimeChanges = changed.filter(
  (path) => path === 'data/content' || path.startsWith('data/content/'),
);
if (runtimeChanges.length) {
  fail(`runtime content changed or returned: ${runtimeChanges.join(', ')}`);
}

const manifest = JSON.parse(
  await readFile(join(templateRoot, 'manifest.json'), 'utf8'),
);
const trackedTemplates = git('ls-files', 'data/templates')
  .split(/\r?\n/)
  .filter(Boolean);
if (!trackedTemplates.includes('data/templates/manifest.json')) {
  fail('data/templates/manifest.json must be tracked');
}
if (manifest.schemaVersion !== '1.0.0' || !Array.isArray(manifest.files)) {
  fail('template manifest must define schemaVersion 1.0.0 and files');
}
const entries = manifest.files;
const outputs = new Set(entries.map((entry) => entry.output ?? entry.path));
if (outputs.size !== entries.length) fail('template outputs must be unique');
const json = entries.filter((entry) => entry.kind === 'json');
const mdx = entries.filter((entry) => entry.kind === 'mdx');
if (json.length !== 19 || mdx.length !== 2) {
  fail('manifest must contain 19 JSON files and 2 MDX starters');
}
const starterKinds = mdx.map((entry) => entry.path.split('/')[1]);
if (!starterKinds.includes('projects') || !starterKinds.includes('services')) {
  fail('manifest must contain project and service starters');
}
if (
  json.some((entry) => !entry.path.startsWith('config/')) ||
  json.some((entry) => !entry.output.startsWith('config/'))
) {
  fail('JSON templates must use the config/ layout');
}

for (const entry of entries) {
  const source = await readFile(join(templateRoot, entry.path), 'utf8');
  if (entry.kind === 'json') JSON.parse(source);
  for (const pattern of forbidden) {
    if (pattern.test(source)) fail(`forbidden template value: ${entry.path}`);
  }
}

console.log('Content boundaries, template manifest, and denylist passed.');
