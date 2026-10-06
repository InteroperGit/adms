# Make the footer darker in light mode

**Status:** Completed

**Completed:** 2026-10-07

**Priority:** Medium

**Created:** 2026-10-07

## Goal

Give the shared footer a noticeably darker background in light mode,
creating a clear visual ending to the page while keeping its content readable.

Read [project instructions](../../../../AGENTS.md),
[task management](../../task-management.md), and applicable code-style,
Astro, and development-server rules. Apply frontend-design and
astro-best-practices; use Playwright for browser verification.

## Scope

- Update `src/components/Footer.astro` so light mode uses a dark slate
  surface consistent with the existing brand palette, replacing its current
  pale `bg-base-200` appearance.
- Define footer-scoped background, text, muted-text, link, divider, and
  focus colors as needed. Keep global page/theme colors unchanged.
- Adapt the brand/logo, legal links, headings, contact icons/details,
  telephone/email links, and copyright text to the darker surface.
- Inspect inherited utility colors and the shared `ContactInfo` component
  so descendants do not retain unreadable light-theme foreground colors.
- Preserve the current dark-mode footer appearance and its accessibility.
- Support explicit light/dark settings and system-theme fallback without
  JavaScript. Avoid a light-color flash or mismatched footer colors when
  switching themes or navigating between pages.
- Retain footer content, native destinations, responsive columns, spacing,
  and link behavior. Apply the darker surface across all shared-layout pages.
- Follow the 80-character source limit and commented, expanded CSS rules.

## Acceptance and verification

- In light mode the footer is visibly darker than the preceding content,
  with readable brand, headings, descriptive/contact text, and copyright.
- Normal text and links reach at least 4.5:1 contrast against the footer;
  large text reaches 3:1. Focus indicators remain visible on the dark surface.
- Keyboard focus, hover states, telephone/email links, legal navigation,
  and the home/logo link remain functional.
- Review light/dark screenshots at 320px, 768px, and 1440px on the homepage
  and a service or project page. Check enlarged text for overflow/clipping.
- Verify theme switching/persistence and both system themes without
  JavaScript. Confirm dark mode retains its intended footer presentation.
- Run `pnpm check`, `pnpm build`, and diff checks; record results, sampled
  contrast ratios, browser evidence, and any verification limitations.
- Update relevant footer/theme notes in `docs/site/design-system.md` if
  the final footer introduces new documented colors or usage conventions.

## Completion

Archive after acceptance passes, recording the final visual treatment and
verification results under the task-management guide.

## Implementation and verification

- Light footer uses brand slate `#18222D`; dark retains `#202C38`.
  Footer-local text, muted, link, divider and focus tokens cover shared
  ContactInfo descendants without changing global colors or component APIs.
  Brand/logo, content, destinations, spacing and responsive columns remain.
- CSS handles explicit themes and system dark fallback without JavaScript.
  The existing blocking theme script remains responsible for stored choices.
- Chrome: `/` and `/services/neon`, Light/Dark, 320/768/1440px, 16/32px
  root text: all 24 footer bounds checks passed. Twelve theme/route/size
  screenshots plus two no-JavaScript system captures are stored locally in
  ignored `output/playwright/task-030/`, with `verify.js` and `themes.js`.
- Keyboard Tab/Shift+Tab and 2px focus outlines passed on all footer links.
  Legal hover underline, Enter navigation to both legal pages and home,
  and unchanged `tel:`/`mailto:` destinations passed. No external contact
  application was launched.
- All 18 theme switch/reload/navigation checks passed for light/dark/system
  choices under both emulated system settings. No-JavaScript light/dark
  fallback and explicit theme precedence passed.
- Contrast against Light / Dark footer: body 14.28 / 12.61; muted
  9.48 / 8.37; legal/contact links and focus 7.96 / 7.02; brand/icons
  4.52 / 3.99. Normal text meets 4.5:1; large brand and icons meet 3:1.
- `pnpm check`: zero errors/warnings; one existing unused-variable hint in
  `output/playwright/task-018/matrix.js`. `pnpm build`: 11 routes passed.
  `git diff --check` passed; changed component lines fit 80 characters.
- Restarted the existing background development server after its component
  styles became unavailable during build verification; final browser checks
  used the refreshed server. No frame-by-frame paint recording, native
  browser zoom or screen-reader speech verification was performed.
- Updated `docs/site/design-system.md`. No corresponding plan references
  task 030, so no plan links require adjustment.
