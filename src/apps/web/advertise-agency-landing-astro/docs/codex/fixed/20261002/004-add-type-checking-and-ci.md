# Task 4 — Add type checking and automated verification

**Status:** Completed (CI integration documented; no existing workflow found)

Read the [shared implementation instructions and coordination plan](../../plan/20261001_222426_plan.md) before starting.

**Priority:** High

**Files:** `package.json`, `pnpm-lock.yaml`, applicable repository CI configuration

Add a `check` script using `astro check` and its required dependencies. Inspect repository-level CI before proposing changes; CI files may live outside this application's writable workspace. Run checks and fix actionable diagnostics within the assigned scope. Integrate check and build into existing CI when authorized and accessible, or document the exact remaining CI change.

**Acceptance criteria:**

- `pnpm check` runs without interactive dependency installation and passes.
- `pnpm build` passes.
- Existing CI runs both commands, or the remaining integration is clearly documented.
- Lockfile changes are included where dependencies change.

## Implementation and verification

- Implemented by subagent task_004 and reviewed by the primary agent.
- Added `pnpm check` using installed `@astrojs/check` 0.9.10, so checking does not prompt to install dependencies.
- Changed TypeScript from 7.0.2 to compatible 6.0.3 because the checker supports TypeScript 5/6 and rejects version 7.
- Updated the lockfile for checker dependencies and TypeScript. pnpm also normalized metadata and consolidated Tailwind's Vite peer onto Astro's existing Vite 8.2.2; no unrelated direct dependencies were upgraded.
- Removed an unused Contacts import and replaced deprecated iframe `frameborder` with `border-0`, resolving checker hints while retaining borderless presentation.
- `pnpm check` passed for 35 files with zero errors, warnings, or hints; the primary agent independently confirmed this result.
- `pnpm build` passed and generated six pages.
- `git diff --check` passed.
- No existing repository CI configuration was found. README documents the exact remaining job setup, working directory, runtime requirements, trigger paths, and frozen install/check/build commands. CI automation has not been added.
