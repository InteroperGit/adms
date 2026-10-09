# Verify the FAQ section

**Status:** Technical verification completed; agency approval pending

**Priority:** Priority 2

**Created:** 2026-10-09

**Depends on:**
[Task 044](044-faq-content.md) and
[Task 045](045-faq-section.md).

## Goal

Verify that the FAQ answers real customer objections, remains accessible, and
does not publish unsupported agency promises.

## Scope and acceptance

- Confirm every visible question and answer matches the Task 044 draft
  contract and appears exactly once; verify approvals independently.
- Test desktop, narrow mobile, short landscape, both themes, and enlarged text
  for overflow, clipping, contrast, and readable spacing.
- Test keyboard focus, disclosure activation, reading order, and inquiry-link
  activation with visible focus and sticky-header clearance.
- Verify the complete FAQ remains available with JavaScript disabled and under
  reduced-motion preferences.
- Check headings, disclosure semantics, link names, and landmark order.
- Confirm no bracketed terms; verify demo-off output omits unapproved copy
  and the demo notice. The requested demo intentionally shows draft copy.
- Run `pnpm check`, `pnpm build`, content invariants, and the focused browser
  checks. Record screenshots and any limitations under `output/playwright`.
- Separate technical acceptance from agency approval and inquiry delivery.

## Task 045 implementation handoff

User follow-up: FAQ is now visible through explicit `demoMode` with a
preliminary-answer notice. Test the nine actual native disclosures on the
homepage. Approvals remain drafts; disabling demo mode must still omit them.

`Faq.astro` is integrated after Reviews and before Contacts/OrderInquiry.
It uses `getVisibleFaqItems(faq)`; explicit demo mode exposes all nine drafts
with their preliminary-answer notice. Demo-off uses `getPublishedFaqItems`
and omits the whole section because no source approvals have been recorded.

The eligible branch uses native independent `details`/`summary` controls,
full question/answer document order, shared theme tokens and focus outlines,
wrapping text, and the contract's native `/#order-inquiry` link. No scripts
or FAQ structured data were added. Task 045 passed check/build, the content
contract checks, and an isolated one-approved-answer Astro container check.
Browser acceptance remains this task's responsibility; exercise an isolated
approved fixture without changing production approval records. See the
archived Task 045 for evidence and remaining agency/inquiry dependencies.

## Completion workflow

Archive this task under `docs/codex/fixed/YYYYMMDD/` only after verification,
then update the sales plan links and status.

## Completed verification, 2026-10-09

Technical acceptance passed for the user's requested visible demo. Added
`ariaLabel={faq.heading}` to name the FAQ section landmark; no customer copy
or agency approval changed. All nine question/answer pairs match Task 044
exactly and occur once in component-rendered and built homepage HTML.
The section contains one H2, nine independent native details/summary pairs,
the full answers in document order and the correctly named native inquiry.
No bracketed draft terms or FAQ structured data occur in FAQ output.

Focused Playwright verification passed 119 assertions: desktop 1440x1000,
tablet 768x1024, narrow mobile 320x760, short landscape 667x375; both themes
at 100/200% root text. All answers fit without FAQ clipping or overflow.
Minimum text contrast is 5.55:1 light / 7.02:1 dark, border contrast
4.59/5.50:1, focus contrast 6.06/8.04:1; targets are at least 44px.
Keyboard Enter/Space activation, Tab reading order, independent open answers,
visible focus and inquiry navigation with sticky-header clearance pass.
Two no-JavaScript contexts expand all nine answers and navigate by keyboard
under light/dark OS themes. Reduced motion is enabled for all browser checks.
Reviews → FAQ → Contacts → OrderInquiry order remains intact.

Publication/schema checks pass independently: disabling demo mode omits all
current drafts; an isolated one-approved-answer fixture renders only that
answer without the demo notice. Schema checks reject malformed approvals.
Current build intentionally contains the preliminary notice and nine drafts
under the explicit user request; production agency approval is still pending.
No promises were newly approved or rewritten during verification.

`pnpm check`, `pnpm build`, `pnpm verify:content` (14 files),
`node scripts/verify-faq.mjs` and the focused render fixture pass.
Check reports zero errors/warnings and one existing Task 018 hint.
The container fixture emits the existing transport-disconnected shutdown
message after success; normal build succeeds.

Evidence: [README](../../../../output/playwright/task-046/README.md),
[browser results](../../../../output/playwright/task-046/browser-results.json)
and 18 screenshots in `output/playwright/task-046/`. Development toolbar is
hidden only in evidence. HTTPS media was blocked; external-resource console
errors are recorded separately from FAQ behavior. Manual screen-reader
testing and inquiry delivery were not performed; the form is disabled.
Existing OrderingProcess CTA document overflow at 320px/200% text remains
as recorded by Task 043. FAQ itself fits; neighboring sections were preserved.
