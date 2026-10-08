// Verify remote media and styles before deploying the static output.
// This check confirms availability and type; legal ownership needs review.
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const root = new URL('..', import.meta.url);
const timeoutMs = 10_000;
const sourceFiles = [
  'data/content/about-carousel.json',
  'data/content/introduction.json',
  'data/content/projects.json',
  'data/content/reviews.json',
  'data/content/site.json',
  'data/content/offers.json',
  'src/layouts/Layout.astro',
];
const expectedTypes = [
  { test: /cdnjs\.cloudflare\.com/, type: 'text/css' },
  { test: /yandex\.ru\/map-widget/, type: 'text/html' },
  { test: /\.(?:avif|gif|jpe?g|png|svg|webp)(?:\?|$)/i,
    type: 'image/' },
  { test: /picsum\.photos|pravatar\.cc/, type: 'image/' },
  { test: /upload\.wikimedia\.org/, type: 'image/' },
];

async function readText(path) {
  return readFile(new URL(path, root), 'utf8');
}

function urlsIn(text) {
  return [...text.matchAll(/https?:\/\/[^\s"'<>]+/g)]
    .map(match => match[0].replace(/[),.;]+$/, ''));
}

async function filesIn(directory) {
  const entries = await readdir(new URL(directory, root), {
    withFileTypes: true,
  });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await filesIn(path));
    else files.push(path);
  }
  return files;
}

function expectedType(url) {
  return expectedTypes.find(item => item.test.test(url))?.type ?? null;
}

async function inspect(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: { Range: 'bytes=0-1023' },
    });
    const contentType = response.headers.get('content-type') ?? '';
    const expected = expectedType(url);
    const validType = !expected || contentType.startsWith(expected);
    return {
      ok: response.ok && validType,
      status: response.status,
      contentType,
      expected,
      finalUrl: response.url,
    };
  } finally {
    clearTimeout(timer);
  }
}

const sources = await Promise.all(sourceFiles.map(readText));
const builtFiles = await filesIn('dist');
const built = await Promise.all(builtFiles.map(path => readText(path)));
const urls = new Set([...sources, ...built].flatMap(urlsIn));
const internalOrigins = new Set();
for (const [index, path] of builtFiles.entries()) {
  if (!path.endsWith('sitemap.xml')) continue;
  for (const url of urlsIn(built[index])) {
    internalOrigins.add(new URL(url).origin);
  }
}
for (const url of urls) {
  // XML namespace declarations are URLs, but they are not resources.
  const hostname = new URL(url).hostname;
  if (hostname === 'www.w3.org' || hostname === 'www.sitemaps.org') {
    urls.delete(url);
  }
  if (internalOrigins.has(new URL(url).origin)) urls.delete(url);
  // The layout builds the CDN stylesheet URL from this base prefix.
  if (url === 'https://cdnjs.cloudflare.com/ajax/libs/') urls.delete(url);
}
const results = [];

for (const url of urls) {
  try {
    results.push({ url, ...(await inspect(url)) });
  } catch (error) {
    results.push({
      url,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

for (const result of results) {
  const state = result.ok ? 'PASS' : 'FAIL';
  const detail = result.error ??
    `${result.status} ${result.contentType}`;
  console.log(`${state} ${result.url} — ${detail}`);
}

const failures = results.filter(result => !result.ok);
if (failures.length > 0) {
  console.error(`External asset verification failed: ${failures.length}`);
  process.exitCode = 1;
}
