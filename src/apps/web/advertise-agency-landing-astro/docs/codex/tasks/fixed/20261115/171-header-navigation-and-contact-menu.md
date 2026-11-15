# 171 - Refresh header navigation and contact menu

**Status:** UI complete; delivery deferred to task 173

**Archived:** 2026-11-15, at the user's request

**Priority:** Priority 2

**Created:** 2026-11-14

**Area:** Shared header, navigation and contact actions

## Goal

Make the shared header easier to scan and give visitors one clear place to
choose a contact method. Keep the existing mobile header layout while moving
desktop navigation into its own row.

## Scope

- On desktop, show the configured address (`site.address`) in the first row,
  where navigation currently sits. Keep the brand and three header controls
  aligned; use one shared height for the call, settings and contact controls.
- Extract desktop navigation into a focused component on a second row. Use an
  inverted, theme-aware surface and uppercase labels while retaining configured
  menu items, existing routes and semantic navigation.
- Keep the current mobile header layout and site navigation drawer. Replace the
  MAX shortcut with a new square `Связаться` control that uses a chat icon.
- On desktop, open a dropdown from `Связаться`. On mobile, open a bottom sheet
  spanning the viewport width and about half its height. Center a short handle
  at the top; use larger labels and horizontal dividers between its four
  actions: `Обратный звонок`, ВКонтакте, MAX and Telegram.
- Use the repository's local social icon assets for ВКонтакте, MAX and Telegram.
  Render the phone action with the Lucide Phone icon and the contact control
  with a chat icon; do not fetch icon assets from a remote host.
- Open a callback form in a modal from `Обратный звонок`. Reuse the existing
  inquiry validation and delivery contracts where they support this request.
  Follow the inquiry rules for consent, server validation, failure feedback and
  activation; never report success without confirmed acceptance.
- Preserve native links, keyboard operation, visible focus, 44px hit targets,
  Escape and outside dismissal, focus restoration, reduced motion, both themes
  and usable behavior without JavaScript where applicable.

## Acceptance

Delivery, consent approval and real social destinations are deferred to task 173
by the user's decision on 2026-11-15. Completion here covers the interface;
local input is editable, and submission remains disabled.

- At desktop widths, the first header row shows the single-source address and
  aligned controls. Navigation is a separate uppercase row with inverted theme
  colors; it does not duplicate menu items or hardcode address text.
- At mobile widths, the navigation drawer starts below the first header row and
  extends to the viewport bottom. The burger trigger animates to a close icon
  without changing button colors; the same trigger toggles the nonmodal drawer.
  It has a white surface, larger link text, route icons and separators in the
  theme primary color, with no separate close or contact action buttons.
- The desktop dropdown and mobile sheet expose the same four actions. Social
  icons load from local assets; phone uses Lucide; no icon requires a remote
  request.
- `Обратный звонок` opens a labeled callback form in a modal. Validation,
  consent, submission feedback and error/input preservation match the verified
  receiving service contract. No unapproved submission path is activated.
- All three desktop controls have equal rendered height. Keyboard and pointer
  users can open and dismiss each panel, reach every action, see focus, and
  return focus to its opener.
- Header and overlays work at 320px, tablet and desktop widths, in light and
  dark themes, with enlarged text and reduced motion; no clipping or horizontal
  overflow is introduced.
- Tablet and desktop contact dropdowns stay nonmodal; the mobile contact sheet
  stays modal. The mobile navigation drawer is nonmodal. Settings are rightmost,
  call shows the phone number, and button hover states use theme colors.
- Tablet and desktop navigation items use even spacing between each other and
  the outer edges, with hover underlines; the address has a map-pin icon.
- Navigation bands use the theme primary color. Navigation labels are white in
  the light theme and black in the dark theme across desktop, tablet and mobile.
- Mobile contact buttons use white surfaces with orange borders and icons;
  pointer hover brightens their orange details with a subtle glow.
- The sticky header has no divider below mobile navigation, and the mobile
  contact sheet keeps a compact bottom inset after its final action.
- Theme settings show a larger heading and named options beside their icons;
  selecting an option closes the panel and restores trigger focus.
- Desktop theme buttons are taller, with icons and names aligned horizontally.
- The mobile navigation opener is a dedicated accessible header component.
- The desktop contact dropdown sits above the navigation band and below the
  complete header.
- The direct call button has a theme-colored circle around its icon, wider
  spacing, and synchronized hover colors.
- On mobile, the brand starts at the left edge, the call control uses the
  primary fill without a shadow, and the address has no border. The contact
  sheet has no visible title, includes an icon on callback, uses larger action
  text, and closes from its 44px handle near the top edge.
- On mobile, the theme settings stack vertically and show larger, named choices.
- Mobile navigation links close the drawer and scroll same-page destinations
  into view below the header; links to other pages preserve native navigation.
- Selecting `Обратный звонок` closes the contact menu and opens a separate
  labeled modal spanning the full viewport width and height. Its form has space
  on all sides, visible field borders and editable name/phone inputs; submission
  remains disabled. An icon-only close button sits at the form's top right.
  Escape and that control restore focus to the contact opener.

