# PDR: Frontend Design & UX Improvements

**Status:** Pending
**Date:** 2026-03-18
**Scope:** Visual polish, motion design, interaction quality, accessibility — all components

---

## Executive Summary

Full frontend audit of all 80+ `.tsx` components across `src/components/`, `src/pages/`, and `src/root.tsx`. The codebase is structurally solid with good dark mode support, semantic HTML, and responsive layouts. This PDR identifies **20 improvements** across:

- **Motion & Animation** — staggered reveals, scroll-driven effects, richer micro-interactions
- **Visual Depth** — atmospheric backgrounds, card hover states, gradient usage
- **Typography & Hierarchy** — clamp refinement, accent color utilization
- **Interaction Quality** — form UX, filter animations, loading/empty states
- **Page-Level Polish** — 404, CTA section, footer, mobile menu
- **Accessibility Gaps** — focus-visible rings, skip targets, contrast

All changes are white-label safe — no hardcoded brand values; everything flows through `theme.json` tokens.

---

## F1. Staggered grid card reveal animations

**Status:** ✅ COMPLETED (2026-03-18)
**Priority:** High
**Impact:** Home page (Services, Portfolio, Advantages grids)

**Current state:**
All grid sections use `<FadeInSection>` which fades in the entire section as a single block. Every card appears simultaneously — no stagger, no sequential reveal.

```tsx
// src/components/sections/services/index.tsx
<FadeInSection id="services" className="bg-muted py-24 md:py-32">
  <Container>
    <SectionHeader ... />
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {services.map((service) => <ServiceCard key={...} service={service} />)}
    </div>
  </Container>
</FadeInSection>
```

Same pattern in: `advantages/index.tsx`, `portfolio/index.tsx`.

**Proposed:**
Add per-card staggered reveal using CSS `animation-delay` on each grid child. When the grid enters the viewport, cards fade in one by one (50–80ms apart).

Approach:
1. Add a `useStaggeredReveal(itemCount)` hook (or extend `useFadeIn`) that returns `ref` + `isVisible`
2. Each card gets `style={{ animationDelay: `${index * 60}ms` }}` with a shared CSS class:
   ```css
   .stagger-item {
     opacity: 0;
     transform: translateY(16px);
   }
   .stagger-visible .stagger-item {
     animation: fade-in 0.5s ease-out forwards;
   }
   ```
3. Apply to Services, Portfolio, Advantages grids
4. Respect `prefers-reduced-motion` — skip delays, show immediately

**Files:** `src/index.css`, `src/hooks/useStaggeredReveal.ts` (new), `src/components/sections/services/index.tsx`, `src/components/sections/advantages/index.tsx`, `src/components/sections/portfolio/index.tsx`

**Status:** ✅ Complete (commit 90135d9)
- Implemented `useStaggeredReveal` hook with 60ms inter-card delays
- Added stagger-fade-in animation (0.5s ease-out)
- Applied to Services, Advantages, Portfolio grids
- Fixed card heights (ItemCard: h-full flex-col)
- PortfolioCard: 4-line description limit, aligned badges
- Respects prefers-reduced-motion

---

## F2. Enhanced card hover micro-interactions

**Status:** ✅ COMPLETED (2026-03-18)
**Priority:** High
**Impact:** ServiceCard, AdvantageCard, PortfolioCard, ItemCard

**Current state:**
All cards share a minimal hover: `hover:-translate-y-0.5 hover:shadow-lg` via `ItemCard`. This is subtle to the point of being almost invisible.

```tsx
// src/components/ui/ItemCard.tsx
className={cn(
  'overflow-hidden rounded-2xl border border-border bg-card shadow-sm',
  'transition-all duration-300',
  'hover:-translate-y-0.5 hover:shadow-lg',
  'dark:hover:border-primary/50',
  className,
)}
```

**Proposed:**
Differentiate hover states by card type for visual variety:

1. **ServiceCard** — on hover, icon box transitions from `bg-primary/10 text-primary` to `bg-primary text-white` (filled icon state):
   ```tsx
   <div className="... group-hover:bg-primary group-hover:text-white transition-colors duration-300">
     <Icon />
   </div>
   ```

2. **PortfolioCard** — on hover, thumbnail shows a subtle zoom (`scale-105`) with the dark overlay intensifying:
   ```tsx
   // PortfolioThumbnail.tsx — image wrapper
   <div className="overflow-hidden">
     <img className="transition-transform duration-500 group-hover:scale-105" />
   </div>
   ```

3. **AdvantageCard** — on hover, the large number badge transitions from `text-foreground/25` to `text-primary/40`:
   ```tsx
   <span className="... transition-colors duration-300 group-hover:text-primary/40">
     {paddedIndex}
   </span>
   ```

4. **ItemCard** — increase lift to `hover:-translate-y-1` and add `hover:border-primary/30` in light mode too (currently only dark mode has `dark:hover:border-primary/50`)

**Files:** `src/components/ui/ItemCard.tsx`, `src/components/sections/services/ServiceCard.tsx`, `src/components/sections/advantages/AdvantageCard.tsx`, `src/components/ui/portfolio/PortfolioThumbnail.tsx`

