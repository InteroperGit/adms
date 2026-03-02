---
name: react
description: Use this skill when writing, reviewing, or explaining React code. Fetches up-to-date React documentation via context7 to ensure accuracy with the current version used in this project (React 19).
---

When working with React in this project:

1. Use context7 MCP tools to retrieve current React documentation:
   - First call `resolve-library-id` with query "react" to get the correct library ID
   - Then call `get-library-docs` with that ID to fetch up-to-date API docs

2. Always prefer React 19 APIs and patterns:
   - Use `use()` hook for promise/context reading where appropriate
   - Prefer function components with hooks over class components
   - Use `useId()` for accessibility attributes requiring stable IDs
   - Use `useTransition()` / `startTransition()` for non-urgent state updates
   - Use `useDeferredValue()` for deferred rendering of expensive components

3. Project-specific conventions (from CLAUDE.md):
   - One component per file, PascalCase filename
   - Import `cn()` from `@/lib/utils` for conditional Tailwind class merging
   - Static data lives in `@/lib/constants.ts`
   - No routing — single-page layout only
   - No server-side code or data fetching

4. Always verify hook rules: no hooks inside conditions, loops, or nested functions.
