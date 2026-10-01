# Task 5 — Simplify cookie-banner interactivity

**Status:** Completed (browser interaction and visual verification outstanding)

Read the [shared implementation instructions and coordination plan](../../plan/20261001_222426_plan.md) before starting.

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

## Implementation and verification

- Implemented by subagent task_005 and reviewed by the primary agent.
- Replaced the only React component with `CookieBanner.astro`, preserving wording, classes, legal links, choices, and `cookieConsent` storage values.
- The browser script catches blocked storage access and failed reads/writes; either choice still dismisses the banner for the current page.
- Removed React hydration, integration, dependencies, and React-specific TypeScript settings; updated the lockfile.
- README documents preference-only behavior, persistence, and storage failures. The banner does not gate the map or other resources.
- `pnpm check` passed for 35 files with zero errors, warnings, or hints.
- Final `pnpm build` passed and generated six pages.
- Exact production script passed Node VM checks for both choices, saved preferences on reload, blocked storage access, failed reads/writes, and a missing banner.
- All six generated pages contain the banner without React islands; wording and spaces around links were checked.
- `git diff --check` passed; the new Astro file was separately checked for trailing whitespace.
- Browser automation tools were unavailable. Actual browser interaction and visual verification remain outstanding; VM verification does not replace these checks.
- Dependency removal pruned the React-only Vite/rolldown stack. pnpm also rebound an existing optional checker peer; remaining Astro/Tailwind Vite versions were preserved.
