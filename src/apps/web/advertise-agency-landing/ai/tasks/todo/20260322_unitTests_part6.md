# Plan: Unit Tests — Part 6: Legal Pages, Chart Sub-components & List Sub-components

**Status**: in-progress
**Date**: 2026-03-22
**Series**: 6 of N (continuation of parts 1–5)

## Goal

Add tests for the three legal pages, the Chart block sub-components (BarChart, HorizontalBarChart, LineChart, PieChart, ProgressChart, CustomTooltip, colorResolver), the List block sub-components (ChecklistBlock, OrderedListBlock, UnorderedListBlock), and the `blockAnimations` utility.

---

## Task T32: Legal pages — `src/pages/` ✅

**Model**: Claude Haiku 4.5

All three legal pages share the same `LegalPageLayout` + `LegalSection` + `LegalBlockRenderer` rendering pipeline and live in `src/pages/`.

| Test file | Component | Lines | Tests |
|-----------|-----------|-------|-------|
| `PrivacyPolicy.test.tsx` | `PrivacyPolicy` | 36 | renders page title; renders at least one legal section; renders within `LegalPageLayout` |
| `UserAgreement.test.tsx` | `UserAgreement` | 36 | renders page title; renders at least one legal section |
| `Consent.test.tsx` | `Consent` | 32 | renders page title; renders at least one legal section |

**Mock notes:**
- Mock `@/types/legal/index` to return stable fixture data (`privacyPolicyContent`, `userAgreementContent`, `consentContent`)
- Mock `LegalBlockRenderer` as a simple `<div data-testid="legal-block-renderer" />` to avoid deep rendering
- Wrap in `MemoryRouter`

**Validation:** `pnpm test src/pages/PrivacyPolicy src/pages/UserAgreement src/pages/Consent`

---

## Task T33: List block sub-components — `src/components/blocks/ListBlock/` ✅

**Model**: Claude Haiku 4.5

`ListBlock.test.tsx` already tests routing logic. These are the individual renderers.

| Test file | Component | Lines | Tests |
|-----------|-----------|-------|-------|
| `UnorderedListBlock.test.tsx` | `UnorderedListBlock` | 35 | renders `<ul>` with correct list items; applies correct bullet/disc class |
| `OrderedListBlock.test.tsx` | `OrderedListBlock` | 36 | renders `<ol>` with correct list items; applies decimal numbering class |
| `ChecklistBlock.test.tsx` | `ChecklistBlock` | 58 | renders checked and unchecked items; checked item has tick icon/class; unchecked item has empty circle class; renders item text |

**Validation:** `pnpm test src/components/blocks/ListBlock`

---

## Task T34: Chart block sub-components — `src/components/blocks/ChartBlock/`

**Model**: Claude Sonnet 4.6

`ChartBlock.test.tsx` already tests routing by chart type. These test the individual chart renderers.

All Recharts components must be mocked:
```ts
vi.mock('recharts', () => ({
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  XAxis: () => null, YAxis: () => null, CartesianGrid: () => null,
  Tooltip: () => null, Legend: () => null, ResponsiveContainer: ({ children }: any) => <>{children}</>,
  // ... etc for each chart type
}));
```

| Test file | Component | Lines | Tests |
|-----------|-----------|-------|-------|
| `BarChart.test.tsx` | `BarChart` | 77 | renders chart container; renders correct number of bars per series; handles empty data |
| `HorizontalBarChart.test.tsx` | `HorizontalBarChart` | 88 | renders chart with horizontal layout; correct number of bars; renders legend when series has labels |
| `LineChart.test.tsx` | `LineChart` | 96 | renders chart container; renders correct number of lines per series; handles single-series |
| `PieChart.test.tsx` | `PieChart` | 274 | renders pie chart; renders legend items; handles donut mode (inner radius > 0) |
| `ProgressChart.test.tsx` | `ProgressChart` | 86 | renders progress bars with correct widths; renders labels and values; handles 0% and 100% |
| `CustomTooltip.test.tsx` | `CustomTooltip` | 40 | renders null when `active` is false; renders label and payload values when active |

**colorResolver utility:**

| Test file | Module | Lines | Tests |
|-----------|--------|-------|-------|
| `colorResolver.test.ts` | `colorResolver.ts` | 39 | resolves named colors (primary, accent); resolves hex passthrough; handles unknown name gracefully |

**Validation:** `pnpm test src/components/blocks/ChartBlock`

---

## Task T35: blockAnimations utility — `src/components/blocks/blockAnimations.ts`

**Model**: Claude Haiku 4.5

| Test file | Module | Lines | Tests |
|-----------|--------|-------|-------|
| `blockAnimations.test.ts` | `blockAnimations.ts` | 20 | exports expected animation class strings/objects; stagger delay increments correctly per index; returns empty string for index 0 (no delay) |

**Validation:** `pnpm test src/components/blocks/blockAnimations`

---

## Summary

| Task | Scope | Est. tests |
|------|-------|------------|
| T32 | 3 legal pages | ~9 |
| T33 | 3 list sub-components | ~12 |
| T34 | 6 chart sub-components + colorResolver | ~22 |
| T35 | blockAnimations utility | ~5 |
| **Total** | | **~48 tests** |

## Execution Order

T32 → T33 → T34 → T35 (all independent).

## Validation (each task)

```bash
pnpm format && pnpm lint && pnpm typecheck && pnpm test <path>
```

Final after all tasks:

```bash
pnpm format && pnpm lint && pnpm typecheck && pnpm build
```
