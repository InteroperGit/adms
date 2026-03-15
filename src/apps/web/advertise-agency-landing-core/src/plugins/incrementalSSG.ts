import { createHash } from 'crypto';
import { existsSync, readFileSync, readdirSync, statSync, copyFileSync, mkdirSync, writeFileSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';

/**
 * Computes SHA-256 hash of a single file's content.
 */
export function hashFile(filePath: string): string {
  const content = readFileSync(filePath, 'utf-8');
  return createHash('sha256').update(content).digest('hex');
}

/**
 * Computes SHA-256 hash of multiple files' content using incremental hashing.
 * Paths are sorted to ensure consistent hashing regardless of glob order.
 * Uses length-prefixed format to avoid separator collision issues.
 */
export function hashFiles(filePaths: string[]): string {
  const sorted = [...filePaths].sort();
  const hash = createHash('sha256');
  for (const p of sorted) {
    try {
      const content = readFileSync(p, 'utf-8');
      // Length-prefix each file's content to prevent cross-file collisions
      hash.update(`${content.length}:${content}`);
    } catch {
      // Mark missing files with a sentinel so their absence is hashed distinctly
      hash.update('0:');
    }
  }
  return hash.digest('hex');
}

/**
 * Walks a directory recursively and returns all file paths matching pattern.
 */
function walkFiles(dir: string, pattern?: RegExp): string[] {
  if (!existsSync(dir)) {
    return [];
  }

  const results: string[] = [];

  function walk(current: string) {
    const stat = statSync(current);
    if (stat.isDirectory()) {
      const entries = readdirSync(current);
      for (const entry of entries) {
        walk(join(current, entry));
      }
    } else if (!pattern || pattern.test(current)) {
      results.push(current);
    }
  }

  walk(dir);
  return results.sort();
}

/**
 * Helper to get all TypeScript source files.
 */
function getTsSourceFiles(srcDir: string): string[] {
  return walkFiles(srcDir, /\.(ts|tsx)$/);
}

/**
 * Extract year and month from ISO 8601 date string (YYYY-MM-DD).
 */
function extractYearMonth(date: string): { year: string; month: string } {
  if (!date || typeof date !== 'string' || date.length !== 10) {
    throw new Error(`Invalid date format. Expected "YYYY-MM-DD", got "${date}"`);
  }
  const year = date.slice(0, 4);
  const month = date.slice(5, 7);
  return { year, month };
}

/**
 * Helper to get all JSON files in a directory.
 */
function getJsonFiles(dir: string): string[] {
  return walkFiles(dir, /\.json$/);
}

/**
 * Computes global hash from source files and config.
 * Global hash invalidates all routes if source code or critical config changes.
 *
 * Global invalidators:
 * - src/ (all TypeScript files)
 * - vite.config.ts, tailwind.config, postcss.config
 * - data/content/config/ (all JSON config files — affects all pages)
 * - package.json, pnpm-lock.yaml
 */
export function computeGlobalHash(rootDir: string): string {
  const filesToHash: string[] = [];

  // Source files
  const srcFiles = getTsSourceFiles(join(rootDir, 'src'));
  filesToHash.push(...srcFiles);

  // Config files
  const configFiles = [
    'vite.config.ts',
    'tailwind.config.ts',
    'tailwind.config.js',
    'postcss.config.ts',
    'postcss.config.js',
    'package.json',
    'pnpm-lock.yaml',
  ];

  for (const configFile of configFiles) {
    const filePath = join(rootDir, configFile);
    if (existsSync(filePath)) {
      filesToHash.push(filePath);
    }
  }

  // All JSON files in data/content/config/ (any config change → full rebuild)
  const dataConfigFiles = getJsonFiles(join(rootDir, 'data/content/config'));
  filesToHash.push(...dataConfigFiles);

  return hashFiles(filesToHash);
}

/**
 * Reads and parses categories from data/content/config/categories.json.
 * Returns empty array if file doesn't exist or is invalid.
 */
function getCategories(contentDir: string): Array<{ slug: string; [key: string]: unknown }> {
  const categoriesPath = join(contentDir, 'config/categories.json');
  if (!existsSync(categoriesPath)) {
    return [];
  }
  try {
    const categoriesContent = JSON.parse(readFileSync(categoriesPath, 'utf-8'));
    return Array.isArray(categoriesContent) ? categoriesContent : [];
  } catch {
    return [];
  }
}

/**
 * Route-to-data-dependency mapping.
 * Maps each route to the files it depends on.
 */
interface RouteDataMap {
  [route: string]: string[];
}

/**
 * Builds the complete route-to-data-dependency map.
 */
function buildRouteDataMap(rootDir: string): RouteDataMap {
  const contentDir = join(rootDir, 'data', 'content');
  const map: RouteDataMap = {};

  // Helper to check if file exists and add to list
  const addIfExists = (paths: string[], ...filePaths: string[]) => {
    for (const fp of filePaths) {
      if (existsSync(fp)) {
        paths.push(fp);
      }
    }
  };

  // Home page (/)
  // Depends on: all sections + portfolioSection + first N cases for preview
  // (Config files covered by global hash)
  const homeFiles: string[] = [];
  const sectionsDir = join(contentDir, 'sections');
  // Sections are in subdirectories (e.g. sections/hero/hero.json), so scan recursively
  const sectionFiles = getJsonFiles(sectionsDir);
  homeFiles.push(...sectionFiles);
  // Add all portfolio cases (home likely shows featured cases)
  const portfolioFiles = getJsonFiles(join(contentDir, 'portfolio'));
  homeFiles.push(...portfolioFiles);
  map['/'] = homeFiles;

  // Portfolio listing pages
  // /portfolio and /portfolio/all depend on ALL cases (they render everything)
  // /portfolio/:category depends only on that category's case files
  // (Config files covered by global hash)
  const listingSectionFiles: string[] = [];
  addIfExists(listingSectionFiles,
    join(contentDir, 'sections/portfolio/portfolioPage.json'),
    join(contentDir, 'sections/portfolio/portfolioSection.json'),
  );
  const allCases = getJsonFiles(join(contentDir, 'portfolio'));
  map['/portfolio'] = [...listingSectionFiles, ...allCases];
  map['/portfolio/all'] = [...listingSectionFiles, ...allCases];
  // Each category page depends only on its own category's files
  const categories = getCategories(contentDir);
  for (const cat of categories) {
    if (cat.slug) {
      const categoryCases = getJsonFiles(join(contentDir, 'portfolio', cat.slug));
      map[`/portfolio/${cat.slug}`] = [...listingSectionFiles, ...categoryCases];
    }
  }

  // Portfolio case detail pages (pattern: /portfolio/:category/:year/:month/:slug)
  // Each case depends only on: its own JSON
  // (Config files covered by global hash)
  const caseFilePaths = allCases;

  for (const caseFile of caseFilePaths) {
    try {
      // Parse case data to extract slug, category, and publishDate
      const caseData = JSON.parse(readFileSync(caseFile, 'utf-8')) as {
        slug?: string;
        category?: string;
        publishDate?: string;
      };

      if (!caseData.slug || !caseData.category || !caseData.publishDate) {
        continue; // Skip invalid cases
      }

      // Extract year/month from publishDate
      const { year, month } = extractYearMonth(caseData.publishDate);

      // Find category slug
      const catSlug = categories.find((c) => c.name === caseData.category)?.slug;

      // Generate actual web routes for this case
      const caseRoutes = catSlug
        ? [
            `/portfolio/all/${year}/${month}/${caseData.slug}`,
            `/portfolio/${catSlug}/${year}/${month}/${caseData.slug}`,
          ]
        : [`/portfolio/all/${year}/${month}/${caseData.slug}`];

      // Map each route to its source file
      for (const route of caseRoutes) {
        map[route] = [caseFile];
      }
    } catch {
      // Skip files that can't be parsed or don't have required fields
    }
  }

  // Legal pages (/privacy-policy, /user-agreement, /consent)
  // Each page depends only on its own JSON file
  // (Config files covered by global hash)
  const legalDir = join(contentDir, 'legal');
  const legalRouteFileMap: Record<string, string> = {
    '/privacy-policy': 'privacyPolicy.json',
    '/user-agreement': 'userAgreement.json',
    '/consent': 'consent.json',
  };
  for (const [route, filename] of Object.entries(legalRouteFileMap)) {
    const filePath = join(legalDir, filename);
    map[route] = existsSync(filePath) ? [filePath] : [];
  }

  // Order page (/order)
  // (Config files covered by global hash)
  map['/order'] = [];

  // 404 page
  // (Config files covered by global hash)
  map['/404'] = [];

  return map;
}

/**
 * RouteManifest maps routes to their content hashes and HTML output paths.
 */
export interface RouteManifest {
  globalHash: string;
  routes: Record<string, {
    hash: string;
    htmlFile: string;
  }>;
}

/**
 * Computes the complete route manifest with per-route hashes.
 * This is the main entry point for step 1.
 */
export function computeRouteManifest(rootDir: string): RouteManifest {
  const globalHash = computeGlobalHash(rootDir);
  const routeDataMap = buildRouteDataMap(rootDir);

  const manifest: RouteManifest = {
    globalHash,
    routes: {},
  };

  // Compute hash for each route based on its dependencies
  // Include route path in the hash so routes with identical (or empty) deps get unique hashes
  for (const [route, filePaths] of Object.entries(routeDataMap)) {
    const dataHash = hashFiles(filePaths);
    const hash = createHash('sha256').update(route + '\0' + dataHash).digest('hex');
    // Map route to output HTML file (pattern: /path → path/index.html)
    const htmlFile = route === '/'
      ? 'index.html'
      : `${route.replace(/^\//, '')}/index.html`;

    manifest.routes[route] = {
      hash,
      htmlFile: htmlFile.replace(/\\/g, '/'), // Normalize to forward slashes
    };
  }

  return manifest;
}

/**
 * Loads the previously saved manifest from .ssg-cache/manifest.json.
 * Returns null if file doesn't exist or is corrupted.
 */
export function loadPreviousManifest(rootDir: string): RouteManifest | null {
  const manifestPath = join(rootDir, '.ssg-cache', 'manifest.json');

  if (!existsSync(manifestPath)) {
    return null;
  }

  try {
    const content = readFileSync(manifestPath, 'utf-8');
    const manifest = JSON.parse(content);

    const isInvalidManifest = typeof manifest !== 'object' ||
        manifest === null ||
        typeof manifest.globalHash !== 'string' ||
        typeof manifest.routes !== 'object';

    return isInvalidManifest
      ? null
      : manifest as RouteManifest;
  } catch {
    // File exists but is corrupted or unreadable
    return null;
  }
}

/**
 * Diff result between previous and current manifests.
 */
export interface ManifestDiff {
  /** Routes that changed (hash mismatch) or are new */
  changed: string[];
  /** Routes that haven't changed */
  unchanged: string[];
  /** Whether the global hash changed (forces full rebuild) */
  globalChanged: boolean;
}

/**
 * Compares previous and current manifests.
 * If global hash changed, all routes are considered changed.
 * Returns routes to rebuild + routes that can be served from cache.
 */
export function diffManifest(
  previous: RouteManifest | null,
  current: RouteManifest,
): ManifestDiff {
  const changed: string[] = [];
  const unchanged: string[] = [];

  // If no previous manifest (first build) or global hash changed, invalidate all routes
  if (!previous || previous.globalHash !== current.globalHash) {
    return {
      changed: Object.keys(current.routes),
      unchanged: [],
      globalChanged: true,
    };
  }

  // Global hash is unchanged; compare per-route hashes
  for (const [route, currentRoute] of Object.entries(current.routes)) {
    const previousRoute = previous.routes[route];

    // If route didn't exist before or hash changed, it's dirty
    if (!previousRoute || previousRoute.hash !== currentRoute.hash) {
      changed.push(route);
    } else {
      unchanged.push(route);
    }
  }

  // Any routes that existed before but not now are also "changed"
  // (they'll be removed from cache in the next step)
  // For now, we just track what's in the current manifest.

  return {
    changed,
    unchanged,
    globalChanged: false,
  };
}

/**
 * Incremental build hook interface.
 * Provides methods for filtering routes and managing cache during builds.
 */
export interface IncrementalHook {
  /**
   * Filters routes to only include changed ones for incremental rebuilds.
   * Returns all routes for full builds (when no cache exists or global hash changed).
   */
  filterRoutes(allRoutes: string[]): string[];
}

/**
 * Creates an incremental build hook for use in vite.config.ts.
 * Loads previous manifest, compares against current manifest, and provides
 * route filtering for incremental SSG builds.
 *
 * @example
 * // vite.config.ts
 * import { createIncrementalBuildHook } from './src/plugins/incrementalSSG';
 * import { buildIncludedRoutes } from './src/plugins/ssgMetaPlugin';
 *
 * const incremental = createIncrementalBuildHook(__dirname);
 * const allRoutes = buildIncludedRoutes(__dirname);
 *
 * ssgOptions: {
 *   includedRoutes: (paths) => incremental.filterRoutes(allRoutes(paths))
 * }
 */
export function createIncrementalBuildHook(rootDir: string): IncrementalHook {
  const currentManifest = computeRouteManifest(rootDir);
  const previousManifest = loadPreviousManifest(rootDir);
  const diff = diffManifest(previousManifest, currentManifest);

  // Convert changed routes array to Set for efficient filtering
  const changedRoutesSet = new Set(diff.changed);

  return {
    filterRoutes(allRoutes: string[]): string[] {
      // If global hash changed or no previous manifest, return all routes
      if (diff.globalChanged || !previousManifest) {
        return allRoutes;
      }

      // Otherwise, only return routes that changed
      return allRoutes.filter((route) => changedRoutesSet.has(route));
    },
  };
}

/**
 * Restores unchanged HTML files from cache to dist directory.
 * Uses the htmlFile mapping from the manifest to locate and copy files.
 *
 * @param distDir - Path to the dist directory where SSG output is written
 * @param unchanged - Array of route strings that didn't change (can be obtained from ManifestDiff)
 * @param manifest - RouteManifest from previous build (contains htmlFile paths)
 *
 * @example
 * const diff = diffManifest(prevManifest, currentManifest);
 * restoreCached(distPath, diff.unchanged, prevManifest);
 */
export function restoreCached(
  distDir: string,
  unchanged: string[],
  manifest: RouteManifest
): void {
  const cacheDir = join(distDir, '..', '.ssg-cache', 'html');

  for (const route of unchanged) {
    const routeEntry = manifest.routes[route];
    if (!routeEntry) {
      continue;
    }

    const sourcePath = join(cacheDir, routeEntry.htmlFile);
    const destPath = join(distDir, routeEntry.htmlFile);

    // Ensure destination directory exists
    const destDirPath = dirname(destPath);
    if (!existsSync(destDirPath)) {
      mkdirSync(destDirPath, { recursive: true });
    }

    // Copy file from cache to dist
    if (existsSync(sourcePath)) {
      try {
        copyFileSync(sourcePath, destPath);
      } catch (err) {
        // Log but don't fail — file might be temporarily locked or cache might be stale
        console.warn(`[incremental-ssg] Failed to restore ${route}: ${err}`);
      }
    }
  }
}

/**
 * Removes cached HTML files that are no longer in the current manifest.
 * Prevents stale files from accumulating when routes are removed between builds.
 */
function cleanStaleCacheFiles(cacheHtmlDir: string, manifest: RouteManifest): void {
  if (!existsSync(cacheHtmlDir)) {
    return;
  }

  const validFiles = new Set(
    Object.values(manifest.routes).map((r) => r.htmlFile)
  );

  const cachedFiles = walkFiles(cacheHtmlDir, /\.html$/);
  for (const cachedFile of cachedFiles) {
    // Convert absolute path to relative (matching htmlFile format)
    const relative = cachedFile
      .slice(cacheHtmlDir.length + 1)
      .replace(/\\/g, '/');
    if (!validFiles.has(relative)) {
      try {
        unlinkSync(cachedFile);
      } catch {
        // Ignore cleanup errors — non-critical
      }
    }
  }
}

/**
 * Saves all rendered HTML files to cache and writes the manifest.
 * Mirrors the dist/ directory structure into .ssg-cache/html/ and writes
 * manifest.json for comparison on next build.
 *
 * @param distDir - Path to the dist directory (SSG output)
 * @param manifest - Current RouteManifest to save for next build
 *
 * @example
 * const manifest = computeRouteManifest(rootDir);
 * saveCache(distPath, manifest);
 */
export function saveCache(distDir: string, manifest: RouteManifest): void {
  const cacheDir = join(distDir, '..', '.ssg-cache');
  const cacheHtmlDir = join(cacheDir, 'html');

  // Ensure cache directories exist
  if (!existsSync(cacheDir)) {
    mkdirSync(cacheDir, { recursive: true });
  }
  if (!existsSync(cacheHtmlDir)) {
    mkdirSync(cacheHtmlDir, { recursive: true });
  }

  // Copy all HTML files from dist to cache
  for (const [route, routeEntry] of Object.entries(manifest.routes)) {
    const sourcePath = join(distDir, routeEntry.htmlFile);
    const destPath = join(cacheHtmlDir, routeEntry.htmlFile);

    // Ensure destination directory exists
    const destDirPath = dirname(destPath);
    if (!existsSync(destDirPath)) {
      mkdirSync(destDirPath, { recursive: true });
    }

    // Copy file to cache
    if (existsSync(sourcePath)) {
      try {
        copyFileSync(sourcePath, destPath);
      } catch (err) {
        console.warn(`[incremental-ssg] Failed to cache ${route}: ${err}`);
      }
    }
  }

  // Clean up stale cache files for routes that no longer exist
  cleanStaleCacheFiles(cacheHtmlDir, manifest);

  // Write manifest for next build
  const manifestPath = join(cacheDir, 'manifest.json');
  try {
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  } catch (err) {
    console.warn(`[incremental-ssg] Failed to write manifest: ${err}`);
  }
}