**Status:** ✅ Complete (commit 6225c54)
- ItemCard: increased lift (-translate-y-1) + border-primary/30 in light mode
- ServiceCard: icon box hover via SectionIconBox (bg-primary, text-white)
- AdvantageCard: number badge transitions to text-primary/40 on hover
- PortfolioThumbnail: image zoom scale-105 (500ms), overlay intensifies to bg-black/40

---

## F3. Accent color underutilization

**Status:** ✅ COMPLETED (2026-03-18)
**Priority:** High
**Impact:** Entire site — visual variety

**Current state:**
The accent color (`#7C3AED` purple, `--color-accent`) is defined in `theme.json` but barely used. Almost everything is `text-primary`, `bg-primary`, `border-primary`. The accent appears only in:
- Hero gradient text: `bg-gradient-to-r from-primary to-accent`
- Hero blob: `bg-accent/5`

This creates visual monotony — the entire site reads as one-color.

**Proposed:**
Introduce accent as a secondary rhythm throughout the page:

1. **SectionBadge** — alternate variant: even-indexed sections use accent badge (`border-accent/20 bg-accent/5 text-accent`)
2. **AdvantageCard icon boxes** — alternate between `bg-primary/10 text-primary` and `bg-accent/10 text-accent` (odd/even)
3. **Footer section titles** — change from `text-white/40` to `text-accent/60` for subtle color injection
4. **Portfolio tags** — use `Badge variant="accent"` (new variant) for category-specific tags
5. **CallToAction secondary button** — accent border instead of `border-white/40` for more punch

Keep primary as the dominant brand color; accent provides contrast points. All via semantic tokens so white-label clients just change `--color-accent`.

**Files:** `src/components/ui/section/SectionBadge.tsx`, `src/components/sections/advantages/AdvantageCard.tsx`, `src/components/sections/footer/FooterNav.tsx` (and siblings), `src/components/sections/call-to-action/CtaButtons.tsx`, `src/components/ui/badge.tsx`

**Status:** ✅ Complete
- Theme: accent color changed from purple (`262 83% 58%`) to golden (`39 85% 52%`)
- Footer titles: all section headers now use `text-accent/60` (FooterNav, FooterServices, FooterContact)
- AdvantageCard: alternating icon colors (even=primary, odd=accent) + counter hover color matching icon
- ServiceCard: alternating icon colors (odd=accent, even=primary)
- SectionIconBox: added `variant` prop ('primary' | 'accent') with conditional styling
- SectionBadge: added 'accent' variant
- CtaButtons: secondary button border changed to accent (`border-accent/40`)
- FooterSection: new shared component for consistent footer column structure


---

## F4. CTA section visual depth

**Status:** ✅ COMPLETED (2026-03-18)
**Priority:** Medium
**Impact:** `src/components/sections/call-to-action/`

**Current state:**
The CallToAction section is a flat `bg-primary py-20` block with centered white text. No texture, no depth, no visual energy:

```tsx
// call-to-action/index.tsx
<section className="bg-primary py-20">
  <Container>
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="mb-4 text-white">{...}</h2>
      <p className="mb-8 text-white/75">{...}</p>
      <CtaButtons ... />
    </div>
  </Container>
</section>
```

This is the most important conversion section on the page but looks the least designed.

**Proposed:**
Add atmospheric depth without changing the primary-color identity:

1. Add diagonal gradient: `bg-gradient-to-br from-primary via-primary to-primary/80`
2. Add decorative circles (same approach as Hero blobs but white-based):
   ```tsx
   <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
   <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
   ```
3. Add subtle dot pattern overlay: `opacity-[0.04]` radial gradient dots
4. Increase vertical padding: `py-20` → `py-24 md:py-32` (match other sections)
5. Add `overflow-hidden relative` to section for blob containment

**Files:** `src/components/sections/call-to-action/index.tsx`

**Status:** ✅ Complete
- Diagonal gradient applied (from-primary via-primary to-primary/80)
- Decorative blobs positioned (top-right and bottom-left)
- Dot pattern overlay at 1px dots, 24px spacing, opacity-[0.04]
- Padding increased to py-24 md:py-32
- Container properly z-indexed for layering

---

## F5. Portfolio filter animated indicator

**Status:** ✅ COMPLETED (2026-03-18)
**Priority:** Medium
**Impact:** Home portfolio section + PortfolioCategoryPage

**Current state:**
Portfolio category filter uses plain buttons with instant background swap:

```tsx
// PortfolioFilter.tsx
className={cn(
  'rounded-full transition-all duration-200',
  isActive
    ? 'bg-primary text-white shadow-sm'
    : 'border border-primary bg-transparent text-muted-foreground hover:text-foreground',
)}
```

Similarly in `CategoryNav.tsx` (portfolio pages):
```tsx
isActive
  ? 'bg-primary text-primary-foreground shadow-sm'
  : 'border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
```

The transition is functional but feels cheap. No sliding indicator, no smooth color morph.

**Proposed:**
Add a sliding pill background indicator that animates between active items:

1. Track the active button's position and width via `useRef` + `useLayoutEffect`
2. Render an absolutely positioned `<div>` behind the buttons that slides to the active item:
   ```tsx
   <div
     className="absolute rounded-full bg-primary shadow-sm transition-all duration-300 ease-out"
     style={{ left: activeLeft, width: activeWidth, height: activeHeight }}
   />
   ```
