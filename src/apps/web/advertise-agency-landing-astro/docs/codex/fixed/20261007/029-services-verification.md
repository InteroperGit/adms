# Verify the homepage services section

**Status:** Archived at user request; technical verification performed

**Archived:** 2026-10-07

**Priority:** High

**Created:** 2026-10-06

**Depends on:** [Task 028](028-services-section.md)

**Next verification input:**
[Task 028a](028a-services-demo-content-and-pages.md) enables
the requested
demo catalog and test articles. After it is implemented, verify all five
visible cards, images, destinations, demo notices, and article noindex
metadata. Preserve the distinction between demo verification and agency
production acceptance in the results below.

## Goal

Verify that visitors can understand the agency's confirmed services and
navigate to available detail pages, fulfilling “Priority 1: Services” in
the [sales and SEO plan](../../plan/sales-and-seo-plan.md).

Read [project instructions](../../../../AGENTS.md),
[task management](../../task-management.md), and applicable development rules.
Use the Playwright skill for browser checks and follow development-server
rules when starting, reusing, or stopping the server.

## Scope and acceptance

- Verify light and dark themes at 320px, 768px, and desktop widths.
  Review screenshots for card hierarchy, spacing, readable descriptions,
  recognizable image crops, and page/section horizontal overflow.
- Check enlarged text, long names/descriptions, and different catalog sizes
  using temporary fixtures. Restore fixtures after verification. Distinguish
  root-text enlargement from native browser zoom in recorded results.
- Confirm OffersCarousel → Introduction → About → Services, and alternating
  section surfaces. Verify exactly one visible homepage H1, a Services H2,
  and logical card headings in generated HTML.
- Verify card text and images match confirmed agency capabilities. Record
  copy approval, image provenance/rights, and missing assets separately
  from technical check results.
- Check actual image requests, dimensions, alt text, responsive sizing,
  loading behavior, and crops. Test absent/failed images for readable cards;
  a fallback layout does not establish real-image acceptance.
- Verify contrast, visible keyboard focus, and native link activation.
  Ensure cards have no nested anchors or misleading unavailable controls.
- Open every configured service-page link and confirm its destination
  exists and matches the service. With no published service pages, verify
  the no-link state and record link activation as not yet applicable.
- Verify desktop/mobile `/#services` navigation, sticky-header clearance,
  menu closing, and navigation from a project page. Repeat essential
  section and link checks without JavaScript.
- Check header/settings, offers navigation/autoplay, introduction inquiry
  action, projects, cookie UI, and the existing form for regressions.
  Inquiry delivery remains a separate dependency.
- Fix findings within this section's scope and repeat affected checks.
  Run `pnpm check`, `pnpm build`, and diff checks after fixes.
- Record browser evidence, route/viewport coverage, command results, and
  limitations. Do not mark unperformed checks or missing inputs as passed.

## Completion

Archive after acceptance passes, preserving task numbers and updating the
Services task links/status in the plan. Report unresolved agency content,
photo inputs, or future service-page links explicitly. Dedicated service
page creation and broader SEO setup remain in the plan's later phase.

## Verification results — 2026-10-06

Used the Playwright skill, a dedicated Chromium session `services29`, and
the existing background server at `http://localhost:4321`. Reviewed the
static components using astro-best-practices. All populated checks below
used temporary fixtures, not approved agency services or photographs.

### Current publication state

- All five candidates remain unconfirmed with unapproved descriptions,
  `image: null`, and no dedicated-page links. Section copy is unapproved.
- The actual homepage has no Services section or dangling Services menu
  entry, and retains one H1. This is the intended publication gate.
- No real service pages are published, so acceptance of actual destinations
  and service-specific page content is not yet applicable.
- Copy, capabilities, photo provenance/rights, relevance, and recognizable
  real-project crops remain open. Technical fixtures do not satisfy them.

### Responsive layout, structure, and accessibility

- Five-card fixtures at 320/768/1440px in light/dark themes: no horizontal
  overflow, no photo/heading/description overlap, readable card hierarchy.
  Repeated all six cases with 200% root text, long Russian descriptions,
  and 100-character unbroken strings; all passed. Native browser zoom and
  screen-reader testing were not performed.
- Confirmed Offers → Introduction → About → Services and alternating
  rendered surfaces in both themes. Populated generated HTML has one H1,
  one Services H2, five card H3s, a labelled region/articles, one real fixture
  link, and no nested anchors or fake controls on cards without pages.
- Minimum measured section text contrast across normal fixtures: 5.55:1
  light and 7.02:1 dark, above 4.5:1. Enlarged-text/long-copy fixtures also
  exceeded 4.5:1. Measurements reflect sampled computed theme colors.
