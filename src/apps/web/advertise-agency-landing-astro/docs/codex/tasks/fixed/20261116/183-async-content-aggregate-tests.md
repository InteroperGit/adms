# 183 - Test async content aggregates

**Status:** fixed

**Priority:** high

**Created:** 2026-11-15

**Scope:** `src/content/pricing.ts`, `src/content/projects.ts`,
`src/content/services.ts`, `src/content/site.ts`

## Goal

Add focused tests around the modules that combine parsed config, Astro content
collections, publication policy and derived visible lists.

## Scope

- Add matching colocated tests for all four modules.
- Mock `astro:content` at the module boundary with minimal valid, missing,
  mismatched and rendered-entry cases.
- Cover JSON and MDX article paths, missing/mismatched IDs, publication
  filtering, visible category/service lists, pricing route allow-lists and the
  site menu filter based on visible services.
- Keep mocks deterministic and isolated; do not read or rewrite runtime
  content, and do not duplicate schema tests.

## Execution

- Skills: `ponytail`.
- Primary executor: Sol, medium; async module evaluation crosses several local
  contracts.
- Escalate to Astra only after a reproducible unresolved module-mocking or
  publication-contract conflict; record evidence if that occurs.
- Delegation: none.

### Checklist

Update these checkboxes during execution using the
[task checklist rules](../../rules/workflow.md#task-checklists).

- [x] Read the four modules, publication helpers, content config and existing
  async test patterns.
- [x] Create isolated `astro:content` mocks and synthetic collection entries.
- [x] Add success, missing-entry, ID-mismatch and publication-boundary tests.
- [x] Run the four focused suites, related publication tests and `pnpm check`.
- [x] Review module cache/reset behavior so one suite cannot leak collection
  data.
- [x] Record changed files, verification commands/results and resolved review
  findings in this task's handoff; reconcile all checkboxes before completion.

## Acceptance

- [x] JSON and rendered MDX article paths are covered with isolated
  astro:content mocks.
- [x] Missing entries and mismatched IDs reject invalid references without JSON
  fallback.
- [x] Publication filtering prevents unapproved route, category and service
  leakage.
- [x] Pricing route allow-lists and site menu filtering follow visible services.
- [x] Module cache resets prevent collection data leaking between tests.
- [x] Each listed module has a matching colocated suite with meaningful async
  and
  failure assertions.
- [x] Tests prove no silent JSON fallback for invalid article references and no
  unapproved route/category leakage.
- [x] Focused tests, related publication tests and type/check diagnostics pass.

## Dependencies

Tasks 180-182 provide adjacent export coverage. Run this task after them when
sharing fixture helpers, but do not merge their responsibilities.

## Handoff

- Implementation: `/root/task183_impl` (Sol medium) added four colocated
  suites for projects, services, pricing and site. No runtime source or
  fixture files changed.
- Collection mocks cover JSON/MDX resolution, missing and mismatched entry
  rejection, draft category exclusion, unapproved service visibility,
  published-only pricing destinations and service menu filtering.
- `pnpm exec vitest run src/content/projects.test.ts
  src/content/services.test.ts src/content/site.test.ts
  src/content/pricing.test.ts src/content/project-publication.test.ts
  src/content/service-publication.test.ts
  src/content/pricing-publication.test.ts` passed (7 files, 22 tests).
- `pnpm check` passed (363 files, zero errors/warnings, one existing Zod
  deprecation hint); changed-source style passed for four files.
- Initial failures exposed cached service collection mocks and a parameterized
  project-case typing issue. Replaced service mocks with explicitly reset
  collection state and parameterized projects with named entries. Clean
  rerun passed. Three long test titles were shortened before the clean check.
- Independent test stage: reran the four aggregate suites and three related
  publication suites with `pnpm exec vitest run src/content/projects.test.ts
  src/content/services.test.ts src/content/site.test.ts
  src/content/pricing.test.ts src/content/project-publication.test.ts
  src/content/service-publication.test.ts
  src/content/pricing-publication.test.ts`; all 7 files and 22 tests passed.
  `pnpm check` passed across 363 files with zero errors/warnings and one
  existing Zod deprecation hint. Verified project/service/site/pricing suites
  reset module caches between imports; service collection entries are reset
  before every load. Non-fatal Node warnings noted an invalid
  `--localstorage-file` path.
- Review finding: visible-category inclusion was not asserted because both
  visible project records used `category: null`; the existing assertion only
  proved draft-only categories were omitted.
- Independent review `/root/task183_review` reported no other findings.
- Repair: assigned a registry category to one visible project and another to
  the draft-only project; now asserts only the visible category is available.
  Removed the stale pending-review line from this handoff.
- Repair verification: all four aggregate suites and three publication suites
  passed (7 files, 22 tests); `pnpm check` passed across 363 files with zero
  errors/warnings and the existing Zod deprecation hint. `git diff --check`
  passed. Non-fatal Node warnings noted an invalid `--localstorage-file`
  path.
- Independent post-repair test stage: reran all four aggregate suites and
  three publication suites; 7 files and 22 tests passed. `pnpm check` passed
  for 363 files with zero errors/warnings and one existing Zod deprecation
  hint; changed-source style passed for four files. Confirmed the visible
  project category is included and the draft-only category is excluded.
- Post-repair review: `/root/task183_rereview` reported no findings.
- Worker IDs: `/root/task183_impl` (Sol medium), `/root/task183_test`,
  `/root/task183_review`, `/root/task183_repair`, `/root/task183_retest`,
  `/root/task183_rereview` (all Luna high except implementation).
- Commit worker: `/root/task183_commit` (Luna high).