3. Buttons become transparent; only the sliding pill has `bg-primary`
4. Active button text: `text-white` (via z-index over pill), inactive: `text-muted-foreground`
5. Apply same pattern to both `PortfolioFilter.tsx` and `CategoryNav.tsx`

**Files:** `src/components/sections/portfolio/PortfolioFilter.tsx`, `src/components/portfolio/CategoryNav.tsx`

**Status:** ✅ Complete
- Created generic `useAnimatedPillPosition` hook (`src/hooks/useAnimatedPillPosition.ts`)
  - Calculates pill position/width/height based on active item index
  - Uses useLayoutEffect for synchronous DOM measurements
  - Type-safe ref handling avoiding deprecated MutableRefObject
- Created shared `AnimatedPillTabs` component (`src/components/ui/AnimatedPillTabs.tsx`)
  - Generic component accepting items array, activeValue, and renderItem callback
  - Flexible rendering: supports buttons, links, or any custom elements
  - Animates sliding pill with 300ms ease-out transition
- Refactored `CategoryNav.tsx` to use AnimatedPillTabs
  - Link-based rendering with proper focus-visible rings
  - Maintains href routing for portfolio categories
- Refactored `PortfolioFilter.tsx` to use AnimatedPillTabs
  - Button-based rendering with onClick callbacks
  - Maintains onChange prop for state updates
- Applied consistent responsive padding: px-3 py-1.5 (sm: px-5 py-2)
- Text color handling: active=text-white, inactive=text-muted-foreground

---

## F6. 404 page redesign

**Status:** ✅ COMPLETED (2026-03-18)
**Priority:** Medium
**Impact:** `src/pages/NotFound.tsx`

**Current state:**
The 404 page is extremely minimal — centered text with no visual character:

```tsx
<div className="bg-background min-h-screen flex items-center justify-center py-20">
  <Container>
    <div className="text-center">
      <h1 className="text-8xl font-bold text-primary mb-4">{code}</h1>
      <h2 className="text-3xl font-semibold text-foreground mb-4">{title}</h2>
      <p className="text-lg text-muted-foreground mb-8">{description}</p>
      <Link className="... bg-primary text-primary-foreground rounded-lg ...">{label}</Link>
    </div>
  </Container>
</div>
```

No illustration, no motion, no personality.

**Proposed:**
Add visual personality while keeping the data-driven content:

1. Animated "404" number with gradient text and subtle float animation:
   ```tsx
   <h1 className="text-[10rem] md:text-[14rem] font-heading font-bold
     bg-gradient-to-br from-primary via-accent to-primary bg-clip-text text-transparent
     animate-float select-none leading-none">
     {code}
   </h1>
   ```
2. Add `@keyframes float` — gentle vertical bob (translateY ±8px, 3s infinite ease-in-out)
3. Add decorative background elements: soft gradient blobs (reuse Hero approach) + subtle grid pattern
4. Button: upgrade to `rounded-full` pill with `animate-cta-pulse` to draw attention
5. Add `aria-label` to the code number for screen readers

**Files:** `src/pages/NotFound.tsx`, `src/index.css` (new keyframe)

**Status:** ✅ Complete
- Added @keyframes float (3s ease-in-out, ±8px vertical motion)
- Animated '404' code with gradient (primary → accent → primary)
- Decorative blobs: primary/5 (top-right) and accent/5 (bottom-left) with blur-3xl
- Dot pattern overlay: 1px dots, 24px spacing, opacity-[0.04]
- Button: rounded-full outline style (primary border, primary text, hover bg-primary/10)
- Added aria-label for accessibility
- Respects prefers-reduced-motion

---

## F7. Hero stats scroll-triggered count-up refinement

**Status:** ✅ COMPLETED (2026-03-18)
**Priority:** Medium
**Impact:** `src/components/sections/hero/HeroStats.tsx`, `CountingStat.tsx`

**Current state:**
Stats count up from 0 via `useCountUp` hook. The animation is basic ease-out-cubic. All three stats animate simultaneously. The stat cards have no visual container — just `border-t border-border pt-10 mt-12`.

**Proposed:**
1. Add staggered start: each stat begins counting 200ms after the previous one (pass `delay` prop to `useCountUp`)
2. Wrap each stat in a subtle card: `rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 p-6` — gives visual grounding
3. On count completion, add a brief scale pop: `transform: scale(1.05)` → `scale(1)` on the number, 200ms ease-out
4. Suffix animation: the `+`/`%` suffix fades in 100ms after the number finishes

**Files:** `src/components/sections/hero/HeroStats.tsx`, `src/components/sections/hero/CountingStat.tsx`, `src/hooks/useCountUp.ts`

**Status:** ✅ Complete
- Added `delay` parameter to `useCountUp` hook (4th param) with timeout-based delay before count animation starts
- Updated `CountingStat` component: removed `border-t` divider, added card wrapper with `rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 p-6`
- Added staggered animation: each stat (0–2) starts 200ms after the previous one via `index * STAGGER_DELAY`
- Stats enter with fade-in (0.5s ease-out) respecting the stagger delay
- Number animates with scale pop (1.05 → 1, 200ms ease-out) when counting completes
- Suffix (like `+`, `%`) fades in 100ms after count finishes (delayed animation via `animation-delay`)
- Removed `border-t border-border pt-12` from HeroStats grid wrapper — card wrapper now provides visual containment
- Added `@keyframes count-pop` and `@keyframes suffix-fade-in` to `src/index.css`

