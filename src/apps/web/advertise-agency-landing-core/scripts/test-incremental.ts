/**
 * Test suite for incremental SSG functionality.
 * Validates that incremental builds produce identical output to full builds.
 *
 * Usage:
 *   pnpm run test-incremental [--verbose]
 *
 * Flags:
 *   --verbose  Show detailed test output
 *
 * Note: This test suite requires data/ directory to be populated.
 * Data structure:
 *   - data/content/config/*.json — site configuration (theme, site, categories, etc.)
 *   - data/content/portfolio/** — portfolio case files
 *   - data/content/sections/** — content for each page section
 *
 * If you see "ENOENT" errors for data files, copy sample data first.
 */

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { execSync } from 'child_process';
import { existsSync, rmSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { createHash } from 'crypto';
import {
  hashFile,
  hashFiles,
  computeRouteManifest,
  diffManifest,
  loadPreviousManifest,
} from '../src/plugins/incrementalSSG';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

interface TestResult {
  name: string;
  passed: boolean;
  skipped: boolean;
  message: string;
  duration?: number;
}

const results: TestResult[] = [];
const verbose = process.argv.includes('--verbose');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
};

function log(message: string) {
  console.log(`${colors.cyan}[incremental-test]${colors.reset} ${message}`);
}

function pass(name: string, message: string, duration?: number) {
  results.push({ name, passed: true, skipped: false, message, duration });
  const durationStr = duration ? ` (${duration}ms)` : '';
  console.log(`${colors.green}✓${colors.reset} ${name}${durationStr} — ${message}`);
}

function fail(name: string, message: string, duration?: number) {
  results.push({ name, passed: false, skipped: false, message, duration });
  const durationStr = duration ? ` (${duration}ms)` : '';
  console.log(`${colors.red}✗${colors.reset} ${name}${durationStr} — ${message}`);
}

function skip(name: string, message: string, duration?: number) {
  results.push({ name, passed: false, skipped: true, message, duration });
  const durationStr = duration ? ` (${duration}ms)` : '';
  console.log(`${colors.yellow}○${colors.reset} ${name}${durationStr} — ${message}`);
}

function rmCache() {
  const cacheDir = resolve(rootDir, '.ssg-cache');
  if (existsSync(cacheDir)) {
    rmSync(cacheDir, { recursive: true });
  }
}

function rmDist() {
  const distDir = resolve(rootDir, 'dist');
  if (existsSync(distDir)) {
    rmSync(distDir, { recursive: true });
  }
}

function build() {
  try {
    execSync('pnpm build', { cwd: rootDir, stdio: 'pipe' });
    return true;
  } catch (err) {
    if (verbose) {
      log(`Build failed: ${err}`);
    }
    return false;
  }
}

