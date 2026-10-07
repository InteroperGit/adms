# Implement the homepage pricing examples section

**Status:** Completed — enabled demo section implemented and checked

**Completed:** 2026-10-07

**Priority:** High

**Created:** 2026-10-07

**Depends on:**
[Task 032](032-pricing-content-and-examples.md) — completed.

**Content handoff:** [Pricing content](../../../site/pricing-content.md)

## Demo handoff update — 2026-10-07

The user requested fake data and photos in task 032. Implement its enabled
demo examples with a visible Russian section notice and fictional-price
labels beside each amount. Render test photos as demonstration imagery.
The demo must be visible without setting agency approval flags; omit only
an empty eligible dataset. These instructions supersede the real/approved
content requirements below for demo delivery. Keep production approval gates
for later real content. Persistent user-requested demo assets are retained;
only temporary verification fixtures must be restored.

## Goal

Help visitors compare real project scopes and budgets, then request a quote,
fulfilling “Priority 1: Pricing and examples” in the
[sales and SEO plan](../../plan/sales-and-seo-plan.md).

Read [project instructions](../../../../AGENTS.md),
[task management](../../task-management.md), and applicable code-style, Astro,
and development-server rules. Apply frontend-design and
astro-best-practices during implementation.

## Scope

- Build a mostly static `PricingExamples.astro` section from task 032's
  validated public content. Extract reusable presentation only where useful.
- Insert it directly after Projects and before Reviews in
  `src/pages/index.astro`. Preserve the existing offers-first sequence and
  backgrounds alternating by rendered section order.
- Use a stable `id="pricing"`, a visible H2, and semantic example headings.
  Preserve the homepage's single H1. Omit the section if no approved
  examples are available; any added navigation must follow that visibility.
- Show each real photo, project description, dimensions, materials,
  included work, exclusions, and exact price or range. Display price context
  and conditions close to the amount so a historical price cannot be
  mistaken for a current fixed offer.
- Show the confirmed cost factors and custom-estimate explanation beside
  or immediately after the examples, with a clear visual hierarchy.
- Place a descriptive inquiry link next to every example, using the
  existing inquiry section anchor. Keep links native and keyboard usable.
  Do not add a new form or imply successful delivery while submission is
  disabled. Inquiry delivery remains a separate plan dependency.
- Render optional project links only for existing matching destinations.
  Avoid nested anchors, empty links, and placeholder controls.
- Reuse established typography, tokens, containers, themes, and image
  handling. Reserve image dimensions, provide appropriate responsive sizes
  and loading priorities, and keep text readable when an image fails.
- Support narrow screens, long Russian text, enlarged text, and varying
  example counts without clipping. Keep all pricing information and links
  available without JavaScript; a calculator or carousel is outside scope.

## Acceptance and verification

- Approved examples render after Projects, with correct alternating surfaces
  in light and dark themes. Empty/draft content adds no dangling navigation.
- Buyers can see scope, price context, cost factors, and custom-estimate
  guidance without interacting with hidden controls.
- Inquiry links reach the existing form with sticky-header clearance.
  Project links, when present, resolve to the corresponding real project.
- Section headings, focus states, images, and layout follow accessibility
  and project conventions; content remains useful without JavaScript.
- Run `pnpm check`, `pnpm build`, and diff checks. Record implementation
  checks and hand off browser review and remaining inputs to
  [task 034](034-pricing-examples-verification.md).

Archive after acceptance passes and update the plan's task links/status.
Temporary layout fixtures must be restored and do not satisfy agency
content, pricing, or image acceptance.

## Implementation and verification — 2026-10-07

- Added static `PricingExamples.astro` immediately after Projects and before
  Reviews, preserving offers-first order and rendered surface alternation.
  `id="pricing"` has a visible H2 and labelled section. Empty eligible data
  omits the section. No new menu entry or browser script was introduced.
- Added `PricingExample.astro` for complete scope comparisons: image,
  title/H3, description, labelled dimensions/materials, amount, nearby
  fictional-price context/conditions, included work, exclusions, and a
  uniquely named native inquiry action. Optional genuine project links are
  separate anchors; current fictional examples contain none.
- Kept the Russian section demo notice prominent. Agency approvals remain
  false; task 032's publication gates determine visibility unchanged.
- Reused theme tokens, typography, containers, Button, and Astro Image.
  Bundled images use lazy responsive 320/480/768w sources with stable 4:3
  frames and separate crop positions. Missing bundled originals fail with
  the example ID. Public/remote production assets use supplied metadata.
- Single-column mobile layout pairs specification and scope from 42rem;
  desktop splits included/excluded work from 64rem. All copy stays visible
  and wraps; no calculator, carousel, hydration, or extra form was added.
- Applied frontend-design, astro-best-practices, and Playwright skills.
  Reused the background server at `http://localhost:4321`, session `pricing33`.
- Six browser cases at 320/768/1440px in light/dark themes passed: three
  examples, visible demo labels, one homepage H1, Projects → Pricing →
  Reviews, alternating surfaces, responsive image decoding and native links,
  no nested anchors or page/section horizontal overflow.
- Repeated six cases with 200% root text and long descriptions: no overflow.
  This verifies text enlargement, not native browser zoom. All three inquiry
  actions activated by Enter with sticky-header clearance at the form.
- Forward/reverse Tab and visible 2px focus outlines passed in both themes.
  Intentional failed-image checks retained identical frame dimensions and
  readable actions. DOM-only stress/failure mutations disappeared on reload.
- At 320px without JavaScript, three examples render and the native inquiry
  link reaches the form. Delivery remains disabled and was not tested.
- Browser checks aborted unrelated HTTPS placeholder requests to isolate
  local layout/anchors. They do not establish remote media reliability.
  Initial screenshots included fixed overlays; clean review captures hide
  header/toolbar/cookie UI only in screenshot styles. Reviewed desktop light
  and mobile dark layouts; text hierarchy and illustration crops are clear.
- Temporary content fixtures verified empty and unapproved-production
  omission, a single historical/current example with a displayed reference
  date, and optional project-link markup. Restored `pricing.json` byte-for-byte
  in `finally`; no fixture approval or project link remains in source.
- `pnpm check`: zero errors/warnings, one pre-existing unused-variable hint
  in ignored `output/playwright/task-018/matrix.js`. Final `pnpm build`
  passed with 11 pages and 20 reused responsive image variants.
- Evidence/helpers: `output/playwright/task-033/` (ignored). Diff and new
  component line-length checks passed. No dependencies changed.

Demo implementation acceptance is complete. Task 034 completed broader
demo verification on 2026-10-07, including contrast measurements, regressions,
and additional catalog/crop coverage. Genuine agency pricing/photos and
verified inquiry delivery remain future production work.
