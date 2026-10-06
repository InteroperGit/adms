# Butterfly favicon

**Status:** Completed

**Priority:** Normal

**Created:** 2026-10-06

**Completed:** 2026-10-06

## Goal

Use the existing butterfly brand icon for both favicon formats so browser
tabs and bookmarks match the website's header and footer branding.

Read [project instructions](../../../../AGENTS.md),
[task management](../../task-management.md), and applicable development rules:

- [Code style](../../../development/rules/code-style.md).
- [Astro guides](../../../development/rules/astro-guides.md).
- [Development server](../../../development/rules/dev-server.md) before running
  server commands.

Apply astro-best-practices for shared layout changes and the Playwright
skill for browser verification.

## Scope

- Use `public/images/butterfly-logo.svg` as the source design.
- Replace the default Astro artwork in `public/favicon.svg` with the
  butterfly, preserving its recognizable shape and brand colors.
- Generate `public/favicon.ico` from the same butterfly design with
  16×16, 32×32, and 48×48 sizes.
- Keep both icons centered, with transparent backgrounds and enough
  padding to avoid clipping.
- Update `src/layouts/Layout.astro` to declare the SVG favicon and an ICO
  fallback. Verify coverage for legal pages and any other page layouts.

## Acceptance and verification

- Both `/favicon.svg` and `/favicon.ico` load successfully with appropriate
  content types.
- Both assets display the butterfly rather than the default Astro mark.
- Verify the ICO contains the requested sizes.
- The icon remains recognizable at small sizes on light and dark browser
  tab backgrounds.
- Verify favicon declarations and loading on the homepage, a project page,
  and a legal page using a fresh browser session to avoid cached results.
- Run `pnpm check`, `pnpm build`, and diff checks. Record verification
  results and any remaining limitations in this task.

Archive this task only after its acceptance checks pass, following the
task-management guide. Creating this task does not complete implementation.

## Implementation and results

- Replaced the Astro SVG with the existing butterfly design; raster
  comparison confirmed it renders identically to the source brand SVG.
- Generated a transparent 32-bit bitmap ICO from that SVG with 16x16,
  32x32, and 48x48 entries. Verified directory entries, alpha transparency,
  visible pixels, and transparent corners for all three sizes.
- Added the ICO fallback before the SVG declaration in the shared layout.
  SVG uses `sizes="any"`; ICO lists all three available sizes. Homepage,
  project pages, and both legal pages inherit these declarations.
- Fresh Playwright Chromium session `task23`: homepage, `/projects/1/`,
  `/privacy-policy/`, and `/terms-of-use/` each returned HTTP 200 and
  contained both favicon links. Both images decoded successfully.
- `/favicon.svg`: HTTP 200, `image/svg+xml`.
- `/favicon.ico`: HTTP 200, `image/x-icon`.
- Visually inspected SVG and ICO at 16, 32, and 48 CSS pixels on white and
  dark backgrounds. Butterfly shape and orange/blue wings remain
  recognizable; no clipping. Local screenshot:
  `output/playwright/task23/light-dark-favicons.png`.
- `pnpm check`: passed, 0 errors and 0 warnings. One pre-existing hint in
  ignored `output/playwright/task-018/matrix.js` remains.
- `pnpm build`: passed; all six static routes generated.
- `git diff --check`: passed. New SVG/layout declaration lines comply
  with the 80-character code limit.

## Verification limits

Browser checks used Chromium and an in-page light/dark preview because
Playwright screenshots do not capture native browser tab chrome.
Native tab appearance in other browser engines was not directly tested.
No dependency changes or additional client JavaScript were needed.
