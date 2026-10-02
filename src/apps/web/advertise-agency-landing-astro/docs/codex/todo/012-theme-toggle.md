# Theme toggle

**Status:** Pending

**Priority:** Medium (theme toggle: High)

Read the [design plan](../plan/20261002_134818_plan.md), [task-management guide](../task-management.md), and [project instructions](../../../AGENTS.md). Follow the dependencies and constraints in the plan. Apply frontend-design and astro-best-practices; consult required Astro guides.

## Scope and acceptance

Add an accessible compact Astro theme control to desktop and mobile header with Russian Light/Dark/System choices. Default to System, persist validated choices, catch storage errors, and react to OS changes only in System mode. Apply effective data-theme and color-scheme before first paint without hydration or theme flashes; account for deployment CSP if present. Preserve keyboard access and selected-state announcements, synchronize any duplicate controls, and keep layout usable without JavaScript. Remove permanently hardcoded light theme behavior. Document external-map color limitations. Acceptance: all routes work in both themes; reload, cross-page persistence, invalid stored value, storage failure, OS changes, keyboard selection, focus and initial paint verified; check/build pass.

Record changed files, checks, browser evidence and limitations. Archive only after completing verification; update the plan link and status. No deployment is authorized by this task.
