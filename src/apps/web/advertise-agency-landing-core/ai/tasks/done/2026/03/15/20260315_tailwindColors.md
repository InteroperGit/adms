# Plan: Support Tailwind Semantic Colors in JSON Data

**Date**: 2026-03-15
**Status**: TODO
**Branch**: `feat/tailwind-colors-in-json`

## Problem

Portfolio case JSON files (`data/content/portfolio/**/*.json`) currently use **raw hex colors** for styling list-block striped rows (e.g., `"#e0e7ff"`, `"#312e81"`). These are applied as inline `style` attributes, which:

1. **Break dark mode** — hex values are static, can't adapt to `.dark` class
2. **Break white-label** — new clients must manually recolor every case file
3. **Are inconsistent** — `BlockColorSchema` already supports `'primary'`/`'accent'` semantic types, but `ListBlockSchema` color fields are raw strings with no semantic option

## Goal

Allow JSON data authors to write Tailwind semantic color names (e.g., `"primary"`, `"accent"`, `"muted"`) alongside hex values. Components resolve semantic names to the correct CSS variable at render time.

## Scope

Color fields affected (all in `data/content/portfolio/**/*.json`):

| Schema | Fields | Current Format | Applied In |
|---|---|---|---|
| `ListBlockSchema` | `colors.even.background`, `colors.even.text`, `colors.odd.background`, `colors.odd.text` | hex string (`#e0e7ff`) | `UnorderedListBlock.tsx`, `ChecklistBlock.tsx`, `OrderedListBlock.tsx` — inline `style` |
| `MetricsColorSchema` | `metric`, `label`, `description` | Tailwind class string (`text-white`) | `MetricsBlock.tsx` — `className` |
| `BlockColorSchema` | `type` enum already has `primary`/`accent` | enum | `MetricsBlock.tsx`, `CardsBlock.tsx`, `ProgressChart.tsx` — `className` |

**Primary target**: `ListBlockSchema` color fields — the only place where hex values are used as inline styles.

**Secondary target**: `MetricsColorSchema` text fields — already use Tailwind classes, but should be documented/validated as accepting semantic tokens too.

`BlockColorSchema` already supports semantic types and needs no changes.

---

## Implementation Plan

### Step 1: Create a color resolver utility

**File**: `src/libs/resolveColor.ts`

Create a function that detects whether a color string is a hex value or a Tailwind semantic token, and returns the appropriate CSS value.

```ts
/** Known semantic color tokens from @theme inline in index.css */
const SEMANTIC_COLORS: Record<string, string> = {
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  'surface-dark': 'hsl(var(--surface-dark, var(--foreground)))',
  card: 'hsl(var(--card))',
  'card-foreground': 'hsl(var(--card-foreground))',
  primary: 'hsl(var(--primary))',
  'primary-foreground': 'hsl(var(--primary-foreground))',
  secondary: 'hsl(var(--secondary))',
  'secondary-foreground': 'hsl(var(--secondary-foreground))',
  muted: 'hsl(var(--muted))',
  'muted-foreground': 'hsl(var(--muted-foreground))',
  accent: 'hsl(var(--accent))',
  'accent-foreground': 'hsl(var(--accent-foreground))',
  destructive: 'hsl(var(--destructive))',
  'destructive-foreground': 'hsl(var(--destructive-foreground))',
  border: 'hsl(var(--border))',
  input: 'hsl(var(--input))',
  ring: 'hsl(var(--ring))',
};

/**
 * Resolves a color string to a CSS value.
 * - Hex values (`#abc`, `#aabbcc`, `#aabbccdd`) → passed through as-is
 * - Semantic tokens (`primary`, `accent`, `muted-foreground`) → `hsl(var(--<token>))`
 * - Semantic with opacity (`primary/50`) → `hsl(var(--<token>) / 0.5)`
 * - Already a CSS value (starts with `hsl(`, `rgb(`, `var(`) → passed through
 */
