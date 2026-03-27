/**
 * Post-build script for incremental SSG cache management.
 * Runs after vite-react-ssg build to restore cached files and save new cache.
 *
 * Usage:
 *   vite-node scripts/postbuild-cache.ts [--verbose]
 *
 * Flags:
 *   --verbose  Show detailed per-route hash information
 *
 * Example:
 *   react-router build && vite-node scripts/postbuild-cache.ts
 *   react-router build && vite-node scripts/postbuild-cache.ts --verbose
 */

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import {
  type RouteManifest,
  computeRouteManifest,
  loadPreviousManifest,
  diffManifest,
  restoreCached,
  saveCache,
  readBuildDiff,
  clearBuildDiff,
} from '../src/plugins/incrementalSSGPlugin.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Parse command line flags
const verbose = process.argv.includes('--verbose');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(message: string) {
  console.log(`${colors.cyan}[incremental-ssg]${colors.reset} ${message}`);
}

function logSuccess(message: string) {
  console.log(
    `${colors.cyan}[incremental-ssg]${colors.reset} ${colors.green}✓${colors.reset} ${message}`
  );
}

function logWarning(message: string) {
  console.log(
    `${colors.cyan}[incremental-ssg]${colors.reset} ${colors.yellow}⚠${colors.reset} ${message}`
  );
}

function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}

async function main() {
  const startTime = Date.now();
  const rootDir = resolve(__dirname, '..');
  const distDir = resolve(rootDir, 'build/client');

  try {
    log('Starting post-build cache management...');

    // Read the transient diff written by prerender() before the build.
    // Clear it immediately so a crashed build never leaves stale state.
    const buildDiff = readBuildDiff(rootDir);
    clearBuildDiff(rootDir);

    let currentManifest: RouteManifest;
    let changed: string[];
    let unchanged: string[];
    let firstBuild: boolean;
    let globalChanged: boolean;

    if (buildDiff) {
      // Fast path: manifest + diff were computed pre-build by prerender().
      // React Router only rendered diff.changed — unchanged routes need
      // to be restored from cache to complete build/client/.
      currentManifest = buildDiff.manifest;
      changed = buildDiff.changed;
      unchanged = buildDiff.unchanged;
      firstBuild = buildDiff.firstBuild;
      globalChanged = buildDiff.globalChanged;
    } else {
      // Fallback: diff file missing (e.g. cache cleared manually, old build).
      // React Router already rendered every route — restoreCached is a no-op,
      // but we still update the manifest for next time.
      log('Diff file not found — computing manifest diff post-build');
      currentManifest = computeRouteManifest(rootDir);
      const previousManifest = loadPreviousManifest(rootDir);
      const diff = diffManifest(previousManifest, currentManifest);
      changed = diff.changed;
      unchanged = diff.unchanged;
      firstBuild = !previousManifest;
      globalChanged = diff.globalChanged;
    }

    // Calculate stats
    const totalRoutes = Object.keys(currentManifest.routes).length;
    const changedCount = changed.length;
    const unchangedCount = unchanged.length;

    // Log build type and summary
    if (firstBuild) {
      logWarning('No previous manifest — first build');
    } else if (globalChanged) {
      logWarning('Global hash changed — full rebuild');
    } else {
      log(`${changedCount}/${totalRoutes} routes changed, ${unchangedCount} from cache`);
    }

    // Log changed routes (always show top-level summary, full list in verbose)
    if (changedCount > 0) {
      const changedRoutesList = changed.slice(0, 5);
      const moreRoutes = changedCount > 5 ? ` ... and ${changedCount - 5} more` : '';
      log(`Changed routes: ${changedRoutesList.join(', ')}${moreRoutes}`);

      if (verbose && changedCount > 5) {
        console.log(`${colors.dim}  Full list:${colors.reset}`);
        for (const route of changed) {
          console.log(`${colors.dim}    - ${route}${colors.reset}`);
        }
      }
    }

    // Restore unchanged files from cache.
    // In the fast path this is meaningful — React Router skipped these routes.
    // In the fallback path React Router already rendered them; this is a no-op.
    if (unchangedCount > 0) {
      log(`Restoring ${unchangedCount} files from cache...`);
      restoreCached(rootDir, distDir, unchanged, currentManifest);
    }

    // Save current state to cache for next build
    log('Saving cache for next build...');
    saveCache(rootDir, distDir, currentManifest);

    // Calculate and log duration
    const duration = Date.now() - startTime;
    logSuccess(`Cache management complete in ${formatDuration(duration)}`);

    // Show verbose per-route hash information if requested
    if (verbose) {
      const changedSet = new Set(changed);
      console.log(`\n${colors.dim}=== Verbose Route Information ===${colors.reset}`);
      for (const [route, routeEntry] of Object.entries(currentManifest.routes)) {
        const isChanged = changedSet.has(route);
        const status = isChanged
          ? `${colors.yellow}changed${colors.reset}`
          : `${colors.green}cached${colors.reset}`;
        console.log(
          `${colors.dim}${route}${colors.reset} [${status}] ${colors.dim}${routeEntry.hash.substring(0, 8)}...${colors.reset}`
        );
      }
    }
  } catch (err) {
    console.error(
      `${colors.cyan}[incremental-ssg]${colors.reset} ${colors.yellow}Error${colors.reset} during post-build:`,
      err
    );
    process.exit(1);
  }
}

main();
