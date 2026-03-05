# 004 — Image preview gallery for PortfolioCasePage

## Goal

Replace the current flat image grid in `CaseGallery` with an interactive image preview component: a large selected image with description, a horizontal scrollable thumbnail strip for navigation, and prev/next buttons. Update the portfolio data schema to support per-image descriptions. The gallery component itself (`ImageGallery`) lives in `src/components/ui/` and is reusable across any page — not tied to portfolio.

---

## Current state

- `CaseGallery.tsx` (43 lines) renders a simple responsive grid of `<img>` tags
- `PortfolioCase.images.gallery` is `string[]` — URLs only, no descriptions
- `content.portfolioCase` has `galleryTitle` and `photoAlt` (with `{title}` / `{index}` template tokens)
- The gallery section is rendered inside `PortfolioCasePage.tsx` at line 95-97

---

## Schema changes

### Phase 1 — Update `PortfolioCase` type and data

**1.1 Extend `images.gallery` to support descriptions**

Change `gallery` from `string[]` to an array of objects with optional `description`:

```ts
// src/types/portfolio.ts
export interface GalleryImage {
  src: string;
  description?: string;
}

export interface PortfolioCase {
  // ... existing fields ...
  images?: {
    preview?: string;
    og?: string;
    gallery?: GalleryImage[];  // was string[]
  };
}
```

**1.2 Update `data/_schema/portfolio.example.json`**

Update the `images.gallery` section:

```json
"gallery": [
  {
    "src": "/images/portfolio/example-project/01.jpg",
    "description": "Описание первого изображения"
  },
  {
    "src": "/images/portfolio/example-project/02.jpg",
    "_comment": "description is optional"
  }
]
```

**1.3 Migrate `data/portfolio/bodrost.json`**

Convert `gallery` strings to objects:

```json
"gallery": [
  { "src": "/images/portfolio/bodrost/01.jpg", "description": "Новый логотип «Бодрость» на фасаде кофейни" },
  { "src": "/images/portfolio/bodrost/02.jpg", "description": "Фирменная упаковка и стаканчики" },
  { "src": "/images/portfolio/bodrost/03.jpg", "description": "Страницы бренд-гайдлайна" }
]
```

**1.4 Update `content.example.json` — add imageGallery UI labels**

Add a new top-level `imageGallery` section (not nested under `portfolioCase` — this is a shared UI component):

```json
"imageGallery": {
  "prevLabel": "Предыдущее фото",
  "nextLabel": "Следующее фото",
  "counter": "{current} из {total}"
}
```

**1.5 Update `Content` type in `src/types/content.ts`**

Add the new `imageGallery` section to the `Content` type:

```ts
imageGallery: {
  prevLabel: string;
  nextLabel: string;
  counter: string;
};
```

---

## Component changes

### Phase 2 — Create reusable `ImageGallery` in `src/components/ui/`

Target: `src/components/ui/imageGallery/` — a self-contained, reusable gallery component with no portfolio-specific logic.

**2.1 Create `src/components/ui/imageGallery/ImageGalleryPreview.tsx`**

Large image display area with description.

```tsx
interface ImageGalleryPreviewProps {
  src: string;
  alt: string;
  description?: string;
}
```

Renders:
- Full-width image container with `rounded-2xl overflow-hidden`, max-height constraint (e.g. `max-h-[560px]`)
- Image with `object-cover w-full`
- Instant swap on image change
- Below the image: description text (if present) in `text-sm text-muted-foreground` with subtle left border accent

Estimated: ~25 lines.

**2.2 Create `src/components/ui/imageGallery/ImageGalleryThumbnails.tsx`**

Horizontal scrollable thumbnail strip.

```tsx
interface ImageGalleryThumbnailsProps {
  images: { src: string }[];
  activeIndex: number;
  onSelect: (index: number) => void;
  altPrefix: string;
}
```

Renders:
- Horizontal `flex gap-2 overflow-x-auto` container with snap scrolling (`scroll-snap-type: x mandatory`)
- Each thumbnail: `w-20 h-14 sm:w-24 sm:h-16` with `rounded-lg overflow-hidden cursor-pointer`
- Active thumbnail: `ring-2 ring-primary` border
- Inactive thumbnails: `opacity-60 hover:opacity-100` transition
- Thumbnail container auto-scrolls to keep active thumbnail visible (via `scrollIntoView`)

Estimated: ~35 lines.

**2.3 Create `src/components/ui/imageGallery/ImageGalleryNav.tsx`**

Prev/next navigation buttons + image counter.

```tsx
interface ImageGalleryNavProps {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  prevLabel: string;
  nextLabel: string;
  counterTemplate: string;  // e.g. "{current} из {total}"
}
```

Renders:
- Flex row with prev button, counter text, next button
- Buttons use `ChevronLeft` / `ChevronRight` from lucide-react (direct import OK for ui/ components)
- Wrap-around navigation (consistent with carousel)
- Buttons: subtle `bg-muted hover:bg-muted/80 rounded-full p-2` style

Estimated: ~25 lines.

**2.4 Create `src/components/ui/imageGallery/index.tsx`**

Orchestrator — the public API of the component.

```tsx
export interface ImageGalleryItem {
  src: string;
  description?: string;
}

export interface ImageGalleryProps {
  images: ImageGalleryItem[];
  altPrefix: string;           // e.g. "Бодрость — фото"
  prevLabel: string;
  nextLabel: string;
  counterTemplate: string;
  className?: string;
}
```

State:
- `activeIndex` (number, default 0)
- Keyboard navigation: left/right arrows change image when gallery container is focused

