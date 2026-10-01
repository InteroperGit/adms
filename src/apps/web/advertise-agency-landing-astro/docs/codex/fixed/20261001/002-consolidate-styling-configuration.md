# Task 2 — Consolidate Tailwind and DaisyUI configuration

**Status:** Completed (browser visual verification outstanding)

Read the [shared implementation instructions and coordination plan](../../plan/20261001_222426_plan.md) before starting.

**Priority:** High

**Files:** `tailwind.config.cjs`, `src/styles/global.css`, `src/styles/scrollbar.css`, `astro.config.mjs`

The project uses Tailwind 4 through its Vite plugin and loads DaisyUI through CSS. The legacy JavaScript configuration is not explicitly loaded. Inspect its settings, migrate any intended settings to the active CSS configuration, and remove the obsolete file. Update scrollbar colors to use the theme variables already defined in `global.css` rather than legacy fallback variables.

**Acceptance criteria:**

- There is one clear, active source of styling configuration.
- Intended theme settings are preserved.
- Scrollbar styling follows the active theme.
- Build and a visual check of homepage, project, and legal pages pass.

## Implementation and verification

- Implemented by subagent task_002 and reviewed by the primary agent.
- DaisyUI light/default and dark/prefersdark themes are explicitly configured in `src/styles/global.css`; existing brand overrides are preserved.
- Removed obsolete `tailwind.config.cjs`; the existing Tailwind Vite integration remains active.
- Scrollbars use the active primary/base theme variables and the accent color on hover.
- Production build passed and generated six pages.
- Generated CSS was checked for both themes, brand overrides, and absence of legacy scrollbar variables. All six pages reference existing stylesheets.
- Primary-agent review found no whitespace errors with `git diff --check`.
- Browser tools were unavailable. A manual visual check of homepage, project, and legal pages remains outstanding.
