# Code Conventions & Best Practices

## File Naming

- **Components**: `PascalCase` — e.g., `PortfolioCard.tsx`, `Header.tsx`
- **Other source files** (hooks, utils, type modules, helpers): `camelCase` — e.g., `portfolioConfig.ts`, `useScrolled.ts`, `categorySlug.ts`
- **Plan files** in `ai/tasks/`: `NNN_planName.md` — zero-padded number (3 digits) + camelCase name — e.g., `006_portfolioPage.md`

## Import Conventions

- **Type modules**: import from `@/types/` (never `@data/`)
  ```typescript
  import { heroContent } from '@/types/sections/hero';
  import { categories } from '@/types/config/categories';
  ```
- **Utilities**: import from `@/lib/`
  ```typescript
  import { cn } from '@/lib/utils';
  import { categorySlug } from '@/lib/categorySlug';
  ```
- **Components**: use relative or `@/` alias paths
  ```typescript
  import { Container } from '@/components/ui/container';
  import { PortfolioCard } from './PortfolioCard';
  ```
- **Path aliases**: `@/` → `src/`, `@data` → `data/content`

## CSS & Styling

**Tailwind tokens (semantic):**
- `bg-background` — page/section background
- `bg-card` — elevated card surface
- `bg-foreground` — always-dark footer + advantages
- `text-foreground` — primary text
- `text-muted-foreground` — secondary/muted text
- `border-border` — dividers, borders
- `bg-primary` — brand color buttons
- `text-primary` — brand color text

**Never use:**
- Raw `bg-white` — use `bg-background` or `bg-card` (breaks dark mode)
- Raw color hex values — use Tailwind tokens from `theme.json`

**cn() helper:**
- Only use when needed:
  - Conditional classes: `cn('base', isDark && 'dark-variant')`
  - Merging external `className`: `cn(defaultClasses, className)`
  - Long multi-expression strings (readability)
- Don't overuse — single Tailwind string is fine

**Responsive variants:**
- Use Tailwind's responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`
- Consistency: mobile-first — write base styles, then add responsive overrides

## Control Flow & Code Structure

**Curly braces always:**
- Every `if`, `else`, `for`, `while` body must use curly braces
- Body always on new line (enforced by ESLint)

```typescript
// ✅ Correct
if (condition) {
  doSomething();
}

// ❌ Wrong
if (condition) doSomething();
```

**Named condition variables:**
- Extract non-trivial boolean expressions into named `const`
- Improves readability and makes logic reusable

```typescript
// ✅ Good
const hasUnused = unused.length > 0;
const isValidEmail = email.includes('@') && email.length > 5;
if (hasUnused && isValidEmail) {
  proceed();
}

// ❌ Avoid
if (unused.length > 0 && email.includes('@') && email.length > 5) {
  proceed();
}
```

## Type & Data Patterns

**Zod schemas & exports:**
- Each type module exports: a **Zod schema**, inferred TypeScript type, and parsed const
- **Do not use `satisfies`** for data consts — Zod parse replaces it

```typescript
export const HeroSchema = z.object({
  title: z.string(),
  description: z.string(),
  cta: z.object({ text: z.string(), href: z.string() }),
});

export type Hero = z.infer<typeof HeroSchema>;

export const heroContent = HeroSchema.parse(
  import('@data/sections/hero.json', { assert: { type: 'json' } })
);
```

**Data flow:**
- JSON data lives in `data/content/` (gitignored except `_schema/`)
- Components **never** import from `@data/` directly — always via `src/types/`
- Type modules are the bridge: parse JSON, validate with Zod, expose to components

## React 19 Conventions

**Native DOM event types:**
- React 19 removed synthetic event types (`React.FormEvent`, `React.MouseEvent`, etc.)
- Use native browser types instead:

```typescript
// ✅ Correct (React 19)
function handleSubmit(e: SubmitEvent) { /* ... */ }
function handleClick(e: MouseEvent) { /* ... */ }
function handleInput(e: InputEvent) { /* ... */ }

// ❌ Deprecated (React 18 and earlier)
function handleSubmit(e: React.FormEvent) { /* ... */ }
```

**Icon resolution:**
- Never import icons directly: `import { Settings } from 'lucide-react'`
- Always use `resolveIcon()` from centralized `ICON_MAP`:

```typescript
import { resolveIcon } from '@/types/shared/iconMap';

const IconComponent = resolveIcon(data.iconKey); // resolveIcon('settings') → Settings
```

## Scripts & Build-Time Code

**New scripts go in `scripts/`:**
- Included in `tsconfig.node.json` (separate compiler config)
- Use `import * as path from 'path'` — `esModuleInterop` is off
- Write as proper modules (CommonJS not required)

Example:
```typescript
// scripts/myScript.ts
import * as path from 'path';
import { readFileSync } from 'fs';

const dataDir = path.resolve(process.cwd(), 'data');
console.log(readFileSync(path.join(dataDir, 'config.json'), 'utf-8'));
```

## Component Structure

**Section components:**
- Self-contained in `src/components/sections/`
- Use `Container` for consistent width/padding
- Import section data from `@/types/` (never `@data/`)
- No internal logic — just layout + rendering

**Layout components:**
- `<Header />`, `<Footer />`, `<App />` in `src/components/layout/`
- Wrap `<Outlet />` for page content (React Router v6)

## Configuration & Overrides

**ESLint overrides:**
- `badge.tsx` / `button.tsx` (shadcn-generated) have `react-refresh` rule suppressed
- Do not edit these files — regenerate via `pnpm dlx shadcn@latest add`

**Warnings (expected, pre-existing):**
- `pnpm typecheck` shows "Cannot find module" errors for gitignored `data/` JSON files — harmless, expected
- `react-helmet-async` unmet peer warning for React 19 — harmless
- `react-router-dom@^6.14.1` peer warning — v6 is required, v7 not supported by vite-react-ssg

## Development Shortcuts

**Add shadcn/ui component:**
```bash
pnpm dlx shadcn@latest add <component-name>
# Output goes to src/components/ui/
```

**Formatting & validation (run after changes):**
```bash
pnpm format     # Prettier over src/**/*.{ts,tsx,css}
pnpm typecheck  # tsc -b (check errors, ignore gitignored JSON warnings)
pnpm lint       # ESLint
pnpm validate   # Validate data JSON against schemas (vite-node)
```
