# 076. Universal content block renderers

Status: fixed. Created: 2026-10-12.
Plan: [Universal content blocks](../../plan/20261012_universal-content-blocks-plan.md).

## Completed

- [x] Added Astro renderers for paragraph, table, chart, image, image stack,
  order form, quote, and footnote blocks.
- [x] Added `ContentBlocks.astro` dispatching by block type while preserving
  source order.
- [x] Added Apache ECharts with tree-shaken chart modules and resize handling.
- [x] Added an accessible chart data table that works without JavaScript.
- [x] Added an image gallery with a dimmed overlay, side controls, position
  dots, and keyboard navigation.
- [x] Kept article blocks in a single reading flow without persistent side
  panels and preserved order across viewport widths.
- [x] Added image alt/captions, semantic headings, and reduced-motion handling.
- [x] Verified the changed code follows the 80-character line limit.

## Follow-up tasks

- Full gallery focus management and no-JavaScript behavior are handled by
  [076a](076a-image-stack-lightbox-gallery.md). Browser acceptance remains in
  [082](082-content-blocks-playwright-acceptance.md).
- MDX component mapping, collection integration, and JSON/MDX parity are handled
  by [078](078-project-content-migration.md) and
  [080](080-universal-article-pages.md).
- Removal of duplicate project/service gallery and process sections is handled
  by [078](078-project-content-migration.md).
