# Projects and reviews design

**Status:** Pending

**Priority:** Medium

**Dependency:** Task 011 completed; use completed theme/settings behavior from 012–012b. Keep changes scoped to portfolio and reviews; coordinate with 013 if shared tokens/layout need changes.

Read the [design plan](../plan/20261002_134818_plan.md), [task-management guide](../task-management.md), and [project instructions](../../../AGENTS.md). Follow the dependencies and constraints in the plan. Apply frontend-design and astro-best-practices; consult required Astro guides.

## Scope and acceptance

Refine project cards, image framing, titles, metadata and detail-page reading hierarchy. Reduce heavy decorative shadows; make link targets clear without nested interactive elements. Preserve IDs, schema validation, image dimensions and truthful placeholder alt text. Improve reviews with readable quote lengths, wrapping and consistent author/avatar alignment; fix 200% text overflow. Use semantic theme colors instead of fixed light-only gray. Do not invent or silently endorse project results or testimonials. Acceptance: homepage and all project routes reviewed mobile/desktop in both themes, long-content and enlarged-text checks, stable image geometry, visible keyboard focus, check/build pass.

## Implementation details

- Work in `sections/Projects.astro`, `sections/Reviews.astro`, `cards/ProjectCard.astro`, `cards/ReviewCard.astro` and `pages/projects/[id].astro`. Keep content editing in existing JSON/schema sources and URLs/record IDs stable.
- Set a consistent portfolio hierarchy: image, title, concise client/context information, summary and clear detail action. Avoid small decorative badges taking priority over the work title. Give repeated «Подробнее» links distinguishable accessible names that include the project title. Use one coherent link strategy without nested links or click-only card handlers.
- Keep card image aspect ratios predictable, preserve truthful alternative text and intrinsic dimensions, and reserve image space before remote assets load. Check crops without stretching images. Do not download/generated-replace approved-media gaps as part of a styling task; follow the [media guide](../../site/media.md).
- On project details, provide readable text width, sensible heading/list spacing, a clear return-to-projects link and a contact path using existing sources. Retain document metadata and image loading appropriate to its position. No new performance/result claims.
- Use semantic quote markup for reviews; align avatars and author details without shrinking avatars or forcing long names/company strings outside the card. Mark ornamental quote SVGs decorative. Keep full testimonial text available; do not introduce truncation, carousels or invented ratings.
- Ensure grid children/text containers can shrink and wrap at 320px and 200% text. Use content-driven heights, consistent padding and semantic surfaces. Keep keyboard focus visible independently of hover; avoid motion that conflicts with reduced-motion preferences.

## Verification

Review homepage plus all three project routes in both themes at narrow/desktop widths, including the 768px grid breakpoint. Check 320px, separate 200% text and long name/title/company fixtures in the browser without committing fixture text. Verify keyboard link names/order, contact/return destinations, image dimensions/crops and stable layout with delayed or failed remote images. Save representative card/review/detail before/after screenshots; measure contrast for changed text/controls. Record external-image failures separately from code failures. Run check/build; reserve the complete viewport/route matrix for 016.

Record changed files, checks, browser evidence and limitations. Archive only after completing verification; update the plan link and status. No deployment is authorized by this task.
