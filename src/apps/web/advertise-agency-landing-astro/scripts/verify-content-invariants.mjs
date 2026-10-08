// Check JSON content invariants before the schema-backed Astro build.
// This gives content editors a fast, dependency-free diagnostic command.
import { readFile, readdir } from 'node:fs/promises';

const directory = 'data/content';
const files = (await readdir(directory)).filter(name => name.endsWith('.json'));
const urlFields = new Set([
  'avatar', 'endpoint', 'href', 'image', 'mapSrc', 'src',
]);
const errors = [];

function visit(value, path) {
  if (Array.isArray(value)) {
    const keyed = value.filter(item => item && typeof item === 'object'
      && 'id' in item);
    const seen = new Map();
    keyed.forEach((item, index) => {
      const id = item.id;
      const first = seen.get(id);
      if (first !== undefined) {
        errors.push(`${path}[${index}].id duplicates ${path}[${first}].id`);
      } else {
        seen.set(id, index);
      }
    });
    value.forEach((item, index) => visit(item, `${path}[${index}]`));
    return;
  }
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    const childPath = `${path}.${key}`;
    if (urlFields.has(key) && typeof child === 'string' && child) {
      if (/^[a-z]+:/i.test(child) && !/^https?:\/\//i.test(child)) {
        errors.push(`${childPath} uses an unsafe URL scheme`);
      }
      if (/[\u0000-\u0020\u007f\\]/.test(child)) {
        errors.push(`${childPath} contains control characters or spaces`);
      }
      if (child.startsWith('//')) {
        errors.push(`${childPath} must not be protocol-relative`);
      }
      try {
        const parsed = new URL(child, 'https://content.invalid');
        if (parsed.username || parsed.password) {
          errors.push(`${childPath} contains URL credentials`);
        }
      } catch {
        errors.push(`${childPath} is not a valid URL or root-relative path`);
      }
    }
    if ((key === 'width' || key === 'height' || key === 'imageWidth'
      || key === 'imageHeight') &&
      (!Number.isInteger(child) || child <= 0)) {
      errors.push(`${childPath} must be a positive integer`);
    }
    visit(child, childPath);
  }
}

for (const file of files) {
  const data = JSON.parse(await readFile(`${directory}/${file}`, 'utf8'));
  visit(data, file);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Content invariants passed for ${files.length} files.`);
}
