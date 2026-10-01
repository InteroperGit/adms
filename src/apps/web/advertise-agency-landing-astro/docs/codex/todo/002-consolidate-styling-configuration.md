# Task 2 — Consolidate Tailwind and DaisyUI configuration

**Status:** Pending

Read the [shared implementation instructions and coordination plan](../plan/20261001_222426_plan.md) before starting.

**Priority:** High

**Files:** `tailwind.config.cjs`, `src/styles/global.css`, `src/styles/scrollbar.css`, `astro.config.mjs`

The project uses Tailwind 4 through its Vite plugin and loads DaisyUI through CSS. The legacy JavaScript configuration is not explicitly loaded. Inspect its settings, migrate any intended settings to the active CSS configuration, and remove the obsolete file. Update scrollbar colors to use the theme variables already defined in `global.css` rather than legacy fallback variables.

**Acceptance criteria:**

- There is one clear, active source of styling configuration.
- Intended theme settings are preserved.
- Scrollbar styling follows the active theme.
- Build and a visual check of homepage, project, and legal pages pass.

