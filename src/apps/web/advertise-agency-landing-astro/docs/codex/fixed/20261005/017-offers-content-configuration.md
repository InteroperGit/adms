# Offers content and configuration

**Status:** Completed — 2026-10-05

**Priority:** Medium

**Dependency:** Completed design tasks 011–016.

Read the [carousel plan](../../plan/20261005_044149_plan.md), [task guide](../../task-management.md), [README](../../../../README.md) and [project instructions](../../../../AGENTS.md). Apply relevant astro-best-practices/frontend-design guidance and Playwright for browser work; consult required Astro guides.

## Scope

Create offers.json, validation and a typed export following existing conventions. Cover settings, interval limits, unique stable IDs, ordered enabled items, safe links and positive image dimensions. Keep publication disabled until approved offer copy/artwork exists; do not invent promotions. Start docs/site/offers-carousel.md with configuration and asset-handoff instructions, linked from README.

## Acceptance

Check valid zero/one/multiple configurations and rejection of duplicate IDs, unsafe links, invalid dimensions and short intervals. Run targeted validation checks plus check/build. No UI in this task.

Keep content truthful and JSON-editable. Browser evidence belongs under ignored `output/playwright/task-017/`. Record changed files, checks and limits; archive by actual completion date and update the plan after verification. No commit or deployment is implied.

## Completion evidence

Implemented by subagent task_017 and reviewed by primary. Added disabled, empty `data/content/offers.json`, strict offer/settings schemas, `src/content/offers.ts`, inferred Offer/Offers types and exports. Enabled-item export preserves editorial order. Updated README/content guide and added [offers editing/handoff guide](../../../site/offers-carousel.md).

66 targeted schema/wrapper assertions passed: valid empty/one/multiple items, filtering/order, defaults, duplicate IDs, unsafe URLs, invalid dimensions/intervals/flags/text and actionable source/field errors. `pnpm check` passed for 77 files with zero diagnostics; build generated six routes; diff check passed. Ignored schema evidence is `output/playwright/task-017/verify.mjs`.

No UI, browser or server added. Offers remain unpublished pending approved content. Until task 018 imports the wrapper into a page, a page build alone does not exercise offers validation; the targeted checks imported the actual wrapper. No dependencies, commit or deployment made.
