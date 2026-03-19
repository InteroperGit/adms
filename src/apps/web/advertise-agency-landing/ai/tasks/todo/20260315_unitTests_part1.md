# Plan: Unit Tests — Part 1: Setup & Foundation

**Status**: pending
**Date**: 2026-03-15
**Series**: 1 of 4 (`20260315_unitTests_part1.md` → `_part2.md` → `_part3.md` → `_part4.md`)

## Goal

Set up test infrastructure (Vitest + React Testing Library) and add unit tests for utilities, shared types, hooks, and context. This part **must be completed first** — Parts 2 and 3 depend on the setup from Task 0.

## Current State

- **No tests exist** in the project
- **No test dependencies** installed
- Stack: Vite 8 + React 19 + TypeScript 5.9 + Tailwind v4
- ~70+ components, 8 hooks, 4 utility modules, 1 context

---

## Task 0: Test Infrastructure Setup

**Model**: Claude Sonnet 4.6

**Files to create/modify:**
- `package.json` — add devDependencies
- `vitest.config.ts` — test runner config
- `src/test/setup.ts` — global test setup
- `src/test/utils.tsx` — shared render helpers and mocks
- `tsconfig.app.json` — include test files

**Steps:**

1. Install dependencies (Vitest 3+ required for Vite 8 / Rolldown compatibility):
   ```bash
   pnpm add -D vitest@^3 @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
   ```

2. Create `vitest.config.ts` at project root:
   ```ts
   import { defineConfig, mergeConfig } from 'vitest/config';
   import viteConfig from './vite.config';

   export default mergeConfig(
     viteConfig({ mode: 'test', command: 'serve' }),
     defineConfig({
       test: {
         globals: true,
         environment: 'jsdom',
         setupFiles: ['./src/test/setup.ts'],
         include: ['src/**/*.test.{ts,tsx}'],
         css: false,
       },
     })
   );
   ```

   **Vite 8 note:** `ConfigEnv` no longer has `isSsrBuild` — only `mode` and `command` are passed. If the merge throws a type error, use `defineConfig` wrapper:
   ```ts
   import { defineConfig } from 'vitest/config';
   import path from 'path';

   export default defineConfig({
     resolve: {
       alias: {
         '@': path.resolve(__dirname, './src'),
         '@data': path.resolve(__dirname, './data/content'),
       },
     },
     test: {
       globals: true,
       environment: 'jsdom',
       setupFiles: ['./src/test/setup.ts'],
       include: ['src/**/*.test.{ts,tsx}'],
       css: false,
     },
   });
   ```

3. Create `src/test/setup.ts`:
   ```ts
   import '@testing-library/jest-dom/vitest';
   ```

4. Create `src/test/utils.tsx` with:
   - Custom `render()` wrapper that includes `BrowserRouter` + `ThemeProvider`
   - Re-exports from `@testing-library/react`
   - Shared mock factories for common data types (`Service`, `Advantage`, `PortfolioCase`, etc.)
   - Mock for `import.meta.glob` (used by portfolio modules)

5. Add script to `package.json`:
   ```json
   "test": "vitest run",
   "test:watch": "vitest",
   "test:coverage": "vitest run --coverage"
   ```

6. Update `tsconfig.app.json` — add `"vitest/globals"` to `compilerOptions.types`

7. Verify setup by creating a trivial test and running `pnpm test`

**Validation:** `pnpm test` runs and passes with 0 tests found (or the trivial test passes).

---

## Task 1: Utility Functions — `src/libs/`

**Model**: Claude Haiku 4.5

**Test file:** `src/libs/libs.test.ts`

| Function | Source | Tests |
|----------|--------|-------|
| `cn()` | `utils.ts` | merges classes, resolves Tailwind conflicts, handles falsy values, handles arrays/objects |
| `extractYearMonth()` | `dateUtils.ts` | valid dates, invalid format, wrong separators, empty string, out-of-range month, edge months (01, 12) |
| `resolveImageSrcSet()` | `imageSrcSet.ts` | valid `/images/` path, custom widths, non-`/images/` path returns empty, file without extension, deeply nested path |
| `categorySlug()` | `categorySlug.ts` | known category returns slug, unknown category returns `'all'` |

**Validation:** `pnpm test src/libs`

---

## Task 2: Shared Types & Utilities — `src/types/shared/`

**Model**: Claude Haiku 4.5

**Test file:** `src/types/shared/iconMap.test.ts`

| Function | Source | Tests |
|----------|--------|-------|
| `resolveIcon()` | `iconMap.ts` | valid key returns component, invalid key returns fallback, all keys in ICON_MAP are valid LucideIcon components |
| `ICON_MAP` | `iconMap.ts` | is a non-empty object, all values are functions (React components) |

