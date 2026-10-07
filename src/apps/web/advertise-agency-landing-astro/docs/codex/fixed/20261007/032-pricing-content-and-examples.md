# Prepare demonstration pricing content and photos

**Status:** Completed — demo content layer verified

**Completed:** 2026-10-07

**Priority:** High

**Created:** 2026-10-07

**Depends on:** Existing content and image conventions; no real inputs needed.

**Updated:** 2026-10-07 — user requested fake data and photos because real
agency material is unavailable. This task delivers a usable demo dataset.

## Goal

Prepare editable, validated content for “Priority 1: Pricing and examples”
in the [sales and SEO plan](../../plan/sales-and-seo-plan.md).
Use fictional examples to demonstrate pricing presentation and inquiry
actions. Actual agency pricing and real project material are future inputs.

Read [project instructions](../../../../AGENTS.md),
[task management](../../task-management.md), and applicable development rules.

## Scope

- Review existing service demonstration content for consistent categories.
  Create fictional examples; do not present them as completed agency work.
- Create example project scopes with dimensions and units,
  materials, included production/installation/design work, and exclusions.
  Distinguish included work from optional work and exclusions.
- Supply fictional ruble prices, covering both exact amounts and useful
  ranges. Label them as illustrative figures rather than agency offers,
  verified market prices, historical transactions, or current estimates.
- Supply local test photos or generated photo-style assets relevant to the
  fictional scopes. Record source, usage rights, descriptive alt text,
  intrinsic dimensions, and crop guidance. Existing reusable demo media is
  acceptable; do not depend on remote placeholder services.
- Write illustrative cost factors and custom-estimate guidance. Label the
  overall content as demonstration material, pending later agency review.
- Create `data/content/pricing.json` and the corresponding types, schema,
  and loader using existing content parsing and image conventions.
  Support ordered examples, stable unique IDs, section copy, cost factors,
  estimate guidance, inquiry-button text, and visible Russian demo notices.
  Include a section notice and a short per-example fictional-price label.
- Represent price amounts as numeric values with explicit currency and
  price type. Validate positive amounts, ordered range bounds, required
  specification text, image metadata, IDs, and optional existing project
  links. Format displayed prices consistently for Russian readers.
- Track demo status separately from agency approval. Enable the requested
  demo dataset for task 033 without setting real-content approval flags.
  Keep production publication gated on genuine approvals; omit an empty
  dataset. Do not link fictional examples to unrelated real project pages.
- Document the content contract, demo notices, asset sources, and editing
  steps for task 033, including how to replace the demo with approved data.
  Missing real material does not block this task's demo acceptance.

## Acceptance and verification

- Demo examples include specifications, included work, exclusions, fictional
  prices, and working local test photos suitable for task 033's layout.
- Demo status and fictional prices are explicit in displayable Russian copy.
  No real agency capability, price verification, or completed work is claimed.
- Cost factors and estimate guidance are understandable as demo copy.
- The enabled demo loads without real approvals. Production mode continues
  to require verified details, prices, approved copy, and approved imagery.
- Valid exact/range prices and demo/draft/empty states load successfully.
  Invalid ranges, missing specifications, unsafe links, duplicate IDs, and
  incomplete approval metadata produce useful existing-format errors.
- Run `pnpm check`, `pnpm build`, and diff checks after implementation.
  Check meaningful content validation cases using existing tooling.
- Hand off the contract and unresolved inputs to
  [task 033](../../todo/033-pricing-examples-section.md).

Archive after demo acceptance passes and update the plan's links and status
according to the task-management guide. Record real agency content as future
production work, rather than an incomplete requirement for this demo task.

## Implementation and verification — 2026-10-07

- Added `pricing.json` with three fictional examples: facade letters,
  a flat entrance sign, and an interior neon inscription. Each includes
  dimensions, materials, included work, exclusions, conditions, and an
  exact or ranged numeric ruble price. All price contexts are `demo`.
- Added visible Russian section and fictional-price notice copy, cost
  factors, estimate guidance, and inquiry-link text for task 033.
- Reused three local Services demo PNGs with original SVG source references,
  usage permission, descriptive demonstration alt text, 1200×900 dimensions,
  and centered desktop/mobile focal points. Visually inspected each asset.
  These are category illustrations, not photos of the precise examples.
  Image generation was unavailable; task scope permits reused demo media.
- Added pricing types, strict schema, shared-parser loader, publication
  helpers, and Russian ruble formatting. Project links validate against
  records generating existing project routes; fictional links are rejected.
- Demo mode exposes three examples with all agency approvals false.
  Production mode exposes none; genuine publication needs approved section
  copy, specifications, item copy, price, image, and a non-demo context.
- Invalid content checks cover 42 cases: blanks, required specifications,
  duplicate/malformed IDs, price bounds/types/currency, nonfinite amounts,
  calendar dates, approval evidence/flags, unsafe/absent project links,
  missing/remote demo images, dimensions, alt, rights, and focal bounds.
  Shared errors identify `data/content/pricing.json` and the relevant field.
- Valid cases cover exact/range prices, decimals, demo/production modes,
  empty/single catalogs, image-free drafts, current/historical fixtures,
  approval gates, and matching project links. Fixtures never changed data.
- Sharp decoded all three originals, confirmed dimensions, and produced
  in-memory 320px WebP variants. The actual loader passed via Vite middleware
  without starting a listening server. Three visible demos, zero published.
- `pnpm check`: zero errors/warnings; one pre-existing unused-variable hint
  in ignored `output/playwright/task-018/matrix.js`.
- `pnpm build`: passed, 11 existing pages and 20 existing image variants.
  Pricing is not imported by a page yet; the separate actual-loader check
  verifies this task's content layer. No browser UI acceptance is claimed.
- Diff and new-file line-length checks passed. Local verification helper:
  `output/task-032/verify.mjs` (ignored).
- [Pricing handoff](../../../site/pricing-content.md) describes integration,
  image resolution, demo notices, editing, and the production transition.

Demo acceptance is complete. Task 033 implements the homepage section and
task 034 verifies its rendering. Genuine agency data/photos and inquiry
delivery remain future production work, not blockers for this demo task.
