# Error Handling — Architecture, Debugging & Verification

## Overview

The application implements a **layered error handling** system with React Error Boundaries, global error handlers, and dev-mode error overlays.

**Goals:**
- Catch rendering errors at multiple levels (app, route, block)
- Prevent white-screen crashes
- Provide detailed debugging info in development
- Show user-friendly error messages in production
- Integrate with future error reporting services (Sentry, Rollbar, etc.)

---

## Architecture

### Layer 1: Global Error Handlers (`src/libs/globalErrorHandler.ts`)

Catches errors **outside the React tree**:
- Synchronous errors (`window.error`)
- Unhandled promise rejections (`window.unhandledrejection`)

**When it triggers:**
- Script loading errors
- Image load failures
- Third-party library errors
- Event handler errors
- Fetch/async errors without `.catch()` or `try/catch`

**In console:** Logs with `[GlobalError]` prefix + timestamp

**Integration point:** `initGlobalErrorHandlers()` called in `src/main.tsx`

---

### Layer 2: App-Level ErrorBoundary (`src/App.tsx`)

Catches rendering errors in Header, main content (Outlet), Footer, CookieBanner.

**Fallback UI:**
- **DEV mode:** `DevErrorFallback` (detailed error message + stack trace + component stack)
- **PROD mode:** `ErrorFallback` (user-friendly message from config)

**When it triggers:**
- Component rendering errors
- Lifecycle method errors
- Constructor errors

**In console:** Logs with `[ErrorBoundary]` prefix

---

### Layer 3: Route ErrorBoundary (`src/router.tsx`)

Catches rendering errors during route component rendering or data loading.

**Fallback:** `ErrorFallback` (displays in both dev and prod)

**When it triggers:**
- Errors in route components
- Errors in route loaders
- Route-specific data loading failures

---

### Layer 4: Block-Level ErrorBoundaries (`src/components/blocks/BlockRenderer.tsx`)

Wraps each portfolio block in its own ErrorBoundary.

**Fallback:** `BlockErrorFallback` (minimal placeholder: "Content could not be displayed")

**When it triggers:**
- One broken block component doesn't crash the entire portfolio case page
- Graceful degradation for complex block types (Chart, Metrics, Cards, etc.)

---

### Layer 5: Optional Component ErrorBoundaries (`src/pages/Home.tsx`)

Wraps optional/decorative components (Carousel).

**Fallback:** `SilentErrorFallback` (renders `null`, section is skipped)

**When it triggers:**
- Carousel rendering errors
- Hero animation errors
- Other optional UI elements

**Behavior:** Component silently fails; page continues without that section

---

## Development vs. Production Behavior

### Development (`import.meta.env.DEV`)

**App-level ErrorBoundary:**
- Shows `DevErrorFallback` with:
  - Error message
  - Full JavaScript stack trace
  - React component stack trace
  - Tip pointing to browser console

**Vite Dev Overlay:**
- Overlays module reload errors (not caught by ErrorBoundary)
- Shows error source file + line number
- Appears **alongside** ErrorBoundary (not suppressed)

**Console logging:**
- All errors logged with `[ErrorBoundary]` or `[GlobalError]` prefix
- Full error objects printed for inspection
- Component stack visible

**Workflow:**
1. Error occurs → ErrorBoundary catches it → `DevErrorFallback` rendered
2. Developer sees red error screen with full details
3. Stack trace points to source component
4. Browser DevTools console shows full error object
5. Vite overlay shows module reload errors in a separate UI

### Production (`import.meta.env.PROD`)

**App-level ErrorBoundary:**
- Shows `ErrorFallback` with:
  - User-friendly title (from config: `data/config/errorFallback.json`)
  - User-friendly description
  - "Go to homepage" button

**No Vite overlay:**
- Vite dev overlay is not included in production build

**Console logging:**
- Errors still logged to console (for monitoring in browser DevTools)
- User won't see console unless they open DevTools manually

**Workflow:**
1. Error occurs → ErrorBoundary catches it → `ErrorFallback` rendered
2. User sees centered, friendly error message
3. User can click "Go to homepage" or navigate away
4. Page is stable (no white-screen crash)