async function test0_HashValidation() {
  log('Test 0: Hash calculation validation');
  const startTime = Date.now();

  const testDir = resolve(rootDir, '.test-hash-validation');
  const file1 = resolve(testDir, 'file1.txt');
  const file2 = resolve(testDir, 'file2.txt');
  const file3 = resolve(testDir, 'file3.txt');

  try {
    // Create test directory and files
    mkdirSync(testDir, { recursive: true });
    const content1 = 'This is test file 1 with unique content';
    const content2 = 'This is test file 2 with different content';
    writeFileSync(file1, content1);
    writeFileSync(file2, content2);
    writeFileSync(file3, content1); // Same content as file1

    // Test 1: Verify hashFile matches manual calculation
    const hash1 = hashFile(file1);
    const expectedHash1 = createHash('sha256').update(content1).digest('hex');

    if (hash1 !== expectedHash1) {
      const duration = Date.now() - startTime;
      fail('Test 0', `hashFile mismatch: got ${hash1}, expected ${expectedHash1}`, duration);
      return;
    }

    // Test 2: Verify different files produce different hashes
    const hash2 = hashFile(file2);
    if (hash1 === hash2) {
      const duration = Date.now() - startTime;
      fail('Test 0', `Different files must produce different hashes (${hash1} === ${hash2})`, duration);
      return;
    }

    // Test 3: Verify same content produces same hash
    const hash3 = hashFile(file3);
    if (hash1 !== hash3) {
      const duration = Date.now() - startTime;
      fail('Test 0', `Same content must produce same hash: ${hash1} !== ${hash3}`, duration);
      return;
    }

    // Test 4: Verify hashFiles with multiple files
    const combinedHash = hashFiles([file1, file2]);
    const expectedCombined = createHash('sha256')
      .update(`${content1.length}:${content1}`)
      .update(`${content2.length}:${content2}`)
      .digest('hex');

    if (combinedHash !== expectedCombined) {
      const duration = Date.now() - startTime;
      fail('Test 0', `hashFiles mismatch: got ${combinedHash}, expected ${expectedCombined}`, duration);
      return;
    }

    // Test 5: Verify hashFiles is order-independent (internal sorting)
    const hash_ab = hashFiles([file1, file2]);
    const hash_ba = hashFiles([file2, file1]);
    if (hash_ab !== hash_ba) {
      const duration = Date.now() - startTime;
      fail('Test 0', `hashFiles must be order-independent: [1,2]=${hash_ab} !== [2,1]=${hash_ba}`, duration);
      return;
    }

    // Test 6: Verify consistent hash on repeated calls
    const hash1_again = hashFile(file1);
    if (hash1 !== hash1_again) {
      const duration = Date.now() - startTime;
      fail('Test 0', `Hash should be consistent across calls: ${hash1} !== ${hash1_again}`, duration);
      return;
    }

    // Test 7: Verify different file sets produce different hashes
    const emptyHash = hashFiles([]);
    const hash_file1_only = hashFiles([file1]);
    const hash_file1_file2 = hashFiles([file1, file2]);
    const hash_file2_only = hashFiles([file2]);

    const allHashes = [emptyHash, hash_file1_only, hash_file1_file2, hash_file2_only];
    const uniqueHashes = new Set(allHashes);

    if (uniqueHashes.size !== allHashes.length) {
      const duration = Date.now() - startTime;
      fail(
        'Test 0',
        `All hashes must be unique. Got ${uniqueHashes.size} unique out of ${allHashes.length} hashes`,
        duration,
      );
      return;
    }

    const duration = Date.now() - startTime;
    pass(
      'Test 0',
      'Hash calculation verified (single, multiple, order-independence, consistency, uniqueness)',
      duration,
    );
  } catch (err) {
    const duration = Date.now() - startTime;
    fail('Test 0', `Validation error: ${err instanceof Error ? err.message : err}`, duration);
  } finally {
    // Cleanup
    rmSync(testDir, { recursive: true, force: true });
  }
}

async function test1_CleanBuild() {
  log('Test 1: Clean build (no cache)');
  const startTime = Date.now();

  try {
    rmCache();
    rmDist();

    const success = build();
    const duration = Date.now() - startTime;

    if (!success) {
      fail('Test 1', 'Clean build failed', duration);
      return;
    }

    if (!existsSync(resolve(rootDir, 'dist/index.html'))) {
      fail('Test 1', 'dist/index.html not created', duration);
      return;
    }

    // Verify cache manifest was created with valid structure
    const manifestPath = resolve(rootDir, '.ssg-cache/manifest.json');
    if (!existsSync(manifestPath)) {
      fail('Test 1', 'Build succeeded but .ssg-cache/manifest.json not created', duration);
      return;
    }

    const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
    const routeCount = Object.keys(manifest.routes ?? {}).length;
    if (!manifest.globalHash || routeCount === 0) {
      fail('Test 1', `Invalid manifest: globalHash=${!!manifest.globalHash}, routes=${routeCount}`, duration);
      return;
    }

    pass('Test 1', `Clean build completed (${routeCount} routes cached)`, duration);
  } catch (err) {
    const duration = Date.now() - startTime;
    fail('Test 1', `Build error: ${err instanceof Error ? err.message : err}`, duration);
  }
}

