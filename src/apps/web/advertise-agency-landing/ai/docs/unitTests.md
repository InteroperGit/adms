# Unit Test Guide

## Stack

- **Vitest** — test runner (`pnpm test` / `pnpm test --run`)
- **@testing-library/react** — component rendering (`render`, `screen`, `fireEvent`, `act`)
- **@testing-library/jest-dom** — DOM matchers (`toBeInTheDocument`, `toBeDisabled`, etc.)
- **jsdom** — browser environment (configured in `vitest.config.ts`)

Config: `vitest.config.ts` — `globals: true`, `environment: jsdom`, `css: false`.
Setup: `src/test/setup.ts` — imports `@testing-library/jest-dom/vitest`.
Aliases: `@` → `./src`, `@data` → `./data/content`.

## File Location Convention

Tests live **next to the file they test**, with `.test.ts` / `.test.tsx` extension.

```
src/components/sections/hero/Hero.tsx
src/components/sections/hero/Hero.test.tsx
```

## Imports Order

Always `vi.mock(...)` calls **before** importing the module under test — Vitest hoists mocks:

```ts
// 1. vi.mock calls (hoisted by Vitest)
vi.mock('@/types/sections/carousel/carousel', () => ({ carouselSlides: [...] }));

// 2. Import the component after mocks
import { Carousel } from './index';
```

## Standard Test File Structure

```ts
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// --- mocks ---
vi.mock('@/types/...', () => ({ ... }));

// --- import under test ---
import { MyComponent } from './MyComponent';

// --- test data ---
const mockProps = { ... };

describe('MyComponent', () => {
  it('renders expected content', () => {
    render(<MyComponent {...mockProps} />);
    expect(screen.getByText('...')).toBeInTheDocument();
  });
});
```

## Mock Patterns

### Type/data modules

Mock all `@/types/` and `@/types/sections/` imports — they read from gitignored JSON at runtime:

```ts
vi.mock('@/types/sections/hero/hero', () => ({
  heroContent: { title: 'Test Title', subtitle: 'Sub', ... },
}));
```

### Icon map (Proxy pattern)

When a component uses `ICON_MAP` or `resolveIcon`, mock with a `Proxy` that returns a stub SVG for any key:

```ts
vi.mock('@/types/shared/iconMap', () => ({
  ICON_MAP: new Proxy({}, { get: () => (props: object) => <svg data-testid="icon" {...props} /> }),
  resolveIcon: () => null,
}));
```

### Hooks

```ts
// useViewportAnimation — return [ref, inView]
vi.mock('@/hooks/useViewportAnimation', () => ({
  useViewportAnimation: () => [{ current: null }, true],
}));

// useSwipe
vi.mock('@/hooks/useSwipe', () => ({
  useSwipe: () => ({ onTouchStart: vi.fn(), onTouchEnd: vi.fn(), didSwipe: { current: false } }),
}));

// useFadeIn — return [ref, isVisible]
vi.mock('@/hooks/useFadeIn', () => ({
  useFadeIn: () => [{ current: null }, true],
}));

// useStaggeredReveal — return array of [ref, isVisible] pairs
vi.mock('@/hooks/useStaggeredReveal', () => ({
  useStaggeredReveal: (n: number) => Array.from({ length: n }, () => [{ current: null }, true]),
}));

// useScrollReset — no return value, call on route change
vi.mock('@/hooks/useScrollReset', () => ({
  useScrollReset: vi.fn(),
}));

// useAnimatedPillPosition — return { style, setActiveEl }
vi.mock('@/hooks/useAnimatedPillPosition', () => ({
  useAnimatedPillPosition: () => ({ style: {}, setActiveEl: vi.fn() }),
}));

// useRandomButtonHighlight — return highlighted index
vi.mock('@/hooks/useRandomButtonHighlight', () => ({
  useRandomButtonHighlight: () => 0,
}));
```

### Child components (orchestration tests)

Mock child components to expose `data-testid` and controllable props:

```ts
vi.mock('./ContactFormFields', () => ({
  ContactFormFields: ({ form, onChange }: { form: ...; onChange: ... }) => (
    <div>
      <input data-testid="name-input" value={form.name} onChange={(e) => onChange('name', e.target.value)} />
    </div>
  ),
}));
```

### Third-party rendering libs (recharts)

