# Task 9 — Replace placeholder media with real agency assets

**Status:** Pending

Read the [shared implementation instructions and coordination plan](../plan/20261001_222426_plan.md) before starting.

**Priority:** Medium before launch

**Files:** `data/content/projects.json`, `data/content/reviews.json`, `src/components/cards/ProjectCard.astro`, `src/components/cards/ReviewCard.astro`, `src/pages/projects/[id].astro`, image assets

Projects currently use Picsum images and reviews use Pravatar avatars. Identify and use approved real media when available. Document missing media if none is supplied. Consider Astro image optimization, appropriate dimensions, responsive sizing, and descriptive alternative text. Do not substitute generated project photography or invented customer identities.

**Acceptance criteria:**

- Approved assets replace placeholders when available; missing assets are explicitly listed otherwise.
- Images have appropriate alternative text and dimensions.
- Cards and project detail pages remain visually correct on mobile and desktop.
- Build passes.

