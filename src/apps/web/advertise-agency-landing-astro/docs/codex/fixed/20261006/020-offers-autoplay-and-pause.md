# Offers autoplay and pause behavior

**Status:** Fixed 2026-10-06; native visibility verification carried to 021.

**Priority:** Medium

**Dependency:** 019 and 019a.

**Follow-up:** [020a](020a-offers-settings-autoplay.md)
supersedes the explicit
pause/play button and persistent manual-stop requirements. Preserve the
implementation history below; carry native visibility verification forward.

Read the [carousel plan](../../plan/20261005_044149_plan.md), [task guide](../../task-management.md), [README](../../../../README.md) and [project instructions](../../../../AGENTS.md). Apply relevant astro-best-practices/frontend-design guidance and Playwright for browser work; consult required Astro guides.

## Scope

Add configured autoplay and explicit pause/play using one timer. Respect hover, focus, document/viewport visibility, reduced motion and zero/one items. Manual navigation or keyboard interaction stops rotation until explicit Play; user pause lasts this page visit. Automatic changes never move focus or announce every slide. Play still respects temporary hover/focus/visibility constraints; avoid duplicate timers/catch-up jumps.

## Acceptance

Verify timing/wrap, manual stop/restart, hover/focus, hidden-tab/offscreen pause/resume, reduced motion and focused CTA safety in production Chrome. Document state rules and results; run check/build and restore original publication setting.

Keep content truthful and JSON-editable. Browser evidence belongs under ignored `output/playwright/task-020/`. Record changed files, checks and limits; archive by actual completion date and update the plan after verification. No commit or deployment is implied.

## Implementation and verification — 2026-10-06

Changed `src/components/sections/OffersCarousel.astro` and
`docs/site/offers-carousel.md`. Configured autoplay uses one resettable timeout
and an explicit requested state. Added an accessible circular pause/play button,
reserved dot/copy clearance and placed controls before slides in keyboard order.
Hover, focus, document/viewport visibility, reduced motion and page lifecycle
gate rotation. Manual actions and keyboard focus stop until explicit Play.
Automatic changes preserve focus and remain silent. No content/schema changes.

Production Chrome passed 44 main timing/interaction/layout assertions and seven
supplementary checks. Timing includes real approximately 7s rotation/wrap and
controlled-clock interval boundaries. Checks cover hover/focus/manual holds,
Pause/Play, keyboard restart, focused CTA safety, offscreen/resume, reduced
motion, simulated visibility holds/resume and duplicate-timer prevention.
Sixteen theme/width/text-size layouts, 844×390 landscape and no-JS fallback
passed. Browser screenshots and scripts are in `output/playwright/task-020/`;
the mobile screenshot was visually reviewed.

Three actual JSON fixtures (zero, one, autoplay false with explicit Play) were
built and checked in Chrome. Original JSON bytes/publication settings restored:
enabled true, autoplay true, interval 7000, two items. Production build restored.
`pnpm check`: zero errors/warnings, one preexisting ignored task-018 script hint.
`pnpm build`: six pages. Component 80-column and diff checks pass.

Native hidden-tab acceptance remains unverified: automated Chrome kept
`document.hidden` false on tab switch/window minimization even with focus
emulation disabled. Simulated visibility events passed against production code.
Archived as fixed at the user's request on 2026-10-06. Task 020a supersedes the
original pause/play behavior. Native hidden/visible document verification is
carried to task 021; simulated events are not a native browser result. Task 021
also owns the broader integration/performance review. No commit or deployment.
