# Publish approved introduction and services content

**Status:** Completed implementation; archived at user request

**Archived:** 2026-10-10

**Priority:** Priority 1

**Created:** 2026-10-09

**Plan:** [Sales and SEO improvement plan](../../plan/sales-and-seo-plan.md).

**Depends on:** Tasks 050 and 052; archived tasks 024-029.

## Goal

Complete production acceptance of the existing introduction and catalog.

## Scope

- Confirm introductory heading, service summary, service area, and real
  completed-project hero photo with approval and publication rights.
- Confirm which of the five catalog services the agency actually provides;
  replace test descriptions/images with approved relevant material.
- Update existing approval/provenance fields from real evidence, disable
  services demo mode when ready, and preserve valid inquiry/service links.
- Repeat deferred copy/photo acceptance, remote-image decoding, responsive,
  keyboard, no-JavaScript, and light/dark checks for tasks 024-029.

## Acceptance

- Introduction and visible service cards communicate the confirmed offer and
  area without test media or unsupported agency claims.
- Approved content passes publication gates; unavailable services disappear
  consistently from cards/navigation. Dedicated SEO articles remain task 059.

## Execution notes

Read project instructions, task-management guidance, and applicable rules
before implementation. Record missing agency inputs or external access as
dependencies. This task file authorizes no external publication or messages.
Archive only after acceptance, with evidence and updated plan/status links.

## Implementation — 2026-10-10

- Removed the unrelated remote Picsum hero. The introduction is text-only
  until approved actual-project photography is supplied. Changed its action
  to «Обсудить проект» so it describes the inquiry rather than a calculator.
- Added required `photo.approved` metadata for future hero photos. The hero
  renders only with both copy and photo approval; missing/unapproved photos
  reserve no empty column. No approval flags were enabled.
- Refreshed the five draft service card descriptions with customer benefits
  and concrete discussion inputs, retaining demo disclosure and draft flags.
- Centralized service publication predicates for cards, navigation consumers,
  article robots metadata and service sitemap entries. Article indexing now
  also requires section-copy approval; demo/unapproved articles are excluded
  from the sitemap. With a hidden catalog, article return links use `/`.
- Added synthetic publication-gate tests, covering independent approval
  withdrawals, demo/production modes, missing photo/route and hero fallback.
- Updated content and service handoff guidance with exact remaining inputs.

## Verification

- `node scripts/test-service-publication.mjs`: three tests passed.
- `pnpm build`: passed; 11 pages built with local service image variants.
- `pnpm check`: passed with no errors/warnings and one pre-existing hint in
  ignored Playwright output; changed-file 80-column validation passed.
- `node scripts/verify-content-invariants.mjs`: passed for 15 JSON files.
- Synthetic-origin build passed: the nonempty sitemap excludes all unapproved
  service routes. Rebuilt with the normal environment afterward.
- Browser checks passed at 320/1440px in both themes: text-only introduction,
  five decoded local catalog images and no catalog overflow. All five service
  routes remain noindex and retain native catalog return links. Introduction
  and catalog also render without JavaScript. Screenshots were inspected.
- Browser evidence: `output/task-053/browser.js` and `catalog-*.png`.
  Checks wait for DOM readiness because unrelated remote homepage assets can
  delay the full load event; this does not verify those external assets.

## Independent implementation and review loop

- An implementation subagent prepared the changes; another subagent reviewed
  code, tests and publication handoff independently.
- First review found two issues: deleting a JSON service alone breaks its
  static route, and tests relied on optional fields in the live demo catalog.
- Implementation agent clarified withholding/coordinated route removal and
  replaced live-content assumptions with independent synthetic fixtures.
- Second review found no actionable defects. Three publication tests and
  final code-style verification passed after the corrections.

## Remaining production acceptance

Follow-up at user request: restored the original Picsum introduction photo
using explicit `demoMode: true`, with `photo.approved: false`. Production
photo gates apply when demo mode is off. A missing photo still renders no
image column. Prior text-only browser checks above describe the earlier state.
Follow-up publication tests, `pnpm check` and `pnpm build` pass; the restored
original image URL is present in the generated homepage.

Next user follow-up: replaced Picsum with the bundled CC0 storefront photo
showing illuminated lettering above an entrance. Source, license, real image
dimensions and centered signage crop are recorded in introduction JSON and
the offers guide. This is stock imagery, not a genuine agency project;
the photo approval flag remains false and explicit demo mode stays enabled.

Latest image follow-up: Introduction now uses its own CC0 photo of dimensional
storefront lettering, cropped to focus on the sign and entrance. Local asset:
`src/assets/introduction/storefront-sign.webp` (1200 × 900). Author, source,
license and Sharp processing are recorded in `docs/site/content.md`.
It no longer shares a photograph with OfferCarousel. This is a licensed
photograph, not an AI-generated image or an agency portfolio record.

The [production input register](../../../site/production-inputs.md) contains no
agency approval records. Archived dependencies do not supply that evidence.
The existing heading, summary and Череповец service area are still drafts.
All five service confirmations, section/card copy approvals, image approvals
and article approvals remain false. Services demo mode remains enabled.

Required agency inputs: approved introduction copy and service area; explicit
confirmation or withholding of each catalog service; genuine relevant completed
work photos with source, installation context and publication rights; named
approver/role, approval date, document/version reference and usage limits.
Set copy/media flags and disable demo mode only from that real evidence.
Dedicated SEO article expansion remains task 059. Real-photo rights, decoding
and crop acceptance cannot be completed against unavailable originals.

Archived at user request on 2026-10-10. Agency approvals and genuine project
photo acceptance remain release dependencies; archival does not establish
production acceptance.

Unavailable service records can stay with `confirmed: false` after demo mode
is disabled; their cards/menu disappear while draft routes stay noindex.
If deleting a service record, remove its matching static service route too,
otherwise the missing ID fails the build. Synthetic tests use complete
independent fixtures, including null media and omitted optional links, so
future valid editorial changes do not break verification assumptions.
