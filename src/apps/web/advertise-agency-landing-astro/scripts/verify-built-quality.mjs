// Check generated HTML for stable layout, semantics, and basic accessibility.
// Browser and assistive-technology behavior still needs real-device review.
import { access, readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = `${directory}/${entry.name}`;
    if (entry.isDirectory()) files.push(...await htmlFiles(path));
    else if (entry.name.endsWith('.html')) files.push(path);
  }
  return files;
}

function attribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}=(?:"([^"]*)"|'([^']*)')`))
    ?.slice(1).find(Boolean);
}

const errors = [];
const root = process.argv[2] ?? 'dist';
const origin = process.argv[3];
const files = await htmlFiles(root);
const documents = new Map(await Promise.all(files.map(async (file) =>
  [resolve(file), await readFile(file, 'utf8')],
)));
const sitemap = await readFile(`${root}/sitemap.xml`, 'utf8');
if (origin ? !sitemap.includes(new URL('/', origin).href)
  : /<loc>/.test(sitemap)) {
  errors.push('sitemap: configured/unconfigured origin policy failed');
}
if (sitemap.includes('/__article-check/')) {
  errors.push('sitemap: test fixture route leaked');
}
for (const file of files) {
  const html = await readFile(file, 'utf8');
  const route = file.replace(/^dist[\\/]/, '');
  if (html.includes('/src/assets/')) {
    errors.push(`${route}: unresolved source asset URL`);
  }
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  if (new Set(ids).size !== ids.length) {
    errors.push(`${route}: duplicate rendered id`);
  }
  const noindex = /name="robots" content="noindex, follow"/.test(html);
  if (noindex && canonical && sitemap.includes(`<loc>${canonical[1]}</loc>`)) {
    errors.push(`${route}: noindex page included in sitemap`);
  }
  if (/DRAFT_(?:BLOCK|IMAGE)_MUST_NOT_RENDER/.test(html)) {
    errors.push(`${route}: draft fixture content leaked into HTML`);
  }
  if (origin) {
    const path = file.replace(root, '').replaceAll('\\', '/')
      .replace(/index\.html$/, '');
    if (canonical?.[1] !== new URL(path, origin).href) {
      errors.push(`${route}: canonical does not match configured origin`);
    }
  } else if (canonical) {
    errors.push(`${route}: canonical invented without configured origin`);
  }
  // Only source-bearing images are fetched; closed lightbox placeholders are
  // deliberately empty. Check local resources and native fragment targets.
  for (const [, attributeName, raw] of html.matchAll(
    /\b(href|src)="([^"<>]+)"/g,
  )) {
    const url = new URL(raw.replaceAll('&amp;', '&'), 'https://local.invalid');
    if (url.origin !== 'https://local.invalid') continue;
    const target = raw.startsWith('#') ? resolve(file)
      : resolve(root, `.${url.pathname}`,
        url.pathname.endsWith('/') ? 'index.html' : '');
    try {
      await access(target);
      if (attributeName === 'href' && url.hash && documents.has(target)) {
        const id = decodeURIComponent(url.hash.slice(1));
        if (!documents.get(target).includes(`id="${id}"`)) {
          errors.push(`${route}: broken fragment ${raw}`);
        }
      }
    } catch {
      errors.push(`${route}: missing local resource ${raw}`);
    }
  }
  if (!/<html\b[^>]*\blang="[^"]+"/.test(html)) {
    errors.push(`${route}: html lang is missing`);
  }
  if (!/<title>[^<]+<\/title>/.test(html)) {
    errors.push(`${route}: title is missing or empty`);
  }
  if (!/<meta name="description" content="[^"]+"/.test(html)) {
    errors.push(`${route}: description is missing or empty`);
  }
  for (const landmark of ['header', 'main', 'footer']) {
    const count = (html.match(new RegExp(`<${landmark}(?:\\s|>)`, 'g'))
      ?? []).length;
    if (landmark === 'header' ? count < 1 : count !== 1) {
      errors.push(`${route}: expected site landmarks`);
    }
  }
  const headings = [...html.matchAll(/<h([1-6])\b/g)]
    .map(match => Number(match[1]));
  if (headings.filter(level => level === 1).length !== 1) {
    errors.push(`${route}: expected exactly one h1`);
  }
  headings.slice(1).forEach((level, index) => {
    if (level > headings[index] + 1) {
      errors.push(`${route}: heading level jumps from h${headings[index]}`);
    }
  });
  for (const tag of html.matchAll(/<img\b[^>]*>/g)) {
    const image = tag[0];
    const label = attribute(image, 'alt');
    const width = Number(attribute(image, 'width'));
    const height = Number(attribute(image, 'height'));
    if (label === undefined && !/\balt(?:\s|=)/.test(image)) {
      errors.push(`${route}: image is missing alt`);
    }
    if (!Number.isInteger(width) || width <= 0 ||
      !Number.isInteger(height) || height <= 0) {
      errors.push(`${route}: image is missing intrinsic dimensions`);
    }
    if (!/class="[^"]*\bbrand-logo\b/.test(image) &&
      !attribute(image, 'loading')) {
      errors.push(`${route}: non-brand image is missing loading policy`);
    }
    const srcset = attribute(image, 'srcset');
    if (srcset) {
      for (const candidate of srcset.split(',')) {
        const url = candidate.trim().split(/\s+/)[0];
        if (!url.startsWith('/_astro/')) continue;
        try {
          await access(resolve(root, `.${url}`));
        } catch {
          errors.push(`${route}: optimized variant missing ${url}`);
        }
      }
    }
  }
  if (/[/\\](?:projects[/\\]\d+|services[/\\][a-z-]+)[/\\]/.test(file)) {
    const eager = [...html.matchAll(/<img\b[^>]*loading="eager"[^>]*>/g)];
    if (eager.length !== 1 || !eager[0][0].includes('fetchpriority="high"')) {
      errors.push(`${route}: expected one high-priority eager lead image`);
    }
  }
  if (/\btabindex=["'][1-9]/.test(html)) {
    errors.push(`${route}: positive tabindex harms keyboard order`);
  }
  if (/href=["'](?:javascript:|data:)/i.test(html)) {
    errors.push(`${route}: unsafe link scheme found`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Built quality checks passed for ${files.length} routes.`);
}
