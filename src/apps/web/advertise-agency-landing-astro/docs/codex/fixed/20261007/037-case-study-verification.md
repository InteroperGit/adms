# Verify expanded case studies and project navigation

**Status:** Completed technical verification, 2026-10-07

**Priority:** High

**Created:** 2026-10-07

**Depends on:**
[Task 035](035-case-study-content-and-evidence.md) and
[task 036](036-expanded-case-study-pages.md).

## Goal

Verify truthful, usable case studies connected to the inquiry flow under the
[sales and SEO plan](../../plan/sales-and-seo-plan.md).
Read [project instructions](../../../../AGENTS.md),
[task management](../../task-management.md), and applicable development rules.
Apply playwright for browser checks.

## Scope and acceptance

- Audit every published case against evidence/approvals: task/context,
  materials/dimensions, production time, installation photos/rights, outcome,
  and attribution. Unsupported growth claims must be absent. Demo/draft
  notices are visible; technical checks confer no agency approval.
- Check homepage cards and every generated project URL for matching content,
  one H1, logical headings, descriptive metadata, breadcrumbs, and native
  return/contact/inquiry navigation.
- Inspect representative pages at 320px, 768px, and 1440px in both themes.
  Check long Russian text and 200% text enlargement for overflow, clipping,
  readable specifications, usable actions, and adequate text contrast.
- Check image decoding, responsive sources, alt/captions, crops, priorities,
  and reserved dimensions. Simulate a missing image: copy/actions stay useful.
  Record remote-image limitations rather than assuming reliability.
- Verify keyboard order, visible focus, Enter activation, and inquiry arrival
  with sticky-header clearance after navigation from project pages.
- Disable JavaScript in both system themes: details/photos and native inquiry
  links remain available. Disabled submission must not imply delivery.
- Exercise full, partial, empty, draft/demo, and unapproved content with
  temporary fixtures. Check notices, publication rules, generated routes,
  and absence of dangling homepage/pricing links. Restore originals exactly.
- Recheck homepage order/surfaces, pricing, service/project links, theme
  persistence, mobile menu, cookies, offers controls, and inquiry behavior.
- Run `pnpm check`, `pnpm build`, and diff checks. Audit generated routes and
  content; fix defects and repeat affected checks.

## Evidence and completion

Record URLs, viewport/theme cases, assertions, screenshots, fixture results,
and command outcomes under the project's ignored output folder. Summarize
findings and limitations in this task and the content handoff.

Separate technical acceptance from missing agency inputs and inquiry receipt.
Do not mark production acceptance complete without evidence and approved
photos. Archive after acceptance and update plan links/status under task rules.
Pending work stays in `todo/`.
## Task 036a handoff (2026-10-07)

Manufacturing and Installation are implemented with local preview diagrams
and proposed copy. See the completed
[task 036a](036a-case-study-manufacturing-and-installation.md).
The process contract allows absent/null/empty sections and text-only or
image-only content. Existing detail fields and narrative sections are now
optional too. Validation/rendering checks and 18 responsive/theme page cases
passed; evidence is in `output/playwright/task-036a/`. Extend regression checks
to the new content and optional states without assuming genuine photo rights
or agency acceptance. Older task-035/036 fixtures encode superseded required
detail and opening-action assumptions; update those expectations when reused.

## Verified scope and current user requirements

Verification covers the current development case studies, including subsequent
user adjustments to tasks 036/036a/036b: compact customer/year metadata, no
introductory notice/button or image heading, Russian process headings and
lists, final-result gallery after installation, optional sections, and a
grouped LedLettersForm only for `projectType: "led-letters"`.
Missing/null types and other English project types render no form or form link.
Homepage cards retain their project-solution notice. Detail qualifiers remain
in proposed copy, planned specification labels, and preview image captions.
The earlier instruction to retain an opening demo notice is superseded by the
user's explicit header simplification; it was not reintroduced by this review.

## Results (2026-10-07)

