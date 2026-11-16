# 201 - Complete inquiry wiring and safe fallback contracts

- **Executor:** Luna (`gpt-6-luna`), reasoning: `high`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `high`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `high`.

**Status:** complete

**Created:** 2026-11-16

**Parent:** [195](195-automate-integration-test-improvements.md)

**Dependency:** [200](200-integration-articles-content-and-crawlers.md)

## Goal

Complete inquiry wiring and safe fallback contracts for tests/integration/.

## Scope

- Own inquiry integration suite and synthetic inquiry fixtures.
- Inspect OrderInquiry, OrderFormBlock, registry/article-context,
  service/project forms, callback composition, inquiry-payload and existing E2E
  delivery mocks.
- Cover enabled/disabled configuration, owner/service/category context,
  field/consent/error/status wiring, multiple form IDs, captcha configuration
  and safe native/no-JS fallback where rendered by the current implementation.
- Use real cooperating modules at each tested boundary; mock only external
  providers or fixture inputs.
- If a server boundary exists, test its actual validation/dependency failures;
  do not invent an endpoint or delivery path.
- Keep callback delivery disabled under task 173.
- No external submissions, credentials or runtime-content edits.
- Client retries/input preservation remain E2E; link exact existing scenarios
  and record genuine gaps.
- Run owned suite and pnpm test:integration.
- Runtime content stays in data/content/; synthetic fixtures belong in
  tests/fixtures/content/.
- Production behavior changes require a separate explicit scope decision.
- Preserve unrelated work and existing test gates.

## Execution

Skills: ponytail; Astro skill if changing .astro; playwright only for browser
diagnosis. Primary owns review and acceptance. No delegation by default.
Luna (`gpt-6-luna`), high, for implementation, checks and review per user
override. Record actual routing and evidence in Handoff.

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

- [x] Form configuration and article ownership agree across render boundaries.
- [x] Disabled delivery and incomplete configuration remain safe and usable.
- [x] No live delivery, external HTTP or personal/runtime data is required.

## Handoff

Actual implementation, testing and review: Luna (`gpt-6-luna`), high, per
user override. No delegation or escalation.

Changed `tests/integration/inquiry.test.ts` and this task record. The two
prepared inquiry cases were retained and expanded; five cases now cover the
configured disabled form, enabled configuration with controls still disabled
in SSR, registered service/project form ownership, general-inquiry fallback,
and callback consent/privacy with disabled submission. No application source,
runtime content, fixture files or endpoints changed. The existing versioned
`/__fixture/inquiry` URL is only rendered configuration; no request is sent.

The page-level route -> `ContentBlocks` -> form propagation is already covered
by `tests/integration/articles-content.test.ts` from task 200. No inquiry or
callback API route exists under `src/pages/`; `src/server/inquiry-payload.ts`
is a payload helper, not a delivery boundary. Browser validation, CAPTCHA
mocking, delivery errors/retries and input preservation remain covered by
`tests/e2e/inquiry/inquiry-validation.spec.ts`,
`tests/e2e/inquiry/inquiry-delivery.spec.ts`, and
`tests/e2e/inquiry/led-letters.spec.ts`. Callback interaction remains in
`tests/e2e/navigation/contact-menu.spec.ts` and
`tests/e2e/navigation/callback-dialog.spec.ts`.

Verification on Windows, Node 25.7.0, pnpm 10.7.0, Vitest 4.0.18; process
`TEMP`/`TMP` pointed to ignored `output/task195`:

- `pnpm exec vitest run tests/integration/inquiry.test.ts`: 5/5 passed.
- `pnpm test:integration`: 5 files, 73/73 passed, 51.21s.
- `pnpm exec prettier tests/integration/inquiry.test.ts --check`: passed.
- `pnpm exec eslint tests/integration/inquiry.test.ts --max-warnings=0`:
  passed.
- `pnpm check:style`: passed for the changed source file.

No browser tests, live submissions or full verification matrix were run.
