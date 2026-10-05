# Offers static layout and homepage integration

**Status:** Pending

**Priority:** Medium

**Dependency:** 017 and 017a.

Read the [carousel plan](../plan/20261005_044149_plan.md), [task guide](../task-management.md), [README](../../../README.md) and [project instructions](../../../AGENTS.md). Apply relevant astro-best-practices/frontend-design guidance and Playwright for browser work; consult required Astro guides.

## Scope

Create sections/OffersCarousel.astro below the header and above About. Render validated offers with image, heading, description and CTA. Implement theme-aware desktop/mobile composition, reserved image frames and long-copy wrapping. Preserve hidden homepage h1. Disabled/zero items omit the section; one item is static; multiple items form a stacked readable no-JS fallback. Do not show nonfunctional controls.

## Acceptance

Test temporarily enabled preview in both themes at320/768/1440px, enlarged text and failed images. Check links/headings/overflow, capture representative screenshots and run check/build. Update offers guide and restore original publication setting.

Keep content truthful and JSON-editable. Browser evidence belongs under ignored `output/playwright/task-018/`. Record changed files, checks and limits; archive by actual completion date and update the plan after verification. No commit or deployment is implied.
