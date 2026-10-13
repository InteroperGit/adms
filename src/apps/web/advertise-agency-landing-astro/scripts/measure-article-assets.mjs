// Measure emitted HTML and transitively imported JS, excluding lazy imports.
import { readFile, readdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

const root = resolve(process.argv[2] ?? 'dist');
const routes = process.argv.slice(3);
if (!routes.length) routes.push('projects/2/', 'services/svetovye-bukvy/');

async function dependencyBytes(path, seen = new Set()) {
  if (seen.has(path)) return { bytes: 0, gzip: 0 };
  seen.add(path);
  const code = await readFile(path);
  const total = { bytes: code.length, gzip: gzipSync(code).length };
  const imports = [...code.toString().matchAll(
    /(?:\bfrom\s*|\bimport\s*)["']([^"']+\.js)["']/g,
  )];
  for (const [, specifier] of imports) {
    const imported = await dependencyBytes(
      resolve(dirname(path), specifier), seen,
    );
    total.bytes += imported.bytes;
    total.gzip += imported.gzip;
  }
  return total;
}

const measurements = [];
for (const route of routes) {
  const html = await readFile(resolve(root, route, 'index.html'));
  const sources = [...html.toString().matchAll(
    /<script\b[^>]*src="([^"?]+)"/g,
  )];
  const inlineScripts = [...html.toString().matchAll(
    /<script\b[^>]*>([\s\S]*?)<\/script>/g,
  )].map(([, code]) => code);
  const seen = new Set();
  const js = {
    bytes: inlineScripts.reduce((total, code) =>
      total + Buffer.byteLength(code), 0),
    gzip: inlineScripts.reduce((total, code) =>
      total + gzipSync(code).length, 0),
  };
  for (const code of inlineScripts) {
    for (const [, source] of code.matchAll(
      /(?:\bfrom\s*|\bimport\s*)["'`]([^"'`]+\.js)["'`]/g,
    )) {
      sources.push(['', source]);
    }
  }
  for (const [, source] of sources) {
    if (!source.startsWith('/_astro/')) continue;
    const bytes = await dependencyBytes(resolve(root, `.${source}`), seen);
    js.bytes += bytes.bytes;
    js.gzip += bytes.gzip;
  }
  measurements.push({
    route, html: html.length, htmlGzip: gzipSync(html).length,
    initialJS: js.bytes, initialJSGzip: js.gzip,
  });
}
const chunks = [];
for (const name of await readdir(resolve(root, '_astro'))) {
  if (!name.endsWith('.js')) continue;
  const code = await readFile(resolve(root, '_astro', name));
  chunks.push({ name, bytes: code.length, gzip: gzipSync(code).length });
}
console.log(JSON.stringify({
  measurements, largestChunk: chunks.sort((a, b) => b.bytes - a.bytes)[0],
}, null, 2));