**Validation:** `pnpm test src/types/shared`

---

## Task 3: Custom Hooks — `src/hooks/`

**Model**: Claude Sonnet 4.6

**Test file:** `src/hooks/hooks.test.ts`

| Hook | Tests |
|------|-------|
| `useTheme()` | returns `isDark` and `toggle` from ThemeContext |
| `useCookieConsent()` | reads localStorage, returns consent state, reacts to storage events |
| `useCountUp(100, true, 500)` | animates from 0 to target, stays at 0 when `animate=false` |
| `useDocumentTitle('Title')` | sets `document.title` |
| `useFadeIn()` | returns a ref, creates IntersectionObserver (mock) |
| `useInViewport()` | returns boolean based on IntersectionObserver visibility |
| `useSwipe()` | calls `onLeft`/`onRight` on touch events exceeding threshold |
| `useRandomButtonHighlight(3)` | returns a number in range [0, count), cycles over time |

**Mocking notes:**
- Mock `IntersectionObserver` globally in setup or per-test
- Mock `localStorage` for `useCookieConsent`
- Use `vi.useFakeTimers()` for timing-based hooks (`useCountUp`, `useRandomButtonHighlight`)
- Wrap hook calls in `renderHook()` from `@testing-library/react`

**Validation:** `pnpm test src/hooks`

---

## Task 4: Context — `src/contexts/`

**Model**: Claude Sonnet 4.6

**Test file:** `src/contexts/ThemeContext.test.tsx`

| Test | Description |
|------|-------------|
| `ThemeProvider` defaults | reads system preference via `matchMedia`, provides `isDark` |
| `ThemeProvider` localStorage | reads saved preference from `localStorage('theme-mode')` |
| `toggle()` | flips `isDark`, updates `localStorage`, toggles `.dark` on `<html>` |
| Nested consumers | multiple `useTheme()` consumers get same state |

**Validation:** `pnpm test src/contexts`

---

## Task 27: Zod Schema Validation — `src/types/`

**Model**: Claude Haiku 4.5

**Test file:** `src/types/schemas.test.ts`

Test that all Zod schemas correctly parse their corresponding JSON data:

| Schema Group | Tests |
|-------------|-------|
| Config schemas | `SiteDataSchema`, `ThemeSchema`, `CookiesSchema`, `LegalDataSchema`, `PortfolioConfigSchema`, `CategoriesSchema`, `OrderFormsSchema`, `NotFoundSchema` all parse without errors |
| Section schemas | All section schemas parse their JSON data correctly |
| Portfolio schemas | `PortfolioCaseSchema` parses case data, `ContentBlockSchema` discriminated union resolves all block types |
| Block schemas | Each individual block schema validates correct and rejects invalid data |

**Mocking notes:**
- Import schemas and test data directly; no React rendering needed
- These are pure TypeScript tests, no JSX

**Validation:** `pnpm test src/types`

---

## Summary — Part 1

| Task | Test File | Scope | Est. Tests |
|------|-----------|-------|------------|
| 0 | (setup) | Infrastructure | — |
| 1 | `src/libs/libs.test.ts` | 4 utility functions | ~20 |
| 2 | `src/types/shared/iconMap.test.ts` | ICON_MAP, resolveIcon | ~5 |
| 3 | `src/hooks/hooks.test.ts` | 8 hooks | ~25 |
| 4 | `src/contexts/ThemeContext.test.tsx` | ThemeProvider | ~5 |
| 27 | `src/types/schemas.test.ts` | All Zod schemas | ~25 |
| **Subtotal** | **5 test files** | | **~80 tests** |

## Execution Order

```
Task 0 (setup) ← MUST be first
  ├── Task 1 (utils) ← pure TS, no React — start here
  ├── Task 2 (iconMap) ← pure TS
  ├── Task 27 (schemas) ← pure TS
  ├── Task 3 (hooks) ← needs renderHook
  └── Task 4 (context) ← needs renderHook
```

## Session Strategy

Each task is designed to be completable in **one Claude session**:

1. **Start session** → Read this plan, identify which task to work on
2. **Run:** `pnpm test` to confirm existing tests pass
3. **Implement** the test file for the chosen task
4. **Run:** `pnpm test <path>` to validate
5. **Commit:** `git add <test-file> && git commit -m "test(taskN): add tests for <area>"`

To do **all Part 1 tasks in one session**, work through them in order (0 → 1 → 2 → 27 → 3 → 4), committing after each task passes. Then proceed to Part 2.