- Forward/reverse Tab traversal reaches the service link. Both themes show
  a 2px focus outline. Enter reaches the temporary detail page. Direct
  programmatic focus is used only to establish a deterministic start point.
- Catalog fixtures with zero, one, and seven text-only cards: no overflow
  at 320px; absent images have no empty frames and absent links have no CTA.
  The zero-card section is omitted.
- Reviewed light desktop and dark mobile screenshots; card text/frame
  hierarchy remains readable. Cookie overlays appear in screenshots;
  header/dev-toolbar visibility was suppressed only during captures.

### Images and production-build fix

- Four local fixture images loaded; the intentional missing image returned
  404 while its 4:3 frame and adjacent name/description remained readable.
- Imported-original fixture used Astro Image with responsive 320/480/768w
  sources and `sizes`. Supplied public images kept their intrinsic 1200×600
  metadata and no srcset, as expected for the established supplied pipeline.
  All images have descriptive fixture alt, lazy loading, and cover cropping.
  Desktop focal point is 50%/50%; mobile uses the supplied 25%/50% position.
- Desktop frames measured about 357×268px regardless of load success. This
  verifies reserved geometry, not a quantified cumulative-layout-shift test.
- The populated production build exposed missing Sharp in the imported
  image branch. Added `sharp` 0.35.5 to runtime dependencies and updated the
  lockfile. The repeated populated build passed, producing four WebP assets
  of roughly 3–12kB from the 20kB fixture original. Generated HTML image
  dimensions, alt, lazy loading, responsive metadata, and headings passed.
- Intermittent existing remote review-avatar connection resets were observed.
  No approved remote service photo exists to verify requests or real crops.

### Navigation, no JavaScript, and regressions

- Desktop/mobile navigation from `/projects/1` reaches Services; headings
  start around 156/124px below a 60px header. The mobile menu closes.
- Both system themes without JavaScript at 320px render five fixture cards
  and native detail links work. Initial native anchor positioning was
  delayed by unrelated remote image loading. With external requests aborted
  to isolate local behavior, the Services heading settles at about 128px
  below a 56px header. This check does not claim reliable initial scrolling
  while unrelated remote requests remain pending.
- Settings switch to dark and persist on a project page. Header About
  navigation clears the header, mobile Contacts navigation closes its menu,
  and project `/projects/1` renders its own title.
- Offers arrows/dots switch slides and autoplay advances after its configured
  interval when focus/pointer leave the carousel.
- Cookie UI appears, dismisses, and persists its choice on returning home.
  The dev toolbar was hidden in the project-page DOM for this pointer check.
- Introduction CTA works by Enter, reaching the inquiry heading around
  124px below the 60px header. Submission remains disabled with unavailable
  feedback; Contacts retains telephone/email links. Delivery was not tested.

### Evidence and final state

- Ignored scripts/screenshots: `output/playwright/task-029/`; reused navigation
  helper from task 028 and regression helper from task 026. CLI logs/snapshots
  are in `.playwright-cli/`.
- Intermediate helper issues were corrected: DOM stress mutations removed
  test anchors when same-hash navigation did not reload; explicit reloads
  now restore each fixture. Catalog-size query tests required a temporary
  request-aware route; it was returned to static mode before build checks.
- Restored `services.json` byte-for-byte and removed both fixture pages and
  the imported test asset. No service approval flags changed permanently.
- Final `pnpm build`: passed, six static pages; final generated HTML omits
  Services/menu link and keeps one H1. Fixture routes/assets are absent.
- Final `pnpm check`: zero errors/warnings; one pre-existing unused-variable
  hint in ignored `output/playwright/task-018/matrix.js`.
- `git diff --check`: passed. The persistent implementation fix is the Sharp
  dependency; remaining changes record verification and plan status.

Agency content, real imagery, and populated production acceptance remain
open. The technical checks passed
within the fixture scope; Services remains hidden in the current public site.

## Enabled demo update — 2026-10-07

Task 028a is complete: the homepage now shows all five cards after About,
with local test illustrations and five dedicated demonstration articles.
Earlier hidden-state/fixture results above describe the previous catalog.

Task 028a verified 36 actual route/theme/viewport cases and corresponding
enlarged-text cases, image decoding, all five card/back links, keyboard
activation, header clearance, no-JavaScript flows, and existing UI regressions.
Generated article metadata, visible demo notices and noindex passed checks.
Build now produces 11 static pages and 20 responsive image variants.

All agency approvals remain false. Task 029 is archived at the user's
request with genuine content/photo acceptance unresolved. The demo does not
meet production
acceptance. See the archived task 028a for detailed evidence and limitations.
