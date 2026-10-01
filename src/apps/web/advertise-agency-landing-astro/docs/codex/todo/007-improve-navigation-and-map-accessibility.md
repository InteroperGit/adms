# Task 7 — Improve navigation and map accessibility

**Status:** Pending

Read the [shared implementation instructions and coordination plan](../plan/20261001_222426_plan.md) before starting.

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

