# PDR: Portfolio Block Modernization & Conversion Improvements

**Status:** In Progress
**Date:** 2026-03-19
**Scope:** All content blocks used in portfolio case articles — visual quality, motion, and conversion-oriented UX. Based on full audit of the bodrost case (`outdoor/2023/11/2023_11_01_bodrost.json`) which exercises every block type.

---

## Executive Summary

Portfolio case articles are the agency's primary sales tool. A visitor reads a case to answer: "Can this agency solve my problem?" Every block contributes to trust-building and moves the visitor toward the order form. The current blocks are technically correct but visually underpowered: static charts, anemic progress bars, a plain order form, and no scroll-triggered animations make the articles read like documentation rather than a persuasive showcase.

This PDR targets **13 improvements** across two axes:

- **Conversion** — blocks that directly build trust and drive to the CTA (order-form, metrics, blockquote, cards, callout-success)
- **Modern aesthetics** — blocks that look dated compared to 2025 editorial standards (progress chart, chart animations, code, video, gallery, heading anchors, divider)

All changes are white-label safe — no hardcoded brand values; all colors flow through theme tokens.

---

## F1. Order-form block — premium CTA container

**Status:** ✅ COMPLETED (2026-03-19)
**Priority:** Critical (highest conversion impact)
**Impact:** `src/components/blocks/OrderFormBlock.tsx`

**Current state:**
The order-form block renders as a plain `max-w-2xl` container with a centered h2 and a bare `<OrderForm>` component. It is the primary conversion point of every case article but has no visual prominence — it looks identical to any other block on the page:

```tsx
// OrderFormBlock.tsx
<div className="mx-auto max-w-2xl">
  {block.title && (
    <h2 className="mb-6 text-center font-heading text-2xl font-bold md:text-3xl">
      {block.title}
    </h2>
  )}
  <OrderForm definition={definition} />
</div>
```

In the bodrost article the block is preceded by a line divider and follows achievement callouts — but visually it blends into the flow. There is nothing that signals "this is where you take action".

**Proposed:**
Transform the order-form block into a visually distinct offer section:

1. Wrap in a branded container: `rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5 px-8 py-10` — gives it a "zone" feel distinct from article content
2. Add decorative background blobs (same technique as Hero/CTA section):
   ```tsx
   <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/10 blur-2xl" />
   <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-accent/10 blur-2xl" />
   ```
3. Add a trust bar above the form title: a row of 3 micro-badges with Lucide icons:
   - `ShieldCheck` — "Бесплатная консультация"
   - `Clock` — "Ответим за 2 часа"
   - `Star` — "40+ успешных проектов"

   Styled as `text-xs text-muted-foreground` with `gap-4 flex flex-wrap justify-center mb-6`
4. Title: upgrade to gradient text `bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent` for visual urgency
5. Add `relative overflow-hidden` to the wrapper for blob containment

**Files:**
- `src/components/blocks/OrderFormBlock.tsx`

---

## F2. Metrics block — scroll-triggered count-up animation