---

## Error Configuration

### Error Fallback Text (`data/config/errorFallback.json`)

```json
{
  "title": "Что-то пошло не так",
  "description": "Приносим извинения. Пожалуйста, попробуйте снова или вернитесь на главную страницу.",
  "resetLabel": "На главную"
}
```

Customize these strings for your client's locale and branding (white-label kit).

---

## Console Output Examples

### App-level error in development

```
[ErrorBoundary] Caught rendering error: Error: Cannot read property 'map' of undefined
 Component stack:
    at Hero (Hero.tsx:42)
    at Outlet (react-router-dom)
    at main (App.tsx:42)
```

### Global unhandled rejection

```
[GlobalError] Unhandled promise rejection at 2026-03-15T14:23:45.123Z
Error: Failed to fetch /api/data
  reason: TypeError: Network request failed
  promise: Promise { <rejected> }
```

---

## Debugging Tips

### 1. Component Stack Trace

When an error occurs, React's ErrorBoundary provides a component stack showing the path to the broken component:

```
at MyComponent (MyComponent.tsx:10)
at Parent (Parent.tsx:20)
at Grandparent (Grandparent.tsx:30)
```

Use this to quickly locate the source of the error.

### 2. Browser DevTools

- Open **Console** tab to see `[ErrorBoundary]` and `[GlobalError]` logs
- Expand error objects to inspect error message, stack, properties
- Use **Source** tab to set breakpoints and debug

### 3. Vite Error Overlay (Dev mode)

- Shows module reload failures (not caught by React)
- Clicking the error shows source file + line number
- Helpful for syntax errors and module resolution issues

### 4. Block-Level Errors

Portfolio blocks log errors but render a minimal placeholder:
- "Content could not be displayed" message appears in the block area
- Rest of page is unaffected
- Error still logged to console with `[ErrorBoundary]` prefix

---

## Error Boundary Limitations

❌ **Cannot catch:**
- Event handler errors (use global handlers)
- Asynchronous errors (use global handlers)
- Server-side rendering errors (SSG is static, no server execution)
- Errors in child Error Boundaries (child boundary handles them)

✓ **Can catch:**
- Rendering errors
- Lifecycle method errors (`componentDidMount`, `useEffect`, etc.)
- Constructor errors
- Errors in render methods

---

## Future Integrations

### Error Reporting Service (Sentry, Rollbar, etc.)

Both `ErrorBoundary` and `initGlobalErrorHandlers()` support `onError` callbacks:

```typescript
// In ErrorBoundary usage
<ErrorBoundary
  onError={(error, errorInfo) => {
    Sentry.captureException(error, {
      contexts: { react: errorInfo }
    });
  }}
>
  <App />
</ErrorBoundary>

// In globalErrorHandler
initGlobalErrorHandlers({
  onError: (error, context) => {
    Sentry.captureException(error, {
      contexts: { global: context }
    });
  }
});
```

---

## Verification & Testing

### Automated Checks

Run the automated build and lint checks:

```bash
# Type checking
pnpm typecheck
# Expected: ✓ No type errors

# Linting
pnpm lint
# Expected: ✓ No lint errors

# SSG build
pnpm build
# Expected: ✓ Build succeeds, all routes generated, no errors
```

All checks should pass. The ErrorBoundary class component is SSR/SSG-safe and doesn't prevent builds.

---

### Manual Testing in Development Mode

Start the dev server:

```bash
pnpm dev
```

Open browser to `http://localhost:5173/`

#### Test 1: App-Level ErrorBoundary (Header/Footer)

**Objective:** Verify that errors in Header or Footer are caught and display `DevErrorFallback` with full error details.

**Steps:**

1. Open `src/components/sections/header/index.tsx`

2. Add a test error in the component return:
   ```tsx
   export function Header() {
     // ... existing code ...

     if (true) {
       throw new Error('Test error in Header component');
     }

     return (
       // ... rest of component ...
     );
   ```

3. Save file (HMR will refresh)

