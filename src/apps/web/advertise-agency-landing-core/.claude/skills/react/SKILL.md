---
name: react
description: Use this skill when writing, reviewing, or explaining React code. Fetches up-to-date React documentation via context7 to ensure accuracy with the current version used in this project (React 19).
---

When working with React in this project:

1. Use context7 MCP tools to retrieve current React documentation:
   - First call `resolve-library-id` with query "react" to get the correct library ID
   - Then call `query-docs` with that ID to fetch up-to-date API docs

2. Always prefer React 19 APIs and patterns:
   - Use `use()` hook for promise/context reading where appropriate
   - Prefer function components with hooks over class components
   - Use `useId()` for accessibility attributes requiring stable IDs
   - Use `useTransition()` / `startTransition()` for non-urgent state updates
   - Use `useDeferredValue()` for deferred rendering of expensive components
   - Use **native DOM event types** — `React.FormEvent`, `React.MouseEvent` etc. are deprecated in React 19; use `SubmitEvent`, `MouseEvent`, `InputEvent` instead

3. Project-specific conventions (from CLAUDE.md):
   - One component per file, PascalCase filename; hooks/utils/type modules are camelCase
   - Import `cn()` from `@/lib/utils` for conditional Tailwind class merging
   - All data consts live in `src/types/` (organised into `config/`, `sections/`, `portfolio/`, `shared/`); components import from `@/types/`, never from `@data/` directly
   - Routing via react-router-dom v6 (`RouteObject[]`); SSG build via vite-react-ssg
   - No server-side logic, API routes, or runtime data fetching — fully static SSG
   - Icons referenced by string key in JSON, resolved via `ICON_MAP` in `src/types/shared/iconMap.ts`; never import from `lucide-react` directly in components
   - All data const exports use `satisfies` operator: `export const x = data satisfies Type`

4. Always verify hook rules: no hooks inside conditions, loops, or nested functions.
