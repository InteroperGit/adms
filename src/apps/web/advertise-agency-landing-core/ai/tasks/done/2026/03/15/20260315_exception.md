# Plan: Common unhandled exception mechanism

**Status**: pending
**Date**: 2026-03-15

## Goal

Implement a unified mechanism for catching and handling unhandled exceptions across the application. Currently there are zero safety nets: no React ErrorBoundary, no global `window.onerror` / `unhandledrejection` listeners, no route-level `errorElement`, and no fallback UI for component crashes. A single rendering error in any component crashes the entire page with a white screen.

## Current State

- **No React ErrorBoundary** — component rendering errors propagate uncaught, killing the entire React tree
- **No global error listeners** — `window.onerror` and `unhandledrejection` events are not handled; errors in async code (promises, event handlers) vanish silently
- **No route-level error handling** — `src/router.tsx` defines no `errorElement` on routes; react-router's default behavior on route component errors is an unrecoverable crash
- **No error reporting** — no Sentry, no error tracking; production errors are invisible
- **Inline null-returns** — `BlockRenderer.tsx` and `OrderFormBlock.tsx` return `null` for unknown types with dev-only `console.warn()`; this is graceful degradation, not error handling
- **Strong compile-time validation** — Zod schemas validate all JSON at parse/build time; runtime data errors are unlikely but rendering errors are still possible (logic bugs, DOM issues, third-party script interference)
- **SSG context** — the app is fully static with no data fetching; the error surface is primarily: rendering bugs, broken third-party scripts (analytics), and stale cached pages after deploys

## Steps

### 1. Create a reusable ErrorFallback UI component

Create `src/components/ui/ErrorFallback.tsx`:
- Accepts props: `title?: string`, `description?: string`, `resetLabel?: string`, `onReset?: () => void`
- Centered layout with error icon, title, description, and a "Try again" / "Go to homepage" button
- Uses `bg-background`, semantic color tokens, dark-mode safe
- Minimal — no data imports, no context dependencies (must render even when providers crash)
- Default text in Russian matching the site language (hardcoded, not from JSON — error fallback must work even if data parsing fails)

### 2. Create a class-based React ErrorBoundary component

Create `src/components/ErrorBoundary.tsx`:
- React class component (functional components cannot be error boundaries as of React 19)
- Wraps children; catches rendering errors via `componentDidCatch` + `getDerivedStateFromError`
- Renders `<ErrorFallback />` on error with a "reset" action that clears error state
- Logs caught error + componentStack to console in all environments
- Accepts optional props:
  - `fallback?: ReactNode` — custom fallback UI override
  - `onError?: (error: Error, errorInfo: ErrorInfo) => void` — callback for future error reporting integration
  - `resetKeys?: unknown[]` — when any key changes, auto-reset the error state (useful for route changes)

### 3. Wrap the app root in ErrorBoundary

In `src/App.tsx`:
- Wrap the entire content (inside `ThemeProvider` but around everything else) with `<ErrorBoundary>`
- This catches any rendering error from Header, Footer, page content, or child routes
- The ErrorBoundary renders outside the broken tree, so fallback UI always shows

```tsx
// src/App.tsx — conceptual structure
<ThemeProvider>
  <ErrorBoundary>
    <Header />
    <main>
      <Outlet />
    </main>
    <Footer />
    <CookieBanner />
  </ErrorBoundary>
</ThemeProvider>
```

### 4. Add route-level errorElement

In `src/router.tsx`:
- Add `errorElement: <ErrorFallback />` to the root route layout
- This catches errors thrown during route component rendering/loading (react-router specific)
- Use `useRouteError()` inside a thin wrapper component to extract and display the error message

Create `src/pages/RouteError.tsx`:
- Uses `useRouteError()` from react-router-dom
- Renders `<ErrorFallback />` with the error message
- Handles both `Error` objects and `Response` objects (react-router throws Response for status codes)

### 5. Add global unhandled error listeners

