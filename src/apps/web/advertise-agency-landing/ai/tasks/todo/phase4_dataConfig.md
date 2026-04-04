# Phase 4: Data & Config

**Tasks:** T26–T29 (4) | **Depends on:** Phase 3 ✅
**Parent index:** `20260401_generalArticleMechanism.md`

## Architecture Context

### Data folder structure
```
data/
├── content/
│   ├── portfolio/{category}/{year}/{month}/{yyyy_mm_dd}_{slug}.json
│   ├── services/{category}/{year}/{month}/{yyyy_mm_dd}_{slug}.json
│   ├── news/{year}/{month}/{yyyy_mm_dd}_{slug}.json
│   └── blog/{year}/{month}/{yyyy_mm_dd}_{slug}.json
└── config/
    ├── articleTypes.json (new)
    └── categories.json (existing)
```

### Schema examples path rename needed
- Current: `data/_schema/examples/articles/service/service.example.json`
- Target: `data/_schema/examples/articles/services/service.example.json`

### articleTypes.json shape
```json
{
  "types": [
    { "key": "portfolio", "label": "Портфолио", "icon": "briefcase" },
    { "key": "service", "label": "Услуги", "icon": "wrench" },
    { "key": "news", "label": "Новости", "icon": "newspaper" },
    { "key": "blog", "label": "Блог", "icon": "pen" }
  ]
}
```

### `generate-json-schemas.ts` references `service` path — needs update to `services`

---

## Tasks

1. **T26:** Move `data/_schema/examples/articles/service/` → `data/_schema/examples/articles/services/`; update `$schema` refs in example JSONs; update generate-json-schemas.ts to emit to `services/` folder
2. **T27:** Create `data/config/articleTypes.json` per shape above; export from `src/types/config/articleTypes.ts`
3. **T28:** Create 3 example article JSONs:
   - `data/content/services/seo-basics.json`
   - `data/content/news/2026/04/company-update.json`
   - `data/content/blog/2026/04/design-trends.json`
4. **T29:** Update `.vscode/settings.json` — add `fileMatch` patterns for services/news/blog articles

## Validation
- `pnpm validate` passes
- `pnpm gen-schemas` outputs correct paths
- `articleMap` loads all sample files