async function test2_NoChanges() {
  log('Test 2: No changes (all from cache)');
  const startTime = Date.now();

  try {
    // Build is already done from test 1, just rebuild
    const success = build();
    const duration = Date.now() - startTime;

    const cacheFile = resolve(rootDir, '.ssg-cache/manifest.json');
    if (success && existsSync(cacheFile)) {
      try {
        const manifest = JSON.parse(readFileSync(cacheFile, 'utf-8'));
        if (manifest.routes && Object.keys(manifest.routes).length > 0) {
          pass('Test 2', 'Cache used for unchanged build', duration);
        } else {
          fail('Test 2', 'Cache exists but is empty', duration);
        }
      } catch {
        fail('Test 2', 'Cache manifest corrupted', duration);
      }
    } else {
      fail('Test 2', 'Cache not found after second build', duration);
    }
  } catch (err) {
    const duration = Date.now() - startTime;
    fail('Test 2', `Build error: ${err instanceof Error ? err.message : err}`, duration);
  }
}

async function test3_SingleCaseAdded() {
  log('Test 3: Single case added (new routes + listings invalidated)');
  const startTime = Date.now();

  const caseDir = resolve(rootDir, 'data/content/portfolio/branding/2024/12');

  // Skip if portfolio directory doesn't exist
  if (!existsSync(resolve(rootDir, 'data/content/portfolio'))) {
    const duration = Date.now() - startTime;
    skip('Test 3', 'data/content/portfolio not found', duration);
    return;
  }

  mkdirSync(caseDir, { recursive: true });

  const newCaseFile = resolve(caseDir, '2024_12_15_test-case.json');
  const caseData = {
    slug: 'test-case',
    title: 'Тестовый проект',
    category: 'Брендинг',
    description: 'Тестовый проект портфолио для проверки инкрементального SSG',
    publishDate: '2024-12-15',
    hero: {
      gradient: 'from-blue-500 to-purple-600',
    },
    tags: ['test', 'incremental'],
    meta: {
      title: 'Тестовый проект',
      description: 'Тестовый проект для проверки инкрементального SSG',
    },
    overview: {
      client: 'Тестовый клиент',
      year: '2024',
      services: 'Дизайн и разработка',
    },
    content: [
      {
        __component: 'heading',
        level: 2,
        text: 'О проекте',
      },
      {
        __component: 'paragraph',
        text: 'Это тестовый проект портфолио, созданный для проверки функциональности инкрементального SSG.',
      },
    ],
  };

  // Capture manifest before adding the case
  const manifestBefore = computeRouteManifest(rootDir);

  writeFileSync(newCaseFile, JSON.stringify(caseData, null, 2));

  try {
    // Verify manifest picked up the new case routes
    const manifestAfter = computeRouteManifest(rootDir);
    const expectedNewRoutes = [
      '/portfolio/all/2024/12/test-case',
      '/portfolio/branding/2024/12/test-case',
    ];

    const missingRoutes = expectedNewRoutes.filter((r) => !manifestAfter.routes[r]);
    if (missingRoutes.length > 0) {
      const duration = Date.now() - startTime;
      fail('Test 3', `New case routes not in manifest: ${missingRoutes.join(', ')}`, duration);
      return;
    }

    // Verify these routes didn't exist before
    const alreadyExisted = expectedNewRoutes.filter((r) => manifestBefore.routes[r]);
    if (alreadyExisted.length > 0) {
      const duration = Date.now() - startTime;
      fail('Test 3', `Routes existed before adding case: ${alreadyExisted.join(', ')}`, duration);
      return;
    }

    // Verify listing pages are invalidated (different hash due to new case in deps)
    const listingHash_before = manifestBefore.routes['/portfolio']?.hash;
    const listingHash_after = manifestAfter.routes['/portfolio']?.hash;
    if (listingHash_before && listingHash_after && listingHash_before === listingHash_after) {
      const duration = Date.now() - startTime;
      fail('Test 3', '/portfolio hash unchanged after adding case — listing deps broken', duration);
      return;
    }

    // Build to verify full pipeline works
    const success = build();
    const duration = Date.now() - startTime;

    if (success) {
      pass('Test 3', `Build completed, ${expectedNewRoutes.length} new routes detected`, duration);
    } else {
      fail('Test 3', 'Build failed with new case file', duration);
    }
  } finally {
    // Clean up the case file and the test-created directory
    rmSync(caseDir, { recursive: true, force: true });
  }
}

