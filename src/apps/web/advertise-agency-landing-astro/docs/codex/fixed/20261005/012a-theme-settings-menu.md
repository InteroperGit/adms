# Theme settings menu

**Status:** Completed — 2026-10-05

**Priority:** High

**Dependency:** [012 — theme behavior](012-theme-toggle.md). Complete before [013 — header and opening](../../todo/013-header-and-opening.md).

Read the [design plan](../../plan/20261002_134818_plan.md), [task-management guide](../../task-management.md), [theme behavior](../../../site/themes.md), and [project instructions](../../../../AGENTS.md). Apply frontend-design and astro-best-practices; use Playwright for browser verification and consult the relevant Astro guides.

## Goal

Replace the header's visible theme select with a compact gear button («Настройки»). Put theme choices inside its settings panel: sun for Light, moon for Dark, and monitor for System. Reduce header clutter while keeping theme choices discoverable and understandable.

## Scope and design

- Create one shared Astro settings component for desktop and mobile, with a nonmodal panel anchored below the gear. Align it toward the viewport's inner edge, keep at least 16px side clearance and constrain its height to the available viewport with internal scrolling if needed. Use shared surfaces, borders, radii and restrained shadows; use a solid surface for legibility. Preserve brand orange `#EA580C`; use accessible semantic tokens for functional icons and selection states. Keep the gear distinct from the mobile navigation button and reserve at least 44×44px per interactive target.
- Present «Тема оформления» as a three-option segmented group with sun/moon/monitor icons and short visible Russian labels: «Светлая», «Тёмная», «Системная». Icons supplement labels; selected state needs a shape/border/check indicator as well as color. Use existing icons or local SVGs so essential controls work when the external icon font fails.
- Keep System as the default. Preserve the existing validated `site-theme` preference, pre-paint initialization, storage failure handling, cross-tab synchronization and OS-change rules. Reuse one theme controller; adapt its binding to the new inputs rather than adding a competing state implementation. Old saved preferences must continue to work.
- Add a concise status inside the panel, such as «По системе: тёмная», only when System is selected; update it on OS changes. Keep System checked when its effective appearance changes. Apply choices immediately and keep the panel open so visitors can compare and change their choice. Persist the selection without an Apply button. Opening or closing settings must never change the theme or reset the page's scroll position.
- Keep the panel focused on appearance settings that exist. Do not add disabled future settings, account controls, notifications, tracking or a separate reset action; selecting System already restores the default behavior.

## Interaction and accessibility

- Use a real button with accessible name «Настройки», `aria-expanded` and `aria-controls`. Treat the contents as an appearance-settings panel, not an ARIA command menu: use native radio inputs in a fieldset with a legend for mutually exclusive themes. Keep inputs keyboard-focusable and expose their actual checked state; make the entire icon-and-label tile clickable. Decorative SVGs must be hidden from assistive technology. Closed contents must be absent from keyboard navigation and the accessibility tree.
- Open with click/tap, Enter or Space. Put focus on the selected option when opened from the keyboard; support native radio arrow-key behavior and visible focus. Clicking the gear again closes it. Escape from the settings component closes and restores focus to the gear. Clicking outside closes without cancelling the target's action or stealing focus from it.
- Treat the trigger and panel as one focus boundary: close only when focus moves outside both. Tab and Shift+Tab follow document order without a trap; returning to the gear must not immediately close/reopen the panel. Do not unconditionally focus the gear on every close, which would break Tab exit and outside clicks. Avoid focusout/pointer event races when a radio label or the gear is clicked.
- Keep the header visible while settings is open, including pointer use when focus is elsewhere. Integrate this state with both the scroll handler and CSS visibility rules. After closing, resume auto-hide only when its existing conditions allow it; focused header controls must remain visible. Avoid clipping caused by header transforms, overflow or stacking contexts.
- Opening mobile navigation closes settings without taking focus from the dialog. The gear outside the modal stays unavailable while the dialog is open; closing navigation must not reopen settings. Preserve MobileMenuDialog focus/Escape behavior. Recalculate panel placement on resize/orientation changes so an open panel remains usable across the desktop breakpoint.
- Keep the panel inside the viewport at 320px and at enlarged text/200% zoom. Allow labels to wrap; avoid tiny icon-only choices, layout shifts, unnecessary animation or hover-only explanations. Respect reduced motion.
- Without JavaScript, hide inactive settings controls and preserve the existing OS-based CSS theme fallback. Document external-map color limitations and any CSP requirements without adding user-facing technical messages.

