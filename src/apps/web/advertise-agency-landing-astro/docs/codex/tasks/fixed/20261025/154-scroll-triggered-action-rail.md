# Add a scroll-triggered action rail

**Status:** Completed — 2026-10-25

**Priority:** Normal

**Created:** 2026-10-25

## Goal

Provide persistent quick actions while visitors scroll the page.

## Scope

- Show a fixed action rail on the right side after the page is scrolled away
  from the top; hide it again at the top of the page.
- Place collapse, chat, and callback actions in the upper group.
- Place the scroll-to-top action at the bottom of the rail.
- Represent every action with an icon and provide an accessible name and
  keyboard focus state.
- Collapse the rail by animating it to the right, and provide a way to restore
  it while it is collapsed.
- Respect responsive layouts, safe viewport insets, and reduced-motion
  preferences.

## Acceptance

- The rail appears after scrolling and stays fixed at the right edge with a
  consistent viewport inset.
- The upper group contains collapse, chat, and callback icon buttons; the
  scroll-to-top icon button is visually separated at the bottom.
- Collapsing moves the rail out to the right and the rail can be reopened.
- Scroll-to-top returns the page to the top without trapping focus or hiding its
  keyboard focus indicator.
- Every icon-only action has an accessible name and a visible focus state.
- The rail fits narrow screens, does not cover essential page content, and
  honors reduced-motion settings.

## Implementation and verification

- Added the shared action rail to the global layout. Contact controls stay at
  the top edge and return-to-top stays at the bottom in a separate group.
- Kept the chat control as a labeled button without a destination or handler, as
  requested. Every action has its own surface; there is no shared panel.
- Added left-side hover and focus labels. Hover fills are black for collapse,
  blue for chat, green for phone, and dark orange for return-to-top. Icons use
  their action color before hover and switch to a contrasting color on hover.
- Added collapse and restore behavior with remembered state, aligned controls,
  focus handoff, safe-area insets, and reduced-motion handling.
- Configured the phone reminder interval in
  `data/content/config/action-rail.json`; validation enforces a 30-second
  minimum.
- Focused component and interval validation tests: 4 passed.
- `pnpm check`: passed; Astro reported 0 errors and 0 warnings, with one
  existing deprecation hint in `src/validation/content-blocks.ts`.
- `pnpm format:check`: passed.
