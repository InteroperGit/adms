# PDR: E2E Mobile — Step 3: Portfolio case page (`mobile_portfolio_case.spec.ts`)

**Date**: 2026-03-23
**Blocked by**: `20260323_e2eMobile_00_setup.md`
**Spec file**: `tests/e2e/mobile_portfolio_case.spec.ts`
**Test IDs**: E9.1–E9.6 (6 tests × 2 mobile projects = 12 runs)

## Page: `PortfolioCasePage`

Route: `/portfolio/:categorySlug/:year/:month/:caseSlug`

Component tree:
```
BreadCrumbs           ← 4-level path: Home → Portfolio → Category → Case Title
CaseHero              ← <section> with h1 (text-3xl md:text-5xl), optional full-bleed image
CaseOverview          ← <section> metadata grid: grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
  [client, category, year, services] items
Container
  BlockRenderer[]     ← arbitrary content blocks: ParagraphBlock, ImageBlock, TableBlock,
                         ChartBlock (Recharts), ListBlock, GalleryBlock — overflow risk
CaseCTA               ← <section> centered h2 + subtitle + <Button asChild> wrapping <a>
```

## Source files to read before implementing

- `src/components/portfolio/CaseHero.tsx` — `<section>` (no id), `<h1 class="...text-3xl...">`;
  in image mode: `relative bg-neutral-900 py-24` with absolutely positioned image overlay
- `src/components/portfolio/CaseOverview.tsx` — `<section class="border-b border-border py-16">`;
  inner grid: `grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4`; 4 `<div>` children
- `src/components/portfolio/CaseCTA.tsx` — `<section class="py-20">` → `<a href={cta.href}>` button
- `src/components/ui/navigation/BreadCrumbs.tsx` — `nav[aria-label="Breadcrumb"]`;
  layout `flex-col sm:flex-row` — stacks vertically on mobile, no overflow risk
- `src/components/blocks/BlockRenderer.tsx` — understand which block types could cause
  horizontal overflow (TableBlock, ChartBlock have fixed dimensions)
- `src/components/blocks/TableBlock.tsx` — check if wrapped in `overflow-x-auto`
- `src/components/blocks/ChartBlock/index.tsx` — check if chart container is responsive

## How to get a valid case URL

Navigate to `/portfolio`, find first `article a[href^="/portfolio/"]`, get its href,
then `page.goto(href)`. Wrap in a `beforeEach` or a helper used by all E9 tests.

```ts
async function getCaseUrl(page: Page): Promise<string> {
  await page.goto('/portfolio');
  await page.waitForLoadState('networkidle');
  const cardLink = page.locator('article a[href^="/portfolio/"]').first();
  return await cardLink.getAttribute('href') as string;
}
```

## Tests to implement

| ID | Name | How to test |
|----|------|-------------|
| E9.1 | CaseHero `h1` visible on mobile | navigate to case URL → `h1` visible (rendered as `text-3xl` on mobile) |
| E9.2 | Breadcrumbs render without horizontal overflow | `nav[aria-label="Breadcrumb"]` visible; `scrollWidth <= clientWidth` of breadcrumb container |
| E9.3 | CaseOverview shows all 4 metadata items | `section.border-b` grid has 4 visible `<div>` children (client, category, year, services) |
| E9.4 | CaseCTA button visible and within viewport | `section.py-20 a` (CTA button) visible; bounding box `x + width <= viewport.width` |
| E9.5 | No horizontal overflow in page content | `document.documentElement.scrollWidth <= window.innerWidth` after full page load |
| E9.6 | Breadcrumb back link navigates to portfolio | click `a[href="/portfolio"]` in breadcrumb → URL becomes `/portfolio` |

## Notes

- **E9.3**: use `page.locator('section.border-b div')` or count `<p class*="uppercase">` labels.
  More robust: assert the text of labels (client, category, year, services) are all visible.
- **E9.5** is the most important test — `TableBlock` and `ChartBlock` are high-risk for
  overflow on 375px. If this fails, inspect which block causes the overflow.
  `TableBlock` should have `overflow-x-auto` wrapper — verify in source.
- **E9.4** bounding box check: use `page.evaluate` or Playwright's `toBeInViewport()`.

## Validation

```bash
pnpm format && pnpm lint && pnpm typecheck
pnpm exec playwright test mobile_portfolio_case.spec.ts --project="Mobile Chrome"
pnpm exec playwright test mobile_portfolio_case.spec.ts --project="Mobile Safari"
```

## Acceptance criteria

- [x] `tests/e2e/mobile_portfolio_case.spec.ts` exists with E9.1–E9.6 (6 tests)
- [x] All 6 tests pass on `Mobile Chrome` and `Mobile Safari` (12 runs)
- [x] `pnpm format && pnpm lint && pnpm typecheck` pass
