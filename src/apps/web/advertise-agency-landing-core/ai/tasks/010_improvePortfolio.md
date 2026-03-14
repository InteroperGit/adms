# Plan: Portfolio nested folder structure (category / year / month / date-prefixed file)

## Context

`data/content/portfolio/` currently stores all case JSON files in a flat directory.
The user wants:
1. **Nested hierarchy**: `{category-slug}/{year}/{month}/` subfolders
2. **`publishDate` field** in every case JSON (`YYYY-MM-DD` ISO string)
3. **Date-prefixed filenames**: `yyyy_mm_dd_{slug}.json`

The full path pattern: `portfolio/{category}/{year}/{month}/{yyyy_mm_dd}_{slug}.json`
This mirrors the URL structure and enables chronological browsing by category/period.

---

## Target folder layout

```
data/content/portfolio/
├── branding/
│   ├── 2023/
│   │   ├── 03/
│   │   │   └── 2023_03_01_artplex.json
│   │   └── 09/
│   │       └── 2023_09_01_mobibank.json
│   └── 2024/
│       ├── 02/
│       │   └── 2024_02_01_fitstudio.json
│       ├── 05/
│       │   └── 2024_05_01_greenbox.json
│       └── 08/
│           └── 2024_08_01_lumiere.json
├── contextual-ads/
│   ├── 2023/
│   │   └── 04/
│   │       └── 2023_04_01_medline.json
│   └── 2024/
│       ├── 01/
│       │   └── 2024_01_01_automir.json
│       ├── 04/
│       │   └── 2024_04_01_homefit.json
│       ├── 07/
│       │   └── 2024_07_01_smartdom.json
│       └── 10/
│           └── 2024_10_01_techpulse.json
└── outdoor/
    └── 2023/
        └── 11/
            └── 2023_11_01_bodrost.json
```

> Placeholder dates are used for existing files (day = 01). Update with actual dates as needed.

---

## Files to change

### 1. `src/types/portfolio/index.ts`
- Add top-level `publishDate: z.string()` to `PortfolioCaseSchema`
- **Do NOT add** `overview.month` — `publishDate` covers this

```ts
export const PortfolioCaseSchema = z.object({
  slug: z.string(),
  publishDate: z.string(),   // ← add: ISO date "YYYY-MM-DD"
  title: z.string(),
  category: z.string(),
  description: z.string(),
  hero: z.object({ ... }),
  ...
  overview: z.object({
    client:   z.string(),
    year:     z.string(),
    // no month — use publishDate instead
    services: z.string(),
  }),
  ...
});
```

### 2. `src/types/portfolio/portfolioCases.ts`
- Glob: `@data/portfolio/*.json` → `@data/portfolio/**/*.json`
- Slug key: switch from filename-derived (`path.replace(...)`) to `data.slug`
  (critical — filenames now have date prefixes, regex no longer extracts slug)

```ts
const modules = import.meta.glob<PortfolioCase>('@data/portfolio/**/*.json', {
  eager: true,
  import: 'default',
});

export const portfolioCaseMap: Record<string, PortfolioCase> = Object.fromEntries(
  Object.entries(modules).map(([, data]) => {
    const parsed = PortfolioCaseSchema.parse(data);
    return [parsed.slug, parsed];
  })
);
```

### 3. `src/plugins/ssgMetaPlugin.ts`
Two locations use flat `readdirSync` — replace with recursive walk.

**a) Add `walkJsonFiles` helper** (module-level, before `readJson`):
```ts
function walkJsonFiles(dir: string): string[] {
  if (!existsSync(dir)) { return []; }
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) { return walkJsonFiles(full); }
    if (entry.isFile() && entry.name.endsWith('.json')) { return [full]; }
    return [];
  });
}
```

**b) `buildIncludedRoutes`** — replace flat scan:
```ts
const portfolioDir = path.resolve(rootDir, 'data/content/portfolio');
const caseFiles = walkJsonFiles(portfolioDir);
const cases = caseFiles.map(
  (f) => JSON.parse(readFileSync(f, 'utf-8')) as { slug: string; category: string }
);
```
Remove: `existsSync(portfolioDir) ? readdirSync(portfolioDir).filter(f => f.endsWith('.json')) : []`

**c) `createSsgMetaHook`** — build slug-map once at init, replace per-page readJson:
```ts
// After readJson calls for seo/site/legal, add:
const caseFileMap = Object.fromEntries(
  walkJsonFiles(path.resolve(rootDir, 'data/content/portfolio')).map((f) => {
    const data = JSON.parse(readFileSync(f, 'utf-8')) as CaseData & { slug: string };
    return [data.slug, data];
  })
);

// In onPageRendered, replace:
//   readJson<CaseData>(path.resolve(rootDir, `data/content/portfolio/${caseSlug}.json`))
// with:
//   caseFileMap[caseSlug] ?? null
```

### 4. `scripts/validate.ts`
- Add `walkJsonFiles` helper (same pattern as ssgMetaPlugin)
- Replace flat discovery + use relative path as label:

```ts
function walkJsonFiles(dir: string): string[] { ... } // same pattern

// replace the readdirSync block:
const files = walkJsonFiles(portfolioDir);
if (files.length === 0) {
  console.log('  (no portfolio cases found)');
} else {
  for (const file of files) {
    const label = path.relative(portfolioDir, file);
    check(label, () => PortfolioCaseSchema.parse(readJson(file)));
  }
}
```

