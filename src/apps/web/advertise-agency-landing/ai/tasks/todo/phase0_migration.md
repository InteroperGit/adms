# Phase 0: Migration — Rename `publishDate` → `publishedAt`

**Tasks:** T0.1–T0.4 (4) | **Depends on:** None
**Parent index:** `20260401_generalArticleMechanism.md`

## Architecture Reference

Portfolio JSON files currently have `publishDate` field (date string). Must be renamed to `publishedAt` (ISO datetime, e.g. `2024-08-01T00:00:00Z`).

Schema file: `data/content/_schema/portfolio.schema.json`
Portfolio data: `data/content/portfolio/` (nested folders)

## Tasks

- **T0.1:** Update `data/content/_schema/portfolio.schema.json` — rename `publishDate` to `publishedAt`, require ISO datetime format
- **T0.2:** Update all existing portfolio JSON files — rename `publishDate` to `publishedAt` (script or manual)
- **T0.3:** Update `ai/docs/*.md` — update documentation examples to use `publishedAt`
- **T0.4:** Verify `pnpm validate` passes with updated schema

---

**After Phase 0:**
- All portfolio cases use `publishedAt` (ISO datetime format)
- No migration logic needed in loader
