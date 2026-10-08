// Fail releases missing the production origin or generated SEO metadata.
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = new URL('..', import.meta.url);
const siteUrl = process.env.PUBLIC_SITE_URL?.trim();
if (!siteUrl) {
  throw new Error('PUBLIC_SITE_URL is required for release verification');
}

const origin = new URL(siteUrl);
if (origin.protocol !== 'https:') {
  throw new Error('PUBLIC_SITE_URL must use HTTPS');
}
if (origin.pathname !== '/' || origin.search || origin.hash) {
  throw new Error('PUBLIC_SITE_URL must contain only an HTTPS origin');
}

const routes = [
  'index.html',
  'privacy-policy/index.html',
  'terms-of-use/index.html',
  'projects/1/index.html',
  'projects/2/index.html',
  'projects/3/index.html',
  'services/vyveski/index.html',
  'services/svetovye-bukvy/index.html',
  'services/obyomnye-konstruktsii/index.html',
  'services/neon/index.html',
  'services/montazh/index.html',
];
const expectedOrigin = origin.href;
const errors = [];

function meta(html, pattern, label, route) {
  if (!pattern.test(html)) errors.push(`${route}: missing ${label}`);
}

for (const route of routes) {
  const html = await readFile(new URL(join('dist', route), root), 'utf8');
  const path = route === 'index.html'
    ? '/'
    : `/${route.replace('/index.html', '')}/`;
  const canonical = new URL(path, origin).href;
  meta(html, new RegExp(`<link rel="canonical" href="${canonical}"`),
    'canonical URL', route);
  meta(html, new RegExp(`<meta property="og:url" content="${canonical}"`),
    'Open Graph URL', route);
  meta(html, /<meta name="description" content="[^"]+"/, 'description',
    route);
}

const robots = await readFile(new URL('dist/robots.txt', root), 'utf8');
if (!robots.includes(`Sitemap: ${new URL('sitemap.xml', origin).href}`)) {
  errors.push('robots.txt: missing production sitemap');
}
const sitemap = await readFile(new URL('dist/sitemap.xml', root), 'utf8');
if (!sitemap.includes(expectedOrigin)) errors.push('sitemap.xml: wrong origin');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Release metadata verified for ${expectedOrigin}`);
}
