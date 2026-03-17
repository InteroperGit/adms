# Plan: Lazy image loading with Skeleton in OptimizedImage

**Status**: ✅ Task 1 Complete — Skeleton + OptimizedImage loading states implemented
**Date**: 2026-03-15
**Completed**: 2026-03-15 (all 7 consumers updated, className/imgClassName split done)

## Goal

Add a visual loading state (Skeleton placeholder) to `OptimizedImage` so that users see an animated shimmer instead of empty space while images lazy-load. Currently `loading="lazy"` is set but there is no placeholder — the area is blank until the image decodes.

## Current State

- **`src/components/ui/OptimizedImage.tsx`** — renders `<picture>` (prod) or `<img>` (dev) with `loading="lazy"` + `decoding="async"` by default; `priority` prop switches to eager loading
- **No Skeleton component** — shadcn/ui Skeleton is not installed in the project
- **8 consumers** of OptimizedImage across the codebase:
  1. `src/components/blocks/ImageBlock.tsx` — portfolio case images with captions
  2. `src/components/portfolio/CaseHero.tsx` — hero image (`priority={true}`)
  3. `src/components/sections/carousel/CarouselSlide.tsx` — carousel slides
  4. `src/components/ui/imageGallery/ImageGalleryLightbox.tsx` — lightbox main + thumbnails
  5. `src/components/ui/imageGallery/ImageGalleryPreview.tsx` — gallery preview
  6. `src/components/ui/imageGallery/ImageGalleryThumbnails.tsx` — gallery thumbnail strip
  7. `src/components/ui/portfolio/PortfolioThumbnail.tsx` — portfolio card thumbnails
- **No existing loading state patterns** anywhere in the image pipeline

## Steps

### 1. Add shadcn/ui Skeleton component

Run `pnpm dlx shadcn@latest add skeleton` to generate `src/components/ui/skeleton.tsx`.

This gives a simple `<div>` with `animate-pulse` + `bg-primary/10` (dark-mode-safe, uses semantic tokens).

### 2. Add loading state logic to OptimizedImage

Modify `src/components/ui/OptimizedImage.tsx`:

- Add `useState<boolean>(false)` for `loaded` status (start as not loaded)
- Add `onLoad` handler on `<img>` that sets `loaded = true`
- **Skip skeleton for priority images** — they load eagerly above the fold, no shimmer needed; set `loaded = true` initially when `priority` is true
- Wrap the component in a `<div className="relative">` container:
  - Render `<Skeleton>` behind the image when `!loaded`
  - The `<picture>`/`<img>` sits on top, with `opacity-0` while loading and `opacity-100 transition-opacity duration-300` once loaded
- Preserve the existing `className` prop behavior — pass it to the container `<div>`, not the inner `<img>`, so that layout classes (sizing, rounding, etc.) apply correctly to the wrapper. The `<img>` gets `w-full h-full object-cover` (or inherits from wrapper)
- The Skeleton should match the image dimensions: use `w-full h-full absolute inset-0` to fill the container

#### Proposed component structure

```tsx
<div className={cn('relative overflow-hidden', className)}>
  {!loaded && (
    <Skeleton className="absolute inset-0 w-full h-full" />
  )}
  <picture> {/* or <img> in dev */}
    <img
      ...
      className={cn(
        'w-full h-full object-cover transition-opacity duration-300',
        loaded ? 'opacity-100' : 'opacity-0',
      )}
      onLoad={() => setLoaded(true)}
    />
  </picture>
</div>
```

### 3. Handle edge cases

- **`width` / `height` props**: When provided, set them on the wrapper `<div>` as inline styles so the Skeleton occupies the correct space before the image loads
- **Aspect ratio**: If neither `width` nor `height` is provided, the container relies on the image's intrinsic dimensions. The Skeleton collapses to 0 height without a defined size. Solutions:
  - Accept an optional `aspectRatio?: string` prop (e.g. `"16/9"`) applied as `style={{ aspectRatio }}` on the wrapper — consumers that know the ratio can pass it
  - Fallback: if no dimensions and no aspectRatio, skip the Skeleton entirely (existing behavior — no shimmer but no layout shift either)
