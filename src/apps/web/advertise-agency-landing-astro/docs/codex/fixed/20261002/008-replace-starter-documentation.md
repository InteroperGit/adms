# Task 8 — Replace starter documentation and remove unused assets

**Status:** Completed

Read the [shared implementation instructions and coordination plan](../../plan/20261001_222426_plan.md) before starting.

**Priority:** Low

**Files:** `README.md`, `src/assets/astro.svg`, `src/assets/background.svg`, `public/favicon.svg`, relevant components and site configuration

Replace the starter README with project-specific setup, runtime requirements, background dev-server commands, verification commands, content-editing instructions, and deployment assumptions. Search for asset references before removing unused starter assets. Reuse existing site configuration for duplicated brand/footer text. Inspect the favicon and replace starter branding only if an approved agency asset is available.

**Acceptance criteria:**

- README accurately describes this application and its actual commands.
- Only confirmed unused starter assets are removed.
- Duplicated agency name and existing configurable copyright text use shared configuration.
- No unapproved logo or branding is invented.
- Build passes.

## Implementation and verification

- Implemented by subagent task_008 and reviewed by the primary agent.
- Replaced starter README sections with accurate project setup, background server commands, application structure, content workflow, static deployment assumptions, and asset limitations.
- Preserved existing CI, metadata, cookie, content, and agent task-storage documentation, including dated completed-task folders.
- Removed `src/assets/astro.svg` and `src/assets/background.svg` after confirming no application references.
- Moved the existing footer description unchanged into site configuration and used the existing configured copyright text. Component agency names already use shared configuration; legal document text was preserved.
- Retained the starter favicon because no approved agency replacement was available, and documented this limitation.
- `pnpm check` passed for 36 files with zero diagnostics; `pnpm build` generated six pages.
- Generated footer wording remained unchanged. Primary-agent diff review and `git diff --check` passed.
- Subsequent user-requested organization makes README a documentation index. Detailed guides now live in `docs/development/`, `docs/site/`, and `docs/codex/task-management.md`; the original instructions are preserved there.
