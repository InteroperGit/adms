# Header and opening section

**Status:** Completed — 2026-10-05

**Priority:** High

**Dependency:** Tasks 011–012b completed. Implement before 015; coordinate shared header/layout changes with 014.

Read the [design plan](../../plan/20261002_134818_plan.md), [task-management guide](../../task-management.md), and [project instructions](../../../../AGENTS.md). Follow the dependencies and constraints in the plan. Apply frontend-design and astro-best-practices; consult required Astro guides.

## Scope and acceptance

Refine `Header.astro`, `NavLinks.astro` and `sections/About.astro` into a clear service introduction and contact path using the shared design tokens and existing verified copy. Capture current screenshots before changing layout.

- Preserve the orange-and-blue butterfly asset and reusable `ui/Logo.astro`, with the mark left of the agency name. Keep the brand home link's accessible name; the accompanying mark remains decorative. Check logo/text alignment and mobile wrapping without crowding settings or navigation.
- Preserve the completed `Settings.astro`/`ThemeToggle.astro` design: left «Тема» label, joined sun/moon/system icons, Russian tooltips, selected-state border, 32px visible button surfaces with comfortable hit areas, 8px panel corners, black/white Light hover and contrasting orange Dark hover. Keep the gear surface matched to the phone button. Refine surrounding header spacing, not the approved settings design.
- Preserve auto-hide: reveal on upward scrolling, near page top and keyboard focus; remain visible while settings or navigation is open. Keep mobile dialog focus containment, Escape, return focus, root-relative section links and destination focus. Ensure anchored content is not hidden by the header, including when enlarged text makes it taller.
- Build the opening around existing service copy with one primary contact action and one secondary project action. Reuse JSON/menu/contact sources; do not duplicate editable service copy in markup. Keep homepage h1 visually hidden and retain a logical visible section-heading hierarchy.
- Replace the oversized generic sparkle block with restrained service presentation or approved work media. Do not promote Picsum placeholders as agency work or invent new services/results. Preserve current statistics verbatim, with readable labels that wrap; do not enlarge them at the expense of the contact path.
- Remove unnecessary decoration/spacing while retaining semantic colors and reduced-motion behavior. Keep phone, settings and navigation controls reachable at 320px and enlarged text; allow deliberate wrapping rather than shrinking labels beyond readability.

## Verification

Use real-browser checks at 320/375/768/1440px in both themes, plus separate 200% text enlargement and actual browser zoom where available. Verify header and opening bounds, target spacing, logo loading, opening actions, keyboard-only navigation/settings flows, direct section hashes on homepage and links from project/legal pages, scroll-direction auto-hide and reduced motion. Check longer labels using temporary browser fixtures, restoring real content. Review representative before/after screenshots and measure text/control contrast where changed. Record native-zoom and external-resource limits; task 016 owns the final whole-site matrix. Run `pnpm check` and `pnpm build`.

Record changed files, checks, browser evidence and limitations. Archive only after completing verification; update the plan link and status. No deployment is authorized by this task.

## Completion evidence

Implemented by subagent task_013 and reviewed by the primary agent. Changed Header, ui/NavLinks, sections/About, global CSS and design-system documentation. Header uses deliberate wrapping and a 64rem navigation breakpoint; measured header height supplies section clearance. Initial hash correction runs early and cancels on user input. Preserved the butterfly, settings, auto-hide and native dialog behavior. Opening reuses existing JSON service copy/menu destinations, adds contact/projects actions and replaces the sparkle with restrained unchanged statistics.

`pnpm check` passed for 55 files including ignored verification helpers, with zero diagnostics; `pnpm build` generated six routes. Chrome covered 16 viewport/theme/root-text combinations (320/375/768/1440px, Light/Dark, 16/32px root text), plus keyboard focus/Tab/Escape, cross-route section links, direct hashes, opening actions, auto-hide, resize dismissal, long-label fixtures and reduced motion. Changed text/action contrast passed: lead 16.09/14.44, detail 6.36/9.58, large statistics 3.56/4.57, primary action 6.06/7.96 in Light/Dark. See the [design-system guide](../../../site/design-system.md) for full results.

Ignored before/after screenshots and scripts are in `output/playwright/task-013/`. Primary reviewed `after-dark-375.png`. Before screenshots include the cookie banner; after screenshots dismiss it to inspect the opening. Actual native browser zoom could not be driven and remains unverified; root-text enlargement is separate evidence. Whole-site reviews/cookie/footer overflow, screen-reader and full hover review remain tasks 014–016. External placeholders remain unchanged.

Closed owned Chrome; reused existing background preview PID 29556 and left it running. No commit or deployment made.
