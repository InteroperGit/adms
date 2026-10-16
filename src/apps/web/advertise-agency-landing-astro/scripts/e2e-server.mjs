// Build deterministic versioned fixtures, then let Playwright own preview.
import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { preview } from 'astro';

const root = resolve('output/playwright/content');
const templates = JSON.parse(
  await readFile('data/templates/manifest.json', 'utf8'),
);
for (const entry of templates.files.filter((item) => item.kind === 'json')) {
  const path = entry.output ?? entry.path;
  const value = JSON.parse(
    await readFile(resolve('tests/fixtures/content/site', path), 'utf8'),
  );
  if (path === 'order-inquiry.json') value.submission.enabled = true;
  const target = resolve(root, path);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, JSON.stringify(value, null, 2));
}
for (const kind of ['services', 'projects', 'fixtures']) {
  await mkdir(resolve(root, 'articles', kind), { recursive: true });
}
await mkdir(resolve(root, 'fixtures/articles'), { recursive: true });

const env = {
  ...process.env,
  E2E_CONTENT_ROOT: './output/playwright/content',
};
const astro = resolve('node_modules/astro/bin/astro.mjs');
let child;
for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => {
    child?.kill(signal);
  });
}
function run(args) {
  return new Promise((accept, reject) => {
    child = spawn(process.execPath, [astro, ...args], {
      env,
      stdio: 'inherit',
    });
    child.once('error', reject);
    child.once('exit', (code) => {
      if (code === 0) accept();
      else reject(new Error(`Astro exited with ${code}`));
    });
  });
}
await run(['build', '--config', 'scripts/e2e.config.mjs']);
// The API avoids the CLI daemon and leaves existing preview servers alone.
const server = await preview({
  configFile: 'scripts/e2e.config.mjs',
  server: { host: '127.0.0.1', port: 4327 },
});
for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, async () => {
    await server.stop();
    process.exit(0);
  });
}
