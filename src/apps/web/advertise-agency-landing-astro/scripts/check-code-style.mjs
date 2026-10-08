// Enforce the repository's 80-column rule on changed source files.
// Existing legacy files can be cleaned up incrementally without hiding new
// violations behind a repository-wide baseline exception.
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';

const extensions = new Set([
  '.astro', '.css', '.js', '.json', '.mjs', '.ts', '.tsx',
]);
const changed = execFileSync('git', [
  '-c', 'safe.directory=D:/Projects/adms',
  'diff', '--name-only',
], { encoding: 'utf8' });
const untracked = execFileSync('git', [
  '-c', 'safe.directory=D:/Projects/adms',
  'ls-files', '--others', '--exclude-standard',
], { encoding: 'utf8' });
const files = [...new Set(`${changed}\n${untracked}`.split(/\r?\n/))]
  .map(path => path.replace(/^.*advertise-agency-landing-astro[\\/]/, ''))
  .filter(path => path && extensions.has(path.slice(path.lastIndexOf('.'))));
const violations = [];

for (const path of files) {
  const lines = (await readFile(path, 'utf8')).split(/\r?\n/);
  lines.forEach((line, index) => {
    if (line.length > 80) {
      violations.push(`${path}:${index + 1} (${line.length} columns)`);
    }
  });
}

if (violations.length) {
  console.error('Code-style violations:');
  console.error(violations.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Code style passed for ${files.length} changed files.`);
}
