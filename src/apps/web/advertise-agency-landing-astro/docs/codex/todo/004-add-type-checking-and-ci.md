# Task 4 — Add type checking and automated verification

**Status:** Pending

Read the [shared implementation instructions and coordination plan](../plan/20261001_222426_plan.md) before starting.

**Priority:** High

**Files:** `package.json`, `pnpm-lock.yaml`, applicable repository CI configuration

Add a `check` script using `astro check` and its required dependencies. Inspect repository-level CI before proposing changes; CI files may live outside this application's writable workspace. Run checks and fix actionable diagnostics within the assigned scope. Integrate check and build into existing CI when authorized and accessible, or document the exact remaining CI change.

**Acceptance criteria:**

- `pnpm check` runs without interactive dependency installation and passes.
- `pnpm build` passes.
- Existing CI runs both commands, or the remaining integration is clearly documented.
- Lockfile changes are included where dependencies change.

