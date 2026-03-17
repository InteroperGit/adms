# Dark Mode Implementation

## Context & Hook System

**ThemeContext** (`src/contexts/ThemeContext.tsx`):
- Exports `ThemeProvider` component + `ThemeContext` (co-located intentionally)
- Reads `localStorage('theme-mode')` for user preference
- Falls back to system preference via `matchMedia('(prefers-color-scheme: dark)')`
- Toggles `.dark` class on `<html>` element
- Provides `{ isDark: boolean; toggle: () => void }` to context consumers

**useTheme hook** (`src/hooks/useTheme.ts`):
- Returns `{ isDark: boolean; toggle: () => void }`
- Wraps direct context access — use this everywhere instead of `useContext(ThemeContext)` directly

**Usage:**
```typescript
const { isDark, toggle } = useTheme();
```

## CSS System

**@variant declaration** (`src/index.css`):
```css
@variant dark (&:where(.dark, .dark *));
```
This enables Tailwind's `dark:` prefix after `@import 'tailwindcss'` with Tailwind v4.

**Semantic color tokens:**
- Use `bg-background` for page/section backgrounds
- Use `bg-card` for elevated card surfaces
- Use `bg-foreground dark:bg-neutral-950` for always-dark surfaces (footer, advantages section)
- **Never** use raw `bg-white` — breaks dark mode

## Theme Configuration

**data/config/theme.json** supports optional `darkColors` key:
```json
{
  "colors": { ... },
  "darkColors": {
    "primary": "hsl(250, 90%, 50%)",
    "background": "hsl(250, 20%, 10%)",
    ...
  },
  "borderRadius": { ... },
  "fonts": { ... }
}
```

If `darkColors` is omitted, dark mode uses standard Tailwind defaults.

## Build-Time Plugin

**themePlugin.ts** processes `theme.json` at build time:
1. Reads `theme.darkColors` (if present)
2. Emits `.dark { --color-primary: ...; --color-background: ...; }` CSS block
3. Injects anti-FOUC (Flash of Unstyled Content) script into `<html>` `<head>` **before** font loads
   - Script reads `localStorage('theme-mode')` and applies `.dark` class immediately
   - Prevents white flash on dark-mode users' first page load

The injected script runs synchronously before the page renders, ensuring theme is applied before content is visible.

## Components Using Dark Mode

**Header** (`header/index.tsx`):
- Calls `useTheme()` → destructures `isDark` + `toggle`
- Passes to `HeaderDesktopNav` + `HeaderMobileNav` for conditional styling
- Sun/Moon icon toggle button changes theme on click

**Testimonials** (`testimonials/`):
- Uses `isDark` to conditionally render light/dark backgrounds or accent colors

**Contact** (`contact/`):
- Uses `isDark` for form styling adjustments

## CSS Variables

Tailwind color tokens are stored as CSS variables (injected by `themePlugin.ts`):
```css
:root {
  --color-primary: hsl(14, 100%, 50%);
  --color-accent: hsl(263, 84%, 52%);
  --color-background: hsl(0, 0%, 100%);
  /* ... */
}

.dark {
  --color-primary: hsl(250, 90%, 50%);
  --color-background: hsl(250, 20%, 10%);
  /* ... */
}
```

These variables are consumed by Tailwind via `theme.colors` in `tailwind.config.ts`.

## Disabling Dark Mode

If dark mode is not needed:
1. Remove `ThemeProvider` from `src/main.tsx`
2. Delete `src/contexts/ThemeContext.tsx` + `src/hooks/useTheme.ts`
3. Remove `@variant dark` declaration from `src/index.css`
4. Delete `darkColors` from `data/config/theme.json`
5. Remove dark-mode logic from `themePlugin.ts`
6. Delete theme toggle buttons from Header components
