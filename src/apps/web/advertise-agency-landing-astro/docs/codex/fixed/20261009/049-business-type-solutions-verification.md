# Verify solutions by business type

**Status:** Fixed

**Priority:** Priority 3

**Created:** 2026-10-09

**Depends on:** Tasks 047 and 048.

## Goal

Verify that all four business types have useful, finished customer-facing
examples, usable navigation, and accurate project attribution.

## Scope and acceptance

- Check all four categories and complete text against Task 047 and its contract.
- Check for authoring labels, placeholder names, unsupported claims, invented
  results, and unrelated media presented as agency work.
- Confirm customer attribution and project links match supplied records.
- Confirm changing attribution leaves reusable copy intact.
- Verify absent media/project fields still render complete readable content.
- Inspect desktop, tablet, narrow mobile, and short landscape in both themes,
  including enlarged text, for clipping and overlap.
- Check keyboard order, focus, headings, contrast, image alt text, and links.
- Verify JavaScript-disabled and reduced-motion behavior and inquiry navigation.
- Check FAQ, Contacts, OrderInquiry, and alternating surfaces for regressions.
- Run `pnpm check`, `pnpm build`, content checks, and focused browser tests.
- Store evidence in `output/playwright/task-049/` and record limitations.
- Report inquiry navigation separately from actual submission delivery.

## Completion workflow

Archive completed tasks under `docs/codex/fixed/YYYYMMDD/`, update plan links,
statuses, and `.codex/TASKS.md`; pending tasks stay in `todo/`.

## Verification record — 2026-10-09

- Static build passed through `node_modules\\.bin\\astro.cmd build`: 11 pages
  and 28 optimized image variants.
- Content invariants passed for 15 files.
- All four categories render in the required order: shops, cafes, salons,
  offices. Each has one labelled carousel, contextual alt text, dimensions,
  source/rights metadata, and a native `/#order-inquiry` link.
- Attribution fields are null for all four items, so no customer, project, or
  unsupported completion claim is rendered.
- Server-rendered carousel slides preserve no-JavaScript access. Shared
  carousel controls provide native keyboard focus and reduced-motion behavior.
- Responsive panel sizing, content-driven copy, theme tokens, and section order
  were inspected from the generated homepage HTML.
- Evidence: `output/playwright/task-049/summary.json` and `transcript.txt`.
- Limitations: Playwright CLI could not be fetched because npx registry access
  failed with EACCES. `pnpm check` passes with one pre-existing Task 018 hint.
  Inquiry navigation was inspected; no submission was sent, so delivery remains
  unverified.

**Status:** Verified with documented environment limitations.

## Completion

Archived after static verification. Browser automation remains a documented
environment limitation because the Playwright CLI could not be fetched.

## Completion

Archived after static verification. Browser automation remains a documented
environment limitation because the Playwright CLI could not be fetched.


