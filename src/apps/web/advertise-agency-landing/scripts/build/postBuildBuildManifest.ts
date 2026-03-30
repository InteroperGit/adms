/**
 * Post-build script for generating deployment manifests.
 * Creates manifest.json (file-level) and buildMeta.json (build-level) for smart S3 deployment.
 *
 * Usage:
 *   vite-node scripts/postBuildBuildManifest.ts
 *
 * Output:
 *   - build/client/manifest.json — detailed file manifest with SHA-256 hashes
 *   - build/client/buildMeta.json — build-wide hash and metadata
 */

import { createHash } from 'crypto';
import { createReadStream } from 'fs';
import { readdir, stat, writeFile } from 'fs/promises';
import { join, relative } from 'path';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

function log(message: string) {
  console.log(`${colors.cyan}[build-manifest]${colors.reset} ${message}`);
}

function logSuccess(message: string) {
  console.log(
    `${colors.cyan}[build-manifest]${colors.reset} ${colors.green}✓${colors.reset} ${message}`
  );
}

function logError(message: string) {
  console.log(
    `${colors.cyan}[build-manifest]${colors.reset} ${colors.red}✗${colors.reset} ${message}`
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Cache-control header constants for S3 metadata
 */
const CACHE_CONTROL = {
  HTML: 'no-cache',
  ASSET: 'public,max-age=31536000,immutable',
  DEFAULT: 'public,max-age=3600',
} as const;

type FileType = 'html' | 'asset';

interface FileEntry {
  sha256: string;
  size: number;
  type: FileType;
  cacheControl: string;
}

interface Manifest {
  version: string;
  files: Record<string, FileEntry>;
}

interface BuildMeta {
  buildHash: string;
  gitSha: string | null;
  createdAt: string;
  entryCount: number;
  totalSize: number;
}

/**
 * Classify file type based on path and extension
 */
function classifyFile(filePath: string): FileType {
  if (filePath.endsWith('.html')) {
    return 'html';
  }
  return 'asset';
}

/**
 * Get cache-control header based on file type
 */
function getCacheControl(type: FileType): string {
  if (type === 'html') {
    return CACHE_CONTROL.HTML;
  }
  return CACHE_CONTROL.ASSET;
}

/**
 * Calculate SHA-256 hash of file contents using streaming for efficiency
 */
async function calculateFileHash(filePath: string): Promise<string> {
  const hash = createHash('sha256');
  const stream = createReadStream(filePath);
  for await (const chunk of stream) {
    hash.update(chunk);
  }
  return hash.digest('hex');
}

/**
 * Get git SHA if available (for build metadata)
 */
async function getGitSha(): Promise<string | null> {
  try {
    const { exec } = await import('child_process');
    return await new Promise((resolve) => {
      exec('git rev-parse --short HEAD', (error, stdout) => {
        if (error || !stdout.trim()) {
          resolve(null);
        } else {
          resolve(stdout.trim());
        }
      });
    });
  } catch {
    return null;
  }
}

/**
 * Recursively walk directory and collect all files
 */
async function walkDirectory(dir: string, baseDir: string): Promise<string[]> {
  const files: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    const relativePath = relative(baseDir, fullPath);

    // Normalize path to forward slashes for S3 compatibility
    const normalizedPath = relativePath.replace(/\\/g, '/');

    if (entry.isDirectory()) {
      const nested = await walkDirectory(fullPath, baseDir);
      files.push(...nested);
    } else {
      files.push(normalizedPath);
    }
  }

  return files;
}

/**
 * Main manifest generation function
 */
async function generateManifests() {
  const startTime = Date.now();

  // Resolve paths
  const scriptDir = join(import.meta.dirname);
  const rootDir = join(scriptDir, '..', '..');
  const buildDir = join(rootDir, 'build/client');

  log('Starting manifest generation...');

  // Verify build directory exists
  try {
    await stat(buildDir);
  } catch {
    logError(`Build directory not found: ${buildDir}`);
    logError('Run "pnpm build" first');
    process.exit(1);
  }

  // Collect all files
  log('Scanning build directory...');
  const allFiles = await walkDirectory(buildDir, buildDir);

  // Filter out manifest files themselves (they'll be added after)
  const contentFiles = allFiles.filter((f) => f !== 'manifest.json' && f !== 'buildMeta.json');

  log(`Found ${contentFiles.length} files to process`);

  // Process files in parallel batches for efficiency
  const files: Record<string, FileEntry> = {};
  let totalSize = 0;
  const BATCH_SIZE = 10;

  for (let i = 0; i < contentFiles.length; i += BATCH_SIZE) {
    const batch = contentFiles.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(
      batch.map(async (file) => {
        const fullPath = join(buildDir, file);
        const [fileStat, hash] = await Promise.all([stat(fullPath), calculateFileHash(fullPath)]);
        const type = classifyFile(file);
        const cacheControl = getCacheControl(type);

        return [
          file,
          {
            sha256: hash,
            size: fileStat.size,
            type,
            cacheControl,
          },
        ] as [string, FileEntry];
      })
    );

    for (const [file, entry] of results) {
      files[file] = entry;
      totalSize += entry.size;
    }
  }

  // Sort files alphabetically for stable manifests
  const sortedFiles = Object.fromEntries(
    Object.entries(files).sort(([a], [b]) => a.localeCompare(b))
  );

  // Compute build-wide hash from all file hashes
  const hashStrings = Object.values(sortedFiles)
    .map((entry) => entry.sha256)
    .join('');
  const buildHash = createHash('sha256').update(hashStrings).digest('hex');

  // Get git SHA
  const gitSha = await getGitSha();

  // Create manifests
  const manifest: Manifest = {
    version: gitSha || 'unknown',
    files: sortedFiles,
  };

  const buildMeta: BuildMeta = {
    buildHash: `sha256:${buildHash}`,
    gitSha,
    createdAt: new Date().toISOString(),
    entryCount: Object.keys(sortedFiles).length,
    totalSize,
  };

  // Write manifests
  const manifestPath = join(buildDir, 'manifest.json');
  const buildMetaPath = join(buildDir, 'buildMeta.json');

  log('Writing manifest.json...');
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');

  log('Writing buildMeta.json...');
  await writeFile(buildMetaPath, JSON.stringify(buildMeta, null, 2), 'utf-8');

  // Log summary
  const duration = Date.now() - startTime;
  const htmlCount = Object.values(sortedFiles).filter((f) => f.type === 'html').length;
  const assetCount = Object.values(sortedFiles).filter((f) => f.type === 'asset').length;

  logSuccess(`Manifest generation complete in ${duration}ms`);
  console.log(`
${colors.dim}=== Build Manifest Summary ===${colors.reset}
Total files:     ${Object.keys(sortedFiles).length}
  HTML:          ${htmlCount}
  Assets:        ${assetCount}
Total size:      ${formatBytes(totalSize)}
Build hash:      ${buildHash.substring(0, 12)}...
Git SHA:         ${gitSha || 'N/A'}
${colors.dim}Output:${colors.reset}
  - ${manifestPath}
  - ${buildMetaPath}
`);
}

// Run
generateManifests().catch((err) => {
  logError('Manifest generation failed');
  console.error(err);
  process.exit(1);
});