Also remove `existsSync` / try-catch around the block — `walkJsonFiles` handles missing dir.

### 5. `scripts/generate-json-schemas.ts`
Update the `.vscode/settings.json` fileMatch entry:
```ts
// Before:
{ fileMatch: ['data/content/portfolio/*.json'], url: schemaUrl('portfolio', 'portfolio') },
// After:
{ fileMatch: ['data/content/portfolio/**/*.json'], url: schemaUrl('portfolio', 'portfolio') },
```

### 6. `scripts/new-client.ts`
Update the portfolio directory console messages:
```ts
console.log('  ✓ data/content/portfolio/  (empty — add cases as {category}/{year}/{month}/yyyy_mm_dd_slug.json)');
// Next steps line 3:
console.log('  3. Add data/content/portfolio/{category}/{year}/{month}/yyyy_mm_dd_slug.json');
```

### 7. `data/_schema/examples/portfolio/*.json` (example files)
Update all example portfolio case JSON files to:
- Add `"publishDate": "YYYY-MM-DD"` as a top-level field
- Update `"$schema"` path if it references the old flat structure (should remain `../../schema/portfolio.schema.json`)

Example:
```json
{
  "$schema": "../../schema/portfolio.schema.json",
  "slug": "example-case",
  "publishDate": "2024-01-15",
  "title": "Example Case",
  ...
}
```

---

## Migration: move + rename 11 existing files + add publishDate field

Each file must:
1. Be **moved** to the new nested path
2. Be **renamed** with the `yyyy_mm_dd_` prefix
3. Have `"publishDate": "YYYY-MM-DD"` **added** as a top-level field in the JSON

| Original file | New path | publishDate |
|---|---|---|
| `artplex.json` | `branding/2023/03/2023_03_01_artplex.json` | `"2023-03-01"` |
| `mobibank.json` | `branding/2023/09/2023_09_01_mobibank.json` | `"2023-09-01"` |
| `fitstudio.json` | `branding/2024/02/2024_02_01_fitstudio.json` | `"2024-02-01"` |
| `greenbox.json` | `branding/2024/05/2024_05_01_greenbox.json` | `"2024-05-01"` |
| `lumiere.json` | `branding/2024/08/2024_08_01_lumiere.json` | `"2024-08-01"` |
| `medline.json` | `contextual-ads/2023/04/2023_04_01_medline.json` | `"2023-04-01"` |
| `automir.json` | `contextual-ads/2024/01/2024_01_01_automir.json` | `"2024-01-01"` |
| `homefit.json` | `contextual-ads/2024/04/2024_04_01_homefit.json` | `"2024-04-01"` |
| `smartdom.json` | `contextual-ads/2024/07/2024_07_01_smartdom.json` | `"2024-07-01"` |
| `techpulse.json` | `contextual-ads/2024/10/2024_10_01_techpulse.json` | `"2024-10-01"` |
| `bodrost.json` | `outdoor/2023/11/2023_11_01_bodrost.json` | `"2023-11-01"` |

> All dates use day = 01 as placeholders. Update with actual publish dates.

---

## Execution order

1. Edit `src/types/portfolio/index.ts` — add `publishDate` field (top-level, required)
2. Edit `src/types/portfolio/portfolioCases.ts` — `**/*.json` glob + `data.slug` key
3. Edit `src/plugins/ssgMetaPlugin.ts` — add `walkJsonFiles`, fix `buildIncludedRoutes` + `createSsgMetaHook`
4. Edit `scripts/validate.ts` — add `walkJsonFiles`, fix portfolio scan
5. Edit `scripts/generate-json-schemas.ts` — update fileMatch glob
6. Edit `scripts/new-client.ts` — update console messages
7. Update `data/_schema/examples/portfolio/*.json` — add `publishDate` field to all example files
8. **Migrate files** (bash):
   - Create target directories
   - Copy each file to new path, then add `publishDate` field via `node -e` or `jq`
   - Delete original flat files
9. Run `pnpm gen-schemas`
10. Run `pnpm validate` — confirm all 11 cases pass with new path labels
11. Run `pnpm typecheck && pnpm lint`

---

## Verification

```bash
pnpm gen-schemas   # fileMatch shows **/*.json in .vscode/settings.json
pnpm validate      # shows branding/2023/03/2023_03_01_artplex.json etc.
pnpm typecheck     # 0 errors (publishDate added to type)
pnpm lint          # 0 errors
pnpm build         # SSG generates /portfolio/{cat}/{slug} pages correctly
```

---

## Status

- [x] Step 1: Edit `src/types/portfolio/index.ts` ✅
- [x] Step 2: Edit `src/types/portfolio/portfolioCases.ts` ✅
- [x] Step 3: Edit `src/plugins/ssgMetaPlugin.ts` ✅
- [x] Step 4: Edit `scripts/validate.ts` ✅
- [x] Step 5: Edit `scripts/generate-json-schemas.ts` ✅
- [x] Step 6: Edit `scripts/new-client.ts` ✅
- [x] Step 7: Update `data/_schema/examples/portfolio/*.json` ✅
- [x] Step 8: Migrate files (11 cases moved to nested structure) ✅
- [x] Step 9: Run `pnpm gen-schemas` ✅
- [x] Step 10: Run `pnpm validate` (all 11 cases pass with new paths) ✅
- [x] Step 11: Run `pnpm typecheck && pnpm lint` ✅
- [x] ✅ **DONE** — Portfolio nested structure implemented, all validations passing, SSG build verified