4. **Observe:**
   - ✓ Red `DevErrorFallback` error screen appears
   - ✓ Error message visible: "Test error in Header component"
   - ✓ Full JavaScript stack trace displayed
   - ✓ React component stack visible (shows Header → App)
   - ✓ Browser DevTools console shows: `[ErrorBoundary] Caught rendering error:`
   - ✓ Vite overlay is NOT suppressed (independent error reporting still works)
   - ✗ Page does NOT white-screen

5. Revert the change (remove the `throw new Error` line)

6. File saves → HMR refreshes → Page recovers and renders normally

---

#### Test 2: Route ErrorBoundary

**Objective:** Verify that errors during route component rendering are caught by `RouteError`.

**Steps:**

1. Open `src/pages/Home.tsx`

2. Add a test error:
   ```tsx
   export default function Home() {
     throw new Error('Test error in Home route component');

     return (
       // ... rest of component ...
     );
   ```

3. Navigate to `http://localhost:5173/` (homepage)

4. **Observe:**
   - ✓ `DevErrorFallback` appears
   - ✓ Error message: "Test error in Home route component"
   - ✓ Browser console: `[RouteError] Route error caught:` prefix
   - ✓ Rest of app structure (layout, header) is still mounted

5. Revert the change

---

#### Test 3: Block-Level ErrorBoundary

**Objective:** Verify that an error in a single block shows `BlockErrorFallback`, but rest of portfolio case page renders.

**Steps:**

1. Navigate to a portfolio case page, e.g.: `http://localhost:5173/portfolio/branding/2023/03/artplex`

2. Open `src/components/blocks/HeadingBlock.tsx` (or any block component)

3. Add a test error:
   ```tsx
   export function HeadingBlock({ block }: HeadingBlockProps) {
     throw new Error('Test error in HeadingBlock');

     // ... rest of component ...
   ```

4. Navigate back to a portfolio case that has a heading block

5. **Observe:**
   - ✓ Page renders normally (no white-screen)
   - ✓ One block shows gray placeholder: "Content could not be displayed"
   - ✓ All other blocks on the same case page render correctly
   - ✓ Browser console: `[ErrorBoundary] Caught rendering error:` with block component name
   - ✓ Graceful degradation: block fails, page continues

6. Revert the change

---

#### Test 4: Carousel Silent Error (Optional Component)

**Objective:** Verify that carousel errors result in silent failure (component skipped, page continues).

**Steps:**

1. Open `src/components/sections/carousel/index.tsx`

2. Add a test error:
   ```tsx
   export function Carousel() {
     throw new Error('Test error in Carousel');

     // ... rest of component ...
   ```

3. Navigate to homepage `http://localhost:5173/`

4. **Observe:**
   - ✓ Page renders fully (no white-screen)
   - ✓ Carousel section is completely absent (silent failure)
   - ✓ Hero section appears immediately below carousel area
   - ✓ Rest of homepage renders normally
   - ✓ Browser console: `[ErrorBoundary] Caught rendering error:` (logged but no visible error UI)

5. Revert the change

---

#### Test 5: Global Error Handler (Unhandled Promise Rejection)

**Objective:** Verify that unhandled promise rejections are caught by global handler.

**Steps:**

1. Open browser DevTools → **Console** tab

2. In the console, execute:
   ```javascript
   Promise.reject(new Error('Test unhandled rejection'));
   ```