---

## F8. Mobile menu drawer polish

**Status:** ✅ COMPLETED (2026-03-18)
**Priority:** Medium
**Impact:** `src/components/sections/header/HeaderMobileNav.tsx`

**Current state:**
The mobile menu is a `fixed inset-x-0 top-16 z-40` panel that appears/disappears instantly (no transition). No backdrop overlay. Just a white/dark panel dropping down:

```tsx
{menuOpen && (
  <nav className={cn(
    'fixed inset-x-0 top-16 z-40 border-b border-border bg-background',
    'overflow-y-auto px-4 pb-6 pt-4 shadow-lg',
  )}>
    ...
  </nav>
)}
```

**Proposed:**
1. Add slide-down + fade animation:
   ```css
   @keyframes slide-down { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
   ```
2. Add semi-transparent backdrop overlay behind menu: `<div className="fixed inset-0 top-16 z-30 bg-black/20 backdrop-blur-sm" onClick={close} />`
3. Add `max-h-[calc(100dvh-4rem)]` to prevent overflow beyond viewport
4. Stagger nav items appearance (each item 40ms delay) for visual sequence
5. Add exit animation via `animationName: 'slide-down'` + `animationDirection: 'reverse'` before unmounting (or use a `closing` state with 200ms timeout)

**Files:** `src/components/sections/header/HeaderMobileNav.tsx`, `src/index.css`

**Status:** ✅ Complete
- Added `@keyframes slide-down` to index.css (0.3s slide-down animation for enter, 0.2s reverse for exit)
- Implemented `closing` state to handle 200ms exit animation with reverse direction
- Added semi-transparent backdrop overlay (bg-black/20 backdrop-blur-sm) positioned at top-16, clickable to close
- Applied `max-h-[calc(100dvh-4rem)]` with overflow-y-auto to menu drawer
- Staggered nav items with `animation-delay: ${index * 40}ms` for each item
- Added `animateItems` prop to HeaderNav to conditionally apply animation classes
- Mobile nav items get `.mobile-nav-item` class when animating (applies slide-down 0.3s ease-out)
- Respects prefers-reduced-motion via existing media query in index.css

---

## F9. Contact form validation & feedback UX

**Status:** ✅ COMPLETED (2026-03-18)
**Priority:** Medium
**Impact:** `src/components/sections/contact/ContactForm.tsx`, `ContactFormFields.tsx`

**Current state:**
The contact form has no client-side validation feedback. Only `required` HTML attribute is used. No error messages, no field highlighting, no inline validation. The "submit" action is simulated (SSG — no backend), but UX should still demonstrate proper form patterns for the white-label kit.

```tsx
// ContactFormFields.tsx
<Input
  type="text"
  id="contact-name"
  name="name"
  required
  value={fields.name}
  onChange={...}
  placeholder={...}
/>
```

**Proposed:**
1. Add field-level validation state: `{ name: string; contact: string; message: string }` errors object
2. Validate on blur (not on change — less aggressive):
   - Name: min 2 characters
   - Contact: non-empty, basic format check (contains `@` or digits)
   - Message: min 10 characters
3. Show inline error below field: `<p className="mt-1 text-xs text-destructive">{error}</p>`
4. Invalid field border: `border-destructive focus-visible:ring-destructive`
5. Add loading state to submit button: spinner icon + disabled during "submission"
6. Success state: add confetti-like subtle particle burst (CSS-only `::before`/`::after` with animation) around the success checkmark

**Files:** `src/components/sections/contact/ContactForm.tsx`, `src/components/sections/contact/ContactFormFields.tsx`, `src/components/sections/contact/ContactSuccess.tsx`

**Status:** ✅ Complete
- Added validation state management in ContactForm with errors object
- Implemented validateField function with rules: name (min 2 chars), contact (email or phone), message (min 10 chars)
- Added onBlur validation in ContactFormFields with error display below each field
- Applied `border-destructive focus-visible:ring-destructive` styling to invalid fields
- Added `isLoading` state to ContactForm with 1200ms simulated submission
- Submit button shows "Sending..." with animated Loader2 spinner icon during submission
- Added particle burst animation in ContactSuccess: 4 particles burst outward (0.8s ease-out)
- Added `@keyframes particle-burst` to index.css using CSS variables for radial position
- Integrated error messages with aria-invalid and aria-describedby for accessibility

---

## F10. Section divider variety

**Status:** ✅ COMPLETED (2026-03-18)
**Priority:** Low
**Impact:** `src/components/ui/section/SectionDivider.tsx`

**Current state:**
All section dividers use the same SVG wave shape with different color fills:

```tsx
<path d="M0,32 C480,64 960,0 1440,32 L1440,64 L0,64 Z" fill={fill} />
```

Every transition between sections looks identical — the wave shape never varies.

**Proposed:**
Add 2–3 additional SVG path variants and rotate between them:

1. **Wave** (current): `M0,32 C480,64 960,0 1440,32 ...`
2. **Slant**: `M0,64 L1440,0 L1440,64 Z` — diagonal cut
3. **Curve**: `M0,48 Q720,0 1440,48 L1440,64 L0,64 Z` — gentler arc

Add a `shape` prop to `SectionDivider`:
```tsx
type DividerShape = 'wave' | 'slant' | 'curve';
```

