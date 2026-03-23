# PDR: E2E Mobile — Step 4: Legal pages (`mobile_legal.spec.ts`)

**Date**: 2026-03-23
**Blocked by**: `20260323_e2eMobile_00_setup.md`
**Spec file**: `tests/e2e/mobile_legal.spec.ts`
**Test IDs**: E10.1–E10.9 (9 tests × 2 mobile projects = 18 runs)

## Pages: PrivacyPolicy, UserAgreement, Consent

Routes: `/privacy-policy`, `/user-agreement`, `/consent`

All three share an identical component structure:

```
App shell (Header, Footer)
LegalPageLayout
  <main class="mx-auto max-w-3xl px-4 py-12">
    <h1 class="mb-2 text-3xl font-bold">{title}</h1>
    <p class="mb-10 text-sm text-muted-foreground">Дата вступления в силу: {date}</p>
    <LegalBlockRenderer>
      {blocks: p | ul | ol | dl | contact}
    </LegalBlockRenderer>
    <p class="mt-10 border-t ...">Версия {version}</p>
  </main>
```

## Source files to read before implementing

- `src/components/ui/legal/LegalPageLayout.tsx` — confirms `<main class="mx-auto max-w-3xl px-4 py-12">`,
  `<h1 class="...text-3xl...">`, version footer `<p>`
- `src/components/ui/legal/LegalBlockRenderer.tsx` — understand what block types render;
  check if `dl` (definition list) or table-like structures could cause horizontal overflow

## Tests to implement

| ID | Name | How to test |
|----|------|-------------|
| E10.1 | `/privacy-policy` renders `h1` on mobile | `page.goto('/privacy-policy')` → `main h1` visible |
| E10.2 | `/privacy-policy` has no horizontal overflow | `document.documentElement.scrollWidth <= window.innerWidth` |
| E10.3 | `/user-agreement` renders `h1` on mobile | `page.goto('/user-agreement')` → `main h1` visible |
| E10.4 | `/user-agreement` has no horizontal overflow | `document.documentElement.scrollWidth <= window.innerWidth` |
| E10.5 | `/consent` renders `h1` on mobile | `page.goto('/consent')` → `main h1` visible |
| E10.6 | `/consent` has no horizontal overflow | `document.documentElement.scrollWidth <= window.innerWidth` |
| E10.7 | Legal pages have site header with home link | on each legal page → `header#main-nav` visible + `a[href="/"]` inside it |
| E10.8 | Legal page version footer text visible | `main p:last-child` or `p.border-t` visible and contains "Версия" |
| E10.9 | Legal page text is readable (not truncated) | `main h1` `offsetWidth <= main.offsetWidth` — heading not wider than container |

## Notes

- **E10.7** can be a single test that iterates all 3 routes or 3 separate assertions.
  Prefer 3 separate `test()` calls for clearer failure reporting. OR parameterise:
  ```ts
  for (const route of ['/privacy-policy', '/user-agreement', '/consent']) {
    test(`E10.7 ${route} has site header`, async ({ page }) => { ... });
  }
  ```
- **E10.9** is a proxy for "heading doesn't overflow its container". Use `page.evaluate`:
  ```ts
  const ok = await page.evaluate(() => {
    const h1 = document.querySelector('main h1');
    const main = document.querySelector('main');
    return h1 && main ? h1.scrollWidth <= main.clientWidth : false;
  });
  expect(ok).toBe(true);
  ```
- E10.2/E10.4/E10.6 are the same overflow assertion on different routes — don't merge
  them into one test, as a failure should identify the specific page.

## Validation

```bash
pnpm format && pnpm lint && pnpm typecheck
pnpm exec playwright test mobile_legal.spec.ts --project="Mobile Chrome"
pnpm exec playwright test mobile_legal.spec.ts --project="Mobile Safari"
```

## Acceptance criteria

- [ ] `tests/e2e/mobile_legal.spec.ts` exists with E10.1–E10.9 (9 tests)
- [ ] All 9 tests pass on `Mobile Chrome` and `Mobile Safari` (18 runs)
- [ ] `pnpm format && pnpm lint && pnpm typecheck` pass
