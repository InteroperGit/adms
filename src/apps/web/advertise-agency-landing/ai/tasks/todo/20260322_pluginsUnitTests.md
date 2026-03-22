# Plan: Unit Tests — src/plugins/

**Status**: in-progress
**Date**: 2026-03-22

## Goal

Add unit tests for all four Vite plugins in `src/plugins/`. Focus on pure/exported
functions; mock the filesystem (`fs` module) and skip side-effectful I/O (Sharp, actual
disk writes). Use `vi.mock('fs')` or `vi.mock('node:fs')` depending on how each file
imports it.

---

## Testability analysis

| File | Exported pure functions | Strategy |
|------|------------------------|----------|
| `incrementalSSG.ts` | `hashFile`, `hashFiles`, `computeGlobalHash`, `computeRouteManifest`, `loadPreviousManifest`, `diffManifest`, `restoreCached`, `saveCache`, `writeBuildDiff`, `readBuildDiff`, `clearBuildDiff`, `RouteManifest`, `ManifestDiff`, `BuildDiff` | Mock `fs` + `crypto` where needed; all logic is pure given deterministic inputs |
| `seoMetaPlugin.ts` | `processBuiltHtml` (exported); internal: `escAttr`, `upsertMeta`, `upsertTitle`, `injectBeforeHead`, `jsonLdTag`, `handleHome`, `handleNotFound`, `handleCasePage` | Mock `fs` (readFileSync, writeFileSync, existsSync, readdirSync, copyFileSync) + `scripts/buildUtils`; drive via `processBuiltHtml` |
| `themePlugin.ts` | `themePlugin()` returns a Vite `Plugin` — hooks are callable objects | Mock `fs` (readFileSync, existsSync); call `configResolved()`, `resolveId()`, `load()`, `transformIndexHtml()` directly on the plugin object |
| `imageResizePlugin.ts` | `imageResizePlugin()` + re-exports `resolveImageSrcSet` | Skip `buildStart` (requires Sharp binary); test `configResolved` hook and guard (`command !== 'build'` early return); `resolveImageSrcSet` already tested in `imageSrcSet.test.ts` |

---

## ✅ T36: incrementalSSG — `src/plugins/incrementalSSG.ts` — 29 tests, all pass; format/lint/typecheck/build ✓

## Task T36: incrementalSSG — `src/plugins/incrementalSSG.ts`

**Model**: Claude Sonnet 4.6

The richest plugin — 11 exported functions, all pure given mocked `fs`.

**Mock strategy:**
```ts
vi.mock('fs', () => ({
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
  mkdirSync: vi.fn(),
  copyFileSync: vi.fn(),
  readdirSync: vi.fn(),
  statSync: vi.fn(),
  unlinkSync: vi.fn(),
}));
vi.mock('crypto', async (importOriginal) => {
  // Use real createHash — deterministic and side-effect free
  return importOriginal();
});
```

| Test file | Function(s) | Lines | Tests |
|-----------|-------------|-------|-------|
| `incrementalSSG.test.ts` | All exported functions | ~180 | See below |

**Tests:**

`hashFile(filePath)`
- returns deterministic SHA-256 hex string for known content
- different content → different hash

`hashFiles(filePaths)`
- empty array → stable hash
- order-independent (same hash regardless of input order)
- missing file contributes `missing:<path>` sentinel (distinct from empty file)
- two files with swapped content produce different hashes

`diffManifest(previous, current)`
- previous=null → all routes changed, globalChanged=true
- globalHash mismatch → all routes changed, globalChanged=true
- identical manifests → all unchanged, globalChanged=false
- one route hash changed → that route in changed[], rest in unchanged[]
- new route in current (not in previous) → in changed[]

`loadPreviousManifest(rootDir)`
- missing file → null
- invalid JSON → null
- missing required fields (globalHash, routes) → null
- valid manifest → returns typed object

`writeBuildDiff / readBuildDiff / clearBuildDiff`
- writeBuildDiff writes JSON to `.ssg-cache/current-diff.json`
- readBuildDiff reads it back and returns typed BuildDiff
- readBuildDiff missing file → null
- readBuildDiff invalid structure → null
- clearBuildDiff calls unlinkSync; tolerates missing file (no throw)

`restoreCached(rootDir, distDir, unchanged, manifest)`
- skips routes not in manifest
- skips cache files that don't exist
- copies cached HTML to dist with mkdirSync for parent dirs

`saveCache(rootDir, distDir, manifest)`
- copies existing HTML files from dist to cache dir
- writes manifest.json
- skips HTML files that don't exist in distDir

**Validation:** `pnpm test src/plugins/incrementalSSG`

---

## Task T37: seoMetaPlugin — `src/plugins/seoMetaPlugin.ts`

**Model**: Claude Sonnet 4.6

Drive all tests through `processBuiltHtml(rootDir)` with mocked filesystem.
Also mock `scripts/buildUtils` (`readJson`, `walkJsonFiles`, `extractYearMonth`).

**Mock strategy:**
```ts
vi.mock('fs');
vi.mock('../../scripts/buildUtils', () => ({
  readJson: vi.fn(),
  walkJsonFiles: vi.fn(() => []),
  extractYearMonth: vi.fn(() => ({ year: '2024', month: '05' })),
}));
```

Setup helpers — build minimal HTML fixture and mock `readdirSync`/`existsSync`
to return a simple `build/client/` tree with one `index.html`.