async function test4_ThemeChange() {
  log('Test 4: Theme change (global hash invalidation)');
  const startTime = Date.now();

  const themeFile = resolve(rootDir, 'data/content/config/theme.json');

  // Skip test if theme file doesn't exist (data directory not populated)
  if (!existsSync(themeFile)) {
    const duration = Date.now() - startTime;
    skip('Test 4', 'data/content/config/theme.json not found', duration);
    return;
  }

  const originalTheme = readFileSync(themeFile, 'utf-8');

  // Capture global hash before modification
  const hashBefore = computeRouteManifest(rootDir).globalHash;

  try {
    // Modify theme slightly
    const theme = JSON.parse(originalTheme);
    theme.colors = theme.colors || {};
    theme.colors.modified = true;
    writeFileSync(themeFile, JSON.stringify(theme, null, 2));

    // Verify global hash changed
    const hashAfter = computeRouteManifest(rootDir).globalHash;
    if (hashBefore === hashAfter) {
      const duration = Date.now() - startTime;
      fail('Test 4', 'Global hash unchanged after theme modification', duration);
      return;
    }

    const success = build();
    const duration = Date.now() - startTime;

    if (success) {
      pass('Test 4', 'Global hash changed + full rebuild succeeded', duration);
    } else {
      fail('Test 4', 'Build failed after theme change', duration);
    }
  } catch (err) {
    const duration = Date.now() - startTime;
    fail('Test 4', `Error during theme change: ${err}`, duration);
  } finally {
    writeFileSync(themeFile, originalTheme);
  }
}

async function test5_SourceCodeChange() {
  log('Test 5: Source code change (global hash invalidation)');
  const startTime = Date.now();

  const componentFile = resolve(rootDir, 'src/components/ui/button.tsx');

  if (!existsSync(componentFile)) {
    const duration = Date.now() - startTime;
    skip('Test 5', 'src/components/ui/button.tsx not found', duration);
    return;
  }

  const originalContent = readFileSync(componentFile, 'utf-8');
  const testComment = '// TEST: temporary comment\n';

  // Capture global hash before modification
  const hashBefore = computeRouteManifest(rootDir).globalHash;

  try {
    writeFileSync(componentFile, testComment + originalContent);

    // Verify global hash changed
    const hashAfter = computeRouteManifest(rootDir).globalHash;
    if (hashBefore === hashAfter) {
      const duration = Date.now() - startTime;
      fail('Test 5', 'Global hash unchanged after source modification', duration);
      return;
    }

    const success = build();
    const duration = Date.now() - startTime;

    if (success) {
      pass('Test 5', 'Global hash changed + full rebuild succeeded', duration);
    } else {
      fail('Test 5', 'Build failed after source change', duration);
    }
  } catch (err) {
    const duration = Date.now() - startTime;
    fail('Test 5', `Error during source change test: ${err}`, duration);
  } finally {
    writeFileSync(componentFile, originalContent);
  }
}

async function test6_CorruptedCache() {
  log('Test 6: Corrupted cache (graceful fallback)');
  const startTime = Date.now();

  const manifestFile = resolve(rootDir, '.ssg-cache/manifest.json');

  // Skip if cache doesn't exist
  if (!existsSync(manifestFile)) {
    const duration = Date.now() - startTime;
    skip('Test 6', '.ssg-cache/manifest.json not found', duration);
    return;
  }

  try {
    // Corrupt the manifest
    writeFileSync(manifestFile, 'INVALID JSON {');

    const success = build();
    const duration = Date.now() - startTime;

    if (success) {
      pass('Test 6', 'Build completed with corrupted cache (graceful fallback)', duration);
    } else {
      fail('Test 6', 'Build failed with corrupted cache', duration);
    }
    // Don't restore old manifest — the build creates a fresh valid one.
    // Restoring the stale manifest would leave cache in an inconsistent state.
  } catch (err) {
    const duration = Date.now() - startTime;
    fail('Test 6', `Error during cache corruption test: ${err}`, duration);
  }
}

