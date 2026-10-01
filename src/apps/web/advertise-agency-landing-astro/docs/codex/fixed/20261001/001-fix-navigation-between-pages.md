# Task 1 — Fix navigation between pages

**Status:** Completed

Read the [shared implementation instructions and coordination plan](../../plan/20261001_222426_plan.md) before starting.

**Priority:** High

**Files:** `data/content/site.json`, `src/components/ui/NavLinks.astro`, `src/components/ui/Section.astro`

Change homepage section links from `#about`, `#projects`, `#reviews`, and `#contacts` to their root-relative equivalents, such as `/#about`. Check section positioning beneath the sticky header and add scroll margin if needed.

**Acceptance criteria:**

- Desktop and mobile links reach the correct homepage section from the homepage, project pages, and both legal pages.
- Target headings remain visible beneath the sticky header.
- The production build passes.


## Implementation and verification

- Completed by subagent task_001 and reviewed by the primary agent.
- All four shared menu links now use root-relative homepage anchors.
- Shared sections use an 80px scroll margin for sticky-header clearance.
- Selecting a mobile navigation link closes the drawer.
- Production build passed and generated six pages.
- Generated HTML verified for desktop/mobile links on every page and all homepage targets; generated scroll-margin CSS was checked.
- Browser tools were unavailable. Actual scrolling and mobile interaction still need a manual browser check.
