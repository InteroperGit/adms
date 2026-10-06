# Verify the introductory section

**Status:** Archived at user request; verification performed

**Archived:** 2026-10-06

**Priority:** High

**Created:** 2026-10-06

**Depends on:** [Task 025][introduction-task]

## Goal

Verify the completed introduction against the
[sales and SEO plan](../../plan/sales-and-seo-plan.md), focusing on readability,
the real project photo, semantic structure, and the inquiry action.

Read [project instructions](../../../../AGENTS.md),
[task management](../../task-management.md), and applicable development rules.
Use the Playwright skill for real browser checks; follow development-server
rules for starting, reusing, or stopping a server.

## Scope and acceptance

- Verify light and dark themes at 320px, 768px, and desktop widths.
- Check enlarged text and long-copy fixtures for overlap, clipping, and
  horizontal overflow. Remove temporary fixtures after verification.
- Confirm the heading, summary, primary action, and important photo details
  remain readable and recognizable across viewport sizes.
- Verify contrast, keyboard focus, and primary action activation. Confirm
  the inquiry destination is visible and accessible after anchor navigation.
- Verify the section and anchor work without JavaScript; the form must
  accurately show delivery availability and the direct contact fallback.
- Check generated HTML for exactly one visible homepage H1, descriptive
  copy, image dimensions, and appropriate alt text.
- Verify image requests succeed and the main introductory photo is not
  lazy-loaded. Record observed image loading or layout-shift problems.
- Check offers navigation/autoplay, header navigation, theme settings,
  cookie UI, and a project page for regressions caused by the new section.
- Fix findings within the introductory section's scope. Repeat checks only
  where changes or unresolved concerns justify them.
- Run `pnpm check`, `pnpm build`, and diff checks after any fixes.
- Record browser evidence, viewport coverage, check results, and limitations.
  Distinguish inquiry-anchor verification from actual delivery verification.

## Completion

Archive this task after acceptance passes. Update the introductory section's
task links and status in the plan as tasks are archived. Report missing real
photography or content as unresolved rather than declaring the section ready.

[introduction-task]: 025-introduction-section.md

## Verification results — 2026-10-06

Used Playwright CLI with a dedicated Chromium session and the existing
background server at `http://localhost:4321`. Followed the Playwright and
Astro best-practices skills. Verified the latest requested order: offers
carousel first, Introduction second, with alternating section surfaces.

### Responsive layout and accessibility

- Light and dark themes at 320×1000, 768×1000, and 1440×1000: no page or
  introduction horizontal overflow. Heading, summary, location, and CTA
  remain visible. Mobile/tablet stack the image; desktop uses two columns.
- Repeated the six combinations with 200% root font size, five times the
  introduction copy, and a 120-character unbroken string in each text
  element. No introduction overlap, clipping, or horizontal overflow.
  Restored the DOM-only fixtures after each check; content files unchanged.
- Native Tab/Shift+Tab reaches the CTA with a visible 2px solid focus ring.
  Enter activates `/#order-inquiry`. At 320px the inquiry heading starts
  around 124px, below the header's roughly 59px bottom edge.
- Without JavaScript at 320px, light and dark system themes: native CTA
  navigation works. Inquiry heading starts around 128px, below the 56px
  header. Unavailable-delivery and no-JavaScript messages remain visible;
  submission stays disabled. Contacts provide native telephone/email links.
- Generated `dist/index.html` contains exactly one H1, Russian service and
  location copy, a labelled Introduction section, and photo dimensions
  1200×900. Alt explicitly identifies the image as a demonstration rather
  than an agency project. The image is eager with high fetch priority.
- Sections alternate white/#f3f5f7 in light and #18212b/#202c38 in dark,
  including Introduction and the inquiry destination.
- Steady-state theme token contrast exceeds 4.5:1 for heading/summary,
  muted location, and CTA text in both themes. Measurements exclude the
  brief color transition immediately after switching themes.

### Image availability and remaining acceptance

- The introduction request fails in this environment: Picsum returns
  HTTP 403, `text/plain`, body `Geoblocked`; Chromium reports
  `net::ERR_BLOCKED_BY_ORB`. Existing Picsum project images fail similarly.
- An alternate Picsum endpoint also returned the same 403. A bounded
  Unsplash request timed out. Existing Wikimedia office-interior offer
  photos return HTTP 200 image/jpeg. They demonstrate an available host,
  but do not establish a suitable real agency project photo or rights for
  the introduction. The configured demonstration URL was preserved.
- The 4:3 photo frame reserves layout space even when loading fails: roughly
  288×216 at 320px, 722×541 at 768px, and 518×389 at 1440px. CSS uses cover
  with a 50%/50% focal point. Actual photo details and crop recognition
  cannot pass while the remote request fails; successful-load layout-shift
  behavior was not established.
- `copyApproved` remains false. A genuine project photograph, its rights,
  descriptive alt, and approved focal points remain outstanding.
- Inquiry navigation was verified; successful delivery was not. Submission
  is intentionally disabled and no endpoint is configured.

### Evidence and disposition

- Carousel arrows and dots switch slides; autoplay advances after its
  configured 7-second interval when focus/pointer leave the carousel.
- Desktop header navigation reaches About with header clearance; the
  320px mobile menu reaches Contacts and closes normally.
- Theme settings select dark and preserve the choice on a project page.
  Project `/projects/1` renders its own title. Cookie UI appears, accepts
  dismissal, and preserves that choice on returning home. The development
  toolbar was hidden only in the project-page DOM for the cookie pointer
  check because it intercepted the button; production source was unchanged.
- `pnpm check`: 0 errors and 0 warnings; one existing unused-variable hint
  in ignored `output/playwright/task-018/matrix.js`.
- `pnpm build`: passed, six static pages. Generated homepage HTML checked.
- `git diff --check`: passed; only normal LF/CRLF conversion notices.
- No application code changes were necessary for the passing layout and
  interaction checks. Only this task record and plan status were updated.

Ignored local screenshots are in `output/playwright/task26/`, including
`light-320.png`, `light-768.png`, `light-1440.png`, the corresponding dark
screenshots, and `nojs-light.png`/`nojs-dark.png`. CLI snapshots and request
logs are under `.playwright-cli/`. Evidence is local and not committed.

Archived at the user's explicit request. Acceptance still requires an
accessible image and approved real project content. Archiving does not
confirm publication readiness or resolve the image and approval limitations.
