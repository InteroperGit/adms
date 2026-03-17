# Custom Hooks Reference

Custom hooks providing reusable logic for animations, viewport detection, theme management, and user interactions.

## useInViewport

**Location:** `src/hooks/useInViewport.ts`

Detects whether an element is currently visible in the viewport using the Intersection Observer API. Updates state reactively as the element enters/exits the viewport.

```tsx
function useInViewport(
  ref: React.RefObject<HTMLElement | null>,
  { threshold = 0.1 } = {}
): boolean
```

**Parameters:**
- `ref` — Ref object pointing to the DOM element to observe
- `threshold` (optional, default `0.1`) — Percentage of element that must be visible to trigger state change (0-1)

**Returns:** `boolean` — `true` if element is visible in viewport, `false` otherwise

**Use Cases:**
- Activate animations only when element is in view (performance optimization)
- Lazy load content on scroll
- Conditional rendering based on visibility

**Example:**
```tsx
const headerRef = useRef(null);
const isHeaderVisible = useInViewport(headerRef);

// Only show animations when header is in viewport
const highlight = isHeaderVisible ? randomHighlight : null;
```

**Browser Support:** All modern browsers (IE 11 requires polyfill)

---

## useRandomButtonHighlight

**Location:** `src/hooks/useRandomButtonHighlight.ts`

Cycles a highlight through a sequence of indices in random order, with randomized timing for effect duration and pauses between cycles. Only one index is highlighted at a time, returning `null` between highlights.

```tsx
function useRandomButtonHighlight(count: number): number | null
```

**Parameters:**
- `count` — Number of items (indices 0 to count-1) to cycle through

**Returns:** `number | null` — Currently highlighted index (0 to count-1), or `null` when between cycles

**Use Cases:**
- Attention-drawing animations on button arrays
- Cyclic highlighting of features
- Call-to-action button highlights

**Example:**
```tsx
const HEADER_BUTTON_COUNT = 4;
const highlight = useRandomButtonHighlight(HEADER_BUTTON_COUNT);
// Returns: 0, null, 1, null, 2, null, 3, null, ... (random indices)
```

**Timing:**
- Hold highlight: 2–5 seconds (random)
- Pause between highlights: 1–4 seconds (random)
- Initial delay: 0.8–2.5 seconds before first highlight

---

## useTheme

**Location:** `src/hooks/useTheme.ts`

Provides access to theme context for dark mode control. Returns current theme state and toggle function.

```tsx
function useTheme(): {
  isDark: boolean;
  toggle: () => void;
}
```

**Returns:** Object with `isDark` boolean and `toggle` function

**Use Cases:**
- Toggle dark mode in Header
- Conditional styling in Testimonials
- Theme-aware rendering in Contact section

**Example:**
```tsx
const { isDark, toggle } = useTheme();
return (
  <button onClick={toggle}>
    {isDark ? '☀️ Light' : '🌙 Dark'}
  </button>
);
```

---

## useCookieConsent

**Location:** `src/hooks/useCookieConsent.ts`

Manages cookie consent state and events. Reads/writes consent preference from localStorage and fires custom events.

**Returns:** Object with consent state and management functions

**Use Cases:**
- CookieBanner component for user consent
- Analytics integration (Yandex Metrika conditional loading)
- Legal compliance tracking

---

## useSwipe

**Location:** `src/hooks/useSwipe.ts`

Detects left/right swipe gestures on touch devices. Returns swipe direction and state.

**Returns:** Swipe direction (`'left'` | `'right'`) or `null`

**Use Cases:**
- Mobile carousel navigation
- Touch-based component interactions
- Gesture-driven page transitions

---

## useFadeIn

**Location:** `src/hooks/useFadeIn.ts`

Implements scroll-triggered fade-in animations. Observes element and applies animation class when visible.

```tsx
function useFadeIn(
  ref: React.RefObject<HTMLElement>,
  options?: IntersectionObserverInit
): void
```

**Parameters:**
- `ref` — Element to animate
- `options` (optional) — IntersectionObserver options

**Use Cases:**
- Staggered section reveals on page load
- Scroll-triggered animations throughout page
- Progressive content disclosure

**Example:**
```tsx
const sectionRef = useRef(null);
useFadeIn(sectionRef);
return <section ref={sectionRef}>Content fades in on scroll</section>;
```

---

## useActiveSection

**Location:** `src/hooks/useActiveSection.ts`

Returns ID of currently active section based on scroll position. Used for highlighting active nav link.

```tsx
function useActiveSection(): string | null
```

**Returns:** `string | null` — ID of currently visible section (or `null` if none visible)

**Use Cases:**
- Header nav link highlighting
- Scroll position tracking
- Section-aware page behavior

**Example:**
```tsx
const activeId = useActiveSection();
return (
  <nav>
    {links.map(link => (
      <a
        href={`#${link.id}`}
        className={activeId === link.id ? 'active' : ''}
      >
        {link.label}
      </a>
    ))}
  </nav>
);
```

---

## useDocumentTitle

**Location:** `src/hooks/useDocumentTitle.ts`

Updates document title (browser tab title) with optional suffix.

```tsx
function useDocumentTitle(title: string, suffix?: string): void
```

**Parameters:**
- `title` — Page title
- `suffix` (optional) — Text appended to title (e.g., site name)

**Use Cases:**
- Page-specific titles
- SEO optimization
- Dynamic title updates

---

## useCountUp

**Location:** `src/hooks/useCountUp.ts`

Animates number counting from 0 to target value. Returns current animated value.

```tsx
function useCountUp(targetValue: number, duration?: number): number
```

**Parameters:**
- `targetValue` — Final number to count to
- `duration` (optional) — Animation duration in milliseconds

**Returns:** `number` — Current animated value

**Use Cases:**
- Statistics counters
- Animated metric displays
- Achievement numbers

**Example:**
```tsx
const count = useCountUp(1000, 2000);
return <div>{count}</div>; // Counts from 0 to 1000 over 2s
```
