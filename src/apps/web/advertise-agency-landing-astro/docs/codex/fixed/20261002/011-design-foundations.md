# Design foundations

**Status:** Completed

**Priority:** Medium (theme toggle: High)

Read the [design plan](../../plan/20261002_134818_plan.md), [task-management guide](../../task-management.md), and [project instructions](../../../../AGENTS.md). Follow the dependencies and constraints in the plan. Apply frontend-design and astro-best-practices; consult required Astro guides.

## Scope and acceptance

Capture screenshots of all six routes before changes. Compare service-led and work-led opening concepts against available media and record the selected direction in docs/site/design-system.md. Implement shared spacing, container, typography, radii, shadow and semantic light/dark tokens with Tailwind 4/DaisyUI. Assess a licensed Cyrillic-capable locally hosted font; preserve a system fallback. Measure text and control contrast, including orange action colors. Replace hardcoded gray colors where necessary for semantic theming. Keep JSON sources and existing route architecture. Acceptance: documented token system, consistent shared primitives, baseline screenshots, measured contrast, pnpm check and pnpm build pass.

Record changed files, checks, browser evidence and limitations. Archive only after completing verification; update the plan link and status. No deployment is authorized by this task.

## Implementation and verification

- Implemented by subagent task_011 and reviewed by the primary agent.
- Added semantic light/dark tokens, shared containers, responsive section spacing, typography, radii, restrained shadows, focus styling and reduced-motion rules. Replaced fixed gray/translucent text where required.
- Documented service-led direction and token system in `docs/site/design-system.md`, linked from README. Assessed licensed Cyrillic Manrope; retained system fonts rather than downloading an unneeded font asset.
- Preserved content, routes, hidden homepage h1, map configuration and interaction scripts. Theme toggle remains task 012.
- Captured 12 baseline screenshots and 24 final light/dark screenshots at 375px/1440px across six routes in `output/playwright/task-011/`; generated browser evidence is ignored by Git. Primary agent visually inspected the final mobile dark homepage.
- Measured orange contrast across surfaces: light 6.06/5.55/4.65, dark 8.04/7.02/4.87; primary button text 6.06/7.96. Other token contrast measurements are documented in the design-system guide.
- Final check passed with zero diagnostics; production build generated six pages; whitespace checks passed.
- Remote placeholder images sometimes failed to load. Full breakpoint, zoom and interaction audit remains task 016; foundation screenshots do not establish complete accessibility compliance.
