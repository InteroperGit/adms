# Task 5 — Simplify cookie-banner interactivity

**Status:** Pending

Read the [shared implementation instructions and coordination plan](../plan/20261001_222426_plan.md) before starting.

**Priority:** Medium

**Files:** `src/components/CookieBanner.tsx`, `src/layouts/Layout.astro`, `astro.config.mjs`, `package.json`, `pnpm-lock.yaml`, `tsconfig.json`

If the cookie banner is still the only React component, replace it with an Astro component and a small browser script. Preserve preference persistence and existing appearance. Handle unavailable browser storage gracefully. Remove the React integration, dependencies, and React-specific TypeScript configuration only after confirming nothing else needs them.

The current banner saves a preference and hides itself; it does not gate the external map or other resources. Document this behavior. Any change to consent wording or resource gating requires a concrete product requirement rather than an invented policy.

**Acceptance criteria:**

- Banner appears without a saved preference and hides after either choice.
- Choice persists across reloads when storage is available.
- Storage failures do not break the banner interaction.
- React is removed only if unused throughout the application.
- Build passes and browser behavior is verified.

