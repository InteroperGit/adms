import { createHash } from 'crypto';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'fs';
import { dirname, join, relative } from 'path';

/**
 * Computes SHA-256 hash of a single file's content.
 */
export function hashFile(filePath: string): string {
  const content = readFileSync(filePath, 'utf-8');
  return createHash('sha256').update(content).digest('hex');
}

/**
 * Computes SHA-256 hash of multiple files' content using incremental hashing.
 *
 * Paths are sorted to ensure consistent hashing regardless of glob order.
 * Uses length-prefixed format (`<len>:<content>`) to prevent cross-file
 * hash collisions. Missing files contribute a `missing:<path>` sentinel,
 * keeping them distinct from empty files (length 0).
 */
export function hashFiles(filePaths: string[]): string {
  const sorted = [...filePaths].sort();
  const hash = createHash('sha256');
  for (const p of sorted) {
    try {
      const content = readFileSync(p, 'utf-8');
      hash.update(`${content.length}:${content}`);
    } catch {
      hash.update(`missing:${p}`);
    }
  }
  return hash.digest('hex');
}

/**
 * Walks `dir` recursively and returns all file paths matching `pattern`,
 * sorted alphabetically. Returns an empty array when `dir` does not exist.
 *
 * Uses an iterative stack to avoid call-stack overflows on deep directory
 * trees.
 */
function walkFiles(dir: string, pattern?: RegExp): string[] {
  if (!existsSync(dir)) {
    return [];
  }

  const results: string[] = [];
  const stack = [dir];

  while (stack.length > 0) {
    const current = stack.pop()!;
    if (statSync(current).isDirectory()) {
      for (const entry of readdirSync(current)) {
        stack.push(join(current, entry));
      }
    } else if (!pattern || pattern.test(current)) {
      results.push(current);
    }
  }

  return results.sort();
}

/** Returns all `.ts` / `.tsx` source files under `srcDir`. */
function getTsSourceFiles(srcDir: string): string[] {
  return walkFiles(srcDir, /\.(ts|tsx)$/);
}

/** Returns all `.json` files under `dir`. */
function getJsonFiles(dir: string): string[] {
  return walkFiles(dir, /\.json$/);
}

/**
 * Extracts `year` and `month` segments from an ISO 8601 date string
 * (`YYYY-MM-DD`).
 *
 * @throws {Error} When the string does not match the `YYYY-MM-DD` format.
 */
function extractYearMonth(date: string): { year: string; month: string } {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`Invalid date format. Expected "YYYY-MM-DD", got "${date}"`);
  }
  return { year: date.slice(0, 4), month: date.slice(5, 7) };
}

/**
 * Reads and parses `data/content/config/categories.json`.
 * Returns an empty array when the file is absent or unparseable.
 */
