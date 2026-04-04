# PDR — Generalized Article Mechanism (Index)

**Date:** 2026-04-01 | **Status:** Pending
**Related:** `portfolioStructure.md`, `blocks.md`, `typesStructure.md`

## Goal
Generalize Portfolio Case page mechanism into a reusable Article Engine: portfolio, service, news, blog — all rendered from `src/pages/ArticlePage.tsx` using `src/components/articles/`. No portfolio-specific components or pages remain.

## Phase Files (self-contained, load one at a time)

| Phase | File | Tasks | Key Dependencies |
|-------|------|-------|------------------|
| 0 | `phase0_migration.md` | T0.1–T0.4 (4) | None |
| 1 | `phase1_coreTypes.md` | T1–T7 (7, all done) | Phase 0 |
| 2 | `phase2_components.md` | T8–T19 (12) | Phase 1 |
| 3 | `phase3_pages.md` | T20–T25 (6) | Phase 2 |
| 4 | `phase4_dataConfig.md` | T26–T29 (4, all done) | Phase 3 |
| 5 | `phase5_ssg.md` | T30–T33 (4) | Phase 3 |
| 6 | `phase6_cleanup.md` | T34–T36 (3) | Phases 2–5 |
| 7 | `phase7_docsQa.md` | T37–T40 (4) | All prior |

## Success Criteria
- [ ] All tasks complete
- [ ] All portfolio JSON files use `publishedAt` (ISO datetime)
- [ ] `pnpm build && pnpm typecheck` passes
- [ ] `src/components/portfolio/` and `PortfolioCasePage.tsx`/`PortfolioCategoryPage.tsx` deleted
- [ ] All article types render through `ArticlePage.tsx` with type-specific sections
- [ ] Service, news, blog articles render correctly
- [ ] SEO meta + dark mode + incremental SSG cache all work for all types
- [ ] All unit tests pass for moved/renamed components and pages
