# Simplify offers to description and CTA over the background

**Status:** Completed — 2026-10-05 (Europe/Moscow)

**Priority:** Medium

**Dependency:** 018a. Implement before 019.

Read the [carousel plan](../../plan/20261005_044149_plan.md),
[task guide](../../task-management.md),
[offers guide](../../../site/offers-carousel.md),
[content guide](../../../site/content.md) and
[project instructions](../../../../AGENTS.md). Apply astro-best-practices,
frontend-design and Playwright; consult required Astro component, styling and
content guides.

## Requested change

Remove the visible component title and every visible offer title. Remove the
description's background container and image credits. Each slide should show
only its description and CTA over its full-width background image. This
supersedes task 018a's visible headings, opaque copy panel and credit UI.

## Scope

- Remove the heading band and its spacing so the first background begins
  immediately below the header. Remove offer heading elements. Preserve the
  existing hidden homepage h1 and label the offers region/slides accessibly
  without introducing visible replacement titles or fake headings. Use concise
  Russian accessible labels; retain stable IDs for later navigation.
- Remove the copy panel's background, border, radius and decorative box
  treatment. Keep a transparent layout wrapper only as needed for positioning.
  Visible slide content consists of description text and one native CTA; remove
  image-credit markup and styling entirely.
- Preserve JSON font size, text color, horizontal/vertical positioning, ordered
  enabled items, whole-slide remote backgrounds and native link destinations.
  Update plain domain contracts, schemas, wrappers, JSON and documentation
  together. Remove obsolete section/item `title` and `imageCredit` fields and
  associated credit type/schema exports; replace title-based accessibility
  references with the new labeling strategy. Retain strict validation and
  bidirectional checks for items, aggregates and remaining nested contracts.
- Replace any demo background that requires displayed attribution with a
  verified remote image whose terms permit use without displayed credit, such as
  CC0/public-domain imagery or an appropriate stock-library license. Do not
  simply hide the current CC BY credit while continuing to use that image. Keep
  photographer/source-page/usage-term records in documentation, independently of
  removed UI fields. Use direct HTTPS URLs, no local downloads or new background
  assets, and verify actual browser loading.
- Retain at least two enabled, clearly identified test offers. Keep demo copy
  concise and truthful; identify test content without turning the description
  into technical implementation notes. Remote stock photos must not imply agency
  work, client results or promotions. Do not invent offers or financial claims.

## Additional improvements

- Maintain description readability without a bounded copy panel. Use a subtle
  overlay across the entire slide, or a broad gradient blending into the
  photograph, together with restrained text shadow where useful. No rectangle,
  pill or local backing behind the description. The overlay must remain
  effective for bright, dark, busy and failed backgrounds and both themes.
  Preserve editor color selection and validate/document supported color/overlay
  combinations; if a color cannot meet contrast, report a source/field
  validation error rather than silently changing it. Text shadow alone is not
  contrast evidence. Keep CTA and focus-ring contrast independent of editor text
  color.
- Add JSON background focal-point settings with safe bounded numeric percentages
  and documented defaults, so editors can keep the image subject visible when
  desktop/mobile crops differ. Allow a mobile focal-point override if it
  materially improves the supplied demo images. Avoid arbitrary CSS strings;
  keep types and schemas synchronized.
- Tighten the composition now that headings/panels are gone: comfortable line
  lengths, intentional spacing between description and CTA, site-aligned
  gutters, and responsive minimum slide height. Avoid unnecessary blank space
  while preserving enough photograph to read as a background. Long or enlarged
  text must expand the slide without clipping or truncation.
- Preserve all nine description positions where space allows; keep mobile
  alignment predictable and document it. Reserve safe spacing for later carousel
  controls without adding placeholders or nonfunctional controls.
  Navigation/autoplay remain tasks 019–020.
- Keep zero/disabled omission, single static offer and readable stacked
  multiple-offer no-JavaScript fallback. Preserve image dimensions, first/later
  loading policy and usable copy/CTA during slow or failed remote requests.
  Avoid new client JavaScript for styling alone.
- Update current offers/content guides and the carousel plan around the final
  description-only layout, accessibility labels, contrast rules, focal-point
  settings and new demo sources. Historical completed task records remain
  historical.

## Acceptance

- Verify no visible component/item headings, copy background panel or
  image-credit UI remains. Confirm first background starts below the header and
  visible slide content is description plus CTA only. Check accessible
  region/slide names and preserve the single hidden homepage h1.
