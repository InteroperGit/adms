# 198 - Complete shell, home and legal composition contracts

- **Executor:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `medium`.

**Status:** complete

**Created:** 2026-11-16

**Parent:** [195](../../todo/195-automate-integration-test-improvements.md)

**Dependency:** [197](197-integration-domain-suite-structure.md)

## Goal

Complete shell, home and legal composition contracts for tests/integration/.

## Scope

- Own shell/home/legal integration suites from 197.
- Inspect Layout, LegalLayout, index, 404, privacy-policy and terms-of-use with
  their real sections.
- Cover editorial order, unique anchors and target links,
  header/footer/action-rail/settings/cookie composition and legal links.
- Check enabled, disabled, empty and optional content states where the public
  contract permits them, including metadata/canonical/noindex, legal
  dates/sections and usable 404/native return links.
- Assert semantic HTML and cross-component wiring; retain component-local render
  details in colocated tests.
- Reference E2E for focus, storage, responsive behavior and theme switching.
- Use synthetic fixture overrides.
- Run affected domain files and pnpm test:integration.
- Runtime content stays in data/content/; synthetic fixtures belong in
  tests/fixtures/content/.
- Production behavior changes require a separate explicit scope decision.
- Preserve unrelated work and existing test gates.

## Execution

Skills: ponytail; Astro skill if changing .astro; playwright only for browser
diagnosis. Primary owns review and acceptance. No delegation by default.
Luna medium for inventory, scoped test edits, focused checks and docs;
Sol medium for conflicting cross-module contracts. Record actual routing
and concrete evidence for escalation in Handoff.

- [x] Read AGENTS.md and rules index, workflow, style, testing, verification.
- [x] Read parent, dependency evidence and affected source/callers.
- [x] Move this file backlog -> todo; update status and all task links.
- [x] Implement the scoped outcomes and record changed files.
- [x] Run checks named in Scope; record commands and actual results.
- [x] Review diff and resolve findings without weakening assertions.
- [x] Reconcile acceptance and execution; record evidence and limitations.
- [x] On accepted automatic execution archive to fixed/yyyyMMdd and update
  parent, sibling links and .codex/TASKS.md using Europe/Moscow date.

## Acceptance

- [x] Shell/home/legal matrix gaps from 196 have executable evidence.
- [x] Hidden sections leave no broken page navigation or duplicate target IDs.
- [x] Metadata and native fallback contracts hold for applicable variants.

## Handoff

Executor/tester/reviewer: Luna (`gpt-6-luna`), medium for all roles. Task 198
was already in `todo` with active links when this bounded implementation began.
No delegation or model escalation was needed. The `ponytail` skill was used;
Astro source files were inspected but not changed.

Changed files: `tests/integration/shell-home-legal.test.ts` and this handoff.
No source, runtime content, fixture, package or dependency changes were made.
The shell suite retains its original 16 expanded cases and adds one combined
empty-services/withheld-offers case, for 17 expanded cases total.

The suite now checks the shared full-document header/footer, settings and
mobile-menu control relationships, action-rail target wiring, hidden initial
cookie banner and choices, configured footer legal destinations, and unique
IDs across each full document. Homepage route variants check same-page
fragment links resolve against rendered IDs when offers are present or
withheld. The full homepage document with empty services and withheld offers
also verifies section IDs and all same-page fragment targets. Legal assertions
check dated and minimal documents, authored topic/copy order, optional date behavior, and
the native `/` return target on the privacy route. The 404 variants check the
named recovery region and decorative status semantics as well as the existing
service-dependent recovery links. Existing metadata, canonical and noindex
checks remain.

Verification ran from the application root on Windows with Node `v25.7.0`,
pnpm `10.7.0`, Vitest `4.0.18`. Process-local `TEMP`/`TMP` pointed to ignored
`output/task195` to avoid pnpm's user-temp EPERM; no maintained environment
configuration changed.

- `pnpm exec vitest run tests/integration/shell-home-legal.test.ts`: 17/17
  passed after the full-document empty-state variant (37.17 s Vitest duration).
- `pnpm test:integration`: 5 files, 60/60 passed with that final variant
  (40.85 s Vitest duration).
- An earlier focused run had 16/17 pass due to my incorrect expected legal
  fixture paragraph; corrected to match both paragraphs in
  `tests/fixtures/content/page-routes.json`, then the rerun passed.
- `pnpm check:style`: passed after wrapping the only flagged line; `pnpm check`
  later also passed style across 6 changed source files.
- `pnpm exec eslint tests/integration/shell-home-legal.test.ts
  --max-warnings 0`: passed.
- `pnpm exec prettier --check tests/integration/shell-home-legal.test.ts`:
  passed after formatting.
- `pnpm check`: passed for 375 files, zero errors/warnings, one existing Zod
  deprecation hint at `src/validation/content-blocks.ts:129`.

Luna self-review found no remaining assertion or scope issue. Browser focus,
storage, responsive behavior and theme switching remain E2E responsibilities
in `tests/e2e/navigation/mobile-drawer.spec.ts`,
`tests/e2e/navigation/header-settings.spec.ts`,
`tests/e2e/preferences/preferences.spec.ts`, and
`tests/e2e/no-javascript.spec.ts`; AstroContainer does not execute those scripts.
No browser or full verification matrix was run. Coordinator owns archival and
related task/index updates.