Create `src/libs/globalErrorHandler.ts`:
- Exports an `initGlobalErrorHandlers()` function
- Registers `window.addEventListener('error', ...)` — catches synchronous errors outside React tree (script errors, image load failures, etc.)
- Registers `window.addEventListener('unhandledrejection', ...)` — catches unhandled promise rejections
- Logs to `console.error` with structured format: `[GlobalError]` prefix, timestamp, error object
- Provides a pluggable `onError` callback for future error reporting service integration (Sentry, etc.)
- Only runs client-side (guards against SSG/SSR execution with `typeof window !== 'undefined'`)

Call `initGlobalErrorHandlers()` in `src/main.tsx` or at the top of `src/App.tsx` (before render).

### 6. Add granular ErrorBoundary around portfolio blocks

In `src/components/blocks/BlockRenderer.tsx`:
- Wrap each individual block render in `<ErrorBoundary>` with a minimal inline fallback
- A broken block should not crash the entire portfolio case page — just that one block shows an error message
- Fallback: a subtle "Content could not be displayed" placeholder styled consistently with the block area

This is the highest-value granular boundary because portfolio case content is the most dynamic part of the site (many block types, complex rendering).

### 7. Add ErrorBoundary around Carousel

In `src/components/sections/Carousel.tsx` or in `src/App.tsx` where Carousel is rendered:
- Wrap `<Carousel />` in `<ErrorBoundary>` with a silent fallback (empty div or null)
- The carousel is complex (auto-advance, transitions, touch events) and its failure should not take down the homepage
- Fallback: renders nothing — the page flows without the carousel, Hero section remains visible below

### 8. Dev-mode error overlay integration

Vite already provides an error overlay in development. Verify:
- The ErrorBoundary does not suppress Vite's dev overlay (it should not, since Vite intercepts at a different level)
- `componentDidCatch` logs the full error + component stack to console so developers can debug
- In development, optionally render a more detailed fallback showing the error message and stack trace (behind `import.meta.env.DEV` guard)

### 9. Verify

- `pnpm typecheck` — no type errors
- `pnpm lint` — no lint errors
- `pnpm build` — SSG build succeeds (ErrorBoundary class component is SSR-safe)
- Manual test in dev: intentionally throw in a component → verify ErrorFallback renders, page does not white-screen
- Manual test: throw in a block component → verify only that block shows error, rest of page works
- Verify Vite dev overlay still works alongside ErrorBoundary

## Files Affected

| Action | File |
|--------|------|
| **Create** | `src/components/ui/ErrorFallback.tsx` |
| **Create** | `src/components/ErrorBoundary.tsx` |
| **Create** | `src/pages/RouteError.tsx` |
| **Create** | `src/lib/globalErrorHandler.ts` |
| **Modify** | `src/App.tsx` — wrap content in `<ErrorBoundary>` |
| **Modify** | `src/router.tsx` — add `errorElement` to root route |
| **Modify** | `src/components/blocks/BlockRenderer.tsx` — per-block ErrorBoundary |
| **Modify** | `src/App.tsx` or Carousel usage — wrap Carousel in ErrorBoundary |
| **Modify** | `src/main.tsx` — call `initGlobalErrorHandlers()` |

## Architecture Notes

- **No external dependencies** — pure React class component ErrorBoundary, no `react-error-boundary` package (avoids an extra dep for a simple use case)
- **Hardcoded fallback text** — error fallback UI must not depend on JSON data or Zod parsing (those could be the source of the error)
- **Layered boundaries** — App-level (catches everything) → route-level (catches route component errors) → block-level (isolates individual content blocks)
- **Future-ready** — `onError` callback allows plugging in Sentry / error reporting without changing boundary components
- **SSG-safe** — global listeners only attach client-side; ErrorBoundary class component renders correctly during SSG

## Open Questions

1. **Error reporting service**: Should we integrate Sentry or a similar service now, or just prepare the `onError` hooks for future integration?
2. **Analytics**: Should caught errors be sent to Yandex Metrika as custom events, or is console logging sufficient for now?
3. **Carousel fallback**: Silent (render nothing) or show a static placeholder image?
4. **Block error fallback**: Styled placeholder with message, or completely invisible (null)?
