# Refactor all Astro components for readability and maintainability

**Status:** Completed

**Completed:** 2026-10-07

**Priority:** Medium

**Created:** 2026-10-07

## Goal

Apply the `astro-best-practices` skill to every `.astro` file in `src/`,
making components, layouts and pages human-readable and fully explained
through useful source comments while preserving their current behavior.

Read [project instructions](../../../../AGENTS.md),
[task management](../../task-management.md),
[code style](../../../development/rules/code-style.md),
[Astro rules](../../../development/rules/astro-guides.md),
[development server rules](../../../development/rules/dev-server.md), and
[sound notifications](../../../development/rules/sound-notifications.md).
Read and apply `astro-best-practices`; use the Playwright skill for browser
verification. Consult official Astro guides for the features being changed.

## Scope

- Inventory all `.astro` files under `src/components/`, `src/layouts/` and
  `src/pages/`, including cards, sections, UI primitives and dynamic routes.
  Record a per-file checklist so small wrappers and initialization components
  receive the same review as larger interactive components.
- Add or update purpose comments and explain meaningful props, defaults,
  slots, data assumptions, and logical markup sections. Use source-only
  Astro comments for internal explanations rather than shipping them as HTML.
- Expand compressed frontmatter, markup, scripts and CSS. Use descriptive
  names, clear control flow, consistent indentation and at most 80 characters
  on every source line. Keep imports, content preparation, markup, styles
  and browser behavior easy to locate and understand.
- Explain nontrivial transformations, event handling, initialization order,
  state transitions, storage/failure handling, cleanup, accessibility and
  theme behavior. Retain accurate existing comments; replace stale or vague
  comments with explanations of purpose and reasoning.
- Expand every CSS declaration and rule. Add a short explanatory comment
  before every class rule, descendant/state variant and media-query rule;
  explain the intent of responsive queries and preserve selector specificity.
- Apply the Astro skill's static-rendering, minimal-JavaScript, semantic
  markup, scoped-style and maintainability guidance. Preserve existing public
  props/slots, route structure, JSON content, rendered copy and destinations.
- Preserve current visuals, responsive spacing/columns, the task 030 footer,
  explicit/system theme behavior, cookie preferences, mobile navigation,
  settings, offers carousel and inquiry form behavior. Document any proposed
  behavior change separately instead of silently including it in this task.
- Update relevant development notes if a shared convention needs clarification.
  Avoid introducing frameworks, dependencies or abstractions solely to satisfy
  this refactor. Add focused tests only where meaningful behavior changes
  require them; formatting/comment changes need no new unit tests.

## Acceptance and verification

- Every inventoried `.astro` file is reviewed against `astro-best-practices`
  and the project rules, with a completed per-file checklist in the evidence.
- Source comments explain file responsibilities, component contracts,
  meaningful markup sections, nontrivial scripts and CSS behavior. Comments
  remain accurate and useful without narrating every obvious line.
- All `.astro` lines fit the 80-character limit. No compressed CSS rules or
  unexplained class/state/media rules remain. Changed scripts and markup
  use readable formatting and descriptive names.
- Run `pnpm check`, `pnpm build` and `git diff --check`; record results and
  distinguish existing diagnostics from regressions.
- Capture before/after screenshots for all generated routes in light/dark
  themes at mobile, tablet and desktop sizes, including 320/768/1440px.
  Review visual differences and check enlarged text for overflow/clipping.
- Verify native links, focus order/visibility, mobile menu, settings,
  theme switching/persistence and no-JavaScript system fallback, cookie
  choices, carousel navigation/autoplay/pause and inquiry validation.
  Preserve disabled-submit behavior when no form backend is configured.
- Verify rendered headings, landmarks, labels, image alternatives and
  contact/legal destinations. Confirm scripts retain their initialization
  timing and cleanup behavior, especially theme initialization before paint.
- Store reproducible browser evidence in ignored
  `output/playwright/task-031/`. Record coverage, changed file inventory,
  intentional source-only changes and any verification limitations.

## Completion

After acceptance passes, mark this task completed and archive it under
`docs/codex/fixed/yyyyMMdd/`, retaining its numbered filename and correcting
relative links. Update any corresponding plan references and record the
final implementation and verification results.

## Implementation

Reviewed and refactored all 37 Astro files using `astro-best-practices`.
Expanded compressed markup, frontmatter, browser scripts and CSS; added
file responsibilities, meaningful component contracts, source-only markup
notes, and explanations of initialization, focus, storage and timing behavior.
Every CSS rule and responsive/state variant has an explanatory comment.
Every Astro source line fits the 80-character limit.

Kept the static rendering model, props/slots, content, routes, native link
destinations, selectors, colors, responsive layouts and image handling.
Long utility lists use Astro `class:list`; long SVG paths use concatenated
strings whose resulting geometry is unchanged. ThemeInit remains inline in
the document head, and inquiry inputs remain protected before initialization.
No dependencies, frameworks or public component APIs were added.