| Test file | Function(s) | Lines | Tests |
|-----------|-------------|-------|-------|
| `seoMetaPlugin.test.ts` | `processBuiltHtml` + internal HTML helpers | ~150 | See below |

**Tests:**

`escAttr` (via processBuiltHtml output):
- `&`, `"`, `<`, `>` are escaped in meta content values

`upsertMeta`:
- inserts missing meta tag before `</head>`
- updates existing `<meta name="..." content="...">` in place
- updates existing `<meta property="..." content="...">` in place
- handles both attribute orderings (name/content and content/name)

`upsertTitle`:
- replaces existing `<title>` content
- inserts `<title>` before `</head>` when absent

`injectBeforeHead`:
- inserts snippet before `</head>`

`handleHome` (route `/`):
- sets page title to `${site.name} — реклама, которая работает`
- injects og:description, og:url, og:type=website
- injects canonical link
- injects Organization JSON-LD with name, contactPoint, address

`handleNotFound` (route `/404`):
- sets title with "404 — Страница не найдена"
- injects `<meta name="robots" content="noindex">`

`handleCasePage` (route `/portfolio/:cat/:year/:month/:slug`):
- sets title to `${meta.title} — ${siteName}`
- injects breadcrumb JSON-LD with 4 list items
- uses `meta.title`/`meta.description` when present, falls back to `title`/`description`
- injects canonical URL with correct category slug from categories list

`processBuiltHtml` guards:
- returns early (logs warning) when `seo.json` is missing
- skips `index.html` files that don't exist on disk
- copies `build/client/404/index.html` → `build/client/404.html`

**Validation:** `pnpm test src/plugins/seoMetaPlugin`

---

## Task T38: themePlugin — `src/plugins/themePlugin.ts`

**Model**: Claude Haiku 4.5

Call Vite plugin hooks directly on the returned plugin object.

**Mock strategy:**
```ts
vi.mock('fs', () => ({
  readFileSync: vi.fn(),
  existsSync: vi.fn(),
}));
```

| Test file | Function(s) | Lines | Tests |
|-----------|-------------|-------|-------|
| `themePlugin.test.ts` | `themePlugin()` hooks | ~80 | See below |

**Tests:**

Plugin identity:
- `themePlugin().name` equals `'vite-plugin-theme'`
- `themePlugin().enforce` equals `'pre'`

`resolveId(id)`:
- `'virtual:theme-vars.css'` → `'\0virtual:theme-vars.css'`
- any other id → `undefined`

`load(id)`:
- `'\0virtual:theme-vars.css'` → returns CSS string containing `:root {`
- other id → `undefined`

`configResolved()`:
- reads `theme.json`; sets `theme` used by `load` and `transformIndexHtml`
- when `seo.json` exists, extracts `locale.split('_')[0]` as `lang`
- when `seo.json` missing, defaults to `'en'`

`transformIndexHtml(html)`:
- injects `<style id="theme-vars">` before `</head>`
- CSS contains `--primary:`, `--radius:`, `--font-heading:`, `--font-body:`
- when `darkColors` present, CSS also contains `.dark {`
- replaces `lang="..."` attribute in `<html>` tag with locale-derived value

`buildColorVars` (via `load` / `transformIndexHtml` output):
- camelCase key `surfaceDark` → `--surface-dark`
- unknown keys pass through as-is (e.g. `myCustomColor` → `--myCustomColor`)

**Validation:** `pnpm test src/plugins/themePlugin`

---

## Task T39: imageResizePlugin — `src/plugins/imageResizePlugin.ts`

**Model**: Claude Haiku 4.5

Skip `buildStart` internals (Sharp binary + real disk I/O). Test plugin identity,
`configResolved` hook behaviour, and the dev-mode early-return guard.

**Mock strategy:**
```ts
vi.mock('fs', () => ({
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
  readdirSync: vi.fn(),
  mkdirSync: vi.fn(),
  writeFileSync: vi.fn(),
}));
```

| Test file | Function(s) | Lines | Tests |
|-----------|-------------|-------|-------|
| `imageResizePlugin.test.ts` | `imageResizePlugin()` hooks | ~50 | See below |

**Tests:**

Plugin identity:
- `imageResizePlugin().name` equals `'vite-plugin-image-resize'`

`configResolved(config)`:
- reads `site.json` when it exists; merges `imageOptimization` fields
- skips reading `site.json` when file is absent (`existsSync` returns false)
- partial `imageOptimization` override merges with defaults (e.g. only `quality` provided)

`buildStart()` early return:
- does nothing when `config.command !== 'build'` (dev mode guard)
- returns without calling `existsSync` for the images dir when not a build

**Note:** `resolveImageSrcSet` re-export is already covered by `imageSrcSet.test.ts` — no duplication needed.

**Validation:** `pnpm test src/plugins/imageResizePlugin`

---

## Summary

| Task | File | Est. tests |
|------|------|-----------|
| T36 | `incrementalSSG.ts` | ~28 |
| T37 | `seoMetaPlugin.ts` | ~22 |
| T38 | `themePlugin.ts` | ~14 |
| T39 | `imageResizePlugin.ts` | ~6 |
| **Total** | | **~70 tests** |

## Execution Order

T36 → T37 → T38 → T39 (all independent, order by complexity desc).

## Validation (each task)

```bash
pnpm format && pnpm lint && pnpm typecheck && pnpm test <path>
```

Final after all tasks:

```bash
pnpm format && pnpm lint && pnpm typecheck && pnpm build
```
