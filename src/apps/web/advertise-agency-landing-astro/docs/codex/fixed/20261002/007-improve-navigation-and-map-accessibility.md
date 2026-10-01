# Task 7 — Improve navigation and map accessibility

**Status:** Completed

Read the [shared implementation instructions and coordination plan](../../plan/20261001_222426_plan.md) before starting.

**Priority:** High

**Files:** `src/components/Header.astro`, `src/components/ui/NavLinks.astro`, `src/components/sections/Contacts.astro`, related styles/scripts

Give the map iframe a descriptive title. Make mobile menu controls keyboard accessible and clearly named. Inspect the drawer markup and interaction: verify opening, closing, Escape behavior, focus handling, and closing after section selection. Add navigation landmarks and hide purely decorative icons from assistive technology where appropriate.

**Acceptance criteria:**

- Mobile navigation can be opened, used, and closed with the keyboard.
- Controls have accessible names and communicate menu state.
- Focus behaves predictably when opening and closing the menu.
- Selecting a section closes the mobile menu.
- The map iframe has a descriptive title.
- Build and browser keyboard verification pass.

## Implementation and verification

- Implemented by subagent task_007 and reviewed by the primary agent.
- Replaced the checkbox drawer with a native modal dialog and named keyboard buttons, with expanded state, initial focus, explicit Tab wrapping, Escape handling, and close-button focus restoration.
- Added backdrop and desktop-resize closing, and focused the destination section after same-page selection. Consolidated interaction handling in Header and removed the old NavLinks script.
- Added named navigation landmarks, a descriptive map iframe title, and hidden decorative contact/menu icons from assistive technology.
- `pnpm check` passed with zero diagnostics; production build generated six pages.
- Real headless Chrome checks passed Enter opening, initial focus, forward/reverse Tab wrapping, Escape state and focus restoration, close-button restoration, section-selection close and destination focus after hash navigation, backdrop close, desktop resize close, and map title.
- External URLs were blocked during browser verification. External map loading and screen-reader announcements were not tested.
- Temporary browser, profile, and verification harness were cleaned up.
- Primary-agent review and `git diff --check` passed.
- Subsequent user-requested refactor extracted the dialog markup, styles, and behavior into `src/components/ui/MobileMenuDialog.astro`. Header retains the opener button and passes menu items and phone to the dialog component.