Home page can alternate shapes for visual rhythm: wave → slant → curve → wave → ...

**Files:** `src/components/ui/section/SectionDivider.tsx`, `src/pages/Home.tsx`

**Status:** ✅ Complete
- Added `DividerShape` type with 'wave' | 'slant' | 'curve' variants
- Defined three SVG path shapes in `SHAPES` record
- Added `shape` prop to `SectionDivider` component with default 'wave'
- Updated Home.tsx to alternate shapes across all dividers: wave → slant → curve → wave → slant → curve → wave
- All validation passes: format, lint, typecheck, build

---

## F11. Scroll progress indicator

**Status:** ✅ COMPLETED (2026-03-18)
**Priority:** Low
**Impact:** Global — all pages

**Current state:**
No visual indication of scroll position on any page. Users on long pages (Home with 10+ sections, portfolio case pages with many blocks) have no sense of progress.

**Proposed:**
Add a thin (2–3px) progress bar at the very top of the viewport:

1. Create `ScrollProgress.tsx` component:
   ```tsx
   const ScrollProgress = () => {
     const [progress, setProgress] = useState(0);
     useEffect(() => {
       const onScroll = () => {
         const scrolled = window.scrollY;
         const total = document.documentElement.scrollHeight - window.innerHeight;
         setProgress(total > 0 ? (scrolled / total) * 100 : 0);
       };
       window.addEventListener('scroll', onScroll, { passive: true });
       return () => window.removeEventListener('scroll', onScroll);
     }, []);
     return (
       <div className="fixed inset-x-0 top-0 z-50 h-0.5 bg-transparent">
         <div className="h-full bg-primary transition-[width] duration-150" style={{ width: `${progress}%` }} />
       </div>
     );
   };
   ```
2. Place in `App.tsx` above `<Header />`
3. Only show on pages longer than 2x viewport height
4. Color: `bg-primary` → `bg-gradient-to-r from-primary to-accent` for brand reinforcement

**Files:** `src/components/ui/ScrollProgress.tsx` (new), `src/App.tsx`

**Status:** ✅ Complete
- Created `ScrollProgress.tsx` component with scroll tracking via passive listener
- Calculates progress as scrollY / (scrollHeight - innerHeight)
- Only renders on pages longer than 2x viewport height (checked on mount and resize)
- Uses gradient from primary to accent (`bg-gradient-to-r from-primary to-accent`)
- Applied smooth width transition (150ms) for responsive feel
- Added accessibility: `role="progressbar"` with aria attributes (valuenow, min, max, label)
- Placed in `App.tsx` at the very top (before SkipToContent) to sit above all content
- Validates with: format ✅, lint ✅, typecheck ✅, build ✅

---

## F12. Portfolio card image lazy loading skeleton

**Status:** ✅ COMPLETED (2026-03-18)
**Priority:** Low
**Impact:** `src/components/ui/portfolio/PortfolioThumbnail.tsx`

**Current state:**
`PortfolioThumbnail` renders `OptimizedImage` which has its own skeleton. However, the gradient fallback (when no image) has no loading state, and the thumbnail area shows nothing while the image loads on slow connections.

**Proposed:**
1. Add a shimmer skeleton behind the thumbnail that shows until the image fires `onLoad`:
   ```tsx
   <div className="relative aspect-[16/10] overflow-hidden bg-muted">
     {!loaded && <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-muted via-muted-foreground/5 to-muted" />}
     <OptimizedImage onLoad={() => setLoaded(true)} ... />
   </div>
   ```
2. Add a subtle blur-up transition: image starts at `blur-sm opacity-0` and transitions to `blur-0 opacity-100` on load

**Status:** ✅ Complete
- Added `onLoad` callback to OptimizedImage props (optional callback fired when image loads)
- Added shimmer skeleton animation to index.css using `@keyframes shimmer` (background position shifts left-to-right over 2s)
- Added `@keyframes blur-up` animation (blur: 8px → 0, opacity: 0 → 1, 0.6s ease-out)
- Added blur-up animation to --animate-blur-up in Tailwind theme
- Updated PortfolioThumbnail to track image load state with useState hook
- Shimmer skeleton shows conditionally (!imageLoaded) with gradient animation
- Image applies animate-blur-up class until loaded
- OptimizedImage calls onLoad callback in handleLoad function after setting loaded state
- All validation passes: format ✅, lint ✅, typecheck ✅, build ✅

---

## F13. Focus-visible ring consistency audit

**Status:** ✅ COMPLETED (2026-03-18)
**Priority:** Medium
**Impact:** Global — all interactive elements

**Current state:**
Focus rings are inconsistent across components:

- **shadcn/ui Button**: `focus-visible:ring-ring/50 focus-visible:ring-[3px]` (new shadcn pattern)
- **SocialLinks buttons**: `focus-visible:ring-2 focus-visible:ring-primary` (custom)
- **DarkModeToggle**: `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1` (custom + offset)
- **Nav links**: no explicit focus-visible styles
- **Filter buttons**: no focus-visible styles
- **Footer links**: no focus-visible styles
- **Contact form inputs**: `focus-visible:border-ring` (from shadcn Input)

Some elements have `ring-primary`, some have `ring-ring`, some have no ring at all. Ring width varies (2px vs 3px). Offset is inconsistent.

