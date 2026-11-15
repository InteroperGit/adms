# 174 - Create Link component and migrate anchors

**Status:** implemented; archived at the user's request

**Archived:** 2026-11-16

**Priority:** normal

**Created:** 2026-11-15

**Scope:** shared `Link` component and all project anchor call sites

## Goal

Create `src/components/ui/Link.astro` with an underline offset calculated
using CSS, so the underline sits slightly below the text and does not cross
glyphs. Replace project `<a>` call sites with `Link` while preserving native
anchor behavior, accessibility and existing presentation.

## Scope

- Replace every `<a>` call site in the files listed below.
- Keep the internal anchor implementation in `Button.astro` native; `Link.astro`
  also renders its own native `<a>`.
- Calculate the underline offset with CSS only. Do not add client-side JS.
- Preserve `href`, native anchor attributes, slots, accessible names,
  conditional rendering, navigation behavior and existing caller classes.
- Keep non-text and control-like links visually consistent with their current
  presentation. Add only the smallest explicit API needed to opt out of the
  underline where appropriate.
- Do not edit runtime content or change destinations.

## Execution

- Skills: `astro-best-practices`, `ponytail`, `playwright`.
- Primary executor: Luna, medium, for the shared component and scoped migration.
- Delegation: none.

### Checklist

1. Read the project rules index, workflow, code style, architecture, design,
   testing and verification rules. Apply `astro-best-practices`, `ponytail` and
   `playwright`.
2. Inspect all listed call sites, their scoped/global styles and existing link
   states in both themes. Classify text links, navigation, card links,
   icon/media links and button-like actions before migration.
3. Implement `Link.astro` with a required `href`, native anchor attributes,
   forwarded classes and slot content. Set the underline offset with
   `calc(0.2em + 1px)`; do not use runtime measurement or JavaScript.
4. Add focused component tests for rendered anchor semantics, href and attribute
   forwarding, class/slot behavior, and any underline opt-out. Add type-contract
   coverage for required href and accepted native anchor attributes if the
   component contract warrants it.
5. Replace anchors in every in-scope file below. Keep `Button.astro`'s internal
   anchor branch native. Preserve caller-specific styles and link semantics.
6. Run only focused checks directly related to the change. Inspect rendered CSS
   in a browser at varied font sizes and line heights, and check both themes,
   narrow viewports, focus and hover. Run full verification gates only after the
   user explicitly requests them following implementation.
7. Review the full diff and confirm there are no remaining in-scope `<a>` call
   sites; record verification results. Move this task to `fixed` only when the
   user explicitly requests archival.

## Acceptance

- `Link.astro` renders a semantic native anchor and forwards native attributes,
  classes and slot content.
- Its underline is visibly below glyphs and does not cross the text at the
  project's font sizes and line heights; the offset is computed with CSS and
  requires no client JavaScript.
- All listed call sites use `Link`, except the internal native anchor in
  `Button.astro`. Link states remain usable and distinguishable by keyboard,
  including visible focus, in both themes.
- Existing destinations, labels, conditional branches and visual treatments
  remain intact, including links that do not display a text underline.
- Component tests, type checks, relevant browser checks and applicable final
  gates pass. Any unrelated existing failures are reported separately.

## Implementation handoff

- Added `Link.astro` with native anchor attributes, required `href`, slot/class
  forwarding, underline opt-out and `calc(0.2em + 1px)` offset.
- Migrated all listed call sites; `Button.astro` keeps its internal native
  anchor. Footer policy, consent, phone and email links are plain at rest and
  underline on hover. The callback consent sentence links its privacy-policy
  phrase inline; it stays primary-colored and underlined in every state. Its
  heading and unavailable notice have distinct styles, and the close icon gains
  color on hover without a background fill.
- Focused tests passed (23 tests); full Vitest passed (783 tests); type
  contracts, lint, build, content/boundary, style, coverage thresholds and
  built quality passed. `astro check` reported zero errors and one pre-existing
  deprecation hint. `format:check` only reports pre-existing issues in
  `data/templates/README.md` and `Introduction.astro`.
- Browser check at 375px confirmed footer links have no underline at rest;
  hover confirmed the calculated underline. Full E2E had 305 passes and one
  WebKit video fallback failure: the test received no fulfilled URL within
  five seconds. Rerun verification after the user requests testing.
- After the callback privacy link change, `ContactMenu.test.ts` passed (7 tests).
- Mobile callback screenshots at 390x844 are saved under
  `output/playwright/task-174/`. Browser styles confirmed the inline policy
  link underline and primary color, plus a transparent close-button hover
  background. The focused `ContactMenu.test.ts` passed (7 tests) after these
  dialog changes. Full verification remains pending the user's explicit
  request.

## Complete anchor call-site inventory

- `src/pages/404.astro`
- `src/layouts/LegalLayout.astro`
- `src/components/CookieBanner.astro`
- `src/components/Footer.astro`
- `src/components/cards/Card.astro`
- `src/components/cards/PricingExample.astro`
- `src/components/content/FootnoteBlock.astro`
- `src/components/ui/ActionRail.astro`
- `src/components/content/ImageGalleryTiles.astro`
- `src/components/content/OrderFormBlock.astro`
- `src/components/projects/ProjectArticleActions.astro`
- `src/components/forms/LedLettersForm.astro`
- `src/components/ui/DesktopNavigation.astro`
- `src/components/ui/ContactMenu.astro`
- `src/components/content/ParagraphBlock.astro`
- `src/components/ui/ContactInfo.astro`
- `src/components/ui/Breadcrumbs.astro`
- `src/components/projects/ProjectCatalogPagination.astro`
- `src/components/ui/HeaderAddress.astro`
- `src/components/ui/HeaderBrand.astro`
- `src/components/ui/HeaderCall.astro`
- `src/components/content/VideoBlock.astro`
- `src/components/sections/OrderInquiry.astro`
- `src/components/ui/NavLinks.astro`
- `src/components/sections/ServiceArticle.astro`
- `src/components/sections/Faq.astro`
- `src/components/ui/YandexReviews.astro`
- `src/components/sections/BusinessSolutions.astro`

`src/components/ui/Button.astro` also contains an `<a>`, but it is excluded:
it is the internal native implementation of the Button component.
