# Offers autoplay and pause behavior

**Status:** Pending

**Priority:** Medium

**Dependency:** 019 and 019a.

Read the [carousel plan](../plan/20261005_044149_plan.md), [task guide](../task-management.md), [README](../../../README.md) and [project instructions](../../../AGENTS.md). Apply relevant astro-best-practices/frontend-design guidance and Playwright for browser work; consult required Astro guides.

## Scope

Add configured autoplay and explicit pause/play using one timer. Respect hover, focus, document/viewport visibility, reduced motion and zero/one items. Manual navigation or keyboard interaction stops rotation until explicit Play; user pause lasts this page visit. Automatic changes never move focus or announce every slide. Play still respects temporary hover/focus/visibility constraints; avoid duplicate timers/catch-up jumps.

## Acceptance

Verify timing/wrap, manual stop/restart, hover/focus, hidden-tab/offscreen pause/resume, reduced motion and focused CTA safety in production Chrome. Document state rules and results; run check/build and restore original publication setting.

Keep content truthful and JSON-editable. Browser evidence belongs under ignored `output/playwright/task-020/`. Record changed files, checks and limits; archive by actual completion date and update the plan after verification. No commit or deployment is implied.
