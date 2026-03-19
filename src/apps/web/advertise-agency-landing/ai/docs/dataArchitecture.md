# Data Architecture

- All JSON data lives in `data/` at project root (NOT inside `src/`); alias `@data` → `./data`
- `tsconfig.app.json` has `"resolveJsonModule": true`
- **Components never import from `@data/` directly** — always go through `src/types/` or `src/lib/`
- Schema examples in `data/_schema/examples/` are git-tracked as **JSON** files (`.example.json`); actual data files are gitignored
- **JSON Schema files** (T8, March 2026): `pnpm gen-schemas` runs `scripts/generate-json-schemas.ts` → generates `data/_schema/schema/<name>.schema.json` per Zod schema using `z.toJSONSchema()` (Zod v4 built-in, no extra dep); also writes `.vscode/settings.json` for IDE schema mapping; object-root `.example.json` files have `"$schema": "../../schema/<name>.schema.json"` added
- **New-client CLI** (T8, March 2026): `pnpm new-client` runs `scripts/new-client.ts` → interactive readline CLI; prompts for agency info/colors (hex→HSL)/fonts; generates customised `site.json`, `theme.json`, `seo.json`, `header.json` + template copies of all other data files with `$schema` refs
- `tsconfig.app.json` `include` is `["src"]` only — no `data/_schema` (was removed when schemas converted to JSON)
- **Split**: pure interface+const files → `src/types/`; logic files (functions, glob) → `src/lib/`
