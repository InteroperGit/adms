// Verify deterministic generation and rejection of unsafe source packages.
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { generateContentCatalog } from './generate-content-catalog.mjs';

const manifest = {
  schemaVersion: '1.0.0',
  files: [
    { path: 'json/site.json', kind: 'json', output: 'site.json' },
    {
      path: 'articles/service.mdx',
      kind: 'mdx',
      output: 'articles/service.mdx',
    },
  ],
};

async function createSource(root, files) {
  await mkdir(join(root, 'json'), { recursive: true });
  await mkdir(join(root, 'articles'), { recursive: true });
  await writeFile(join(root, 'manifest.json'), `${JSON.stringify(
    manifest, null, 2,
  )}\n`);
  for (const [path, content] of Object.entries(files)) {
    await writeFile(join(root, path), content);
  }
}

async function expectFailure(action, message) {
  await assert.rejects(action, error => {
    assert.match(error.message, new RegExp(message));
    return true;
  });
}

const workspace = await mkdtemp(join(tmpdir(), 'content-catalog-'));
try {
  const complete = join(workspace, 'complete');
  await createSource(complete, {
    'json/site.json': JSON.stringify({
      title: 'PLACEHOLDER_TITLE',
      image: 'media/example.webp',
    }),
    'articles/service.mdx': 'export const unsafe = true;\n',
  });
  const output = join(workspace, 'output');
  await generateContentCatalog(complete, output);
  const first = await readFile(join(output, 'site.json'), 'utf8');
  assert.equal(first, '{\n  "title": "PLACEHOLDER_TITLE",\n'
    + '  "image": "/media/example.webp"\n}\n');
  assert.equal(await readFile(join(output, 'articles/service.mdx'), 'utf8'),
    'export const unsafe = true;\n');
  const firstManifest = await readFile(join(output, 'manifest.json'), 'utf8');
  await assert.rejects(() => generateContentCatalog(complete, output),
    /output is not empty/);
  await generateContentCatalog(complete, output, { force: true });
  assert.equal(await readFile(join(output, 'manifest.json'), 'utf8'),
    firstManifest);

  await expectFailure(
    () => generateContentCatalog(complete, complete),
    'outside the template source directory',
  );

  const duplicateOutput = join(workspace, 'duplicate-output');
  const duplicateManifest = {
    ...manifest,
    files: manifest.files.map(entry => ({ ...entry, output: 'same.json' })),
  };
  await writeFile(join(complete, 'manifest.json'), `${JSON.stringify(
    duplicateManifest, null, 2,
  )}\n`);
  await expectFailure(
    () => generateContentCatalog(complete, duplicateOutput),
    'duplicate manifest output',
  );
  await writeFile(join(complete, 'manifest.json'), `${JSON.stringify(
    manifest, null, 2,
  )}\n`);

  const incomplete = join(workspace, 'incomplete');
  await mkdir(incomplete, { recursive: true });
  await writeFile(join(incomplete, 'manifest.json'), JSON.stringify(manifest));
  await expectFailure(
    () => generateContentCatalog(incomplete, join(workspace, 'missing')),
    'missing',
  );

  const forbidden = join(workspace, 'forbidden');
  await createSource(forbidden, {
    'json/site.json': JSON.stringify({ apiKey: 'DO_NOT_COMMIT' }),
    'articles/service.mdx': '# TEST_ARTICLE',
  });
  await expectFailure(
    () => generateContentCatalog(forbidden, join(workspace, 'unsafe')),
    'forbidden',
  );
  console.log('Content catalog fixtures passed.');
} finally {
  await rm(workspace, { recursive: true, force: true });
}
