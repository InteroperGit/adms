# Images & Lazy Loading

## OptimizedImage Component

**Location**: `src/components/ui/OptimizedImage.tsx`

Drop-in `<img>` replacement with WebP srcset variants, native browser lazy loading, and animated Skeleton placeholder for improved UX.

### Props

```typescript
interface OptimizedImageProps {
  src: string;                        // Image path under /images/, e.g. /images/portfolio/hero.jpg
  alt: string;                        // Alt text for accessibility
  sizes?: string;                     // Responsive sizes string. Default: '100vw'
  priority?: boolean;                 // true → eager loading, skips skeleton; false → lazy loading with skeleton
  width?: number;                     // Explicit image width
  height?: number;                    // Explicit image height
  className?: string;                 // CSS classes for wrapper container (sizing, rounding, positioning)
  imgClassName?: string;              // CSS classes for <img> element (object-fit, etc.)
  aspectRatio?: string;               // CSS aspect ratio for container (e.g. '16/9')
  objectFit?: 'cover' | 'contain' | 'fill';  // CSS object-fit. Default: 'cover'
}
```

### Usage Patterns

#### Standard lazy-loaded image with skeleton
```tsx
<OptimizedImage
  src="/images/portfolio/case-thumb.jpg"
  alt="Case thumbnail"
  sizes="(max-width: 768px) 100vw, 50vw"
  className="rounded-lg w-full max-w-2xl"
  imgClassName="object-cover"
/>
```

#### Priority image (above fold, no skeleton)
```tsx
<OptimizedImage
  src="/images/hero.jpg"
  alt="Hero"
  sizes="100vw"
  priority
  className="absolute inset-0 h-full w-full"
  imgClassName="object-cover"
/>
```

#### Image with custom aspect ratio
```tsx
<OptimizedImage
  src="/images/photo.jpg"
  alt="Photo"
  sizes="400px"
  className="w-full"
  aspectRatio="16/9"
  imgClassName="object-contain"
/>
```

### How It Works

1. **Rendering**:
   - Dev mode: renders plain `<img>`
   - Prod mode: renders `<picture>` with WebP `<source>` + fallback `<img>`

2. **Loading State**:
   - Lazy images (`priority=false`): start with `loaded=false`, show Skeleton placeholder
   - Priority images (`priority=true`): start with `loaded=true`, skip skeleton (eager load)
   - Native browser `loading="lazy"` handles viewport-aware image requests

3. **Fade-in Transition**:
   - On `onLoad` or `onError`: sets `loaded=true`
   - Image: `opacity-0` → `opacity-100` via `transition-opacity duration-300`
   - Skeleton disappears once loaded

4. **Container**:
   - Wrapper `<div className="relative overflow-hidden">` applies `className` props
   - Handles layout sizing, rounding, positioning
   - Inline styles for `width`, `height`, `aspectRatio` when provided

5. **Image Element**:
   - Classes: `w-full h-full object-${objectFit} transition-opacity duration-300 ${imgClassName}`
   - `onLoad` and `onError` both set `loaded=true` (removes skeleton even on broken images)

### Key Design Decisions

- **className vs imgClassName split**: Consumers that previously applied `object-cover` directly to `<img>` now split sizing/rounding (wrapper) from fit (image). This is cleaner and more flexible.
- **No custom Intersection Observer**: Native browser `loading="lazy"` is efficient and sufficient; no need for custom scroll tracking.
- **Skeleton always for lazy images**: Provides visual feedback that something is loading; improves perceived performance.
- **Priority images skip skeleton**: Above-fold images load eagerly anyway; skeleton would just flash.

## Skeleton Component

**Location**: `src/components/ui/skeleton.tsx`

Animated placeholder div with shimmer effect.

```tsx
<Skeleton className="w-full h-32 rounded-lg" />
```

- Generated via `pnpm dlx shadcn@latest add skeleton`
- Classes: `animate-pulse rounded-md bg-muted`
- Dark-mode compatible (uses semantic `bg-muted` token)
- Can be reused for any async content (not just images)

## Updated Consumers

All 7 image consumers updated to split `className` and `imgClassName` (March 2026):

| Component | File | Notes |
|-----------|------|-------|
| ImageBlock | `src/components/blocks/ImageBlock.tsx` | Responsive figure with captions |
| CaseHero | `src/components/portfolio/CaseHero.tsx` | Hero image, priority=true, dark overlay |
| CarouselSlide | `src/components/sections/carousel/CarouselSlide.tsx` | Carousel slides, first image prioritized |
| ImageGalleryLightbox | `src/components/ui/imageGallery/ImageGalleryLightbox.tsx` | Main + thumbnail images |
| ImageGalleryPreview | `src/components/ui/imageGallery/ImageGalleryPreview.tsx` | Gallery preview with hover description |
| ImageGalleryThumbnails | `src/components/ui/imageGallery/ImageGalleryThumbnails.tsx` | Horizontal thumbnail strip |
| PortfolioThumbnail | `src/components/ui/portfolio/PortfolioThumbnail.tsx` | Portfolio card with gradient fallback |

## Implementation Notes

- All changes are **SSG-compatible**: no client-side-only features, hydration-safe
- `useState(priority)` is deterministic: no hydration mismatch
- Skeleton renders server-side; `loaded` state updates client-side on image load
- Build verified: `pnpm build` produces 32 pages without errors
