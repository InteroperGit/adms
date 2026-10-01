# Task 1 — Fix navigation between pages

**Status:** Pending

Read the [shared implementation instructions and coordination plan](../plan/20261001_222426_plan.md) before starting.

**Priority:** High

**Files:** `data/content/site.json`, `src/components/ui/NavLinks.astro`, `src/components/ui/Section.astro`

Change homepage section links from `#about`, `#projects`, `#reviews`, and `#contacts` to their root-relative equivalents, such as `/#about`. Check section positioning beneath the sticky header and add scroll margin if needed.

**Acceptance criteria:**

- Desktop and mobile links reach the correct homepage section from the homepage, project pages, and both legal pages.
- Target headings remain visible beneath the sticky header.
- The production build passes.