export function resolveColor(value: string): string;
```

**Why a utility instead of Tailwind classes?** List-block colors are applied as inline `style` props because they come from per-row JSON data. Tailwind classes would require dynamic class generation which Tailwind v4 can't tree-shake. The resolver converts semantic names to `hsl(var(...))` CSS values that work in `style` props and automatically adapt to dark mode.

### Step 2: Update ListBlock components to use resolver

**Files**:
- `src/components/blocks/ListBlock/UnorderedListBlock.tsx`
- `src/components/blocks/ListBlock/ChecklistBlock.tsx`
- `src/components/blocks/ListBlock/OrderedListBlock.tsx`

Replace direct hex usage:
```ts
// Before
const bgStyle = rowColors?.background
  ? { backgroundColor: rowColors.background }
  : undefined;

// After
import { resolveColor } from '@/libs/resolveColor';

const bgStyle = rowColors?.background
  ? { backgroundColor: resolveColor(rowColors.background) }
  : undefined;
```

This is **fully backward-compatible** — existing hex values pass through unchanged.

### Step 3: Update Zod schemas with documentation

**File**: `src/types/blocks/list.ts`

Update JSDoc comments on color fields to document the new accepted formats:

```ts
/** Background color — hex (#f3f4f6), semantic token (primary, accent, muted), or token/opacity (primary/20) */
background: z.string().optional(),
/** Text color — hex (#1f2937), semantic token (foreground, primary-foreground), or token/opacity (accent/80) */
text: z.string().optional(),
```

No schema shape changes needed — fields remain `z.string().optional()`.

### Step 4: Update portfolio JSON data (optional migration)

**Files**: `data/content/portfolio/**/*.json` (11 case files)

Optionally replace hex colors that match theme tokens with semantic names. Examples:

```jsonc
// Before
"colors": {
  "even": { "background": "#f65314", "text": "#ffffff" },
  "odd":  { "background": "#ffffff", "text": "#1f2937" }
}

// After (dark-mode compatible)
"colors": {
  "even": { "background": "primary", "text": "primary-foreground" },
  "odd":  { "background": "background", "text": "foreground" }
}
```

Cases using custom hex colors that don't map to a theme token can stay as hex — the resolver handles both.

### Step 5: Update schema examples

**File**: `data/_schema/examples/portfolio/portfolio.example.json`

Add examples showing both hex and semantic token usage in the list block `colors` section. Show the `token/opacity` syntax too.

### Step 6: Update validation script (optional)

**File**: `scripts/validate.ts`

If desired, add a soft warning when a hex color in list blocks matches a known theme token, suggesting the semantic name instead. This is non-blocking — just advisory.

---

## Files Changed (summary)

| File | Change |
|---|---|
| `src/libs/resolveColor.ts` | **NEW** — color resolver utility |
| `src/components/blocks/ListBlock/UnorderedListBlock.tsx` | Use `resolveColor()` on style values |
| `src/components/blocks/ListBlock/ChecklistBlock.tsx` | Use `resolveColor()` on style values |
| `src/components/blocks/ListBlock/OrderedListBlock.tsx` | Use `resolveColor()` on style values |
| `src/types/blocks/list.ts` | Update JSDoc to document semantic tokens |
| `data/_schema/examples/portfolio/portfolio.example.json` | Add semantic color examples |
| `data/content/portfolio/**/*.json` | Migrate hex → semantic where applicable (optional) |

## Dark Mode Benefit

With semantic tokens, list-block colors automatically respond to dark mode because they resolve to CSS custom properties that change under `.dark`:

```css
:root { --primary: 17 93% 52%; }
.dark { --primary: 17 95% 60%; }
```

`resolveColor("primary")` → `hsl(var(--primary))` — adapts automatically.

## Design Decisions

1. **Utility function, not Tailwind classes** — List-block colors are per-row data applied via `style` prop. Dynamic Tailwind classes would need `safelist` config and defeat tree-shaking. `hsl(var(...))` in `style` is the correct approach.

2. **Backward compatible** — Hex values still work unchanged. No migration required; can be done incrementally.

3. **Opacity syntax** — `primary/50` → `hsl(var(--primary) / 0.5)` mirrors Tailwind's `bg-primary/50` pattern, keeping the JSON authoring experience familiar.

4. **No schema breaking changes** — Color fields remain `z.string()`. Semantic resolution happens at render time, not validation time.

5. **Single source of truth** — The `SEMANTIC_COLORS` map in `resolveColor.ts` mirrors the `@theme inline` block in `index.css`. If a new theme token is added, it needs to be added in both places.
