# PDR Workflow — advertise-agency-landing

## Overview

PDR (Problem/Decision/Resolution) steps are work units tracked in `ai/tasks/` files. Each step must go through validation before marking complete.

## Workflow for Every PDR Step

### 1. Implement Changes
Make code changes according to the PDR requirements.

### 2. Run Validation (in order)
```bash
pnpm format     # Reformat all changed files
pnpm lint       # Fix any lint errors
pnpm typecheck  # Type check, fix any errors
pnpm build      # Full SSG build to build/client/
```

All four commands **must pass** before proceeding. Do not skip any step.

### 3. Check Build Output
- Verify no errors in console output
- For `pnpm typecheck`: "Cannot find module" errors for gitignored data JSON files are expected — only address errors in edited source files
- For `pnpm build`: watch for React Router or Vite errors

### 4. Update CLAUDE.md if Necessary
If the step involved:
- **New/deleted files** → add to Key Structure section
- **New routes** → add to Routes section
- **Architecture changes** → add to Reference Documentation or create new doc
- **New conventions** → add to Key Rules section

If no structural changes, skip this step.

### 5. Mark Step Complete in PDR File
In the PDR markdown file (e.g., `ai/tasks/todo/YYYYMMDD_*.md`), mark the step with ✅ and add a brief note:

```markdown
- ✅ **T1: Add login form** — Created LoginForm component, added /login route, all validation passes
```

## Common Issues

### Build fails after changes
1. Check `pnpm typecheck` output — fix type errors first
2. Run `pnpm format` to ensure consistent formatting
3. Check `pnpm lint` — some rules may block build
4. Verify imports use correct aliases (`@/`, `@data/`, etc.)

### "Cannot find module @data/" errors in typecheck
Expected for gitignored JSON files. Check for errors in actual source files (`src/`). If only data files show errors, it's safe to proceed.

### Lint rule conflicts
- `badge.tsx` and `button.tsx` are shadcn-generated — do not edit, they have ESLint overrides
- For other files, fix lint errors before committing

## PDR File Template

```markdown
# Refactoring — YYYYMMDD

## T1: Task Name
- [ ] Step 1
- [ ] Step 2

## T2: Another Task
- [ ] Implementation
- [ ] Testing

---

## Done
- ✅ **T1: Task Name** — Brief description of what was implemented
- ✅ **T2: Another Task** — Brief description
```

## Notes
- Do not commit until all validation passes
- Validation sequence cannot be shortened — each step catches different issues
- If a step involves multiple sub-tasks, validate after each sub-task completes
- Use `git add -A` (or check `git status` first) when committing — PDR files may have moved from `todo/` to `done/YYYY/MM/DD/` and a path-specific `git add` will fail with "pathspec did not match any files"
