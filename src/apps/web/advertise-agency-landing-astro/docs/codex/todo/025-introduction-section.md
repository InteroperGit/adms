# Implement the clear introductory section

**Status:** Layout implemented; pending approved copy/photo and final review

**Priority:** High

**Created:** 2026-10-06

**Depends on:** [Task 024](024-introduction-content-and-photo.md)

## Goal

Make the agency's services, location, and next action clear immediately
on the homepage, implementing the introductory section from the
[sales and SEO plan](../plan/sales-and-seo-plan.md).

Read [project instructions](../../../AGENTS.md),
[task management](../task-management.md), and applicable code-style,
Astro, and development-server rules. Apply frontend-design and
astro-best-practices during implementation.

## Scope

- Create a mostly static `Introduction.astro` section using task 024's
  editable content and real project photo.
- Place it directly after OffersCarousel in the homepage main content.
  Keep offers available as a secondary section with existing functionality.
- Replace the homepage's current hidden H1 with the visible introductory
  heading. Ensure the homepage contains exactly one H1.
- Present the service summary, area served, photo, and primary action with
  a clear visual hierarchy using existing typography and brand tokens.
- Link «Рассчитать стоимость» to `/#order-inquiry` with a native anchor.
  Ensure the destination is visible after navigation, including with any
  sticky header. Do not imply an instant price calculation.
- Keep the form's honest unavailable state and direct contact fallback
  while submission is disabled. Delivery setup remains a separate dependency.
- Optimize the introductory photo through the established image pipeline
  or Astro image tools. Provide stable dimensions, responsive sizing, and
  appropriate alt text; avoid lazy-loading the main above-the-fold photo.
- Support mobile and desktop layouts, light and dark themes, keyboard use,
  long copy, and enlarged text. Keep the section useful without JavaScript.

## Acceptance and verification

- The introduction follows the carousel and identifies services
  and Череповец without requiring carousel interaction.
- The real project photo renders with the intended crop and without clipping
  important project details or causing layout shift.
- The single visible H1 and summary are present in generated HTML.
- The primary action reaches the existing inquiry section, with honest
  unavailable feedback and contact fallback when delivery is disabled.
- Existing navigation, offers, settings, and cookie UI remain functional.
- Run `pnpm check`, `pnpm build`, and diff checks; record results.
- Hand off the implemented section and remaining concerns to task 026.

Archive only after acceptance passes, following the task-management guide.

## Implementation — 2026-10-06

Subsequent user adjustment: Introduction now follows OffersCarousel.
Homepage section backgrounds alternate base-100/base-200 by rendered order
in both themes. Earlier verification below records the original ordering;
task 026 should verify the updated order and alternating surfaces.

The user subsequently requested a remote photo. Introduction now uses a
1200×900 Lorem Picsum demonstration image with centered focal points and
alt text identifying it as unrelated to agency work. Genuine project-photo
provenance, publication approval, and crop acceptance remain unresolved.

- Added static `Introduction.astro` as the first homepage section, before
  the unchanged offers carousel. Its visible H1 replaces the hidden H1.
- Reads the validated editable task 024 heading, summary, location and
  native `/#order-inquiry` action. No calculator or new delivery claim.
- Uses existing typography, theme tokens, container and button styles.
  Content drives height; wrapping supports small screens and enlarged text.
- `photo: null` renders a text-only introduction without a fake project
  photograph or empty image frame. Draft copy remains unapproved.
- Prepared an optional stable 4:3 photo frame with separate desktop/mobile
  focal points, truthful alt text, eager loading and high fetch priority.
  Local originals under `src/assets/` use Astro Image responsive variants;
  public/remote sources retain the supplied-image pipeline and need prior
  resizing/compression. No actual approved image or crop was verified.
- About remains intact; its service-copy overlap and unverified trust
  claims need a later editorial decision with agency evidence.

## Verification and handoff to task 026

- `pnpm check` passed: 158 files, zero errors/warnings; one pre-existing
  unused-variable hint in ignored task 018 browser evidence.
- `pnpm build` passed: six static pages. Initial Image union typing error
  was corrected with distinct imported-image and supplied-image branches.
- Chrome snapshot confirmed visible H1, services, location and inquiry
  link before offers. The browser helper advanced through 12 scoped bounds
  checks (320/768/1440px, Light/Dark, 16/32px root text), unavailable
  feedback and keyboard Enter navigation before a later navigation timeout.
  A subsequent rerun stalled and was interrupted. There is no successful
  final browser-summary result; do not treat the full helper as passed.
- Local ignored helper: `output/playwright/task-025/verify.js`.
- Final no-JavaScript navigation, sticky-header clearance, unchanged UI
  interactions, long-copy fixtures, visual screenshot review and genuine
  photo optimization/crops remain for task 026. Root-text enlargement is
  distinct from native browser zoom.
- Remains in `todo/`: task 024's approved service wording and real-photo
  acceptance are unresolved; task 026 remains pending. Submission stays
  disabled with existing unavailable feedback and contacts above the form.