3. **Observe:**
   - ✓ Console shows: `[GlobalError] Unhandled promise rejection at ...`
   - ✓ Error message visible: "Test unhandled rejection"
   - ✓ No error UI appears (global handlers don't interrupt page flow)
   - ✓ Page continues to function normally

---

#### Test 6: Global Error Handler (Synchronous Error)

**Objective:** Verify that synchronous errors outside React (third-party scripts, event handlers) are caught.

**Steps:**

1. Open browser DevTools → **Console** tab

2. In the console, execute:
   ```javascript
   throw new Error('Test synchronous error outside React');
   ```

3. **Observe:**
   - ✓ Console shows: `[GlobalError] Synchronous error at ...`
   - ✓ Error message visible
   - ✓ No error UI appears
   - ✓ Page continues normally

---

#### Test 7: Vite Dev Overlay Independence

**Objective:** Verify that Vite's dev error overlay still works independently alongside ErrorBoundary.

**Steps:**

1. Open `src/App.tsx`

2. Introduce a **syntax error** or **module error** (not a runtime error):
   ```tsx
   // Syntax error example
   const x = {
     broken: ,  // <-- syntax error
   };
   ```

3. Save file

4. **Observe:**
   - ✓ Vite overlay appears with error details
   - ✓ Shows file name and line number
   - ✓ Overlay is **not suppressed** by ErrorBoundary
   - ✓ ErrorBoundary and Vite overlay work in parallel

5. Fix the syntax error

6. File saves → HMR recompiles → Vite overlay disappears → Page recovers

---

#### Test 8: Production Error Display

**Objective:** Verify that production mode shows user-friendly errors.

**Steps:**

1. Build production bundle:
   ```bash
   pnpm build
   ```

2. Serve the build locally:
   ```bash
   cd dist && pnpm exec serve .
   ```

3. Navigate to `http://localhost:3000/` and trigger an error (same as dev tests)

4. **Observe:**
   - ✓ User-friendly `ErrorFallback` appears (not `DevErrorFallback`)
   - ✓ User-friendly message: "Что-то пошло не так"
   - ✓ "На главную" button is clickable
   - ✓ No technical details or stack traces visible to user
   - ✓ Browser DevTools console still shows error (for monitoring)

---

### Verification Checklist

- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm build` succeeds (no errors, all routes generated)
- [ ] Test 1: App-level error shows `DevErrorFallback` (dev mode)
- [ ] Test 2: Route error shows `DevErrorFallback`
- [ ] Test 3: Block error shows `BlockErrorFallback`, rest of page works
- [ ] Test 4: Carousel error silently fails, rest of page works
- [ ] Test 5: Unhandled promise rejection logged with `[GlobalError]`
- [ ] Test 6: Synchronous error logged with `[GlobalError]`
- [ ] Test 7: Vite dev overlay still works independently
- [ ] Test 8: Production shows user-friendly `ErrorFallback`

---

## Troubleshooting

### "Vite overlay is suppressed"

**Problem:** Vite error overlay doesn't appear when there's a syntax error.

**Solution:** Vite overlay is rendered at a different level than React. If you don't see it:
1. Check browser DevTools console for errors
2. Verify HMR is working (look for "vite client connected" in console)
3. Try a simple syntax error in `src/index.css` or `vite.config.ts`

### "ErrorBoundary doesn't catch the error"

**Problem:** You throw an error in a component, but nothing happens.

**Solution:** ErrorBoundary only catches errors during **rendering**:
- ✓ In `return` statement (render phase)
- ✗ In event handlers (use global handlers instead)
- ✗ In `useEffect` (use try/catch or global handlers)

For event handler errors, test via:
```javascript
// In browser console
document.body.click();  // Trigger any click handler with error
```

### "Block error doesn't show placeholder"

**Problem:** Block component throws error, but no placeholder appears.

**Solution:**
1. Verify the block is wrapped in `ErrorBoundary` (should be automatic in `BlockRenderer.tsx`)
2. Check browser console for `[ErrorBoundary]` logs
3. Verify the error is thrown during **render**, not in an effect

---

## Related Files

- `src/components/error/ErrorBoundary.tsx` — Class component catching rendering errors
- `src/components/error/ErrorFallback.tsx` — User-friendly production fallback
- `src/components/error/DevErrorFallback.tsx` — Detailed development fallback
- `src/components/error/SilentErrorFallback.tsx` — Silent fallback (null)
- `src/libs/globalErrorHandler.ts` — Global error handler setup
- `data/config/errorFallback.json` — Error message configuration
- `src/App.tsx` — App-level ErrorBoundary wrapper
- `src/router.tsx` — Route-level ErrorBoundary via `errorElement`
- `src/components/blocks/BlockRenderer.tsx` — Block-level ErrorBoundary wrapper
- `src/pages/Home.tsx` — Carousel wrapped in silent error boundary