```ts
vi.mock('recharts', () => ({
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="recharts-bar-chart">{children}</div>
  ),
  Bar: ({ children }: { children?: React.ReactNode }) => <div data-testid="bar">{children}</div>,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  LabelList: () => null,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
```

### window.matchMedia

Required for any component that uses media query hooks (carousel, charts):

```ts
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockReturnValue({ matches: false, addListener: vi.fn(), removeListener: vi.fn() }),
  });
});
```

### Components using React Router (Link, useNavigate, etc.)

Wrap in `MemoryRouter`:

```ts
import { MemoryRouter } from 'react-router';
render(<MemoryRouter><MyComponent /></MemoryRouter>);
```

## Timer-Based Tests

Use `vi.useFakeTimers()` / `vi.useRealTimers()` with `act()`:

```ts
beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

it('shows success after 1200ms', () => {
  render(<ContactForm />);
  // ... trigger submit ...
  act(() => { vi.advanceTimersByTime(1200); });
  expect(screen.getByTestId('success-state')).toBeInTheDocument();
});
```

## What to Test

| Component type | What to assert |
|---|---|
| Display component | Text content, aria attributes, structural classes |
| Container / orchestrator | Child components rendered, callbacks passed, state changes |
| Hook | Return values under various inputs, side effects |
| Utility function | Input → output, edge cases |
| Plugin | File transforms, emitted assets |
| Block component | Renders correct element per block type, passes props to children |
| Error boundary | Catches thrown errors, renders fallback UI |
| Schema / type guard | Valid inputs pass, invalid inputs throw/fail with correct message |
| Form component | Field rendering, onChange propagation, submit / success state |

**Do not test:**
- CSS class names (unless functionally meaningful, e.g. `.group`, `.icon-shake`)
- Internal implementation details (state variable names)
- Animation keyframes / timings (already CSS)

## Common Selectors

```ts
screen.getByText('...')                     // text content
screen.getByRole('button', { name: '...' }) // accessible role
screen.getByTestId('...')                   // data-testid
screen.queryByTestId('...')                 // nullable (use for absent checks)
container.querySelector('.class-name')      // CSS class (last resort)
container.querySelector('svg circle')       // SVG elements
```

## Test Coverage by Area

| Area | Test files location |
|---|---|
| UI primitives (shadcn + wrappers) | `src/components/ui/*.test.tsx` |
| Section components (header, hero, about, advantages, services, carousel, CTA, testimonials, contact, footer, portfolio) | `src/components/sections/**/*.test.tsx` |
| Portfolio case components | `src/components/portfolio/**/*.test.tsx` |
| Block components (paragraph, heading, image, gallery, video, code, table, divider, callout, blockquote, cards, metrics, list, chart, order form) | `src/components/blocks/**/*.test.tsx` |
| Block animations utility | `src/components/blocks/blockAnimations.test.ts` |
| Error components (ErrorBoundary, ErrorFallback, DevErrorFallback, SilentErrorFallback) | `src/components/error/**/*.test.tsx` |
| Layout components | `src/components/layout/**/*.test.tsx` |
| Analytics components | `src/components/analytics/**/*.test.tsx` |
| Banner components | `src/components/banners/**/*.test.tsx` |
| UI navigation components | `src/components/ui/navigation/**/*.test.tsx` |
| UI image gallery components | `src/components/ui/imageGallery/**/*.test.tsx` |
| UI section primitives | `src/components/ui/section/**/*.test.tsx` |
| UI legal components | `src/components/ui/legal/**/*.test.tsx` |
| UI order form components | `src/components/ui/orderForm/**/*.test.tsx` |
| UI testimonial components | `src/components/ui/testimonial/**/*.test.tsx` |
| UI portfolio card components | `src/components/ui/portfolio/**/*.test.tsx` |
| Pages | `src/pages/**/*.test.tsx` |
| Contexts | `src/contexts/**/*.test.tsx` |
| Hooks | `src/hooks/*.test.ts` |
| Libs / utilities | `src/libs/*.test.ts` |
| Types / schemas | `src/types/**/*.test.ts` |
| Vite plugins | `src/plugins/*.test.ts` |

## Running Tests

```bash
pnpm test           # Watch mode
pnpm test --run     # Single run (CI)
pnpm test --run src/components/sections/hero   # Specific directory
pnpm test --coverage  # With coverage report
```