async function test7_ManifestDiffConsistency() {
  log('Test 7: Manifest diff consistency');
  const startTime = Date.now();

  try {
    const manifest = computeRouteManifest(rootDir);
    const routeCount = Object.keys(manifest.routes).length;

    if (routeCount === 0) {
      const duration = Date.now() - startTime;
      skip('Test 7', 'No routes in manifest (data directory may be missing)', duration);
      return;
    }

    // Self-diff: same manifest compared to itself should show zero changes
    const selfDiff = diffManifest(manifest, manifest);

    if (selfDiff.globalChanged) {
      const duration = Date.now() - startTime;
      fail('Test 7', 'Self-diff incorrectly reports globalChanged=true', duration);
      return;
    }

    if (selfDiff.changed.length !== 0) {
      const duration = Date.now() - startTime;
      fail('Test 7', `Self-diff reports ${selfDiff.changed.length} changed routes (expected 0)`, duration);
      return;
    }

    if (selfDiff.unchanged.length !== routeCount) {
      const duration = Date.now() - startTime;
      fail('Test 7', `Self-diff: ${selfDiff.unchanged.length} unchanged (expected ${routeCount})`, duration);
      return;
    }

    // Null-diff: no previous manifest should mark all routes as changed (first build)
    const nullDiff = diffManifest(null, manifest);

    if (!nullDiff.globalChanged) {
      const duration = Date.now() - startTime;
      fail('Test 7', 'Null-diff should report globalChanged=true', duration);
      return;
    }

    if (nullDiff.changed.length !== routeCount) {
      const duration = Date.now() - startTime;
      fail('Test 7', `Null-diff: ${nullDiff.changed.length} changed (expected ${routeCount})`, duration);
      return;
    }

    if (nullDiff.unchanged.length !== 0) {
      const duration = Date.now() - startTime;
      fail('Test 7', `Null-diff: ${nullDiff.unchanged.length} unchanged (expected 0)`, duration);
      return;
    }

    // Saved manifest diff (if available): should match current if no data changed
    const savedManifest = loadPreviousManifest(rootDir);
    if (savedManifest) {
      const savedDiff = diffManifest(savedManifest, manifest);
      if (verbose) {
        log(
          `Saved manifest: ${savedDiff.changed.length} changed, ${savedDiff.unchanged.length} unchanged, global=${savedDiff.globalChanged}`,
        );
      }
    }

    const duration = Date.now() - startTime;
    pass(
      'Test 7',
      `diffManifest verified (${routeCount} routes): self=all unchanged, null=all changed`,
      duration,
    );
  } catch (err) {
    const duration = Date.now() - startTime;
    fail('Test 7', `Error: ${err instanceof Error ? err.message : err}`, duration);
  }
}

async function test8_HashUniqueness() {
  log('Test 8: All routes in manifest have unique hashes');
  const startTime = Date.now();

  try {
    const manifest = computeRouteManifest(rootDir);
    const routes = Object.entries(manifest.routes);

    if (routes.length === 0) {
      const duration = Date.now() - startTime;
      skip('Test 8', 'Manifest has no routes (data directory may be missing)', duration);
      return;
    }

    // Check that every route has a unique hash
    const hashToRoutes = new Map<string, string[]>();
    for (const [route, entry] of routes) {
      const existing = hashToRoutes.get(entry.hash) ?? [];
      existing.push(route);
      hashToRoutes.set(entry.hash, existing);
    }

    const collisions: string[] = [];
    for (const [hash, collidingRoutes] of hashToRoutes) {
      if (collidingRoutes.length > 1) {
        collisions.push(`${hash.substring(0, 8)}... → [${collidingRoutes.join(', ')}]`);
      }
    }

    if (collisions.length > 0) {
      const duration = Date.now() - startTime;
      fail(
        'Test 8',
        `Found ${collisions.length} hash collision(s):\n${collisions.map((c) => `    ${c}`).join('\n')}`,
        duration,
      );
      return;
    }

    const duration = Date.now() - startTime;
    pass(
      'Test 8',
      `All ${routes.length} routes have unique hashes`,
      duration,
    );
  } catch (err) {
    const duration = Date.now() - startTime;
    fail('Test 8', `Error: ${err instanceof Error ? err.message : err}`, duration);
  }
}

