# Task 9 — Replace placeholder media with real agency assets

**Status:** Completed using missing-assets alternative (approved media still required)

Read the [shared implementation instructions and coordination plan](../../plan/20261001_222426_plan.md) before starting.

**Priority:** Medium before launch

**Files:** `data/content/projects.json`, `data/content/reviews.json`, `src/components/cards/ProjectCard.astro`, `src/components/cards/ReviewCard.astro`, `src/pages/projects/[id].astro`, image assets

Projects currently use Picsum images and reviews use Pravatar avatars. Identify and use approved real media when available. Document missing media if none is supplied. Consider Astro image optimization, appropriate dimensions, responsive sizing, and descriptive alternative text. Do not substitute generated project photography or invented customer identities.

**Acceptance criteria:**

- Approved assets replace placeholders when available; missing assets are explicitly listed otherwise.
- Images have appropriate alternative text and dimensions.
- Cards and project detail pages remain visually correct on mobile and desktop.
- Build passes.

## Implementation and verification

- Implemented by subagent task_009 and reviewed by the primary agent.
- No approved imagery was found in the application or repository's tracked image inventory. Retained current placeholder sources and documented all three missing project photos and three reviewer portraits in `docs/site/media.md`, linked from README and content/deployment guides.
- Added validated alternative text and intrinsic dimensions to project/review JSON records. Alternative text identifies demonstration media without implying real agency work or customer identity.
- Updated cards and detail pages with explicit dimensions, responsive styling, async decoding, lazy card loading, and eager/high-priority detail images.
- Deferred Astro optimization and responsive source variants until approved media is supplied, avoiding build-time downloads of disposable placeholders.
- `pnpm check` passed for 36 files with zero diagnostics; build generated six pages. All nine generated image tags were checked.
- Real Chrome layout checks passed for homepage and three project pages at 375px and 1440px (eight combinations), with no horizontal overflow and expected card/portrait/detail image geometry.
- External image requests were blocked during browser checks. Remote loading and actual image crop appearance remain unverified; reserved dimensions and responsive layout were verified.
- Temporary browser helpers and profiles were cleaned up. Primary-agent review and `git diff --check` passed.
- Agency-approved media remains required before placeholder replacement. The media guide lists the exact handoff requirements.
