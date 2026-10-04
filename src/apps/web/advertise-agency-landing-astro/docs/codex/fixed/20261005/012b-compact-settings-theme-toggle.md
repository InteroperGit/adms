# Compact settings and theme toggle

**Status:** Completed — 2026-10-05

**Priority:** High

**Dependency:** [012a — settings panel](012a-theme-settings-menu.md). Complete before [013 — header and opening](../../todo/013-header-and-opening.md).

Read the [design plan](../../plan/20261002_134818_plan.md), [task-management guide](../../task-management.md), [theme documentation](../../../site/themes.md), and [project instructions](../../../../AGENTS.md). Apply frontend-design and astro-best-practices; consult related Astro guides and use Playwright for browser verification.

## Requested result

Match the header settings gear button's visible height to the header phone button. Extract the settings panel into `Settings.astro` and render `ThemeToggle.astro` inside it. Make the theme toggle a compact horizontal row of sun, moon and monitor icons with the selected icon visibly active. Remove the visible panel title, current-theme caption and theme-mode text labels.

These requirements supersede task 012a's visible labels and System-status caption. Keep Russian accessible names available to assistive technology.

## Component responsibilities

- Create `src/components/ui/Settings.astro` to own the gear trigger, panel surface, placement, open/close behavior, focus boundary, outside click and Escape handling. Render `<ThemeToggle />` inside its panel. Update `Header.astro` to render `<Settings />`.
- Keep `src/components/ui/ThemeToggle.astro` responsible for theme choices and their compact styling. Remove the settings wrapper and its interaction code from this component. Use a fieldset with a visually hidden legend and native radio inputs with Russian accessible labels («Светлая», «Тёмная», «Системная»).
- Retain `ThemeInit.astro` as the single preference controller and blocking pre-paint initializer. Remove the obsolete visible-status markup and its update logic. Preserve radio synchronization, validated `site-theme` values, OS-change rules, cross-tab updates and storage exception handling. No React or additional UI dependency.

## Visual and interaction requirements

- Use the existing desktop phone button (`NavLinks.astro`, shared `Button` with `size="sm"`) as the sizing reference. Match the gear's rendered visible height, vertical alignment and compatible radius using shared sizing rules rather than an unrelated pixel value. Keep it square. Do not enlarge the phone button merely to match the current oversized gear.
- Preserve a comfortable, non-overlapping hit area even if the visible button is smaller: at least 44×44px for the gear's clickable region, with the visible border/surface centered inside it. Keep mobile controls usable and retain header wrapping for enlarged text. Theme options also need at least 44×44px hit targets.
- Show only local SVG sun, moon and monitor icons in the compact theme row. Remove visible «Тема оформления», «По системе: …» and all mode-name captions, including space previously reserved for these texts. Remove the large tile/checkmark row layout; use a compact selected background and border around the active icon. Selection must be distinguishable beyond color alone and separate from keyboard focus.
- Exactly one radio is checked. Highlight the saved preference: when System is selected, keep the monitor selected even if the effective theme is Light or Dark. Apply changes immediately and leave the panel open.
- Size the panel to its compact contents with balanced padding, solid theme-aware surface and restrained shadow. Keep it anchored near the gear, with at least 16px viewport clearance; revise the previous 336px placement assumption to use the compact panel's actual dimensions. Avoid unused title/status space and horizontal overflow.
- Preserve the existing keyboard behavior, Tab/Shift+Tab boundary, Escape focus restoration, outside-click actions, native-radio focus-race fix, mobile-navigation exclusivity and settings-aware header auto-hide. Closed panel contents must remain unfocusable. Preserve no-JS OS-theme fallback and hidden inactive settings controls.
- Keep Russian accessible names for settings and each radio; hide decorative SVGs from assistive technology. Native checked state must expose the active selection. Do not depend on hover text or SVG appearance for accessible names. Keep visible keyboard focus, reduced-motion behavior and sufficient functional-icon/selected-state contrast in both themes.

## Acceptance and verification

- In a real browser, compare the gear's visible surface height with the phone button at desktop widths (allow at most 1px rounding difference). Check clickable target bounds separately, including no overlap with the adjacent phone/menu controls.
- Verify only icons are visibly rendered in the theme row, with no heading or status caption. Confirm all three Russian accessible names, one checked radio, active/focus distinction and System selection after OS changes.
- Check all six routes in Light and Dark; on one representative route verify keyboard selection, focus/dismissal, mobile navigation coordination, header auto-hide, persistence across reload/navigation, cross-tab synchronization, invalid storage and read/write failures. Confirm the initializer still applies the saved theme before page content paints.
- Check open/closed settings at 320px, 375px, 768px and 1440px, enlarged text and a short viewport. Verify placement while resizing. Capture representative mobile/desktop screenshots in both themes; check functional icons/borders/focus contrast at least 3:1. Record actual browser-zoom coverage separately from viewport/text simulations.
- Run `pnpm check` and `pnpm build`. Update `docs/site/themes.md` and relevant design documentation to describe the component split and icon-only presentation. Record changed files, results and limitations; archive under the actual completion date and update the plan after verification. No commit or deployment is implied.

## Completion evidence

Implemented by subagent task_012b and reviewed by the primary agent. Added `src/components/ui/Settings.astro`, updated Header to use it, reduced ThemeToggle to native icon radios and removed status binding from ThemeInit. Settings owns panel placement and interaction; the existing blocking preference controller remains shared. Updated theme/design-system documentation.

`pnpm check` passed with zero diagnostics (50 files including ignored local browser helpers); `pnpm build` generated six routes. Chrome passed 65 regression, 18 compact-layout/accessibility and four supplemental assertions. Gear and phone visible surfaces both measured 32px at 768/1440px, with a separate non-overlapping gear target at least 44px. Radio names/hidden legend, icon-only presentation, active/focus distinction, all routes/both themes, persistence and storage failures, OS/cross-tab updates, keyboard/dismissal/modal coordination and header behavior passed. At 320px with 200% root text, the 242px panel contained three 64px targets without overflow. Essential icon/border/focus contrast passed 3:1. See the [theme guide](../../../site/themes.md) for exact results.

Ignored scripts and screenshots are in `output/playwright/task-012b/`; primary reviewed `320-dark.png`. Native browser zoom, screen-reader speech, physical touch, Safari/Firefox, deployment CSP and iframe styling were not verified. Viewport/device-scale and text-enlargement checks are limited evidence; initial-frame sampling is not a filmstrip guarantee. Whole-site review remains task 016.

The stale development server was restarted using the documented background commands and left running at localhost:4321 (PID 22348). No commit or deployment made.
