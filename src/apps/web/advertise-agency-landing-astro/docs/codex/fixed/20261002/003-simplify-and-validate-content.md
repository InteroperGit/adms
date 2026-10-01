# Task 3 — Simplify and validate content

**Status:** Completed

Read the [shared implementation instructions and coordination plan](../../plan/20261001_222426_plan.md) before starting.

**Priority:** Medium

**Files:** `data/content/`, `src/content/`, `src/types/`, `src/pages/projects/[id].astro`, consuming components

Review the JSON → TypeScript wrapper → interface layers. Choose a consistent approach: typed TypeScript objects for small settings, and Astro content collections with schemas for projects and reviews where worthwhile. Preserve the external JSON source if it is needed by an existing editing workflow. Replace the unchecked `as Project[]` assertion with checked typing or schema validation. Avoid maintaining duplicate schema and interface definitions for the same content.

**Acceptance criteria:**

- The content source of truth and validation approach are documented.
- Invalid project/review data is caught by the relevant check or build.
- Existing content and `/projects/1`, `/projects/2`, and `/projects/3` URLs are preserved.
- Build and type checking pass when the check command is available.

## Implementation and verification

- Implemented by subagent task_003 and reviewed by the primary agent.
- Preserved JSON as the source of truth, synchronous content exports, card order, and existing project URLs. For these small datasets, direct imports with schemas avoid unnecessary content-collection migration.
- Added shared project/review schemas in `src/content/schemas.ts` using `astro/zod`, including required text fields, media sources, positive integer IDs, and unique IDs.
- Content exports validate data at import/build time and report the source JSON file and field path on failure.
- Project and Review types are inferred from their schemas, replacing duplicated interfaces and the unchecked project-array assertion.
- README documents content editing, validation, and stable project IDs.
- `pnpm build` passed and generated six pages, including `/projects/1`, `/projects/2`, and `/projects/3`.
- `pnpm exec tsc --noEmit` passed. A dedicated `astro check` command remains part of task 004; this TypeScript check does not cover Astro templates.
- Four negative build checks rejected an incorrectly typed project title, a duplicate project ID, missing review text, and a duplicate review ID with source/field diagnostics.
- Original JSON files were restored byte-for-byte after negative checks, the temporary verification script was removed, and a final production build passed.
- Primary-agent review found no whitespace errors with `git diff --check`.
