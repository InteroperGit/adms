# Design and behavior verification

**Status:** Pending

**Priority:** Medium (theme toggle: High)

Read the [design plan](../plan/20261002_134818_plan.md), [task-management guide](../task-management.md), and [project instructions](../../../AGENTS.md). Follow the dependencies and constraints in the plan. Apply frontend-design and astro-best-practices; consult required Astro guides.

## Scope and acceptance

Review the completed redesign using real browser automation and screenshots. Cover homepage, three project pages and two legal pages in light/dark and System behavior at 320/375/768/1440px. Verify enlarged text/zoom, long strings, keyboard-only dialog/theme/contact flows, initial theme paint, storage failures, map enabled/disabled requests and reduced motion. Measure contrast and review layout shift, asset loading and shipped JavaScript; run Lighthouse if available and record environment/results without unsupported score promises. Fix scoped regressions and document residual external-resource limits. Refresh design-system/theme guides and README references. Acceptance: check/build pass, reproducible browser evidence, no unresolved critical design/interaction regressions; missing approved media/domain/favicon listed separately.

Record changed files, checks, browser evidence and limitations. Archive only after completing verification; update the plan link and status. No deployment is authorized by this task.