- `fixtures.mjs`: 133 schema/content/generated-page checks passed. Includes
  complete published fixtures with approved test media, draft route/card
  omission, absent/null/empty details, text-only and image-only process data,
  no unmatched forms or dangling actions, pricing destinations, and rejection
  of unapproved media, invalid types/dimensions, blank copy and demo outcomes.
  Isolated fixture builds leave checked-in catalog bytes unchanged.
- `browser.js`: 383 assertions passed across `/projects/1`, `/projects/2`,
  `/projects/3` at 320/768/1440px in both themes. Covers local image decoding,
  responsive sources, dimensions, alt text, one H1, matching H2 styles, unique
  IDs, form labels/description references, type selection, and 200% enlarged
  text without horizontal overflow. Minimum measured text contrast: 5.55:1
  light and 7.02:1 dark. This is a targeted DOM contrast check, not a complete
  assistive-technology audit.
- Keyboard focus/Tab/Enter, local form arrival, cross-page contacts and native
  return-to-projects navigation passed with sticky-header clearance. A failed
  local photo retains its frame, narrative and contact actions.
- No-JavaScript checks passed at 320px in both system themes: process/result
  content remains available, native form links clear the header, fields remain
  editable, and sending stays disabled. Form filling/fallback also verified.
- `fixture-browser.js`: 90 checks passed for seven fixture pages at all three
  widths in both themes. Covers complete/empty/partial pages, unknown-type
  omission and long Russian/unbroken text at 200% enlargement.
- `regressions.js`: 29 surrounding checks passed for cookie choices, theme
  persistence across routes, mobile-menu focus trapping/Escape/navigation,
  service/project links, contacts, disabled homepage inquiry, and offers manual
  controls/autoplay. `home.js` separately verifies homepage order, alternating
  surfaces in both themes, five services, three projects, and three pricing
  examples with decoded local images and valid inquiry destinations.
- `form.js`: six lettering-form viewport/theme cases and simulated submission
  checks passed. Includes required-field and negative-number rejection,
  duplicate prevention, case/service payload, retained values on failure,
  retry-stable request ID, and receipt-confirmed success/reset. Simulated
  responses are test evidence only; they do not establish actual delivery.
- `audit.mjs`: all 224 internal route/anchor destinations resolve across the
  11 generated pages. Nine case/form/schema sources pass 80-character and
  encoding audits. `git diff --check` passed.
- Final `pnpm check`: zero errors/warnings, one pre-existing unused-variable
  hint in the ignored task-018 helper. `pnpm build`: 11 pages, 28 image variants.
- Screenshots include complete fixture pages, grouped lettering forms, and
  enlarged form text. Desktop light lettering form reviewed visually.

## Corrections

The email field became required when email contact was selected, while its
label still said optional. Updated the visible requirement marker together
with native validation; reset restores the optional marker. `contact.js`
verifies desktop/mobile requirement updates and reset. Also cleaned form
markup indentation and corrected stale content-guide claims about the removed
opening action and form placement.

Two verification-helper failures were corrected: the local fragment URL
matcher expected an extra slash, and a fixture image loop tried to decode
the deliberately excluded external placeholder. Corrected checks passed;
neither failure established a product defect.

## Evidence and remaining production dependencies

Evidence is in ignored `output/playwright/task-037/`: fixtures, audit JSON,
browser/fixture/form/regression/home/contact/remote helpers and screenshots.
Playwright snapshots and console logs are in `.playwright-cli/`.
Main deterministic checks deliberately abort unrelated external HTTPS assets;
expected aborted-resource messages and a simulated HTTP 500 appear in logs.

`remote.js` also tested the three Picsum seeds in a fresh browser context
without interception. All three failed to decode in this environment. The
restored URLs remain at the user's request; their availability is not accepted
as reliable production photography. Local process/result diagrams decoded.

The real catalog contains no published agency-approved cases. Genuine copy,
photo rights, outcomes and attribution approval remain tasks 035/036 production
dependencies. The inquiry endpoint/approved consent and actual receipt remain
task 036b dependencies. This archive closes technical verification of the
current development implementation, not production case or delivery acceptance.