- Test both themes at 320/375/768/1440px, short landscape, 200% text and
  long/unbroken description/CTA copy. Check full-width coverage, all positions,
  focal points, wrapping, keyboard focus, CTA destinations and absence of
  horizontal overflow. Record native browser zoom separately from text-size
  simulation.
- Verify supported text/overlay combinations meet 4.5:1 normal-text contrast
  over representative bright/dark/busy images and failed-image fallback. Test
  slow/failed remote requests, zero/one/multiple enabled items and both-theme
  no-JavaScript fallback. Verify the retained remote images load and document
  their source/terms.
- Run meaningful schema/parser/wrapper checks for remaining defaults,
  focal-point bounds, invalid colors/contrast combinations, unknown fields,
  removed fields and preserved IDs/dimensions/URL/interval rules. Confirm
  domain/schema compatibility with `pnpm check`.
- Run `pnpm check`, `pnpm build` and diff checks. Save scripts/results and
  representative screenshots under ignored `output/playwright/task-018b/`. Use
  the instructed background-server workflow and keep browser tool waits bounded.
- Retain the requested enabled demo baseline; remove only temporary stress
  fixtures. Record changed files, actual verification and limitations; archive
  by actual completion date and update the plan when complete. No commit or
  deployment is implied.

## Completed implementation and evidence

Removed visible section/item headings, heading-band spacing, bounded description
backing and image-credit UI. Removed title/imageCredit contracts/schema exports;
strict validation rejects those obsolete fields. Homepage hidden h1 remains,
region/article Russian accessible names replace heading references, and stable
article IDs support later navigation. Static description/CTA text follows site
gutters, 36rem line lengths and tighter expanding slide heights, with bottom
control clearance and no new client JavaScript.

Added editable dark/light 72% whole-slide washes and source/field errors for
color combinations below 4.5:1 over any possible image pixel. Opaque six-digit
color and existing size/nine positions remain editable. Added bounded
desktop/mobile focal percentages with strict nested defaults and bidirectional
schema/domain checks. CTA/focus colors remain independent. Replaced
attribution-required second photo with a verified Parpeliupant CC0 source; both
retained direct HTTPS images loaded at matching intrinsic dimensions. Enabled
truthful demo baseline remains in JSON; temporary publication fixtures were
restored byte-for-byte.

Changed files for this task: src/components/sections/OffersCarousel.astro,
src/types/offer.ts, src/types/index.ts, src/validation/offers.ts,
data/content/offers.json, docs/site/offers-carousel.md, docs/site/content.md,
carousel plan and this archived task. Existing task 018/018a work was preserved.

Verification:
- 160 actual schema/parser/content-wrapper assertions: defaults, positions,
  focal ranges, contrast, colors, URL safety, removed/unknown fields, positive
  unique IDs/dimensions and interval rules. pnpm check confirms
  item/aggregate/presentation/focal compatibility in both directions.
- 16 Chrome Light/Dark × 320/375/768/1440px × normal/200% root-text
  combinations: loaded remote images, whole-slide coverage, predictable focal
  overrides, transparent copy, no titles/credits, first background immediately
  below header, hidden h1, native CTA targets and no overflow.
- Nine positions within 0.01px of expected coordinates, 844×390 landscape, 3px
  focus outlines and native Tab traversal. Four both-theme 320/1440px
  long/unbroken text/CTA cases at 3rem with 200% root text expand without
  clipping.
- Synthetic white/black/checkerboard backgrounds validate whole-slide alpha 0.72
  and demo contrast minima 9.23:1/8.07:1, without text shadow or local panels.
  Uncached failed images reach naturalWidth 0 and retain copy/CTAs; held
  requests retain 400px slide geometry before/after load in both themes.
  Both-theme JavaScript-disabled fallback remains stacked and usable.
- Actual server fixtures: zero, globally disabled, all disabled, one, ordered
  filtered item and restored two-demo baseline pass. pnpm check and pnpm build
  pass (six pages); diff check passes. One preexisting unused-variable hint in
  ignored task-018 browser evidence; no application errors/warnings.

Scripts, structured results, logs and representative screenshots: ignored
output/playwright/task-018b/. Source/creator/CC0 terms are recorded in the
current offers guide. Browser evidence uses development output; native browser
zoom was not tested (200% root text is distinct), and task 021 retains
integrated production review. Existing prescribed background server was reused
and remains running. No commit or deployment.