Updated component conventions in `docs/development/project-structure.md`.
The existing Astro skill/readability rules added before this task are retained.

## Verification results

- Source audit: 37 files pass line length and CSS-comment coverage checks.
  Normalized CSS syntax trees preserve all original declarations, selectors
  and order. All seven browser scripts produce identical normalized emitted
  JavaScript after removing comments and formatting differences.
- `pnpm check`: zero errors and warnings; one existing unused-variable hint
  in `output/playwright/task-018/matrix.js`. `pnpm build`: all 11 routes pass.
  `git diff --check` passes.
- Captured 66 before and 66 after full-page screenshots: all 11 generated
  routes in Light/Dark at 320/768/1440px. Compared all main/footer element
  bounds, colors, font sizes, display values, headings and link destinations;
  every sampled value matches. Screenshot differences are development-toolbar
  pixels, one image-edge pixel, and a lazy map image captured before loading.
  The map was separately confirmed loaded in the production build.
- Raw homepage textContent differences are solely development source-location
  attributes embedded in noscript text. Rendered copy and native link labels
  remain unchanged. Light/dark route contact sheets were visually reviewed.
- Production Chrome: 115 checks pass for cookie acceptance/decline persistence,
  modal Tab wrapping/Escape/focus restoration, same-page focus navigation,
  settings dismissal, all theme preferences under both system schemes,
  reload/navigation persistence, disabled real delivery, and browser-only
  enabled-form fixtures for required fields, consent and malformed email.
- The same production matrix checks all 66 route/theme/width combinations
  with 32px root text: no horizontal overflow; each page retains one main h1,
  image alternatives and associated inquiry labels. This is text enlargement,
  not native browser zoom.
- Carousel real-time rotation, manual wrapping/announcement, keyboard-focus,
  hover, reduced-motion and offscreen pauses pass. Both no-JavaScript system
  themes retain their footer palette, static offers, hidden carousel controls
  and protected inquiry form.
- Supplemental production checks: five footer links retain visible keyboard
  outlines and Tab/Shift+Tab behavior; Enter reaches both legal documents and
  home. The local map fallback loads successfully.

## Evidence and limitations

Ignored local evidence is in `output/playwright/task-031/`: `before/`,
`after/`, light/dark contact sheets, `inventory.json`, `comparison.json`,
source snapshots, and reproducible capture/audit/behavior scripts with results.
The final behavior run uses the static build on port 4322; the development
toolbar and reloads interrupted earlier development-only runs.

External demonstration media and icon CSS were aborted equally for baseline
comparison. Remote media appearance, native zoom, screen-reader speech,
external telephone/mail applications, deployed-host behavior and frame-level
paint timing were not verified. No configured backend or real inquiry delivery
was exercised; validation used an isolated browser HTML fixture.

No corresponding plan references task 031, so no plan links need adjustment.

## Per-file review checklist

All checked files have reviewed responsibilities, contracts where applicable,
markup comments, line lengths, static rendering, semantics and styles.
Interactive files additionally have reviewed script timing and lifecycle.

- [x] `src/components/Header.astro`
- [x] `src/components/Footer.astro`
- [x] `src/components/CookieBanner.astro`
- [x] `src/components/cards/ProjectCard.astro`
- [x] `src/components/cards/ReviewCard.astro`
- [x] `src/components/cards/ServiceCard.astro`
- [x] `src/components/sections/About.astro`
- [x] `src/components/sections/Contacts.astro`
- [x] `src/components/sections/Introduction.astro`
- [x] `src/components/sections/OffersCarousel.astro`
- [x] `src/components/sections/OrderInquiry.astro`
- [x] `src/components/sections/Projects.astro`
- [x] `src/components/sections/Reviews.astro`
- [x] `src/components/sections/ServiceArticle.astro`
- [x] `src/components/sections/Services.astro`
- [x] `src/components/ui/Breadcrumbs.astro`
- [x] `src/components/ui/Button.astro`
- [x] `src/components/ui/ContactInfo.astro`
- [x] `src/components/ui/Logo.astro`
- [x] `src/components/ui/MobileMenuDialog.astro`
- [x] `src/components/ui/NavLinks.astro`
- [x] `src/components/ui/Section.astro`
- [x] `src/components/ui/ServiceVisual.astro`
- [x] `src/components/ui/Settings.astro`
- [x] `src/components/ui/ThemeInit.astro`
- [x] `src/components/ui/ThemeToggle.astro`
- [x] `src/layouts/Layout.astro`
- [x] `src/layouts/LegalLayout.astro`
- [x] `src/pages/index.astro`
- [x] `src/pages/privacy-policy.astro`
- [x] `src/pages/terms-of-use.astro`
- [x] `src/pages/projects/[id].astro`
- [x] `src/pages/services/montazh.astro`
- [x] `src/pages/services/neon.astro`
- [x] `src/pages/services/obyomnye-konstruktsii.astro`
- [x] `src/pages/services/svetovye-bukvy.astro`
- [x] `src/pages/services/vyveski.astro`
