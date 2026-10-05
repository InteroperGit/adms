# Design and behavior verification

**Status:** Completed — 2026-10-05

**Priority:** High

**Dependency:** Tasks 013–015 complete, with completed 011–012b behavior preserved. Final review of the integrated site; do not start a new visual redesign.

Read the [design plan](../../plan/20261002_134818_plan.md), [task-management guide](../../task-management.md), and [project instructions](../../../../AGENTS.md). Follow the dependencies and constraints in the plan. Apply frontend-design and astro-best-practices; consult required Astro guides.

## Scope and acceptance

Review the completed redesign using real browser automation and screenshots. Cover homepage, three project pages and two legal pages in light/dark and System behavior at 320/375/768/1440px. Verify enlarged text/zoom, long strings, keyboard-only dialog/theme/contact flows, initial theme paint, storage failures, map enabled/disabled requests and reduced motion. Measure contrast and review layout shift, asset loading and shipped JavaScript; run Lighthouse if available and record environment/results without unsupported score promises. Fix scoped regressions and document residual external-resource limits. Refresh design-system/theme guides and README references. Acceptance: check/build pass, reproducible browser evidence, no unresolved critical design/interaction regressions; missing approved media/domain/favicon listed separately.

## Browser review matrix

- Inspect all six routes (`/`, `/projects/1`, `/projects/2`, `/projects/3`, `/privacy-policy`, `/terms-of-use`) in Light/Dark at 320/375/768/1440px. Record route/theme/viewport results in a compact matrix. Measure document overflow and relevant element bounds; visually inspect representative screenshots, not only automated assertions.
- Separately test 200% root-text enlargement and actual 200% browser zoom, plus short landscape height and resizing while settings is open. A narrower CSS viewport or higher device scale is not proof of native browser zoom. If tooling cannot drive it, mark it unverified and provide a concise manual check; do not report a full zoom pass.
- Exercise shared behaviors on representative routes: native radio keyboard/selected names, «Тема» joined control/tooltips, black Light hover and orange Dark hover, focus distinction, outside click, Escape/Tab boundaries, settings/navigation exclusivity, modal return/destination focus, auto-hide, direct hash navigation and preserved scroll. Verify header/footer butterfly loads in both themes without crowding links/controls.
- Check theme System follows OS changes while explicit modes do not; missing/invalid preference, successful reads with failing writes, inaccessible storage, cross-tab updates/removal/clear and reload/cross-page persistence. Verify saved Light against Dark OS and saved Dark against Light OS at initial frames; identify sampling limitations and configured CSP if any. Verify no-JS content/OS fallback.
- Check cookie accepted/declined/missing preferences and storage failures, banner overlap at enlarged text, contact/phone/email destinations, legal links and document metadata. Build-test both map configurations and confirm zero Yandex requests when disabled, restoring configuration afterward.
- Check keyboard focus/contrast, semantic landmarks/headings, decorative logo/icons, long titles/names/URLs and image load failure/delay. Preserve hidden homepage h1 and visible project/legal h1. Block the external icon stylesheet to identify missing essential controls; fix accessibility-critical failures without replacing the entire icon system. Record reduced-motion and physical-touch/screen-reader/browser coverage honestly.

## Performance and evidence

Use production output for performance measurements and at least one shared-interaction smoke check; development-server timings are not production results. Record shipped JS/CSS sizes, image sizing/loading behavior and observed layout shifts. If Lighthouse runs, record version, route, viewport, throttling and external-media conditions; use findings to prioritize concrete fixes, not promise scores. Do not introduce React, analytics, third-party widgets or unapproved media to improve presentation.

Reuse prior task evidence as background, but rerun integrated behavior that changed. Keep screenshots/scripts under ignored `output/playwright/task-016/`; put a durable results matrix, findings/fixes and limitations in `docs/site/design-verification.md` with a README link. Update design-system/themes/media documentation only where final behavior changed. Distinguish unresolved code regressions from unavailable native zoom/browser/screen-reader checks and pending agency inputs.

## Completion gate

Fix failures that prevent reading content, reaching controls/links, selecting themes or closing overlays; recheck the affected routes and shared flows. Run `pnpm check`, `pnpm build` and `git diff --check`, verify restored configuration, and record exact results. Do not archive while known critical site regressions remain. Missing approved project/review media, production domain and agency favicon are separately documented inputs; the implemented butterfly mark is already available and must not be listed as missing. Follow the task-management guide for dated archiving and update the plan. No commit/deployment is implied.

Record changed files, checks, browser evidence and limitations. Archive only after completing verification; update the plan link and status. No deployment is authorized by this task.

## Completion evidence

Implemented by subagent task_016 and reviewed by primary. Added [integrated verification report](../../../site/design-verification.md), linked README and updated design-system/themes guides. Only runtime change is Header's local SVG hamburger, fixing the essential navigation icon when external icon CSS fails. Preserved approved design, content and original disabled-map configuration.

Production Chrome passed 96 six-route/theme/width/root-text combinations, 65 theme, 17 cookie, nine supplemental and 12 final assertions. Both built map variants passed; false configuration restored identically. Keyboard/settings/dialog/hash/storage/OS/cross-tab/no-JS/footer/banner/long-text flows passed, as did actual hover/focus contrast. Final check: 73 files including ignored local helpers, zero diagnostics; build: six routes; diff check passed. No known critical regression remains in tested scope.

Production homepage inline JavaScript measured 6,411 UTF-8 bytes with no external JS; shared CSS 96,193 bytes uncompressed. Controlled delayed/failed-image sample retained geometry with observed layout-shift sum zero; this is not field CLS. Detailed environment, results and reproduction are in the report. Ignored evidence is under `output/playwright/task-016/`; primary reviewed mobile Dark settings screenshot.

Native browser zoom, screen-reader speech, physical touch, other browsers, Lighthouse, deployment CSP and external-service appearance remain unverified. Approved project/review media, production domain and favicon remain agency inputs; butterfly mark is implemented. These limits are explicitly documented rather than claimed as passes.

Owned Chrome/static server closed; existing preview untouched. No commit or deployment made.
