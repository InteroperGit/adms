import { lstat, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);

const standardTargets = ['.astro', '.playwright-cli', 'coverage', 'dist'];

function isInsideRoot(root, target) {
  const relativeTarget = path.relative(root, target);
  return (
    relativeTarget !== '' &&
    relativeTarget !== '..' &&
    !relativeTarget.startsWith(`..${path.sep}`) &&
    !path.isAbsolute(relativeTarget)
  );
}

async function inspectTarget(root, relativeTarget) {
  const target = path.resolve(root, relativeTarget);

  if (!isInsideRoot(root, target)) {
    throw new Error(`Refusing path outside project root: ${relativeTarget}`);
  }

  try {
    const details = await lstat(target);
    return { target, exists: true, isSymbolicLink: details.isSymbolicLink() };
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { target, exists: false, isSymbolicLink: false };
    }

    throw error;
  }
}

export async function cleanTemporaryFiles(options = {}) {
  const root = path.resolve(options.root ?? projectRoot);
  const apply = options.apply === true;
  const includeOutput = options.includeOutput === true;
  const targets = includeOutput
    ? [...standardTargets, 'output']
    : standardTargets;
  const results = [];
  const rootDetails = await lstat(root);

  if (rootDetails.isSymbolicLink()) {
    throw new Error('Refusing a project root that is a symbolic link.');
  }

  for (const relativeTarget of targets) {
    const inspected = await inspectTarget(root, relativeTarget);

    if (!inspected.exists) {
      results.push({ relativeTarget, status: 'missing' });
      continue;
    }

    if (inspected.isSymbolicLink) {
      results.push({ relativeTarget, status: 'skipped-symlink' });
      continue;
    }

    if (apply) {
      await rm(inspected.target, { recursive: true, force: true });
    }

    results.push({ relativeTarget, status: apply ? 'removed' : 'preview' });
  }

  return results;
}

function parseArguments(args) {
  const unknown = args.filter(
    (argument) => !['--apply', '--all'].includes(argument),
  );

  if (unknown.length > 0) {
    throw new Error(`Unknown option: ${unknown[0]}`);
  }

  return {
    apply: args.includes('--apply'),
    includeOutput: args.includes('--all'),
  };
}

function printResults(results, apply) {
  for (const result of results) {
    const status = {
      missing: 'missing; skipped',
      'skipped-symlink': 'symlink; skipped',
      preview: 'would remove',
      removed: 'removed',
    }[result.status];

    console.log(`${status}: ${result.relativeTarget}`);
  }

  if (!apply) {
    console.log('Preview only. Pass --apply to remove listed targets.');
  }
}

async function main() {
  try {
    const options = parseArguments(process.argv.slice(2));
    const results = await cleanTemporaryFiles(options);
    printResults(results, options.apply);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

if (path.resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) {
  await main();
}
