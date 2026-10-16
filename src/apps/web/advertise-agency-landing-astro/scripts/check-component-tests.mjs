// Keep Astro component tests beside the source component they cover.
import { readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = 'tests/components';
const testPattern = /\.(test|spec)\.(ts|tsx|js|jsx)$/;
const violations = [];

async function walk(directory) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error?.code === 'ENOENT') return;
    throw error;
  }

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (testPattern.test(entry.name)) violations.push(relative('.', path));
  }
}

await walk(root);

if (violations.length) {
  console.error('Component tests must be colocated with src/components:');
  console.error(violations.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Component test colocation passed: tests/components is empty.');
}