## Implementation boundaries

The current binding lives in `src/components/ui/ThemeInit.astro` and targets a select in `ThemeToggle.astro`. Update that binding to synchronize the new radio inputs and System status from the same validated preference, including when the panel is closed. Preserve the blocking head initialization in `src/layouts/Layout.astro`; do not move it behind panel opening or hydration. Keep panel interaction separate from theme state, remove obsolete select markup/listeners and avoid React or a new UI dependency for this feature. Header integration belongs in `src/components/Header.astro`; coordinate navigation dismissal with `MobileMenuDialog.astro`.

## Acceptance and verification

- Verify all six routes in both themes. Exercise the shared controller on one representative route: reload/cross-page persistence; missing/invalid values; throwing storage reads; successful reads with failing writes; cross-tab change/removal/clear; System OS changes; and explicit Light/Dark ignoring OS changes. Check radio selection and System status after reopening the panel following an external update. Storage failure must still allow an in-memory selection. Check no-JS fallback and repeat initial-frame sampling for saved Dark with a Light OS and the reverse; record its limits rather than claiming filmstrip proof.
- In a real browser, verify gear open/close, keyboard radio selection, selected-state semantics, Escape focus restoration, outside-click actions, Tab/Shift+Tab exit and navigation/settings exclusivity. Scroll while open to verify header visibility, then close, move focus outside the header and verify auto-hide resumes. Confirm page scroll position does not change merely from opening settings or changing theme.
- Check closed/open layouts in both themes at 320px, 375px, 768px and 1440px; save representative open-panel screenshots at 320px and 1440px in both themes. Check 200% browser zoom and separately enlarged text, touch-target size, viewport bounds, short landscape height and resizing while open. Measure normal text contrast at least 4.5:1 and essential control/icon/focus-state contrast at least 3:1 against adjacent colors. Check reduced motion and block the external icon stylesheet to verify the new gear/theme controls remain recognizable. Record actual results and limitations, distinguishing automated checks from screen-reader testing. Whole-site redesign verification remains task 016.
- Run `pnpm check` and `pnpm build`. Update `docs/site/themes.md` and relevant design documentation for the new control. Record changed files, browser evidence and limitations in this task; archive under the actual completion date and update the plan only after verification. No commit or deployment is implied.

## Completion evidence

Implemented by subagent task_012a and reviewed by the primary agent. Updated `src/components/ui/ThemeToggle.astro`, `ThemeInit.astro` and `src/components/Header.astro`: local SVG gear and sun/moon/system radio tiles, checked indicator, System status, nonmodal focus/dismissal behavior, viewport-constrained panel, navigation coordination and header visibility. Reused the pre-paint preference controller. Fixed a native radio focus-transition race and stale panel-width calculation on resize. Mobile header wrapping keeps controls usable with enlarged text. Updated theme and design-system documentation.

`pnpm check` passed with zero diagnostics (46 files, including ignored local verification scripts); `pnpm build` generated six routes. Chrome passed 65 main assertions, four supplemental assertions and a targeted 200% text/header check. Coverage includes all routes in both themes, keyboard/pointer behavior, modal coordination, storage read/write failures, OS and cross-tab updates, no-JS fallback, opposite-OS initial-frame sampling, responsive panel bounds, short-height scrolling and blocked external icons. Measured selected text contrast 5.55/7.02, control borders 4.59/5.50 and focus 6.06/8.04 in light/dark. Detailed evidence is in the [theme guide](../../../site/themes.md).

Ignored screenshots/scripts are in `output/playwright/task-012a/`; primary reviewed the 320px light open panel. Actual browser zoom could not be driven; viewport/device-scale and separate root-text enlargement checks are recorded as limited evidence. Screen-reader speech, physical touch, Safari/Firefox, deployment CSP and external-map styling were not tested. Initial-frame samples are not a filmstrip guarantee; whole-site verification remains task 016.

Reused the existing background Astro server and left it running; closed the owned browser session. No commit or deployment made.
