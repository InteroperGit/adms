# Contacts footer and legal design

**Status:** Completed — 2026-10-05

**Priority:** High

**Dependency:** Tasks 011–012b completed and 013 complete. Coordinate with 014 for shared content/layout tokens.

Read the [design plan](../../plan/20261002_134818_plan.md), [task-management guide](../../task-management.md), and [project instructions](../../../../AGENTS.md). Follow the dependencies and constraints in the plan. Apply frontend-design and astro-best-practices; consult required Astro guides.

## Scope and acceptance

Apply shared tokens to Contacts, Footer, LegalLayout and CookieBanner. Preserve task010 centered icons, comfortable contact actions, build-time map flag and local map placeholder; disabled state must make no Yandex request. Improve legal reading width, heading/list spacing and document-specific metadata. Make cookie actions fit narrow screens and enlarged text without obscuring essential content; preserve saved preference and storage-failure behavior. Keep approved copy unchanged. Acceptance: both map states, both themes, 320px/200% text, keyboard focus, cookie choices and legal readability verified; check/build pass.

## Implementation details

- Refine `sections/Contacts.astro` and `ui/ContactInfo.astro` using existing JSON content. Preserve centered address icons, readable wrapping and phone/email targets. Use a clear contact hierarchy with existing hours/address; do not fabricate office imagery, map coordinates, directions URLs or form/backend functionality.
- Preserve the build-time `mapEnabled` flag and `/images/map-placeholder.png`. The disabled variant must render no map iframe and make no Yandex requests; a visually hidden iframe is insufficient. Keep the placeholder decorative as currently configured. Document the external iframe's independent colors and loading limitations.
- In Footer, preserve the orange-and-blue butterfly through `ui/Logo.astro`, left of the agency name, and verify long legal/contact links wrap. Improve columns, section labels and separators without duplicating contact JSON. Keep copyright and legal destinations.
- Give `LegalLayout.astro` explicit, theme-aware heading/paragraph/list/link styling and comfortable reading width. Verify that any `prose` utility is actually provided before relying on it. Preserve JSON document text, effective dates, descriptions and page-specific h1; homepage hidden-h1 behavior does not apply to legal pages.
- Give CookieBanner clear primary/secondary actions with readable contrast and comfortable targets. Fix 320px/enlarged-text wrapping and fixed-banner overlap: ensure the final footer links/actions can be scrolled into view while the banner is shown, and constrain tall banner content to the viewport with internal scrolling if necessary. Do not turn it into a modal or trap focus.
- Preserve `cookieConsent` accepted/declined choices, reload persistence and dismissal when storage writes fail. Keep theme preferences independent. Follow the [cookie guide](../../../site/cookie-preferences.md); do not change copy/consent claims or imply that the banner controls map/tracking requests. Record any content-policy discrepancy for agency review, separately from layout changes.

## Verification

Check homepage contacts/footer and both legal routes in Light/Dark at 320px and desktop, plus 200% text and short viewport. Verify keyboard focus and destinations, legal list hierarchy, logo alignment, map enabled/disabled DOM/network behavior, banner visible/dismissed layouts, each saved cookie choice and storage read/write failure. Validate theme-settings/banner/navigation stacking and that obscured links can be reached. For build-time map variants, restore the original JSON flag after verification and record which built variant was tested; do not persist a test-only setting. Review screenshots and changed contrast; run check/build. Actual browser zoom limitations remain explicit.

Record changed files, checks, browser evidence and limitations. Archive only after completing verification; update the plan link and status. No deployment is authorized by this task.

## Completion evidence

Implemented by subagent task_015 and reviewed by primary. Updated Contacts, ContactInfo, Footer, LegalLayout and CookieBanner plus content/cookie/design guides. Contacts/footer use quieter surfaces and comfortable wrapping actions; butterfly branding and approved JSON copy remain. Legal pages now have explicit heading/list/paragraph typography instead of unconfigured prose. Cookie banner is bounded to half the viewport, scrolls internally, reserves measured body clearance and clears it on dismissal; its stacking remains below settings/header.

Final check passed for 67 files including ignored browser helpers with zero diagnostics; build generated six routes. Chrome passed 120 scoped assertions across 24 homepage/legal/theme/width/text-size combinations, and 17 production behavior assertions for cookie choices/reload, read/write storage failures, footer keyboard access, settings stacking and disabled-map requests. Both map variants were built and checked: disabled has no iframe/Yandex request; enabled produces its titled iframe/request (aborted for the test). Original `mapEnabled: false` was restored and final build completed with no JSON content diff. Default contrast passed; full ratios are in the [design guide](../../../site/design-system.md).

Ignored evidence is in `output/playwright/task-015/`, including 12 before/after screenshots and verification scripts. Primary reviewed the mobile Light privacy-policy screenshot. Dev-toolbar interference was avoided using production output for interactions. Native browser zoom, screen-reader speech, full hover contrast and external map visuals remain unverified for task 016. Approved consent wording discrepancy is recorded in the cookie guide without changing copy or map behavior.

Owned Chrome/static server closed; existing preview PID 17292 left untouched. No commit or deployment made.