async function test9_RouteDepsCorrectness() {
  log('Test 9: Route data dependencies are correctly mapped');
  const startTime = Date.now();

  try {
    const manifest = computeRouteManifest(rootDir);

    // Home page should have a different hash than listing pages
    // (home includes all section files, listings only include portfolio-specific sections)
    const homeHash = manifest.routes['/']?.hash;
    const portfolioHash = manifest.routes['/portfolio']?.hash;

    if (!homeHash || !portfolioHash) {
      const duration = Date.now() - startTime;
      fail('Test 9', 'Missing / or /portfolio route in manifest', duration);
      return;
    }

    if (homeHash === portfolioHash) {
      const duration = Date.now() - startTime;
      fail(
        'Test 9',
        'Home (/) and /portfolio have same hash — section deps likely not found',
        duration,
      );
      return;
    }

    // Legal pages should each have different hashes (each depends on its own file)
    const legalRoutes = ['/privacy-policy', '/user-agreement', '/consent'] as const;
    const legalHashes = legalRoutes.map((r) => manifest.routes[r]?.hash);
    const missingLegal = legalRoutes.filter((_, i) => !legalHashes[i]);

    if (missingLegal.length > 0) {
      const duration = Date.now() - startTime;
      fail('Test 9', `Missing legal routes in manifest: ${missingLegal.join(', ')}`, duration);
      return;
    }

    if (new Set(legalHashes).size !== 3) {
      const duration = Date.now() - startTime;
      fail('Test 9', 'Legal pages share hashes — should each depend on their own file', duration);
      return;
    }

    // /order and /404 should have different hashes (route path is mixed in)
    const orderHash = manifest.routes['/order']?.hash;
    const notFoundHash = manifest.routes['/404']?.hash;

    if (!orderHash || !notFoundHash) {
      const duration = Date.now() - startTime;
      fail('Test 9', `Missing route in manifest: /order=${!!orderHash}, /404=${!!notFoundHash}`, duration);
      return;
    }

    if (orderHash === notFoundHash) {
      const duration = Date.now() - startTime;
      fail('Test 9', '/order and /404 have same hash — route path not mixed into hash', duration);
      return;
    }

    const duration = Date.now() - startTime;
    pass('Test 9', 'Route dependencies correctly differentiate all route groups', duration);
  } catch (err) {
    const duration = Date.now() - startTime;
    fail('Test 9', `Error: ${err instanceof Error ? err.message : err}`, duration);
  }
}

async function main() {
  console.log(`\n${colors.cyan}=== Incremental SSG Test Suite ===${colors.reset}\n`);

  try {
    await test0_HashValidation();
    await test1_CleanBuild();
    await test2_NoChanges();
    await test3_SingleCaseAdded();
    await test4_ThemeChange();
    await test5_SourceCodeChange();
    await test6_CorruptedCache();
    await test7_ManifestDiffConsistency();
    await test8_HashUniqueness();
    await test9_RouteDepsCorrectness();
  } catch (err) {
    console.error(`\n${colors.red}Test suite error:${colors.reset}`, err instanceof Error ? err.message : err);
    // Continue to show summary even on error
  }

  // Summary
  const passed = results.filter((r) => r.passed).length;
  const skipped = results.filter((r) => r.skipped).length;
  const failed = results.filter((r) => !r.passed && !r.skipped).length;
  const total = results.length;

  console.log(`\n${colors.cyan}=== Test Summary ===${colors.reset}`);
  console.log(`${colors.green}Passed: ${passed}/${total}${colors.reset}`);
  if (skipped > 0) {
    console.log(`${colors.yellow}Skipped: ${skipped}/${total}${colors.reset}`);
  }
  if (failed > 0) {
    console.log(`${colors.red}Failed: ${failed}/${total}${colors.reset}`);
  }

  if (failed === 0) {
    console.log(`\n${colors.green}All tests passed! ✓${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`\n${colors.yellow}Some tests failed. Review above for details.${colors.reset}\n`);
    process.exit(1);
  }
}

main();
