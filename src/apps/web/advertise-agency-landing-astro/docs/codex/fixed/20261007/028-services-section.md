# Implement the homepage services section

**Status:** Archived at user request; layout implemented

**Archived:** 2026-10-07

**Priority:** High

**Created:** 2026-10-06

**Depends on:** [Task 027](027-services-content-and-images.md)

## Goal

Help visitors choose a service through clear, illustrated cards from the
[sales and SEO plan](../../plan/sales-and-seo-plan.md).

Read [project instructions](../../../../AGENTS.md),
[task management](../../task-management.md), and applicable code-style,
Astro, and development-server rules. Apply frontend-design and
astro-best-practices during implementation.

## Scope

- Build a mostly static `Services.astro` section using task 027's validated
  content. Extract a card component if it improves reuse and readability.
- Insert Services directly after About in `src/pages/index.astro`.
  Preserve the current offers-first order and rendered odd/even section
  backgrounds. Retain About and review service-copy overlap for a concise
  presentation without unrelated editorial changes.
- Use `id="services"`, a visible H2, and semantic service cards with
  subordinate headings. Preserve the homepage's single introductory H1.
- Add a descriptive native `/#services` navigation entry through the
  existing site configuration, supporting desktop and mobile menus.
- Show the service name, short explanation, and relevant image clearly.
  Use existing typography, brand tokens, section containers, and themes.
- Use responsive layouts that handle the confirmed catalog size, long
  Russian copy, enlarged text, and narrow screens without clipping.
- Follow the established image pipeline with stable dimensions, suitable
  responsive sizes and loading priorities. Keep card content usable if
  an image is absent or fails to load; record missing-image acceptance.
- Render native descriptive links only when a dedicated published page
  exists. Cards without pages remain readable static content. Avoid empty
  links, `#` placeholders, disabled fake controls, and nested anchors.
- Keep the section and available navigation useful without JavaScript.
  A new carousel, filter, or client framework is unnecessary for this grid.
- Prepare link rendering for future service pages without creating those
  pages or expanding into pricing, case studies, or inquiry delivery.

## Acceptance and verification

- Services follows About: OffersCarousel → Introduction → About → Services.
  Section surfaces alternate correctly in light and dark themes.
- Every published card describes a confirmed service with relevant approved
  imagery. Draft content and missing real images remain open acceptance.
- Available service links resolve; services without pages have no fake CTA.
- Header links reach the section with sticky-header clearance, including
  mobile navigation and navigation from another route.
- The section is semantic, keyboard accessible, responsive, and useful
  without JavaScript. Image frames avoid preventable layout shifts.
- Run `pnpm check`, `pnpm build`, and diff checks; record results and hand
  off browser review and remaining concerns to
  [task 029](029-services-verification.md).

Archive after acceptance passes and update the plan's task links/status
according to the task-management guide.

## Implementation and verification — 2026-10-06

- Added static `Services.astro` after About in `src/pages/index.astro`.
  Uses task 027's `publishedServices`; an empty catalog renders no section.
  Rendered odd/even surfaces continue to alternate automatically.
- Added reusable `ServiceCard.astro` with descriptive H3s, short copy,
  optional native heading links, stable 4:3 photo frames, separate mobile
  and desktop focal points, lazy loading, and no client-side JavaScript.
- Local originals use Astro Image with responsive widths/sizes. Supplied
  public/remote assets follow the existing image pipeline and require
  resizing/compression before publication. Missing configured originals
  fail with the service ID/source rather than rendering a broken asset.
- Added «Услуги» to the configured menu after About. The shared site loader
  omits this entry until cards are publishable, for all route/menu consumers.
- Kept existing About copy intact; actual editorial approval/overlap review
  remains an agency input rather than changing other unapproved claims.
- Applied frontend-design, astro-best-practices, and Playwright skills.
  Reused the background server at `http://localhost:4321`.
- Temporary fixtures enabled five cards using local non-project test media,
  one intentionally failed image, and one temporary dedicated service route.
  All source content was restored and the fixture route removed afterward.
  No confirmation or image approval flags were changed permanently.
- Light/dark browser checks at 320/768/1440px: one/two/three columns,
  five readable cards, no page/section horizontal overflow, one homepage H1,
  expected Offers → Introduction → About → Services order, alternating
  backgrounds, and no fake links on the four cards without detail pages.
- Reviewed light desktop/dark mobile screenshots. Failed-image cards retain
  the reserved frame and readable name/description; genuine photo details
  and crops cannot be accepted using these test images.
- Mobile/desktop navigation from a project page reached Services with header
  clearance; mobile menu closed. The linked card had a visible 2px focus
  outline and Enter reached the fixture page. A first helper run encountered
  development-toolbar shadow headings; the scoped corrected helper passed.
- At 320px, 200% root text plus long Russian/unbroken text stayed within the
  section. This is not a native-browser-zoom check.
- No-JavaScript 320px check: all five fixture cards rendered and the native
  service link reached its destination.
- Final `pnpm check`: zero errors/warnings, one pre-existing hint in ignored
  `output/playwright/task-018/matrix.js`. `pnpm build`: six static pages.
- Generated final HTML has one H1, no draft Services section, and no dangling
  Services menu link. The restored catalog matches the original exactly.
- Ignored helpers and screenshots: `output/playwright/task-028/`.

Archived at the user's request: approved service claims/copy and relevant
agency photos remain open. Task 029 should verify the populated catalog,
real image requests/crops, full keyboard/contrast and regression coverage.
The homepage omitted Services at this verification date. Completed task
028a subsequently enabled the user-requested demo with test illustrations
and article pages; genuine agency production acceptance remains open.