- **`object-fit` override**: Add an optional `objectFit?: 'cover' | 'contain' | 'fill'` prop (default `'cover'`) for consumers that need different fit
- **SSR/SSG hydration**: `useState(priority)` is deterministic — no hydration mismatch. The `onLoad` fires client-side after hydration for lazy images
- **Error state**: Add `onError` handler that sets `loaded = true` to remove the Skeleton (don't leave an infinite shimmer on broken images)

### 4. Update consumers if needed

Review the 8 consumers to ensure the wrapper `<div>` doesn't break their layouts:

- **ImageBlock** — currently wraps in `<figure>`, passes `className` for sizing → should work; `className` now applies to the wrapper div
- **CaseHero** — `priority={true}` → skeleton skipped entirely, no change needed
- **CarouselSlide** — image fills the slide; ensure `w-full h-full` still works with the wrapper
- **ImageGalleryLightbox** — lightbox images with specific sizing → verify `className` passthrough
- **ImageGalleryPreview** — has hover overlay; ensure wrapper div doesn't interfere with z-stacking
- **ImageGalleryThumbnails** — small thumbnails → skeleton should work naturally
- **PortfolioThumbnail** — already has a gradient fallback div; ensure no double-placeholder (skeleton + gradient)

Key concern: some consumers apply `className` expecting it to land on `<img>` directly (e.g. `rounded-lg`, `object-cover`). Moving `className` to a wrapper `<div>` means classes like `object-cover` won't affect the image. Two options:
- **Option A (recommended)**: Split into `className` (wrapper) and `imgClassName` (inner img) — breaking change but explicit
- **Option B**: Keep `className` on `<img>` and add a separate `wrapperClassName` prop — backwards compatible but wrapper gets no consumer styling by default

Decision: **Option A** — introduce `imgClassName` for image-specific classes; migrate the 7 consumers (small effort, each usage is straightforward). This is the cleaner API long-term.

### 5. Verify

- `pnpm dev` → observe skeleton shimmer on lazy images, smooth fade-in on load
- `pnpm dev` → priority images (CaseHero) show instantly with no skeleton flash
- `pnpm dev` → break an image src → skeleton disappears on error (no infinite shimmer)
- `pnpm build` → SSG produces valid HTML; no hydration warnings in console
- `pnpm typecheck` + `pnpm lint` pass
- Visual check in dark mode — skeleton color uses semantic tokens, looks correct on dark backgrounds

## Files Affected

| Action | File |
|--------|------|
| **Create** | `src/components/ui/skeleton.tsx` (via shadcn CLI) |
| **Modify** | `src/components/ui/OptimizedImage.tsx` — add Skeleton, loading state, fade-in, new props |
| **Modify** | `src/components/blocks/ImageBlock.tsx` — adapt to className/imgClassName split |
| **Modify** | `src/components/portfolio/CaseHero.tsx` — adapt to className/imgClassName split |
| **Modify** | `src/components/sections/carousel/CarouselSlide.tsx` — adapt to className/imgClassName split |
| **Modify** | `src/components/ui/imageGallery/ImageGalleryLightbox.tsx` — adapt to className/imgClassName split |
| **Modify** | `src/components/ui/imageGallery/ImageGalleryPreview.tsx` — adapt to className/imgClassName split |
| **Modify** | `src/components/ui/imageGallery/ImageGalleryThumbnails.tsx` — adapt to className/imgClassName split |
| **Modify** | `src/components/ui/portfolio/PortfolioThumbnail.tsx` — adapt to className/imgClassName split |

## Open Questions

1. **`className` split strategy**: Option A (`className` → wrapper, add `imgClassName`) vs Option B (add `wrapperClassName`, keep `className` on img) — plan recommends Option A for cleaner API
2. **`aspectRatio` prop**: Should it be added now or deferred? Some consumers (carousel, hero) have fixed aspect ratios in parent containers, making it redundant for them
3. **Skeleton color**: Default shadcn `bg-primary/10` or custom `bg-muted` — depends on which looks better against `bg-background` and `bg-card` surfaces
4. **PortfolioThumbnail**: Already has a gradient fallback when no image — should the Skeleton replace the gradient, coexist, or only show when an image src exists?
