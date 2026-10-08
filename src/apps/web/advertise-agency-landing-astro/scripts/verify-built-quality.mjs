// Check generated HTML for stable layout, semantics, and basic accessibility.
// Browser and assistive-technology behavior still needs real-device review.
import { readFile, readdir } from 'node:fs/promises';

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
const files = await htmlFiles('dist');
for (const file of files) {
  const html = await readFile(file, 'utf8');
  const route = file.replace(/^dist[\\/]/, '');
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
