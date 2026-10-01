# Task 3 — Simplify and validate content

**Status:** Pending

Read the [shared implementation instructions and coordination plan](../plan/20261001_222426_plan.md) before starting.

**Priority:** Medium

**Files:** `data/content/`, `src/content/`, `src/types/`, `src/pages/projects/[id].astro`, consuming components

Review the JSON → TypeScript wrapper → interface layers. Choose a consistent approach: typed TypeScript objects for small settings, and Astro content collections with schemas for projects and reviews where worthwhile. Preserve the external JSON source if it is needed by an existing editing workflow. Replace the unchecked `as Project[]` assertion with checked typing or schema validation. Avoid maintaining duplicate schema and interface definitions for the same content.

**Acceptance criteria:**

- The content source of truth and validation approach are documented.
- Invalid project/review data is caught by the relevant check or build.
- Existing content and `/projects/1`, `/projects/2`, and `/projects/3` URLs are preserved.
- Build and type checking pass when the check command is available.

