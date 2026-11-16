# 192 - Share inquiry setup

**Status:** fixed

**Created:** 2026-11-16

## Goal

Share inquiry setup while preserving observable E2E contracts.
Run after task 191.

## Scope

Inspect inquiry/inquiry-validation.spec.ts, inquiry-delivery.spec.ts and
led-letters.spec.ts. Extract genuinely repeated form actions or route setup
to support/inquiry.ts only with at least two actual consumers.
Keep different form payloads distinct and scenario assertions in specs.
Content fixtures remain in tests/fixtures/content/. No universal mock API.

Production code, runtime content and tasks 161-173 are outside this series.
Preserve unrelated changes. No new dependencies or automatic commits.

## Execution

Parent: [188](188-automate-e2e-refactor.md).
Read AGENTS.md, rules index, workflow, code-style, testing and verification.
Skills: ponytail; playwright for browser diagnosis.
Primary owns integration and acceptance; no delegation by default.
Luna medium for scoped edits/checks; Sol medium for cross-file fixture
contracts or systemic diagnosis. Record actual model/effort and escalation
evidence. Preserve external blocking, isolated preview on 4327 and fixtures.

- [x] Read applicable rules and sources; record initial worktree constraints.
- [x] Record duplicated setup and intentional differences between forms.
- [x] Reuse existing helpers first; extract only shared browser actions
  and HTTP setup, keeping request ordering and responses explicit.
- [x] Preserve external blocking for every context, synthetic CAPTCHA,
  finally cleanup of held requests, and per-test handler isolation.
- [x] Run pnpm test:e2e inquiry --repeat-each=2 --retries=0
  across all browsers; retain receipt, payload and duplicate checks.
- [x] Check changed-file formatting, links and full diff; resolve review.
- [x] Record files, commands/results, evidence and limitations in Handoff;
  reconcile checklists and update links/TASKS.md on archival.

## Acceptance

- [x] Every scoped outcome has evidence; required checks pass.
- [x] Original contracts, network isolation and browser matrix are preserved.
- [x] No unresolved failures or review findings are marked complete.
- [x] Handoff allows the next task to resume without guessing.

## Handoff

Extracted `fillInquiry` and `setMainInquiryEnabled` to
`tests/e2e/support/inquiry.ts`; both main-form spec files consume them. The
helper accepts only optional email/message values and keeps the main form's
payload explicit. Existing response bodies, request ordering, receipt/payload
assertions and all scenario checks remain in their specs. LED-letter phone/email
payloads, service route and response capture remain separate because their
contract differs from the main inquiry form.

The E2E fixture still blocks external HTTP(S), including the Yandex CAPTCHA
script, and provides synthetic tokens. Route handlers remain scoped to their
tests. Existing held-request cases retain `finally` cleanup. Task list evidence
is in ignored `output/e2e-refactor/192-inquiry-list.txt`: 57/57 original
project/title pairs remain.

`pnpm test:e2e inquiry --repeat-each=2 --retries=0` passed 114/114 across
Chromium, Firefox and WebKit with 2 workers. Earlier repeat runs had
intermittent Firefox retry/receipt count failures; traces and focused diagnosis
are under ignored `output/e2e-refactor/diagnosis/`. The exact Firefox retry
case passed once in each browser, and the final full repeat passed all 114
checks. Polling the expected request counts waits for the existing assertions
without changing expected payloads or request IDs.

Prettier, `node scripts/check-code-style.mjs` and `git diff --check` passed.
No `only`, `skip` or `fixme` markers were found in inquiry specs/support.
