# Verify the ordering process section

**Status:** Completed technical verification, 2026-10-09

**Priority:** Priority 2

**Created:** 2026-10-08

**Depends on:**
[Task 038](038-ordering-process-content.md) and
[Task 039](039-ordering-process-section.md).

## Goal

Verify that the ordering process explains the customer journey accurately,
works across supported layouts, and provides a usable route to inquiry.

## Scope and acceptance

- Confirm the five steps appear once and in the approved order.
- Confirm the ordering-process section renders immediately before the
  `Reviews.astro` testimonials component on the homepage.
- Check customer and agency responsibilities against the approved content.
- Test desktop, narrow mobile, short landscape, both themes, and enlarged
  text for overflow, clipping, contrast, and readable spacing.
- Test keyboard focus order, visible focus, activation, and sticky-header
  clearance for the inquiry action.
- Verify the section with JavaScript disabled and reduced-motion preferences.
- Confirm headings, list semantics, landmarks, link names, and reading order.
- Check that the section does not imply inquiry delivery when the endpoint is
  unavailable.
- Run `pnpm check`, `pnpm build`, and the relevant browser/content checks.

## Evidence and completion

Record tested URLs, viewport and theme cases, assertions, screenshots, and
known limitations under the ignored output folder. Separate technical
acceptance from missing agency approvals or inquiry delivery. Archive this
task under `docs/codex/fixed/YYYYMMDD/` only after acceptance and update the
plan links and status.

## Results — 2026-10-09

- Browser matrix passed at 375x800, 768x900, and 1280x900. Each case found
  one ordering section, five steps in the approved order, ten responsibility
  headings, one inquiry action, no horizontal overflow, and Reviews directly
  after the ordering section.
- The inquiry action has the expected `/#order-inquiry` destination and
  receives keyboard focus while remaining visible in the viewport.
- Reduced-motion emulation passed with the static section unchanged. Dark
  theme rendering remained visible.
- A script-blocked reload retained the section, all five steps, and the
  inquiry link, confirming that the section does not require JavaScript.
- Screenshots and browser output are recorded under
  `output/playwright/task-040/`; the Playwright console errors are expected
  from intentionally aborted script requests in the static fallback case.
- After the icon refactor, a focused browser check passed with five
  content-linked `img.ordering-icon` elements, each marked
  `aria-hidden="true"`. The post-change screenshot is
  `output/playwright/task-040/ordering-process-icons.png`.
- `pnpm check`, `pnpm check:style`, `pnpm build`, built-quality checks, and
  content invariants passed. The check command retains one pre-existing hint
  in the ignored `output/playwright/task-018/matrix.js` helper.

Technical verification is complete. Agency approval of the draft process
copy and real inquiry delivery remain production dependencies.
