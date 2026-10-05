# Offers autoplay controlled by settings

**Status:** Completed 2026-10-06; native visibility gap carried to task 021.

**Priority:** Medium

**Dependency:** Implemented task 020; native visibility verification remains
pending and must be carried forward.

Read the [carousel plan](../../plan/20261005_044149_plan.md),
[task guide](../../task-management.md), [README](../../../../README.md) and
[project instructions](../../../../AGENTS.md). Apply relevant Astro and frontend
design guidance and Playwright for browser work; consult required Astro guides.

## Scope

Remove the carousel autoplay pause/play button, its SVGs, styles, accessible
labels and event handlers. Autoplay must stay enabled whenever `autoplay` is
true in `data/content/offers.json`, without requiring a visitor to press Play.
When the setting is false, automatic rotation must remain off throughout the
page visit. Keep `intervalMs` JSON-editable with its existing validation.

This task supersedes task 020's explicit pause/play and persistent manual-stop
requirements. Remove the user-requested rotation state and persistent stops:
manual arrow/dot selection or keyboard interaction must not permanently disable
configured autoplay. Reset the interval after manual selection and resume
automatically once temporary constraints clear.

Retain temporary hover, focus-within, hidden-document, offscreen, page lifecycle
and reduced-motion holds. Resume automatically with a fresh full interval when
all holds clear and autoplay is enabled. Never replace a focused CTA or move
focus automatically. Reduced motion suppresses rotation and slide animation;
when that preference clears, configured autoplay may resume. Use one timer,
with no duplicate scheduling or catch-up jumps. Automatic changes stay silent;
manual changes retain the concise polite position status.

Keep overlay arrows and centered standalone dots. Remove the horizontal space
reserved specifically for the deleted button while retaining necessary arrow,
dot and copy clearance. Zero/one items remain omitted/static; no-JavaScript
offers retain their stacked native links. Update `docs/site/offers-carousel.md`
to describe the new configuration and automatic resume rules.

## Acceptance

- No autoplay control button, icon, label or keyboard destination remains.
- With autoplay true, production Chrome verifies interval/wrap, manual arrow/dot
  navigation followed by automatic resumption, and keyboard interaction without
  a permanent stop. With autoplay false, no automatic changes occur.
- Hover/focus, hidden-document/offscreen and reduced-motion holds pause safely
  and resume automatically when cleared. Verify focused CTA safety, combined
  holds, fresh intervals and rapid state changes without duplicate timers.
- Carry forward task 020's native hidden-tab verification gap. Distinguish
  genuine browser visibility transitions from simulated events; record limits
  accurately and do not claim native success based on a getter override.
- Check both themes at 320/375/768/1440px, 200% root text and short landscape:
  centered dots, no obsolete button clearance, no copy/control overlap, visible
  keyboard focus, stable slide height and no horizontal overflow.
- Verify zero/one/multiple items and no-JS fallback. Restore original JSON bytes
  and publication settings after fixtures; run `pnpm check`, `pnpm build` and
  diff checks.

Store browser scripts/results/screenshots under ignored
`output/playwright/task-020a/`. Record changed files, verification and limits.
Archive after completion using the actual local date and update the plan.
No commit or deployment is implied.

## Changes and verification

Removed the rotation control and persistent requested/stop state from
`src/components/sections/OffersCarousel.astro`. Autoplay now follows its JSON
flag, with one timer and automatic fresh-interval resume after all temporary
holds clear. Manual selections reset scheduling; focus and silent automatic
updates remain safe. Restored the dots' full available width. Updated the offers
guide and plan; task 020 remains historical with its native visibility gap.

Production Chrome passed real timing/wrap plus controlled-clock hover, focus,
manual arrows/dots, keyboard, reduced-motion, viewport, simulated visibility
and page lifecycle pause/resume. Combined holds and rapid changes passed without
duplicate timers. Sixteen theme/width/text-size layouts passed centered dots,
44px targets, visible focus, stable height, copy clearance and no overflow;
844×390 landscape passed. Screenshots were captured and settled mobile fallback
and desktop image screenshots visually reviewed. A separate no-JS Chrome
snapshot confirms both stacked articles/native links and no carousel controls.

Three actual production JSON fixtures (zero, one and autoplay false) passed.
Autoplay false stayed off before and after manual navigation. Original JSON
bytes were restored: enabled true, autoplay true, interval 7000, two items.
The original production build was rebuilt. `pnpm check`: zero errors/warnings,
one preexisting ignored task-018 script hint. `pnpm build`: six pages.
Component 80-column and diff checks passed. Evidence lives under ignored
`output/playwright/task-020a/`.

Visibility-event checks explicitly simulate document.hidden. The native
hidden-tab gap from task 020 remains for task 021; no genuine hidden-tab success
is claimed. Native zoom, screen-reader speech and integrated performance remain
outside this task. No commit or deployment.