**Proposed:**
Standardize on a single focus-visible pattern across all custom interactive elements:
```
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background
```

1. Audit all `<a>`, `<button>`, and `<input>` elements outside shadcn components
2. Create a Tailwind utility `focus-ring` in `src/index.css`:
   ```css
   @utility focus-ring {
     @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background;
   }
   ```
3. Apply to: nav links, filter buttons, footer links, social buttons, dark mode toggle, carousel controls
4. Ensure offset color changes with dark mode (`ring-offset-background` handles this)

**Files:** `src/index.css`, `src/components/sections/header/HeaderNav.tsx`, `src/components/sections/portfolio/PortfolioFilter.tsx`, `src/components/portfolio/CategoryNav.tsx`, `src/components/sections/footer/FooterNav.tsx`, `src/components/ui/SocialLinks.tsx`, `src/components/sections/header/DarkModeToggle.tsx`, `src/components/sections/carousel/CarouselControls.tsx`

**Status:** ✅ Complete
- Created `@utility focus-ring` in src/index.css with standardized pattern
- Applied focus-ring utility to HeaderNav (desktop & mobile nav links)
- Applied focus-ring utility to PortfolioFilter (category filter buttons)
- Updated CategoryNav to use focus-ring utility (replaced ring-offset-1 with ring-offset-2)
- Applied focus-ring utility to FooterNav (main navigation links)
- Applied focus-ring utility to FooterServices (service links)
- Applied focus-ring utility to FooterContact (phone/email links)
- Applied focus-ring utility to FooterBottom (legal navigation links)
- Updated SocialLinks to use focus-ring utility (replaced ring-offset-1 with ring-offset-2)
- Applied focus-ring utility to CarouselControls arrows and dot indicators
- All validation passes: format ✅, lint ✅, typecheck ✅, build ✅

---

## F14. Testimonials empty state illustration

**Status:** ✅ COMPLETED (2026-03-19)
**Priority:** Low
**Impact:** `src/components/sections/testimonials/TestimonialsEmpty.tsx`

**Current state:**
The empty state shows a plain `MessageCircle` icon with text:

```tsx
<div className="flex max-w-md flex-col items-center gap-4 rounded-2xl
  border border-dashed border-border bg-background px-8 py-12 text-center">
  <MessageCircle size={36} className="text-muted-foreground/50" />
  <p>...</p>
  <p className="text-sm text-muted-foreground/70">...</p>
</div>
```

Feels like a developer placeholder, not a designed empty state.

**Proposed:**
1. Increase icon size: `size={48}` with a subtle background circle: `rounded-full bg-muted p-4`
2. Add a decorative quote pattern behind the icon (CSS pseudo-elements with large `"` characters at low opacity)
3. Soften the dashed border: `border-border/50` instead of `border-border`
4. Add a gentle float animation on the icon (reuse `@keyframes float` from F6)

**Files:** `src/components/sections/testimonials/TestimonialsEmpty.tsx`

**Status:** ✅ Complete
- Icon size increased from 36 to 48
- Added rounded-full bg-muted p-4 circular background around icon
- Added decorative large quote (`"`) character behind icon (text-6xl, text-muted-foreground/5, select-none)
- Softened dashed border from `border-border` to `border-border/50`
- Applied `animate-float` class to icon container (reuses @keyframes float)
- Added aria-hidden="true" to decorative quote for accessibility
- All validation passes: format ✅, lint ✅, typecheck ✅, build ✅

---

## F15. About section image/visual element

**Status:** ✅ COMPLETED (2026-03-19)
**Priority:** Medium
**Impact:** `src/components/sections/about/AboutCard.tsx`

**Current state:**
The About section's right column is an `AboutCard` — a stats card with logo, tagline, and number rows. While well-designed, it's entirely text-based. No photos, no illustrations, no visual break from the text-heavy layout.

The decorative blob behind the card (`h-80 w-80 rounded-full bg-primary/5 blur-3xl`) is the only visual element.

**Proposed:**
1. Add a secondary decorative blob (accent color): `bg-accent/5 blur-3xl` offset from the primary blob
2. Add a subtle rotating ring animation around the card:
   ```css
   @keyframes slow-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
   ```
   Applied to a dashed border circle behind the card: `border-2 border-dashed border-primary/10 rounded-full animate-[slow-spin_30s_linear_infinite]`
3. Consider adding a data-driven `card.image` optional field (for white-label clients who have team photos) — if present, show image above the stats card; if absent, keep current layout

**Files:** `src/components/sections/about/AboutCard.tsx`, `src/index.css`

**Status:** ✅ Complete (commit 334adb7)
- Added secondary accent blob (`bg-accent/5 blur-3xl`) offset from primary blob
- Added slow-spinning dashed ring behind card (`border-dashed border-primary/10`, 30s linear infinite)
- Added `@keyframes slow-spin` to index.css
- All validation passes: format ✅, lint ✅, typecheck ✅, build ✅

---

## F16. Carousel transition variety

**Status:** ✅ COMPLETED (2026-03-19)
**Priority:** Low
**Impact:** `src/components/sections/carousel/CarouselSlide.tsx`

**Current state:**
Carousel uses a simple crossfade (opacity 0 → 1) for all slide transitions.

