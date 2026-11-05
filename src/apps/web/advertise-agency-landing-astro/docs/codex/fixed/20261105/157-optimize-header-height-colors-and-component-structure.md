# Optimize header height, visual hierarchy and component structure

**Status:** Fixed - implementation and verification completed

**Priority:** Priority 2

**Created:** 2026-11-05

**Completed:** 2026-11-05

**Area:** Shared site header (`src/components/Header.astro`) and its navigation,
settings, logo, mobile contacts and menu children

## Goal

Make the site header feel more spacious and deliberate while keeping it fast,
accessible and easy to maintain. Increase the rendered header height slightly so
the brand, navigation and controls have clearer breathing room, then tune the
color and surface treatment only where contrast or hierarchy needs it.

## Scope

- Review the header row and mobile contact row at 320px, tablet and desktop
  widths; increase vertical padding or control sizing by a small, consistent
  amount without causing cumulative layout shift or hiding useful content.
- Rebalance the header surface, brand color, navigation states, icon controls,
  borders, shadow and backdrop treatment against the existing light and dark
  theme tokens. Keep the final palette token based and check contrast instead of
  introducing isolated component colors.
- Make the brand, primary navigation, settings control and mobile menu opener
  read as one hierarchy. Preserve the always-available phone action and the
  existing desktop/mobile breakpoints.
- Simplify `Header.astro` where responsibilities are mixed. Keep it as a thin
  composition layer and move repeated layout or control presentation into
  focused components only when that reduces duplication and keeps the public
  APIs clear.
- Review the scroll-aware behavior, header clearance measurement, focus reveal,
  dialog/settings reveal and initial hash correction. Remove duplicated state or
  selectors where practical, while preserving the current interaction contract
  and cleanup behavior.
- Keep semantic landmarks, native links, keyboard order, visible focus, minimum
  touch targets and reduced-motion behavior. Avoid adding a framework island or
  client code for static presentation changes.
- Keep runtime content in `data/content/`; do not change menu ordering, phone,
  address, logo copy or publication rules as part of this visual task.

## Acceptance

- The header is visibly a little taller at mobile, tablet and desktop widths,
  with balanced vertical alignment and no clipped labels or horizontal overflow
  at 320px.
- Brand, navigation, settings and menu controls have a clear hierarchy in both
  themes. Text, icons, surfaces and focus states meet the project's contrast
  expectations without relying on color alone.
- The mobile contact row remains readable and usable, and desktop navigation
  still switches at the existing breakpoint without duplicate controls.
- Scroll hiding and reveal behavior remains stable: the header reappears for
  focus, open dialogs/settings, hash navigation and restored pages; measured
  anchor clearance tracks the final rendered height.
- Every interactive control keeps an accessible name, logical tab order, visible
  `:focus-visible` styling and a usable touch target. Reduced-motion visitors
  receive no avoidable header transition.
- The composition has less duplicated presentation or state logic where the
  refactor permits it, with comments documenting non-obvious browser behavior.
- Existing header tests continue to cover composition, resize measurement,
  scroll direction, focus/hash/page reveal, malformed hashes and cleanup.

## Verification

- Run focused `Header` and child-component tests, including light/dark themes,
  narrow viewport composition and reduced-motion behavior where supported.
- Use browser checks at 320px, tablet and wide desktop widths to inspect header
  height, alignment, overflow, focus states, menu/settings opening and scroll
  reveal. Capture evidence under an ignored `output/playwright/task-157/`
  directory.
- Check contrast for header text, icons, controls, backdrop and focus states in
  both themes; verify anchors clear the final header height.
- Run `pnpm check`, `pnpm format:check` and `pnpm build` after implementation.

## Dependencies and notes

- Review `Header.astro`, `NavLinks.astro`, `Settings.astro`, `Logo.astro`,
  `MobileHeaderContacts.astro`, `MobileMenuDialog.astro`, and the shared theme
  tokens before editing.
- Follow the Astro, code-style, development-server and sound-notification rules
  before implementation. Apply the `astro-best-practices` skill when changing
  any `.astro` component.
- Preserve the existing header data attributes and selectors used by tests or
  other scripts unless the replacement has equivalent coverage.
- Keep the visual change focused on the shared header; do not redesign page
  sections or publish new content in this task.

## Implementation

- Increased the shared header row and mobile contact spacing while keeping the
  existing 44px control targets, 64rem navigation breakpoint and measured
  clearance behavior.
- Replaced isolated header and messenger colors with light/dark theme tokens,
  added a bordered translucent header surface, and aligned the brand and menu
  controls with theme-aware focus and hover states.
- Kept quick contacts as a labelled action group so the primary and drawer
  navigation landmarks remain distinct, and centralized the scroll script's
  open-overlay selector.
- Preserved native links, dialog focus restoration, settings reveal, hash
  correction, reduced-motion behavior and all existing data attributes.

## Verification Results

- Focused header, navigation, settings and mobile dialog tests passed: 4 files,
  34 tests.
- Browser checks at 320px, 768px and 1280px reported no horizontal overflow;
  mobile header height was 131px, desktop header height was 65px, and the
  desktop navigation switched at the existing breakpoint.
- Mobile menu and settings opened with correct expanded/open state; dark theme
  messenger and header tokens resolved; reduced motion reduced transitions to
  0.00001s.
- `pnpm check` passed with the existing Zod deprecation hint at
  `src/validation/content-blocks.ts:129`.
- `pnpm build` passed with 39 pages generated.
- Changed-file Prettier check and `git diff --check` passed for 8 changed files.
  Repository-wide `pnpm format:check` remains blocked by three pre-existing
  formatted files: `AGENTS.md`, `docs/development/model-routing.md` and
  `docs/development/task-management.md`.
- Browser evidence is saved under `output/playwright/task-157/`.