**Status:** ✅ COMPLETED (2026-03-19)
**Priority:** High (results proof is the #1 conversion signal)
**Impact:** `src/components/blocks/MetricsBlock.tsx`

**Current state:**
Metrics render as a static grid of cards showing `+28%`, `40`, `3 мес.` as plain text. The primary-colored background variant used in bodrost is visually bold but the numbers are dead — they don't animate, don't respond to scroll, and don't give the reader the "wow" moment that results data deserves:

```tsx
<p className={cn('text-4xl font-bold leading-none', metricTextColor)}>{metric}</p>
```

The `useCountUp` hook already exists and is used in `HeroStats`. It supports `delay`, stagger, and count completion callbacks.

**Proposed:**
1. Extract the numeric part of each metric string (e.g., `+28%` → prefix `+`, value `28`, suffix `%`; `40` → value `40`; `3 мес.` → `3` + ` мес.`)
2. Use `useCountUp` for each metric card, staggered by `index * 150ms`
3. Add `useInViewport` (already exists) to trigger count only when block scrolls into view
4. On count completion: apply `count-pop` scale animation (already defined in index.css from F7)
5. Add stagger entrance: cards fade + slide-up into view with 80ms inter-card delay (reuse `useStaggeredReveal` pattern from F1 in the previous PDR)
6. Preserve non-numeric metrics unchanged (e.g., `3 мес.` just appears with fade-in)

**Files:**
- `src/components/blocks/MetricsBlock.tsx`

---

## F3. Blockquote block — editorial social proof design

**Status:** ✅ COMPLETED (2026-03-19)
**Priority:** High (testimonials are the #2 conversion signal after results)
**Impact:** `src/components/blocks/BlockquoteBlock.tsx`

**Current state:**
The inline blockquote variant (Variant B) is a `border-l-4 border-primary bg-muted/30` box with italic text. It's functionally readable but visually generic — identical to thousands of Bootstrap quote components:

```tsx
<blockquote className="mx-auto max-w-3xl rounded-r-lg border-l-4 border-primary bg-muted/30 py-4 pl-6 pr-4 dark:bg-neutral-900">
  <p className="text-lg italic leading-relaxed text-foreground dark:text-white">
    «{block.text}»
  </p>
  <footer className="mt-4 text-sm text-muted-foreground dark:text-neutral-300">
    ...
  </footer>
</blockquote>
```

**Proposed:**
Redesign the inline blockquote as an editorial statement:

1. Replace left border with a subtle full-card approach: `rounded-2xl border border-border/50 bg-card px-8 py-8 shadow-sm` — more card-like, less "alert-like"
2. Add a large decorative quote character behind the text:
   ```tsx
   <div className="pointer-events-none absolute -left-2 -top-4 select-none font-heading text-8xl font-bold leading-none text-primary/10" aria-hidden="true">
     "
   </div>
   ```
3. Increase quote text size: `text-xl` (was `text-lg`) with `font-heading` for a magazine pull-quote feel
4. Author attribution: add a thin horizontal rule + flex layout with optional avatar initial circle:
   ```tsx
   <div className="mt-6 flex items-center gap-3 border-t border-border/50 pt-4">
     <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
       {block.author?.[0]}
     </div>
     <cite>...</cite>
   </div>
   ```
5. Variant A (TestimonialCard reference): no changes needed — already well-designed

**Files:**
- `src/components/blocks/BlockquoteBlock.tsx`

---

## F4. Cards block — hover states and visual depth

**Status:** ✅ COMPLETED (2026-03-19)
**Priority:** High (deliverables/solution presentation must feel premium)
**Impact:** `src/components/blocks/CardsBlock.tsx`

**Current state:**
Cards render as flat `rounded-2xl border border-border bg-card p-6 shadow-sm` with a tiny `h-1 w-10` accent bar at top. No hover state, no depth on interaction. The bodrost article uses this block to present the three deliverables (Logo, Identity, Brand Guide) — these need to feel like premium products:

```tsx
<div key={title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
  {isGradient && (
    <div className={cn('mb-3 h-1 w-10 rounded-full bg-gradient-to-r', gradientStops)} />
  )}
  <h3 className="mb-2 font-semibold">{title}</h3>
  <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
</div>
```

**Proposed:**
1. Add `group` class and hover effect: `transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/30`
2. Upgrade accent bar: increase from `h-1` to `h-1.5`, and width from `w-10` to `w-12` — slightly more visible
3. On hover, animate accent bar: `group-hover:w-16 transition-all duration-300` — bar grows on hover
4. Title on hover: `group-hover:text-primary transition-colors duration-200` — subtle color shift
5. Add stagger entrance: cards fade + slide-up on scroll entry (same pattern as metrics F2)

**Files:**
- `src/components/blocks/CardsBlock.tsx`

---

## F5. Progress chart — modern bars with scroll-triggered animation

**Status:** ✅ COMPLETED (2026-03-19)
**Priority:** High (brand KPI visualization is data credibility)
**Impact:** `src/components/blocks/ChartBlock/ProgressChart.tsx`

**Current state:**
Progress bars are only `h-2` (8px) tall — extremely thin by modern standards. The bars are also static (no entrance animation). In the bodrost article, this shows brand awareness metrics (79%, 68%, 72%, 61%) — data that should feel impactful and alive:

```tsx
// ProgressChart.tsx
<div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
  <div
    className={cn('absolute inset-y-0 left-0 rounded-full', colorClass)}
    style={{ width: `${(item.value / max) * 100}%` }}
  />
</div>
```

**Proposed:**
1. Increase bar height: `h-2` → `h-3` (12px) — chunkier, more readable
2. Add scroll-triggered fill animation via `useInViewport`:
   ```tsx
   const { ref, inView } = useInViewport();
   // Bar style:
   style={{
     width: inView ? `${(item.value / max) * 100}%` : '0%',
     transition: `width 0.8s cubic-bezier(0.25, 1, 0.5, 1) ${index * 100}ms`,
   }}
   ```
3. Stagger each bar's animation: `index * 100ms` delay
4. Value display: move the value label to be inside/after the bar fill (overlay at right edge when bar is wide enough), not just the trailing `w-12` column — modern dashboard style
5. Add a subtle shimmer on bar completion (same shimmer keyframe from portfolio thumbnail loading)

**Files:**
- `src/components/blocks/ChartBlock/ProgressChart.tsx`

---

## F6. Bar/Line/Horizontal-bar charts — scroll-triggered Recharts animations

**Status:** ✅ COMPLETED (2026-03-19)
**Priority:** Medium (animated data builds credibility)
**Impact:** `src/components/blocks/ChartBlock/BarChart.tsx`, `HorizontalBarChart.tsx`, `LineChart.tsx`

**Current state:**
All Recharts-based charts (`bar`, `line`, `horizontal-bar`) render with `isAnimationActive` default behavior — they animate on *mount*, not on *scroll entry*. On a long portfolio case page, charts that are below the fold animate immediately when the page loads (off-screen) and are already static by the time the user scrolls to them.

**Proposed:**
1. Wrap each chart in a `useInViewport`-gated render: only mount the Recharts component when the wrapper enters the viewport
2. Use a placeholder `<div style={{ height: chartHeight }} />` until in-view, then swap to the Recharts chart
3. Set `isAnimationActive={true}` + `animationDuration={800}` + `animationEasing="ease-out"` to ensure the animation fires fresh on viewport entry
4. For `LineChart`: add `strokeDasharray`/`strokeDashoffset` CSS animation for a "drawing" line effect:
   ```tsx
   // Alternative to Recharts animation — CSS stroke draw
   style={{ strokeDasharray: '1000', strokeDashoffset: inView ? '0' : '1000', transition: 'stroke-dashoffset 1s ease-out' }}
   ```
5. For `BarChart`: bars rise from bottom — already built into Recharts `isAnimationActive`, just ensure it fires on entry

**Files:**
- `src/components/blocks/ChartBlock/BarChart.tsx`
- `src/components/blocks/ChartBlock/HorizontalBarChart.tsx`
- `src/components/blocks/ChartBlock/LineChart.tsx`
- `src/hooks/useInViewport.ts` (verify `triggerOnce: true` option exists, add if not)

---

## F7. Pie/Donut chart — animated segment entry

**Status:** ✅ COMPLETED (2026-03-19)
**Priority:** Medium (channel breakdown visualization — eye-catching data)
**Impact:** `src/components/blocks/ChartBlock/PieChart.tsx`

**Current state:**
The custom SVG donut chart renders with all segments visible immediately. The interactive hover (segment expansion + legend hover) is already implemented. However, the entrance is static — all slices appear at once with no drama.

**Proposed:**
1. On viewport entry (via `useInViewport`), animate each segment from `strokeDasharray="0 ${circumference}"` to its actual value, staggered by `index * 100ms`
2. The animation should feel like the pie "fills in" clockwise from 0:
   ```tsx
   style={{
     strokeDasharray: inView ? `${segmentLength} ${circumference}` : `0 ${circumference}`,
     transition: `stroke-dasharray 0.6s ease-out ${index * 100}ms`,
   }}
   ```
3. Add an entrance for the center total (if shown): fade + scale from 0.8 to 1.0
4. Respect `prefers-reduced-motion` — skip animation, show final state immediately

**Files:**
- `src/components/blocks/ChartBlock/PieChart.tsx`

---

## F8. Callout block — variant differentiation and visual weight

**Status:** ✅ COMPLETED (2026-03-19)
**Priority:** Medium (success callouts are achievement proof signals)
**Impact:** `src/components/blocks/CalloutBlock.tsx`

**Current state:**
All four callout types (`info`, `success`, `warning`, `note`) use identical structural styling — `border-l-4` + `bg-{color}-50` + `flex gap-3` icon + text. Only the color palette differs. In the bodrost article, the `success` callout ("Вошла в топ-20") is an achievement signal that should feel like a highlight, not a mild info box:

```tsx
// All types: same layout, different colors only
<div className={cn('mx-auto max-w-3xl rounded-r-xl border-l-4 px-5 py-4', cfg.border, cfg.bg)}>
  <div className="flex gap-3">
    <Icon /> <div>{title}{text}</div>
  </div>
</div>
```

**Proposed:**
1. **`success` type** — upgrade to a "achievement" treatment:
   - Full border (not just left): `border border-green-200 dark:border-green-900` instead of `border-l-4`
   - Subtle gradient background: `bg-gradient-to-r from-green-50 to-emerald-50/50 dark:from-neutral-900 dark:to-neutral-900`
   - Icon: increase to `size={22}` + add `rounded-full bg-green-100 dark:bg-green-900/30 p-1` background circle
   - Add decorative sparkle dots: 2–3 small `bg-green-300/40` circles absolutely positioned in corners (`aria-hidden`)

2. **`info` type** — slightly more prominent:
   - Add `shadow-sm` and `rounded-xl` (currently `rounded-r-xl` only)
   - All rounded corners give a more "card" feel, less "alert"

3. **`note` type** — differentiate with dashed left border:
   ```tsx
   // note uses border-border which is solid — make it dashed
   'border-l-4 border-dashed border-border'
   ```

4. **`warning` type** — keep as-is (amber left border is already correct semantic treatment)

**Files:**
- `src/components/blocks/CalloutBlock.tsx`

---

## F9. Table block — data visualization upgrade

**Status:** ✅ COMPLETED (2026-03-19)
**Priority:** Medium (project timelines and pricing tables are decision-making tools)
**Impact:** `src/components/blocks/TableBlock.tsx`

**Current state:**
The table is functionally responsive (mobile card fallback) but visually generic. Header row has no visual distinction from body rows in light mode. Highlighted rows (`highlight: [3]`) only differ in background color with no left accent. The total row (`tfoot`) has `font-semibold` only. The bodrost article uses this for a project timeline table — a key trust and scope signal.

**Proposed:**
1. **Header row**: add gradient background `bg-gradient-to-r from-primary/8 to-primary/4 dark:from-primary/12 dark:to-primary/6` — makes the header visually anchor without being heavy
2. **Header text**: `text-foreground font-semibold` (currently inherits — make explicit) + add `text-xs uppercase tracking-wide` to match modern data table aesthetics
3. **Highlighted rows**: add left accent border indicator: `border-l-2 border-primary` — signals "this is the featured row"
4. **Total row (`tfoot`)**: increase weight — `bg-muted/50 font-bold text-foreground` + top border `border-t-2 border-border`
5. **Row hover**: `hover:bg-primary/5 transition-colors duration-150` (desktop only — already present but ensure consistent)
6. **Caption**: style as `text-xs text-muted-foreground text-center mt-3 italic` — softer, reads as metadata

**Files:**
- `src/components/blocks/TableBlock.tsx`

---

## F10. Heading block — visual section anchors for h2

**Priority:** Low (navigation and content hierarchy)
**Impact:** `src/components/blocks/HeadingBlock.tsx`

**Current state:**
All heading levels render as plain bold text with no visual differentiators:

```tsx
// HeadingBlock.tsx
const TAG = level === 2 ? 'h2' : level === 3 ? 'h3' : 'h4';
// h2: text-2xl md:text-3xl font-bold
// h3: text-xl md:text-2xl font-semibold
// h4: text-base md:text-lg font-semibold
```

In a long portfolio article (bodrost has 7 h2 + 7 h3 + 2 h4), h2 and h3 look nearly identical because the size difference is subtle and there are no structural visual cues.

**Proposed:**
1. **h2**: add a short gradient accent bar below or beside the heading:
   ```tsx
   <h2 ...>
     {text}
     <div className="mt-2 h-0.5 w-12 rounded-full bg-gradient-to-r from-primary to-accent" />
   </h2>
   ```
   This creates a visual "chapter start" signal without adding decorative clutter.
2. **h3**: increase contrast differentiation — add `text-foreground` explicitly (currently may inherit muted) + slightly more `mt-` spacing above the block in `BlockRenderer` (`py-4` → use `pt-6 pb-2` for h3 specifically)
3. **h4**: no changes needed — subdued role is appropriate

**Files:**
- `src/components/blocks/HeadingBlock.tsx`
- `src/components/blocks/BlockRenderer.tsx` (h3 spacing adjustment)

---

## F11. Video block — branded play button and lazy iframe

**Priority:** Low (performance + visual consistency)
**Impact:** `src/components/blocks/VideoBlock.tsx`

**Current state:**
YouTube videos embed directly as `<iframe src="...autoplay...">` — the iframe loads YouTube's full player immediately on page load. This adds ~400KB of network overhead and renders YouTube's generic red play button, breaking the agency's brand aesthetic. The bodrost article uses this for a project timelapse video.

**Proposed:**
1. For YouTube: implement a "facade" pattern — show a thumbnail image with custom play button until user clicks:
   ```tsx
   const [playing, setPlaying] = useState(false);
   const thumbUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

   if (!playing) {
     return (
       <div onClick={() => setPlaying(true)} className="group relative cursor-pointer overflow-hidden rounded-xl">
         <img src={thumbUrl} className="w-full object-cover" />
         {/* Gradient overlay */}
         <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/40" />
         {/* Branded play button */}
         <div className="absolute inset-0 flex items-center justify-center">
           <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg transition-transform group-hover:scale-110">
             <Play size={24} fill="white" className="ml-1 text-white" />
           </div>
         </div>
       </div>
     );
   }
   ```
2. Only load the iframe after click — saves ~400KB per video on page load
3. Respect the existing `caption` and aspect ratio logic
4. Rutube: same facade pattern using Rutube thumbnail API
5. Local video files: keep `<video controls>` as-is

**Files:**
- `src/components/blocks/VideoBlock.tsx`

---

## F12. Gallery block — stagger reveal and hover treatment

**Priority:** Low (visual showcase, browsability)
**Impact:** `src/components/blocks/GalleryBlock.tsx`

**Current state:**
The gallery block passes all images to `ImageGallery` which handles the lightbox. Thumbnails render in a grid with no hover state visible from the block level — just the OptimizedImage component. In the bodrost article, this shows three project images (facade, packaging, brand guide).

**Proposed:**
1. Add stagger-reveal entrance to gallery thumbnails: each thumbnail fades + scales in with `index * 80ms` delay on viewport entry
2. Add hover overlay on each thumbnail:
   ```tsx
   <div className="group relative cursor-pointer overflow-hidden rounded-lg">
     <OptimizedImage className="transition-transform duration-500 group-hover:scale-105" />
     <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/30 group-hover:opacity-100">
       <ZoomIn size={24} className="text-white" />
     </div>
   </div>
   ```
3. Improve grid layout: use `aspect-[4/3]` ratio for consistent thumbnail sizes (currently images may have variable heights)
4. Add `focus-ring` utility to each clickable thumbnail for keyboard accessibility

**Files:**
- `src/components/blocks/GalleryBlock.tsx`

---

## F13. Code block — syntax highlighting and copy button

**Priority:** Low (developer-facing content, polish)
**Impact:** `src/components/blocks/CodeBlock.tsx`

**Current state:**
Code blocks render as a plain `pre/code` with `bg-muted` background. No syntax coloring. The language badge is a cosmetic label only. The bodrost article uses this for JSON design tokens — a client technical deliverable that should look polished:

```tsx
// CodeBlock.tsx
<pre className="overflow-x-auto rounded-b-lg bg-muted p-4 text-sm">
  <code className={cn('font-mono', block.language && `language-${block.language}`)}>
    {block.code}
  </code>
</pre>
```

**Proposed:**
1. Add a **copy-to-clipboard button** in the top-right corner of the code block (top bar area):
   ```tsx
   <button onClick={() => navigator.clipboard.writeText(block.code)} className="...">
     {copied ? <Check size={14} /> : <Copy size={14} />}
   </button>
   ```
   Use `useState(false)` + 2s timeout for `copied` feedback.
2. **Dark background** for code area: `bg-neutral-900 dark:bg-neutral-950 text-neutral-100` — code always looks better on dark background, regardless of page theme
3. **Basic JSON syntax coloring** via CSS + `dangerouslySetInnerHTML` with a lightweight client-side tokenizer (no external deps):
   - Keys: `text-sky-300`
   - Strings: `text-emerald-300`
   - Numbers: `text-amber-300`
   - Booleans/null: `text-rose-400`
   Implement as a `tokenizeJson(code: string): string` function that replaces tokens with `<span class="...">` tags. Only for `language: "json"` — all other languages keep plain text.
4. Line number gutter (optional field `showLineNumbers`): left column of line numbers in `text-neutral-500`

**Files:**
- `src/components/blocks/CodeBlock.tsx`

---

## Implementation Priority

### Phase 1 — Conversion Impact (implement first)
| Item | Description | Effort |
|------|-------------|--------|
| F1 | Order-form block premium container | Small |
| F2 | Metrics count-up animation | Small |
| F3 | Blockquote editorial design | Small |
| F4 | Cards hover states | Small |

### Phase 2 — Data Visualization Modernization
| Item | Description | Effort |
|------|-------------|--------|
| F5 | Progress chart modern bars + animation | Small |
| F6 | Bar/Line/H-bar scroll-triggered animations | Medium |
| F7 | Pie chart animated segment entry | Small |
| F8 | Callout variant differentiation | Small |

### Phase 3 — Content Quality Polish
| Item | Description | Effort |
|------|-------------|--------|
| F9 | Heading h2 section anchors | Small |
| F10 | Heading h3 spacing | Trivial |
| F11 | Video lazy facade pattern | Medium |
| F12 | Gallery stagger + hover | Small |
| F13 | Code copy button + dark bg | Small |
| F14 | Code JSON syntax coloring | Medium |

---

## Validation Sequence

After each item:
```bash
pnpm format && pnpm lint && pnpm typecheck && pnpm build
```

Visual verification checklist per item:
1. Light mode + dark mode
2. Mobile (375px) and desktop (1440px)
3. `prefers-reduced-motion: reduce` — animations must skip gracefully
4. Keyboard navigation (Tab key) — all interactive elements reachable

---

## Done

- **F1 ✅**: Order-form block premium CTA container — branded rounded-3xl container with gradient bg, decorative blobs, trust badge row (ShieldCheck/Clock/Star), gradient title text
- **F2 ✅**: Metrics block scroll-triggered count-up — `MetricCard` sub-component with regex parsing (prefix/num/suffix), `useViewportAnimation` (triggerOnce + reduced-motion), `useCountUp` staggered 150ms, stagger entrance with `animationFillMode: both`, `count-pop` + `suffix-fade-in` on completion
- **F3 ✅**: Blockquote editorial design — `rounded-2xl border bg-card shadow-sm` card, large decorative `"` in `text-primary/10`, `text-xl font-heading` quote text, author avatar initial circle (`bg-primary/10`), `border-t` separator before attribution
- **F5 ✅**: Progress chart modern bars + scroll animation — `h-2` → `h-3` bars, `useViewportAnimation` (triggerOnce + reduced-motion), width animates `0% → pct%` with `cubic-bezier(0.25,1,0.5,1)` per bar, `index*100ms` stagger, value label fades in 600ms after bar start
- **F6 ✅**: Bar/Line/H-bar scroll-triggered Recharts animations — each chart mounts Recharts only on viewport entry via `useViewportAnimation`; placeholder `<div style={{ height }}/>` holds space until in-view; `isAnimationActive={true}` + `animationDuration={800}` + `animationEasing="ease-out"` ensures fresh animation on entry
- **F7 ✅**: Pie/Donut chart animated segment entry — `useViewportAnimation` (triggerOnce + reduced-motion) added; segments animate from `0 CIRCUMFERENCE` → actual `dash gap` values with `0.6s ease-out` + `index * 100ms` stagger; legend fades in after last segment completes
- **F9 ✅**: Table block data visualization upgrade — header gradient `from-primary/20 to-primary/12 dark:from-primary/40 dark:to-primary/30` + `text-xs uppercase tracking-wide`; highlighted rows `border-l-2 border-l-primary bg-primary/5 dark:bg-primary/20`; hover uses neutral `muted/80 dark:muted/90` (distinct from selection); odd rows `dark:bg-muted/40`; tfoot `bg-muted/50 dark:bg-muted/70 font-bold`; caption moved below table as `mt-3 text-center italic`; dark mode opacity boosted throughout