**Proposed:**
Add a subtle zoom + fade combination for more cinematic feel:
1. Active slide: `opacity-100 scale-100`
2. Inactive slide: `opacity-0 scale-105` (slightly zoomed out while fading)
3. CSS: `transition: opacity 700ms ease, transform 700ms ease`
4. Ken Burns effect on current slide: slow zoom from `scale-100` to `scale-105` over the 5s display duration
5. Apply only to image slides (not gradient slides)
6. Respect `prefers-reduced-motion` — disable Ken Burns

**Files:** `src/components/sections/carousel/CarouselSlide.tsx`, `src/index.css`

**Status:** ✅ Complete
- Updated outer div transition to `transition-[opacity,transform] duration-700 ease-out`
- Active slide: `opacity-100 scale-100`, inactive: `opacity-0 scale-105`
- Added Ken Burns animation wrapper around image slides only
- Added `@keyframes ken-burns` (scale 1 → 1.05 over 5s ease-out forwards)
- Added `--animate-ken-burns: ken-burns 5s ease-out forwards;` to theme animations
- Gradient slides remain unaffected (no Ken Burns)
- Respects prefers-reduced-motion via existing media query
- **BONUS: Added 3 random transition effects (rotating between slides):**
  - **Slide Right**: `translateX(100px)` on enter (left to right slide)
  - **Rotate Fade**: `-5deg` rotation + `scale(0.95)` on enter (spin + scale)
  - **Blur Fade**: `blur(12px)` on enter, sharpens on exit (cinema effect)
- Effects rotate deterministically by slide index (ensures consistency across renders)
- All validation passes: format ✅, lint ✅, typecheck ✅, build ✅

---

## F17. Footer visual hierarchy enhancement

**Status:** ✅ COMPLETED (2026-03-19)
**Priority:** Low
**Impact:** `src/components/sections/footer/`

**Current state:**
The footer is functional but visually flat. All four columns have identical styling: `text-xs font-semibold uppercase tracking-widest text-white/40` titles with `text-sm text-white/60` links. No visual anchors or accent points.

**Proposed:**
1. Add a subtle top border gradient on the footer: `border-t border-transparent bg-gradient-to-r from-transparent via-primary/30 to-transparent` (thin colored line above footer)
2. FooterBrand: add a colored accent line under the logo: `h-0.5 w-12 bg-primary rounded-full mt-2 mb-4`
3. FooterContact: style phone number with `text-primary` instead of `text-white/60` to make it the visual focal point
4. FooterBottom: upgrade copyright year to `text-white/50` (slightly brighter than current `text-white/35`)
5. Add hover underline on footer links: `hover:underline underline-offset-4 decoration-primary/40`

**Files:** `src/components/sections/footer/index.tsx`, `src/components/sections/footer/FooterBrand.tsx`, `src/components/sections/footer/FooterContact.tsx`, `src/components/sections/footer/FooterBottom.tsx`

**Status:** ✅ Complete (commit 0ac6c57)
- Added top border gradient on footer (`border-t border-transparent bg-gradient-to-r from-transparent via-primary/30 to-transparent`)
- FooterBrand: added accent underline (`h-0.5 w-12 bg-primary rounded-full`) under logo
- FooterContact: phone number styled with `text-primary` for visual prominence
- FooterBottom: copyright year upgraded to `text-white/50`
- Footer links: added hover underline with `hover:underline underline-offset-4 decoration-primary/40`
- Premium editorial design with visual hierarchy anchors

---

## F18. Cookie banner entrance animation

**Status:** ✅ COMPLETED (2026-03-19)
**Priority:** Low
**Impact:** `src/components/banners/CookieBanner.tsx`

**Current state:**
The cookie banner appears instantly on page load with no animation. It likely uses conditional rendering (`{showBanner && <div>...</div>}`).

**Proposed:**
1. Add slide-up + fade entrance:
   ```css
   @keyframes slide-up {
     from { opacity: 0; transform: translateY(100%); }
     to { opacity: 1; transform: translateY(0); }
   }
   ```
2. Apply `animate-[slide-up_0.4s_ease-out]` to the banner container
3. Add 1s delay before showing (let the page load settle): `animation-delay: 1s; animation-fill-mode: backwards`
4. On dismiss: reverse animation before removing from DOM (200ms fade-out)

**Files:** `src/components/banners/CookieBanner.tsx`, `src/index.css`

**Status:** ✅ Complete
- Added `@keyframes slide-up` to index.css (opacity: 0→1, translateY: 100%→0)
- Implemented `closing` state in CookieBanner to track dismissal animation
- Entrance animation: `animate-[slide-up_0.4s_ease-out_1s_both]` (0.4s duration, 1s delay with backwards fill-mode)
- Exit animation: `animate-[slide-up_0.2s_ease-out_reverse]` (0.2s reverse animation on dismiss)
- Modified `save()` function to set closing state first, wait 200ms for animation, then finalize dismissal
- All validation passes: format ✅, lint ✅, typecheck ✅, build ✅

---

## F19. Portfolio case page hero parallax (not necessary!!!)

**Status:** ✅ COMPLETED (2026-03-19)
**Priority:** Low
**Impact:** `src/components/portfolio/CaseHero.tsx`

**Current state:**
Portfolio case hero is a static full-height section with image or gradient background:

