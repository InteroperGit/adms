# PDR: E2E Mobile — Step 5: NotFound / 404 page (`mobile_notfound.spec.ts`)

**Date**: 2026-03-23
**Blocked by**: `20260323_e2eMobile_00_setup.md`
**Spec file**: `tests/e2e/mobile_notfound.spec.ts`
**Test IDs**: E11.1–E11.5 (5 tests × 2 mobile projects = 10 runs)

## Page: `NotFound`

Routes: `/404` (pre-rendered), `*` (catch-all)

Component structure (confirmed from source):

```
div.relative.min-h-screen.overflow-hidden
  div.absolute [blob top-right, primary/5]
  div.absolute [blob bottom-left, accent/5]
  div.absolute [dot pattern overlay, opacity-[0.04]]
  Container.relative.z-10
    div.text-center
      <h1
        class="text-[10rem] md:text-[14rem] font-bold ... bg-clip-text text-transparent animate-[float_3s]"
        aria-label="Error 404"
      >
        404
      </h1>
      <h2 class="text-3xl font-semibold">{title}</h2>
      <p class="text-lg text-muted-foreground">{description}</p>
      <Link class="inline-flex ... rounded-full border border-primary">{backLabel}</Link>
```

## Key mobile risk

`h1` has `text-[10rem]` (160px font size) on mobile. `overflow-hidden` on the parent
`div` clips it, but the outer `<html>` / `<body>` could still record horizontal overflow
if the heading text extends beyond the Container's padding. This is the **primary
regression this spec guards against**.

The `select-none` class prevents text selection but does not clip overflow.

## Source files to read before implementing

- `src/pages/NotFound.tsx` — confirmed above; `aria-label="Error 404"` on h1;
  back link: `<Link to={href} class="inline-flex items-center ... rounded-full border border-primary">`
- `src/types/config/notFound.ts` — check `notFoundContent.code` (expected `"404"`) and
  `notFoundContent.backHref` (expected `"/"`)

## Tests to implement

| ID | Name | How to test |
|----|------|-------------|
| E11.1 | `/404` renders `h1` with `aria-label="Error …"` | `page.goto('/404')` → `h1[aria-label^="Error"]` visible |
| E11.2 | No horizontal overflow from giant heading | `document.documentElement.scrollWidth <= window.innerWidth` |
| E11.3 | Error title `h2` visible on mobile | `h2` (text-3xl) visible |
| E11.4 | Error description `p` visible | `p.text-muted-foreground` (description text) visible |
| E11.5 | Back link visible and tappable | `a[class*="rounded-full"][class*="border-primary"]` visible; bounding box within viewport |

## Notes

- **E11.1**: use `[aria-label^="Error"]` to target the h1 — consistent with desktop E6.1/E6.2.
- **E11.2**: if this fails, the fix is to add `overflow-x-hidden` to the `<body>` or
  ensure the Container's `max-w` and `px-4` fully contain the heading. Do not skip — this
  is a real mobile regression check.
- **E11.5**: `toBeInViewport()` is more robust than a bounding box check:
  ```ts
  await expect(page.locator('a[class*="rounded-full"]')).toBeInViewport();
  ```
- Test both `/404` (explicit pre-rendered route) and an unknown route (`/nonexistent-xyz`)
  if desired — but the existing desktop E6.1/E6.2 already do this. Keep E11 focused on `/404`.

## Validation

```bash
pnpm format && pnpm lint && pnpm typecheck
pnpm exec playwright test mobile_notfound.spec.ts --project="Mobile Chrome"
pnpm exec playwright test mobile_notfound.spec.ts --project="Mobile Safari"
```

## Acceptance criteria

- [ ] `tests/e2e/mobile_notfound.spec.ts` exists with E11.1–E11.5 (5 tests)
- [ ] All 5 tests pass on `Mobile Chrome` and `Mobile Safari` (10 runs)
- [ ] `pnpm format && pnpm lint && pnpm typecheck` pass
