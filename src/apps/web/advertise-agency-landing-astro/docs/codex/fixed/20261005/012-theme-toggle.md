# Theme toggle

**Status:** Completed — 2026-10-05

**Priority:** Medium (theme toggle: High)

Read the [design plan](../../plan/20261002_134818_plan.md), [task-management guide](../../task-management.md), and [project instructions](../../../../AGENTS.md). Follow the dependencies and constraints in the plan. Apply frontend-design and astro-best-practices; consult required Astro guides.

## Scope and acceptance

Add an accessible compact Astro theme control to desktop and mobile header with Russian Light/Dark/System choices. Default to System, persist validated choices, catch storage errors, and react to OS changes only in System mode. Apply effective data-theme and color-scheme before first paint without hydration or theme flashes; account for deployment CSP if present. Preserve keyboard access and selected-state announcements, synchronize any duplicate controls, and keep layout usable without JavaScript. Remove permanently hardcoded light theme behavior. Document external-map color limitations. Acceptance: all routes work in both themes; reload, cross-page persistence, invalid stored value, storage failure, OS changes, keyboard selection, focus and initial paint verified; check/build pass.

Record changed files, checks, browser evidence and limitations. Archive only after completing verification; update the plan link and status. No deployment is authorized by this task.

## Implementation and verification

Implemented by subagent task_012 and reviewed by the primary agent. Added native Russian Light/Dark/System selection in `src/components/ui/ThemeToggle.astro` and a blocking head initializer in `ThemeInit.astro`. Updated Header, Layout and global CSS; preserved orange branding, auto-hide behavior and the hidden homepage heading. Validated localStorage values, caught storage errors, synchronized tabs and followed OS changes only for System. Without JavaScript, CSS follows the OS and hides the inactive control.

Added [theme documentation](../../../site/themes.md), linked from README and the design-system guide. No CSP is configured; hosting must authorize the initializer if it adds one. External map and image colors remain independent.

`pnpm check` passed for 42 files with zero diagnostics; `pnpm build` generated six routes. Chrome verification passed 27 assertions covering six routes in both themes, reload/cross-page persistence, keyboard/focus, 320px header bounds, OS changes, invalid/blocked storage, cross-tab updates and no-JS fallback. Saved-dark first-animation-frame samples were dark; this is not a filmstrip proof. Screenshots and the verification script are in ignored `output/playwright/task-012/`; primary reviewed the mobile light screenshot.

Limits: no screen-reader, Safari/Firefox, deployment-CSP, write-only quota failure or external-map appearance verification. Full zoom and whole-site visual review remain in task 016. Existing dev server was reused and left running; the owned browser session was closed. No commit or deployment made.