Composition:
```
<div tabIndex={0} onKeyDown={...} className={className}>
  <ImageGalleryPreview src={...} alt={...} description={...} />
  <div className="flex items-center justify-between mt-4">
    <ImageGalleryNav ... />
  </div>
  {images.length > 1 && (
    <ImageGalleryThumbnails ... />
  )}
</div>
```

- No `<section>`, `<Container>`, or `<h2>` — the caller wraps it as needed
- Single image: hides thumbnails and nav

Estimated: ~40 lines.

---

### Phase 3 — Update portfolio integration

**3.1 Refactor `CaseGallery.tsx` in place**

`CaseGallery` stays at `src/components/portfolio/CaseGallery.tsx` but becomes a thin wrapper:

```tsx
import { ImageGallery } from '@/components/ui/imageGallery';
import { Container } from '@/components/layout/Container';
import { content } from '@/types/content';
import type { GalleryImage } from '@/types/portfolio';

interface CaseGalleryProps {
  gallery: GalleryImage[];
  caseTitle: string;
}

export function CaseGallery({ gallery, caseTitle }: CaseGalleryProps) {
  const { galleryTitle, photoAlt } = content.portfolioCase;
  const { prevLabel, nextLabel, counter } = content.imageGallery;

  return (
    <section className="bg-muted/40 py-16">
      <Container>
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-2xl font-bold md:text-3xl">{galleryTitle}</h2>
          <ImageGallery
            images={gallery}
            altPrefix={photoAlt.replace('{title}', caseTitle)}
            prevLabel={prevLabel}
            nextLabel={nextLabel}
            counterTemplate={counter}
          />
        </div>
      </Container>
    </section>
  );
}
```

Estimated: ~25 lines. No import path changes needed in `PortfolioCasePage.tsx`.

---

## Design decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Component location | `src/components/ui/imageGallery/` | Reusable UI primitive — not portfolio-specific |
| No section/container/heading inside ImageGallery | Caller provides wrapping | Keeps component context-agnostic |
| Labels passed as props (not read from content) | Props-driven | Decouples from specific content.json structure; any page can use its own labels |
| `ImageGalleryItem` interface in index.tsx | Co-located with component | `GalleryImage` in portfolio.ts extends/matches this shape but data types stay in types/ |
| Wrap-around navigation | Yes — prev on first goes to last, next on last goes to first | Consistent with carousel behavior elsewhere on site |
| Keyboard navigation | Left/right arrows when gallery container has focus | Accessibility + power user convenience |
| Image transition | Instant swap (no crossfade) | Keep it simple; gallery images are static, not a slideshow |
| Thumbnail scroll behavior | `scrollIntoView({ behavior: 'smooth', inline: 'center' })` | Keeps active thumb visible without jump |
| Single image fallback | If 1 image, hide thumbnails strip and nav buttons | No point showing navigation for single image |
| Description placement | Below main image, left-aligned, with `border-l-2 border-primary pl-3` | Subtle accent that ties to brand without being heavy |

---

## Execution order & dependencies

```
Phase 1 (Schema) — must be first; all other phases depend on the new GalleryImage type
  1.1 Update PortfolioCase type (add GalleryImage, change gallery field)
  1.2 Update schema example
  1.3 Migrate bodrost.json data
  1.4 Update content.example.json (add imageGallery section)
  1.5 Update Content type

Phase 2 (ImageGallery component) — depends on Phase 1
  2.1 ImageGalleryPreview.tsx
  2.2 ImageGalleryThumbnails.tsx
  2.3 ImageGalleryNav.tsx
  2.4 ImageGallery/index.tsx orchestrator

Phase 3 (Integration) — depends on Phase 2
  3.1 Refactor CaseGallery.tsx to use ImageGallery
```

---

## New / changed files summary

| Phase | File | Action |
|-------|------|--------|
| 1.1 | `src/types/portfolio.ts` | Edit — add `GalleryImage`, change `gallery` type |
| 1.2 | `data/_schema/portfolio.example.json` | Edit — update gallery format |
| 1.3 | `data/portfolio/bodrost.json` | Edit — migrate gallery to objects |
| 1.4 | `data/_schema/content.example.json` | Edit — add `imageGallery` section |
| 1.5 | `src/types/content.ts` | Edit — add `imageGallery` to Content type |
| 2.1 | `src/components/ui/imageGallery/ImageGalleryPreview.tsx` | Create (~25 lines) |
| 2.2 | `src/components/ui/imageGallery/ImageGalleryThumbnails.tsx` | Create (~35 lines) |
| 2.3 | `src/components/ui/imageGallery/ImageGalleryNav.tsx` | Create (~25 lines) |
| 2.4 | `src/components/ui/imageGallery/index.tsx` | Create (~40 lines) |
| 3.1 | `src/components/portfolio/CaseGallery.tsx` | Edit — replace grid with ImageGallery wrapper (~25 lines) |

Total: 4 new files, 6 edited files, 0 deleted files.

---

## Result

| Metric | Before | After |
|--------|--------|-------|
| Gallery UX | Flat grid, no interaction | Selected preview + thumbnails + nav + descriptions |
| ImageGallery (new, reusable) | — | ~125 lines across 4 files (~31 avg) |
| CaseGallery.tsx | 43 lines (grid) | ~25 lines (thin wrapper) |
| Max component size | 43 | ~40 (ImageGallery orchestrator) |
| Schema richness | URL-only strings | Structured objects with optional descriptions |
| Accessibility | Alt text only | Alt text + keyboard nav + nav button labels |
| Reusability | Portfolio-only | Any page can use `<ImageGallery>` with its own labels/data |