function getCategories(
  contentDir: string
): Array<{ name?: string; slug: string; [key: string]: unknown }> {
  const categoriesPath = join(contentDir, 'config/categories.json');
  if (!existsSync(categoriesPath)) {
    return [];
  }
  try {
    const parsed = JSON.parse(readFileSync(categoriesPath, 'utf-8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Builds the route → data-file dependency map for all portfolio case detail
 * pages.
 *
 * For each case JSON, two routes are registered:
 * - `/portfolio/all/:year/:month/:slug`
 * - `/portfolio/:categorySlug/:year/:month/:slug`
 *
 * A `Map` is built from category names to slugs once upfront, giving O(1)
 * lookup per case instead of O(n) linear scans.
 */
function buildCaseRouteDeps(
  allCases: string[],
  categories: Array<{ name?: string; slug: string }>
): Record<string, string[]> {
  const categoryByName = new Map(categories.filter((c) => c.name).map((c) => [c.name!, c.slug]));

  const map: Record<string, string[]> = {};

  for (const caseFile of allCases) {
    try {
      const caseData = JSON.parse(readFileSync(caseFile, 'utf-8')) as {
        slug?: string;
        category?: string;
        publishDate?: string;
      };

      if (!caseData.slug || !caseData.category || !caseData.publishDate) {
        continue;
      }

      const { year, month } = extractYearMonth(caseData.publishDate);
      const catSlug = categoryByName.get(caseData.category);

      const routes = [
        `/portfolio/all/${year}/${month}/${caseData.slug}`,
        ...(catSlug ? [`/portfolio/${catSlug}/${year}/${month}/${caseData.slug}`] : []),
      ];

      for (const route of routes) {
        map[route] = [caseFile];
      }
    } catch {
      // Skip invalid / unparseable case files
    }
  }

  return map;
}

/**
 * Computes the global hash from source files and critical configuration.
 *
 * A global hash change invalidates all cached routes on the next build.
 *
 * **Global invalidators:**
 * - `src/` — all TypeScript source files
 * - `vite.config.ts`, `react-router.config.ts`, `tailwind.config.*`,
 *   `postcss.config.*`
 * - `package.json`, `pnpm-lock.yaml`
 * - `data/content/config/**` — any config JSON change affects every page
 *
 * @param rootDir - Absolute path to the project root
 */
export function computeGlobalHash(rootDir: string): string {
  const configFiles = [
    'vite.config.ts',
    'react-router.config.ts',
    'tailwind.config.ts',
    'tailwind.config.js',
    'postcss.config.ts',
    'postcss.config.js',
    'package.json',
    'pnpm-lock.yaml',
  ]
    .map((f) => join(rootDir, f))
    .filter(existsSync);

  return hashFiles([
    ...getTsSourceFiles(join(rootDir, 'src')),
    ...configFiles,
    ...getJsonFiles(join(rootDir, 'data/content/config')),
  ]);
}

/**
 * Builds a complete route → data-file dependency map for the entire site.
 *
 * Config files are intentionally **excluded** from per-route deps — they are
 * already covered by the global hash and would otherwise invalidate every
 * route on any config change.
 *
 * Route coverage:
 * - `/` — all section JSON + all portfolio cases
 * - `/portfolio`, `/portfolio/all` — portfolio section JSON + all cases
 * - `/portfolio/:slug` — portfolio section JSON + that category's cases
 * - `/portfolio/:cat/:year/:month/:slug` — the single case JSON file
 * - `/privacy-policy`, `/user-agreement`, `/consent` — each legal JSON
 * - `/order`, `/404` — no content deps (covered by global hash)
 */
function buildRouteDataMap(rootDir: string): Record<string, string[]> {
  const contentDir = join(rootDir, 'data', 'content');
  const portfolioDir = join(contentDir, 'portfolio');
  const categories = getCategories(contentDir);

  // Computed once and reused by home page + listing pages
  const allCases = getJsonFiles(portfolioDir);

  // Section JSON files shared by all portfolio listing pages
  const listingSectionFiles = [
    join(contentDir, 'sections/portfolio/portfolioPage.json'),
    join(contentDir, 'sections/portfolio/portfolioSection.json'),
  ].filter(existsSync);

  const map: Record<string, string[]> = {};

  // Home page — all section copy + all portfolio cases
  map['/'] = [...getJsonFiles(join(contentDir, 'sections')), ...allCases];

  // Portfolio listing — root and /all show every case; per-category shows only its own cases
  map['/portfolio'] = [...listingSectionFiles, ...allCases];
  map['/portfolio/all'] = [...listingSectionFiles, ...allCases];
  for (const cat of categories) {
    if (cat.slug) {
      map[`/portfolio/${cat.slug}`] = [
        ...listingSectionFiles,
        ...getJsonFiles(join(portfolioDir, cat.slug)),
      ];
    }
  }

  // Portfolio case detail pages — each case maps to its own JSON only
  Object.assign(map, buildCaseRouteDeps(allCases, categories));

  // Legal pages — each page depends on its own JSON file
  const legalDir = join(contentDir, 'legal');
  for (const [route, filename] of Object.entries({
    '/privacy-policy': 'privacyPolicy.json',
    '/user-agreement': 'userAgreement.json',
    '/consent': 'consent.json',
  })) {
    const filePath = join(legalDir, filename);
    map[route] = existsSync(filePath) ? [filePath] : [];
  }

  // Pages with no content deps — global hash is sufficient
  map['/order'] = [];
  map['/404'] = [];

  return map;
}

/**
 * RouteManifest maps each route to its content hash and expected HTML output
 * path. Persisted to `.ssg-cache/manifest.json` for comparison on subsequent
 * builds.
 */
export interface RouteManifest {
  globalHash: string;
  routes: Record<string, { hash: string; htmlFile: string }>;
}

/**
 * Computes the full route manifest: global hash + per-route content hashes.
 *
 * Each route hash combines the route path and a hash of its data files,
 * ensuring routes with identical (or empty) deps produce distinct hashes.
 *
 * @param rootDir - Absolute path to the project root
 */
export function computeRouteManifest(rootDir: string): RouteManifest {
  const globalHash = computeGlobalHash(rootDir);
  const routeDataMap = buildRouteDataMap(rootDir);
  const routes: RouteManifest['routes'] = {};

  for (const [route, filePaths] of Object.entries(routeDataMap)) {
    const dataHash = hashFiles(filePaths);
    const hash = createHash('sha256')
      .update(route + '\0' + dataHash)
      .digest('hex');
    // Map route to output HTML file (/path → path/index.html)
    const htmlFile = route === '/' ? 'index.html' : `${route.replace(/^\//, '')}/index.html`;

    routes[route] = {
      hash,
      // Normalize to forward slashes for cross-platform consistency
      htmlFile: htmlFile.replace(/\\/g, '/'),
    };
  }

  return { globalHash, routes };
}

/**
 * Loads the manifest saved from the previous build at
 * `.ssg-cache/manifest.json`. Returns `null` when the file is absent,
 * unreadable, or structurally invalid.
 */
export function loadPreviousManifest(rootDir: string): RouteManifest | null {
  const manifestPath = join(rootDir, '.ssg-cache', 'manifest.json');
  if (!existsSync(manifestPath)) {
    return null;
  }
  try {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
    if (
      typeof manifest !== 'object' ||
      manifest === null ||
      typeof manifest.globalHash !== 'string' ||
      typeof manifest.routes !== 'object'
    ) {
      return null;
    }
    return manifest as RouteManifest;
  } catch {
    return null;
  }
}

/**
 * Diff result between two consecutive manifests.
 */
export interface ManifestDiff {
  /** Routes whose content hash changed or are new since the last build. */
  changed: string[];
  /** Routes whose content hash is identical to the last build. */
  unchanged: string[];
  /** `true` when the global hash changed, forcing a full rebuild. */
  globalChanged: boolean;
}

/**
 * Compares the previous and current manifests and categorises routes into
 * changed and unchanged.
 *
 * When `previous` is `null` (first build) or the global hash changed, every
 * route in `current` is returned as changed to trigger a full rebuild.
 */
export function diffManifest(previous: RouteManifest | null, current: RouteManifest): ManifestDiff {
  if (!previous || previous.globalHash !== current.globalHash) {
    return {
      changed: Object.keys(current.routes),
      unchanged: [],
      globalChanged: true,
    };
  }

  const changed: string[] = [];
  const unchanged: string[] = [];

  for (const [route, currentRoute] of Object.entries(current.routes)) {
    const previousRoute = previous.routes[route];
    if (!previousRoute || previousRoute.hash !== currentRoute.hash) {
      changed.push(route);
    } else {
      unchanged.push(route);
    }
  }

  return { changed, unchanged, globalChanged: false };
}

/**
 * Copies unchanged HTML files from `.ssg-cache/html/` into `distDir`,
 * skipping the full SSG render for those routes.
 *
 * @param rootDir   - Absolute project root (locates `.ssg-cache/`)
 * @param distDir   - Build output directory (e.g. `build/client`)
 * @param unchanged - Routes that did not change (from {@link diffManifest})
 * @param manifest  - Previous {@link RouteManifest} (contains `htmlFile` paths)
 *
 * @example
 * const diff = diffManifest(prevManifest, currentManifest);
 * restoreCached(rootDir, distDir, diff.unchanged, prevManifest);
 */
export function restoreCached(
  rootDir: string,
  distDir: string,
  unchanged: string[],
  manifest: RouteManifest
): void {
  const cacheDir = join(rootDir, '.ssg-cache', 'html');

  for (const route of unchanged) {
    const routeEntry = manifest.routes[route];
    if (!routeEntry) {
      continue;
    }

    const sourcePath = join(cacheDir, routeEntry.htmlFile);
    if (!existsSync(sourcePath)) {
      continue;
    }

    const destPath = join(distDir, routeEntry.htmlFile);
    mkdirSync(dirname(destPath), { recursive: true });

    try {
      copyFileSync(sourcePath, destPath);
    } catch (err) {
      // Log but don't fail — cache might be stale or file temporarily locked
      console.warn(`[incremental-ssg] Failed to restore ${route}: ${err}`);
    }
  }
}

/**
 * Deletes cached HTML files whose routes are no longer present in `manifest`.
 * Prevents stale files from accumulating when routes are removed between
 * builds.
 */
function cleanStaleCacheFiles(cacheHtmlDir: string, manifest: RouteManifest): void {
  if (!existsSync(cacheHtmlDir)) {
    return;
  }

  const validFiles = new Set(Object.values(manifest.routes).map((r) => r.htmlFile));

  for (const cachedFile of walkFiles(cacheHtmlDir, /\.html$/)) {
    const rel = relative(cacheHtmlDir, cachedFile).replace(/\\/g, '/');
    if (!validFiles.has(rel)) {
      try {
        unlinkSync(cachedFile);
      } catch {
        // Non-critical: ignore cleanup errors
      }
    }
  }
}

/**
 * Transient build diff written by `prerender()` before the React Router build
 * starts and consumed by `postbuild-cache.ts` after it completes.
 *
 * Stored at `.ssg-cache/current-diff.json` for the duration of one build.
 * Allows `postbuild-cache.ts` to restore the routes that `prerender()` skipped
 * without recomputing the manifest a second time.
 */
export interface BuildDiff {
  /** Routes skipped by `prerender()` — to be restored from cache post-build. */
  unchanged: string[];
  /** Routes returned by `prerender()` for React Router to render. */
  changed: string[];
  /** `true` when the global hash changed (full rebuild, no routes skipped). */
  globalChanged: boolean;
  /** `true` when no previous manifest existed (first build). */
  firstBuild: boolean;
  /** Current {@link RouteManifest} computed before the build started. */
  manifest: RouteManifest;
}

/** Absolute path to the transient build diff file. */
function buildDiffPath(rootDir: string): string {
  return join(rootDir, '.ssg-cache', 'current-diff.json');
}

/**
 * Writes the transient {@link BuildDiff} so `postbuild-cache.ts` can restore
 * unchanged routes after the build without recomputing the manifest.
 *
 * Called from `react-router.config.ts` `prerender()` before the build starts.
 */
export function writeBuildDiff(rootDir: string, diff: BuildDiff): void {
  mkdirSync(join(rootDir, '.ssg-cache'), { recursive: true });
  writeFileSync(buildDiffPath(rootDir), JSON.stringify(diff, null, 2), 'utf-8');
}

/**
 * Reads the transient {@link BuildDiff} written by `prerender()`.
 * Returns `null` when the file is absent, unreadable, or structurally invalid.
 */
export function readBuildDiff(rootDir: string): BuildDiff | null {
  const diffPath = buildDiffPath(rootDir);
  if (!existsSync(diffPath)) {
    return null;
  }
  try {
    const parsed = JSON.parse(readFileSync(diffPath, 'utf-8'));
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      !Array.isArray(parsed.unchanged) ||
      !Array.isArray(parsed.changed) ||
      typeof parsed.manifest !== 'object' ||
      parsed.manifest === null
    ) {
      return null;
    }
    return parsed as BuildDiff;
  } catch {
    return null;
  }
}

/**
 * Deletes the transient build diff file after it has been consumed.
 * Safe to call when the file does not exist.
 */
export function clearBuildDiff(rootDir: string): void {
  try {
    unlinkSync(buildDiffPath(rootDir));
  } catch {
    // Non-critical — file may not exist on first build or if prerender() failed
  }
}

/**
 * Copies all rendered HTML files from `distDir` into `.ssg-cache/html/` and
 * writes the updated manifest to `.ssg-cache/manifest.json`.
 *
 * Call this **after** the build completes so the next build can restore
 * unchanged routes from cache and skip re-rendering them.
 *
 * @param rootDir  - Absolute project root (locates `.ssg-cache/`)
 * @param distDir  - Build output directory whose HTML files are to be cached
 * @param manifest - {@link RouteManifest} computed for the current build
 *
 * @example
 * const manifest = computeRouteManifest(rootDir);
 * // ... run the build ...
 * saveCache(rootDir, distDir, manifest);
 */
export function saveCache(rootDir: string, distDir: string, manifest: RouteManifest): void {
  const cacheDir = join(rootDir, '.ssg-cache');
  const cacheHtmlDir = join(cacheDir, 'html');

  // mkdirSync with recursive:true is a no-op when the directory already exists
  mkdirSync(cacheHtmlDir, { recursive: true });

  for (const [route, routeEntry] of Object.entries(manifest.routes)) {
    const sourcePath = join(distDir, routeEntry.htmlFile);
    if (!existsSync(sourcePath)) {
      continue;
    }

    const destPath = join(cacheHtmlDir, routeEntry.htmlFile);
    mkdirSync(dirname(destPath), { recursive: true });

    try {
      copyFileSync(sourcePath, destPath);
    } catch (err) {
      console.warn(`[incremental-ssg] Failed to cache ${route}: ${err}`);
    }
  }

  cleanStaleCacheFiles(cacheHtmlDir, manifest);

  const manifestPath = join(cacheDir, 'manifest.json');
  try {
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  } catch (err) {
    console.warn(`[incremental-ssg] Failed to write manifest: ${err}`);
  }
}