## Skills and model

- Apply `astro-best-practices`, `frontend-design` and `ponytail` during
  implementation. Re-read the project rules listed below before editing.
- Primary: Luna medium for codebase inspection and bounded component work; Sol
  medium for callback form and inquiry contract integration. No delegation
  planned.

## Checklist

- [x] Read `AGENTS.md`, workflow, code style, architecture, design, inquiries,
      testing and verification rules; apply the listed skills.
- [x] Inspect the current header, navigation, settings, mobile drawer, local
      social assets and inquiry receiving contract before changing them.
- [x] Implement the desktop rows, shared control sizing and responsive contact
      menu; keep callback submission disabled without an approved receiver.
- [x] Add colocated component tests and browser coverage for menu behavior and
      disabled callback submission.
- [x] Verify keyboard/focus behavior, themes, responsive widths, reduced motion
      and no-JavaScript fallbacks as applicable.
- [x] Run the required checks and inspect the complete diff and file list.
- [x] Defer callback receiving, consent, real social contact values and delivery
      activation to [task 173](../../backlog/173-enable-callback-delivery.md),
      at the user's request on 2026-11-15. Keep submission disabled until that
      acceptance.
- [x] Archive the UI task at the user's request; preserve deferred delivery in
      task 173 and update incoming links.

## Verification

- The earlier full unit run passed 782 tests across 103 files and met coverage
  thresholds before the final Lucide integration.
- The full E2E attempt reported 299 passed and 7 failed. Six header assertions
  expected digits in the synthetic `TEST_PHONE` value and were corrected; the
  unrelated WebKit video 404 request also failed. A focused rerun timed out
  while starting the fixture web server, so final browser verification remains
  incomplete.
- Focused component tests passed (14 tests); Astro diagnostics, code style,
  formatting and component-test colocation passed. Production build and
  built-quality checks passed for all 39 routes after the final header edits.
- Latest mobile regression: 8 focused component tests passed, and a Chromium
  smoke check confirmed that tapping the sheet handle closes it and restores
  focus to its opener.
- `format:check` still reports pre-existing formatting issues in
  `data/templates/README.md` and `src/components/sections/Introduction.astro`.
- `pnpm verify:*` was blocked before script execution by sandbox `EPERM` at
  `C:\Users\maxsi`; the equivalent repository scripts passed under Node.

## Notes

- Final acceptance on 2026-11-15: 779 tests and coverage gates passed before the
  final Escape and explicit mobile link tabindex refinements. All 21 affected
  component tests then passed. Coverage was 95.11% overall.
- The navigation matrix passed 23 scenarios; its remaining WebKit Tab case was
  diagnosed with a standalone browser probe and fixed using explicit mobile link
  tabindex. The keyboard scenario then passed in Chromium, Firefox and WebKit
  (3/3). Assertions retain native Tab, target focus, actual section visibility,
  modal bounds, editable input and dismissal.
- Production build and built-quality checks passed for all 39 routes. Lint,
  content/boundary checks, type contracts and component placement passed. Final
  Astro diagnostics and changed-source style passed.
- Global formatting still fails on the two pre-existing files listed above. The
  broader E2E attempt was interrupted after new requirements invalidated its
  build; carousel/catalog failures were observed outside this UI scope. This
  record does not claim a passing full-site browser matrix. PowerShell stderr
  redirection returned a tool error despite the final keyboard report showing 3
  passed; the report and direct browser probe agree.
- Final UI follow-up: local callback inputs are editable, with visible borders
  and a padded form surface inside the full-screen modal. The icon-only close
  control sits at the upper right. Native form submission is prevented while
  delivery is deferred; the submit control stays disabled. All 7 focused
  callback component tests passed, including nonmodal Escape dismissal.
- Mobile navigation follow-up, 2026-11-15: same-page links previously changed
  the hash and focused the section with scrolling suppressed. After the drawer
  closes, the destination now scrolls into view using the existing header
  clearance. The component regression checks hash, focus and scrolling; the
  browser regression checks the actual destination position.
- Follow-up participants: primary Codex owns integration and final gates;
  `gpt-6-luna`, medium, handled the three-file fix and focused checks. No model
  escalation was needed. Focused component tests: 11 passed; style and targeted
  formatting passed. The same worker implemented the separate full-screen
  callback dialog; all 6 focused callback component tests passed. Final
  verification evidence is recorded below.
- Runtime inquiry delivery is disabled and consent is not approved. No callback
  submission path is active; actual callback and social destinations need
  approved values before final integration. The user explicitly deferred that
  connection on 2026-11-15; task 173 owns these prerequisites and activation.
- Archived after the user requested completion; live delivery is task 173.
- The prior header cleanup is documented in
  [157](../20261105/157-optimize-header-height-colors-and-component-structure.md).
- Local social icons are under `public/icons/social/`; UI icons use
  `@lucide/astro`.
