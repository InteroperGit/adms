# PDR: Unit tests for scripts/

**Date**: 2026-03-24

## Goal

Add Vitest unit tests for all testable logic in `scripts/`. Scripts with
top-level side effects export their pure logic so tests can import and exercise
it in isolation with mocked `fs` and `buildUtils`.

`vitest.config.ts` already includes `scripts/**/*.test.ts`.

---

## Scope

| Script | Exported / testable functions | Test file | Status |
|---|---|---|---|
| `buildUtils.ts` | `readJson`, `walkJsonFiles`, `extractYearMonth` | `buildUtils.test.ts` | done ✅ |
| `postbuild-robots.ts` | `buildRobotsContent(baseUrl)` | `postbuild-robots.test.ts` | done ✅ |
| `postbuild-webmanifest.ts` | `buildWebmanifest(site, primaryHsl)` | `postbuild-webmanifest.test.ts` | done ✅ |
| `postbuild-sitemap.ts` | `buildEntries()` | `postbuild-sitemap.test.ts` | **todo** |
| `check-icons.ts` | `extractIconValues(obj)`, `listJsonFiles(dir)` | `check-icons.test.ts` | **todo** |
| `generate-json-schemas.ts` | `schemaUrl(subfolder, name, section?)`, `getSchemaPathForFile(filePath)`, `isObjectRoot(content)`, `injectSchema(obj, schemaPath)` | `generate-json-schemas.test.ts` | **todo** |
| `postbuild-seo.ts` | thin wrapper over `processBuiltHtml` | skip | already tested in `src/plugins/seoMetaPlugin.test.ts` |
| `postbuild-cache.ts` | thin wrapper over `computeRouteManifest` etc. | skip | already tested in `src/plugins/incrementalSSGPlugin.test.ts` |
| `validate.ts` | no exports — interactive CLI | skip | not unit-testable |
| `new-client.ts` | no exports — interactive CLI | skip | not unit-testable |
| `test-incremental.ts` | no exports — integration smoke test | skip | not unit-testable |

> **Required refactor**: `check-icons.ts` and `generate-json-schemas.ts` currently
> have no exports. Extract their pure functions as named exports before writing tests.

---

## Changes

### 1. `scripts/postbuild-sitemap.test.ts` (new)

Tests `buildEntries()`. Mocks `fs` (`readFileSync`) and `./buildUtils`
(`readJson`, `walkJsonFiles`, `extractYearMonth`).

```ts
vi.mock('fs', () => { ... });
vi.mock('./buildUtils', () => ({
  readJson: vi.fn(),
  walkJsonFiles: vi.fn(),
  extractYearMonth: vi.fn(),
}));
```

**Cases:**
- Returns static routes `/` and `/portfolio` with correct `changefreq`/`priority`
- Returns `/portfolio/all` category route plus each category slug
- Returns case route under `/portfolio/all/:year/:month/:slug`
- Returns duplicate case route under `/portfolio/:catSlug/:year/:month/:slug`
  when category name matches a known category
- Omits category-specific route when category name is unknown
- Respects `SITE_URL` env var in all `loc` values (use `vi.stubEnv`)
- Returns only static + category routes when `walkJsonFiles` returns `[]`

---

### 2. `scripts/check-icons.ts` — extract exports

Extract the two pure functions as named exports:

```ts
export function extractIconValues(obj: unknown): string[] { ... }
export function listJsonFiles(dir: string): string[] { ... }
```

### 3. `scripts/check-icons.test.ts` (new)

Tests `extractIconValues` and `listJsonFiles`. Mocks `fs` (`readdirSync`).

**`extractIconValues` cases:**
- Returns `[]` for primitives (string, number, null)
- Returns `[]` for empty object
- Extracts a single `icon` string value from a flat object
- Extracts multiple `icon` values from nested objects
- Extracts `icon` values from objects inside arrays
- Does NOT extract non-`icon` string fields
- Does NOT extract non-string `icon` values

**`listJsonFiles` cases:**
- Returns empty array when `readdirSync` throws (directory missing)
- Returns only `.json` filenames mapped to full paths
- Skips non-`.json` files

---

### 4. `scripts/generate-json-schemas.ts` — extract exports

Extract the four pure functions as named exports:

```ts
export function schemaUrl(subfolder: Subfolder, name: string, section?: string): string { ... }
export function getSchemaPathForFile(filePath: string): string | null { ... }
export function isObjectRoot(content: unknown): boolean { ... }
export function injectSchema(obj: Record<string, unknown>, schemaPath: string): Record<string, unknown> { ... }
```

### 5. `scripts/generate-json-schemas.test.ts` (new)

Tests the four pure functions. No mocks needed.

**`schemaUrl` cases:**
- Returns correct path without section
- Returns correct nested path with section

**`getSchemaPathForFile` cases:**
- Returns config schema path for `data/content/config/site.json`
- Returns `null` for `data/content/config/categories.json` (array-root)
- Returns legal schema path for `data/content/legal/privacyPolicy.json`
- Returns section schema path for `data/content/sections/header/header.json`
- Returns `null` for array-root section files (e.g. `carousel.json`)
- Returns portfolio schema path for `data/content/portfolio/all/2024/01/case.json`
- Returns `null` for unrecognised paths

**`isObjectRoot` cases:**
- Returns `true` for plain object `{}`
- Returns `false` for array `[]`
- Returns `false` for `null`
- Returns `false` for string/number

**`injectSchema` cases:**
- Adds `$schema` as the first key
- Preserves all existing fields
- Replaces existing `$schema` with the new value
- Does not mutate the input object

---

## File summary

| File | Action |
|---|---|
| `scripts/buildUtils.test.ts` | Created ✅ |
| `scripts/postbuild-robots.test.ts` | Created ✅ |
| `scripts/postbuild-webmanifest.test.ts` | Created ✅ |
| `scripts/postbuild-sitemap.test.ts` | **Create** |
| `scripts/check-icons.ts` | **Edit** — export `extractIconValues`, `listJsonFiles` |
| `scripts/check-icons.test.ts` | **Create** |
| `scripts/generate-json-schemas.ts` | **Edit** — export `schemaUrl`, `getSchemaPathForFile`, `isObjectRoot`, `injectSchema` |
| `scripts/generate-json-schemas.test.ts` | **Create** |

---

## Validation

```bash
pnpm test
# All scripts/*.test.ts cases pass

pnpm typecheck
# No TypeScript errors
```

---

## Acceptance criteria

- [ ] `scripts/postbuild-sitemap.test.ts` — all cases pass
- [ ] `scripts/check-icons.test.ts` — all cases pass
- [ ] `scripts/generate-json-schemas.test.ts` — all cases pass
- [ ] Existing `buildUtils`, `postbuild-robots`, `postbuild-webmanifest` tests still pass
- [ ] `pnpm test` exits 0 with no failures
- [ ] `pnpm typecheck` passes