```tsx
<section className="relative flex min-h-[60vh] items-end overflow-hidden">
  <OptimizedImage ... className="absolute inset-0" imgClassName="object-cover" />
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
  <Container className="relative z-10 pb-16 pt-32">
    ...
  </Container>
</section>
```

The image is static — no scroll-driven depth.

**Proposed:**
Add subtle parallax to the background image (CSS-only, no JS):

1. Apply `background-attachment: fixed` on desktop or use CSS `transform: translateZ(-1px) scale(1.5)` in a perspective container
2. Simpler approach — JS-based subtle parallax:
   ```tsx
   const [offset, setOffset] = useState(0);
   useEffect(() => {
     const onScroll = () => setOffset(window.scrollY * 0.3);
     window.addEventListener('scroll', onScroll, { passive: true });
     return () => window.removeEventListener('scroll', onScroll);
   }, []);
   // Apply: style={{ transform: `translateY(${offset}px)` }}
   ```
3. Only apply on desktop (`md:` and up) — mobile gets static image
4. Respect `prefers-reduced-motion` — disable parallax

**Files:** `src/components/portfolio/CaseHero.tsx`

**Status:** ✅ Complete
- Added scroll tracking with `useState(0)` for offset
- Desktop detection: `window.matchMedia('(min-width: 768px)').matches` with lazy initializer (safe for SSG)
- Prefers-reduced-motion check: `window.matchMedia('(prefers-reduced-motion: reduce)').matches`
- Passive scroll listener: `window.addEventListener('scroll', onScroll, { passive: true })`
- Parallax effect: `translateY(${offset}px)` applied only when desktop AND not prefers-reduced-motion
- Wrapped image in container div with transform applied (avoids transform on img tag)
- Added `overflow-hidden` to section to contain parallax overflow
- Safe window checks: `typeof window !== 'undefined'` for SSG compatibility
- All validation passes: format ✅, lint ✅, typecheck ✅, build ✅

---

## F20. Smooth page transitions

**Status:** ✅ COMPLETED (2026-03-19)
**Priority:** Low
**Impact:** `src/App.tsx`, global

**Current state:**
Page navigation is instant — no transition between routes. Navigating from Home to Portfolio or to a case page has an abrupt content swap.

**Proposed:**
Add a minimal page-level fade transition using React Router's built-in capabilities or a simple wrapper:

1. Wrap `<Outlet />` in a transition container:
   ```tsx
   <main id="main-content">
     <div className="animate-fade-in" key={location.pathname}>
       <Outlet />
     </div>
   </main>
   ```
2. The existing `@keyframes fade-in` (0.5s) handles the enter animation
3. For exit: add a brief opacity transition (200ms) before unmount using `useNavigation()` state:
   ```tsx
   const navigation = useNavigation();
   const isNavigating = navigation.state === 'loading';
   // Apply: className={cn(isNavigating && 'opacity-50 transition-opacity duration-200')}
   ```
4. This is lightweight — no View Transitions API dependency, works in all browsers

**Files:** `src/App.tsx`

**Status:** ✅ Complete
- Imported `useNavigation` from React Router + `cn` utility
- Added navigation state tracking: `const navigation = useNavigation(); const isNavigating = navigation.state === 'loading'`
- Wrapped `<Outlet />` in transition container div with:
  - `key={location.pathname}` to trigger re-render on route change
  - `animate-fade-in` class (0.5s ease-out fade-in on mount)
  - Conditional `opacity-50 transition-opacity duration-200` when navigating (exit fade)
- Leverages existing `@keyframes fade-in` from index.css
- No View Transitions API dependency — works in all browsers
- All validation passes: format ✅, lint ✅, typecheck ✅, build ✅

---

## Implementation Priority

### Phase 1 — High Impact (do first)
| Item | Description | Effort |
|------|-------------|--------|
| F1 | Staggered grid card reveals | Small |
| F2 | Enhanced card hover interactions | Small |
| F3 | Accent color utilization | Medium |
| F13 | Focus-visible ring consistency | Medium |

### Phase 2 — Medium Impact
| Item | Description | Effort |
|------|-------------|--------|
| F4 | CTA section visual depth | Small |
| F5 | Portfolio filter animated indicator | Medium |
| F7 | Hero stats count-up refinement | Small |
| F8 | Mobile menu drawer polish | Medium |
| F9 | Contact form validation UX | Medium |
| F15 | About section visual element | Small |

### Phase 3 — Polish & Delight
| Item | Description | Effort |
|------|-------------|--------|
| F6 | 404 page redesign | Small |
| F10 | Section divider variety | Small |
| F11 | Scroll progress indicator | Small |
| F12 | Portfolio thumbnail skeleton | Small |
| F14 | Testimonials empty state | Small |
| F16 | Carousel Ken Burns effect | Small |
| F17 | Footer visual hierarchy | Small |
| F18 | Cookie banner animation | Small |
| F19 | Case hero parallax | Small |
| F20 | Smooth page transitions | Medium |

---

## Validation Sequence

After each item:
```bash
pnpm format && pnpm lint && pnpm typecheck && pnpm build
```

Visual verification:
1. Check light mode + dark mode
2. Check mobile (375px), tablet (768px), desktop (1440px)
3. Check `prefers-reduced-motion: reduce` (disable animations)
4. Keyboard navigation test (Tab through all interactive elements)
