# 005 — Strapi-like dynamic blocks for portfolio cases

## Goal

Replace the rigid fixed-field portfolio case structure (`challenge`, `solution[]`, `results[]`) with a **dynamic content zone** — an ordered array of typed blocks, similar to Strapi's Dynamic Zones / Notion blocks. This lets each case study tell its own story with any combination and order of content blocks.

---

## Current state

Each `data/portfolio/<slug>.json` has a fixed structure:

```
gradient   → single Tailwind gradient class (hero bg only, no image support)
challenge  → single string
solution   → Array<{ title, description }>  (always 3 cards)
results    → Array<{ metric, label, description }>  (always 3 metric cards)
images.gallery → GalleryImage[]  (one gallery at the end)
testimonialId  → optional ref
```

**Problems:**
- Every case has the exact same layout — no editorial freedom
- Can't add multiple text sections, mid-article images, tables, or charts
- Can't reorder sections (e.g. show results before solution)
- Adding a new section type requires code changes to `PortfolioCasePage.tsx`
- Hero only supports gradient backgrounds — no hero images

---

## Target state

```jsonc
// data/portfolio/<slug>.json
{
  "slug": "...",
  "title": "...",
  "category": "...",
  "description": "...",     // card preview text (stays)
  "tags": ["..."],          // card tags (stays)
  "meta": { ... },          // SEO (stays)
  "overview": { ... },      // quick-facts grid (stays)

  // CHANGED: hero background — image with gradient fallback
  "hero": {
    "image": "/images/portfolio/project/hero.jpg",  // optional — shown when present
    "gradient": "from-orange-400 to-rose-500"        // Tailwind gradient — fallback when no image
  },

  // NEW: replaces challenge, solution, results, images.gallery, testimonialId
  "content": [
    { "__component": "heading", ... },
    { "__component": "paragraph", ... },
    { "__component": "image", ... },
    ...
  ],

  // images.preview and images.og stay for card thumbnail and OG image
  "images": {
    "preview": "...",
    "og": "..."
  }
}
```

The `content` array is the **dynamic zone** — an ordered list of blocks rendered top-to-bottom.

### Hero background: image + gradient fallback

The top-level `gradient` field is replaced by a `hero` object:

```jsonc
"hero": {
  "image": "/images/portfolio/project/hero.jpg",  // optional
  "gradient": "from-orange-400 to-rose-500"        // required — Tailwind gradient classes
}
```

**Rendering logic** in `CaseHero.tsx`:
- If `hero.image` exists → render as `background-image` with dark overlay for text readability
- If no `hero.image` → fall back to `bg-gradient-to-br` with the `hero.gradient` Tailwind classes (current behaviour)
- `hero.gradient` is always required — it's also used by gradient-aware blocks (`metrics`, `cards`) and by `PortfolioThumbnail` for card previews when no preview image exists

---

## Block types

### 1. `heading`

Section heading within the article body.

```jsonc
{
  "__component": "heading",
  "level": 2,          // 2 | 3 | 4
  "text": "Задача"
}
```

**Renderer:** `<h2>`/`<h3>`/`<h4>` with appropriate Tailwind sizes.

---

### 2. `paragraph`

Rich text paragraph(s). Supports basic inline markup (bold, italic, links) via a simple markdown-like subset or pre-rendered HTML.

```jsonc
{
  "__component": "paragraph",
  "text": "Описание задачи клиента — **что** было нужно и почему это было сложно.",
  "align": "left"       // "left" | "center" (optional, default "left")
}
```

**Renderer:** `<p>` with optional markdown-to-JSX conversion (use a lightweight lib like `react-markdown` with `remarkGfm`, or just `dangerouslySetInnerHTML` with sanitised HTML). Max-width `max-w-3xl mx-auto` for readability.

---

### 3. `image`

Single image with optional caption and sizing.

```jsonc
{
  "__component": "image",
  "src": "/images/portfolio/project/hero.jpg",
  "alt": "Описание изображения",
  "caption": "Подпись под изображением",   // optional
  "size": "full"                           // "small" | "medium" | "full" (optional, default "medium")
}
```

**Renderer:** `<figure>` + `<img>` + optional `<figcaption>`. Sizes:
- `small` — `max-w-md mx-auto`
- `medium` — `max-w-2xl mx-auto`
- `full` — `max-w-5xl mx-auto` (or full-bleed)

---

### 4. `gallery`

Multiple images in a lightbox-enabled gallery. Reuses existing `ImageGallery` UI component.

```jsonc
{
  "__component": "gallery",
  "images": [
    { "src": "/images/portfolio/project/01.jpg", "description": "Фасад до ребрендинга" },
    { "src": "/images/portfolio/project/02.jpg", "description": "Новый фасад" }
  ]
}
```

**Renderer:** Wraps existing `<ImageGallery>` component with labels from `imageGalleryContent`.

---

### 5. `blockquote`

Standalone quote — can reference a testimonial by ID or contain inline text.

```jsonc
// Variant A — reference existing testimonial
{
  "__component": "blockquote",
  "testimonialId": 1
}

// Variant B — inline quote
{
  "__component": "blockquote",
  "text": "Цитата клиента или партнёра.",
  "author": "Иван Иванов",
  "role": "Директор по маркетингу",    // optional
  "company": "ООО «Бодрость»"          // optional
}
```

**Renderer:** Variant A renders `<TestimonialCard>`. Variant B renders a styled `<blockquote>` with attribution.

---

### 6. `metrics`

KPI/results cards — replaces the old `results[]` field.

```jsonc
{
  "__component": "metrics",
  "title": "Результаты",                 // optional section title
  "items": [
    { "metric": "+42%", "label": "рост выручки", "description": "за 6 месяцев после запуска" },
    { "metric": "12", "label": "точек", "description": "открыто за первый год" },
    { "metric": "3 мес.", "label": "реализации", "description": "от брифа до запуска" }
  ],
  "gradient": true                        // optional — use case gradient bg (default false)
}
```

**Renderer:** Reuses `CaseResults` logic — 3-col grid of metric cards. When `gradient: true`, uses the case's `gradient` class for card backgrounds.

---

### 7. `cards`

Generic card grid — replaces the old `solution[]` field. Useful for solutions, features, services breakdown.

```jsonc
{
  "__component": "cards",
  "title": "Решение",                     // optional section title
  "columns": 3,                           // 2 | 3 | 4 (optional, default 3)
  "items": [
    { "title": "Логотип", "description": "Разработали новый знак и логотип..." },
    { "title": "Айдентика", "description": "Создали систему визуальных элементов..." },
    { "title": "Брендбук", "description": "Оформили все решения в руководство..." }
  ],
  "gradient": true                        // optional — accent bar uses case gradient
}
```

**Renderer:** Reuses `CaseSolution` logic — grid of white cards with optional gradient accent bar.

---

### 8. `table`

Tabular data (pricing, comparison, timeline).

```jsonc
{
  "__component": "table",
  "title": "Этапы работ",                 // optional
  "caption": "Сроки и стоимость по этапам", // optional
  "head": ["Этап", "Срок", "Результат"],
  "rows": [
    ["Аудит", "2 недели", "Отчёт с рекомендациями"],
    ["Дизайн", "4 недели", "3 концепции на выбор"],
    ["Реализация", "6 недель", "Готовые макеты и гайдлайны"]
  ],
  "highlight": [0]                        // optional — row indices to highlight
}
```

**Renderer:** Responsive `<table>` with Tailwind styling (striped rows, header bg, border). On mobile, horizontal scroll or stacked layout.

---

### 9. `chart`

Data visualisation for metrics, comparisons, timelines.

```jsonc
{
  "__component": "chart",
  "type": "bar",                           // "bar" | "horizontal-bar" | "progress" | "line" | "pie"
  "title": "Рост ключевых показателей",    // optional
  "items": [
    { "label": "Узнаваемость", "value": 78, "suffix": "%" },
    { "label": "Лояльность", "value": 65, "suffix": "%" },
    { "label": "Конверсия", "value": 42, "suffix": "%" }
  ],
  "color": "gradient"                      // "gradient" | "primary" | "accent" (optional)
}
```

**Renderer:** Pure CSS/SVG + Tailwind (no chart library needed). Types:
- `bar` — vertical bars with labels below
- `horizontal-bar` — horizontal bars with labels on the left
- `progress` — progress-bar style (thin horizontal bars, value on right)
- `line` — SVG `<polyline>` connecting data points, dots at each value, labels on x-axis
- `pie` — SVG circle with `stroke-dasharray` segments, legend below

No heavy chart libraries — keep bundle lean per project conventions. `line` and `pie` use inline SVG with Tailwind color classes.

---

### 10. `divider`

Visual separator between content sections.

```jsonc
{
  "__component": "divider",
  "style": "line"                          // "line" | "dots" | "space" (optional, default "line")
}
```

**Renderer:**
- `line` — `<hr>` with `border-border`
- `dots` — three centered dots
- `space` — empty `<div>` with `py-8`

---

### 11. `callout`

Highlighted info/note/warning box.

```jsonc
{
  "__component": "callout",
  "type": "info",                          // "info" | "success" | "warning" | "note"
  "title": "Важно",                        // optional
  "text": "Все показатели измерены через 6 месяцев после запуска."
}
```

**Renderer:** Colored left-border box with icon (from `ICON_MAP`) — similar to GitHub/Notion callouts.

---

### 12. `list`

Ordered or unordered list.

```jsonc
{
  "__component": "list",
  "style": "unordered",                   // "ordered" | "unordered" | "checklist"
  "items": [
    "Первый пункт",
    "Второй пункт",
    "Третий пункт"
  ]
}
```

**Renderer:** `<ul>` / `<ol>` / styled checklist with Tailwind `list-disc` / `list-decimal`.

---

### 13. `video`

Embedded video player.

```jsonc
{
  "__component": "video",
  "url": "https://www.youtube.com/watch?v=...",  // YouTube, Rutube, or local path
  "caption": "Видео о проекте",                  // optional
  "aspectRatio": "16/9"                           // optional, default "16/9"
}
```

**Renderer:** `<iframe>` for YouTube/Rutube (extract embed URL), `<video>` for local files. `<figure>` wrapper with optional `<figcaption>`.

---

### 14. `code`

Code snippet block.

```jsonc
{
  "__component": "code",
  "language": "json",                      // optional — for syntax highlight class
  "code": "{\n  \"key\": \"value\"\n}",
  "caption": "Пример конфигурации"         // optional
}
```

**Renderer:** `<pre><code>` with Tailwind monospace styling and bg-muted. No syntax highlighting library — just a styled code block.

---

## Migration mapping

How current fixed fields map to the new structure:

| Current field | New equivalent |
|---|---|
| `gradient` (string) | `hero.gradient` (inside `hero` object) |
| — (no image) | `hero.image` (NEW optional field) |
| `challenge` (string) | `heading` (level 2) + `paragraph` block |
| `solution[]` | `heading` (level 2) + `cards` block |
| `results[]` | `metrics` block (with `gradient: true`) |
| `images.gallery` | `gallery` block |
| `testimonialId` | `blockquote` block (variant A, with `testimonialId`) |

**Example — migrated `bodrost.json`:**

```jsonc
{
  "slug": "bodrost",
  "title": "...",
  "hero": {
    "image": "/images/portfolio/bodrost/hero.jpg",
    "gradient": "from-amber-500 to-orange-600"
  },
  // ... other top-level fields ...
  "content": [
    { "__component": "heading", "level": 2, "text": "Задача" },
    { "__component": "paragraph", "text": "«Бодрость» — региональная сеть кофеен..." },
    { "__component": "cards", "title": "Решение", "items": [...], "gradient": true },
    { "__component": "gallery", "images": [...] },
    { "__component": "metrics", "items": [...], "gradient": true },
    { "__component": "blockquote", "testimonialId": 1 }
  ]
}
```

---

## Tasks

---

### Task 1 — Block type system

Create `src/types/portfolio/blocks.ts` with discriminated union types for all 14 block types.

**Create:**
- `src/types/portfolio/blocks.ts`

**What to do:**
- Define each block as an exported interface with `__component` literal discriminator:
  ```ts
  export interface HeadingBlock { __component: 'heading'; level: 2 | 3 | 4; text: string }
  export interface ParagraphBlock { __component: 'paragraph'; text: string; align?: 'left' | 'center' }
  export interface ImageBlock { __component: 'image'; src: string; alt: string; caption?: string; size?: 'small' | 'medium' | 'full' }
  export interface GalleryBlock { __component: 'gallery'; images: GalleryImage[] }
  export interface BlockquoteRefBlock { __component: 'blockquote'; testimonialId: number }
  export interface BlockquoteInlineBlock { __component: 'blockquote'; text: string; author: string; role?: string; company?: string }
  export interface MetricsBlock { __component: 'metrics'; title?: string; items: { metric: string; label: string; description: string }[]; gradient?: boolean }
  export interface CardsBlock { __component: 'cards'; title?: string; columns?: 2 | 3 | 4; items: { title: string; description: string }[]; gradient?: boolean }
  export interface TableBlock { __component: 'table'; title?: string; caption?: string; head: string[]; rows: string[][]; highlight?: number[] }
  export interface ChartBlock { __component: 'chart'; type: 'bar' | 'horizontal-bar' | 'progress' | 'line' | 'pie'; title?: string; items: { label: string; value: number; suffix?: string }[]; color?: 'gradient' | 'primary' | 'accent' }
  export interface DividerBlock { __component: 'divider'; style?: 'line' | 'dots' | 'space' }
  export interface CalloutBlock { __component: 'callout'; type: 'info' | 'success' | 'warning' | 'note'; title?: string; text: string }
  export interface ListBlock { __component: 'list'; style: 'ordered' | 'unordered' | 'checklist'; items: string[] }
  export interface VideoBlock { __component: 'video'; url: string; caption?: string; aspectRatio?: string }
  export interface CodeBlock { __component: 'code'; language?: string; code: string; caption?: string }
  ```
- Export `ContentBlock` union of all block types
- Import `GalleryImage` from `./index` (already exists)

**Verify:**
1. `pnpm format`
2. `pnpm tsc -b --noEmit` — file compiles with no errors
3. `pnpm lint` — no new lint errors

---

### Task 2 — Update PortfolioCase interface & hero type

Modify `src/types/portfolio/index.ts` to use the new `hero` object and `content[]` zone.

**Modify:**
- `src/types/portfolio/index.ts`

**What to do:**
- Import `ContentBlock` from `./blocks`
- Replace `gradient: string` → `hero: { image?: string; gradient: string }`
- Remove fields: `challenge`, `solution`, `results`, `testimonialId`
- Replace `images?: { preview?: string; og?: string; gallery?: GalleryImage[] }` → `images?: { preview?: string; og?: string }` (gallery moves to content blocks)
- Add `content: ContentBlock[]`
- Keep unchanged: `slug`, `title`, `category`, `description`, `tags`, `meta`, `overview`

**Verify:**
1. `pnpm format`
2. `pnpm tsc -b --noEmit` — expect errors in components that read old fields (will be fixed in later tasks)
3. `pnpm lint` — no new lint errors in modified files

---

### Task 3 — Update CaseHero (image + gradient fallback)

Modify `CaseHero.tsx` to accept the new `hero` prop and render image bg or gradient fallback.

**Modify:**
- `src/components/portfolio/CaseHero.tsx`

**What to do:**
- Change props: replace `gradient: string` with `hero: { image?: string; gradient: string }`
- When `hero.image` present → render with `background-image: url(...)` + `bg-cover bg-center` + dark overlay (`bg-black/50` or `bg-black/40`) for text readability
- When no `hero.image` → render `bg-gradient-to-br` with `hero.gradient` classes (current behaviour)
- Keep everything else: badge, h1, description, layout

**Verify:**
1. `pnpm format`
2. `pnpm tsc -b --noEmit` — no errors in CaseHero
3. `pnpm lint` — no new lint errors

---

### Task 4 — Update PortfolioThumbnail (hero.gradient path)

Modify `PortfolioThumbnail.tsx` to read gradient from `item.hero.gradient` instead of `item.gradient`.

**Modify:**
- `src/components/ui/PortfolioThumbnail.tsx`

**What to do:**
- Update prop type or access path to read `hero.gradient` instead of `gradient`
- Check if `PortfolioCard.tsx` passes the gradient — update call site too

**Verify:**
1. `pnpm format`
2. `pnpm tsc -b --noEmit` — no errors in PortfolioThumbnail / PortfolioCard
3. `pnpm lint` — no new lint errors

---

### Task 5 — BlockRenderer dispatcher

Create the central dispatcher that maps `__component` to the correct block component.

**Create:**
- `src/components/portfolio/blocks/BlockRenderer.tsx`

**What to do:**
- Props: `block: ContentBlock`, `caseGradient: string`
- Switch on `block.__component`, render the matching `*Block` component
- Pass `caseGradient` to gradient-aware blocks (`metrics`, `cards`)
- Wrap each block in a consistent `<section>` or `<div>` with vertical spacing (e.g. `py-8` or `py-12` depending on block type)
- Unknown block type → `null` (fail silently, log warning in dev)

**Verify:**
1. `pnpm format`
2. `pnpm tsc -b --noEmit` — no errors in BlockRenderer
3. `pnpm lint` — no new lint errors

---

### Task 6 — Core text blocks: HeadingBlock, ParagraphBlock, ListBlock

Create the three basic text-oriented block renderers.

**Create:**
- `src/components/portfolio/blocks/HeadingBlock.tsx`
- `src/components/portfolio/blocks/ParagraphBlock.tsx`
- `src/components/portfolio/blocks/ListBlock.tsx`

**HeadingBlock:**
- Render `<h2>`, `<h3>`, or `<h4>` based on `level`
- Tailwind sizes: h2 → `text-2xl md:text-3xl font-bold`, h3 → `text-xl md:text-2xl font-semibold`, h4 → `text-lg md:text-xl font-semibold`
- `mx-auto max-w-3xl` for readability alignment

**ParagraphBlock:**
- Render `<p>` with `dangerouslySetInnerHTML` for basic HTML (`<b>`, `<i>`, `<a>`)
- Respect `align` prop: `text-left` (default) or `text-center`
- `mx-auto max-w-3xl leading-relaxed text-muted-foreground`

**ListBlock:**
- `<ul>` with `list-disc` / `<ol>` with `list-decimal` / checklist with custom check icons
- `mx-auto max-w-3xl` wrapper

**Verify:**
1. `pnpm format`
2. `pnpm tsc -b --noEmit` — no errors in new block files
3. `pnpm lint` — no new lint errors

---

### Task 7 — Media blocks: ImageBlock, GalleryBlock, VideoBlock

Create the three media block renderers.

**Create:**
- `src/components/portfolio/blocks/ImageBlock.tsx`
- `src/components/portfolio/blocks/GalleryBlock.tsx`
- `src/components/portfolio/blocks/VideoBlock.tsx`

**ImageBlock:**
- `<figure>` + `<img>` + optional `<figcaption>`
- Sizes: `small` → `max-w-md`, `medium` → `max-w-2xl`, `full` → `max-w-5xl`; all `mx-auto`

**GalleryBlock:**
- Reuse existing `ImageGallery` UI component
- Read labels from `imageGalleryContent` (prevLabel, nextLabel, counter)
- Read `photoAlt` template from `portfolioCaseContent` — needs `caseTitle` passed through (add to BlockRenderer props or read from context)

**VideoBlock:**
- Detect YouTube/Rutube URLs → extract embed URL → `<iframe>`
- Local paths → `<video>` element
- `<figure>` wrapper + optional `<figcaption>` for caption
- Default aspect ratio `16/9`

**Verify:**
1. `pnpm format`
2. `pnpm tsc -b --noEmit` — no errors in new block files
3. `pnpm lint` — no new lint errors

---

### Task 8 — Data blocks: MetricsBlock, CardsBlock, TableBlock, ChartBlock

Create the four data-presentation block renderers.

**Create:**
- `src/components/portfolio/blocks/MetricsBlock.tsx`
- `src/components/portfolio/blocks/CardsBlock.tsx`
- `src/components/portfolio/blocks/TableBlock.tsx`
- `src/components/portfolio/blocks/ChartBlock.tsx`

**MetricsBlock:**
- Extract logic from current `CaseResults.tsx`
- 3-col grid of metric cards (metric, label, description)
- When `gradient: true` → use `caseGradient` for card backgrounds (white text); otherwise neutral bg

**CardsBlock:**
- Extract logic from current `CaseSolution.tsx`
- Grid of white cards (columns: 2/3/4) with optional gradient accent bar
- When `gradient: true` → accent bar uses `caseGradient`

**TableBlock:**
- Responsive `<table>` with Tailwind styling (striped rows, header bg-muted, border)
- Optional `highlight` rows get `bg-primary/5`
- On mobile: `overflow-x-auto` horizontal scroll

**ChartBlock:**
- Pure CSS/SVG + Tailwind — no chart library
- `bar` → vertical bars, `horizontal-bar` → horizontal bars, `progress` → thin bars with value on right
- `line` → inline SVG `<polyline>` with dots at data points, x-axis labels
- `pie` → inline SVG circle with `stroke-dasharray` segments, legend below
- `color` determines fill: `gradient` uses `caseGradient`, `primary` uses `bg-primary`, `accent` uses `bg-accent`

**Verify:**
1. `pnpm format`
2. `pnpm tsc -b --noEmit` — no errors in new block files
3. `pnpm lint` — no new lint errors

---

### Task 9 — Utility blocks: BlockquoteBlock, CalloutBlock, DividerBlock, CodeBlock

Create the four remaining block renderers.

**Create:**
- `src/components/portfolio/blocks/BlockquoteBlock.tsx`
- `src/components/portfolio/blocks/CalloutBlock.tsx`
- `src/components/portfolio/blocks/DividerBlock.tsx`
- `src/components/portfolio/blocks/CodeBlock.tsx`

**BlockquoteBlock:**
- Variant A (`testimonialId` present) → look up testimonial, render `<TestimonialCard>`
- Variant B (inline `text` + `author`) → styled `<blockquote>` with left border, attribution below

**CalloutBlock:**
- Colored left-border box: `info` → blue, `success` → green, `warning` → amber, `note` → gray
- Icon from `ICON_MAP` (Info, CheckCircle, AlertTriangle, StickyNote)
- Optional title in bold + text

**DividerBlock:**
- `line` → `<hr className="border-border">`, `dots` → three centered dots, `space` → `<div className="py-8">`

**CodeBlock:**
- `<pre><code>` with `bg-muted rounded-lg p-4 overflow-x-auto font-mono text-sm`
- Optional caption as `<figcaption>`
- No syntax highlighting library

**Verify:**
1. `pnpm format`
2. `pnpm tsc -b --noEmit` — no errors in new block files
3. `pnpm lint` — no new lint errors

---

### Task 10 — Refactor PortfolioCasePage to use BlockRenderer

Rewrite the page orchestrator to use the dynamic content zone.

**Modify:**
- `src/pages/PortfolioCasePage.tsx`

**What to do:**
- Remove imports: `CaseSolution`, `CaseResults`, `CaseGallery`, `testimonials`
- Add import: `BlockRenderer`
- Pass `hero={data.hero}` to `CaseHero` (instead of `gradient={data.gradient}`)
- Replace the hardcoded Challenge → Solution → Results → Gallery → Testimonial sections with:
  ```tsx
  {data.content.map((block, i) => (
    <BlockRenderer key={i} block={block} caseGradient={data.hero.gradient} />
  ))}
  ```
- Keep: back link, `<CaseHero>`, `<CaseOverview>`, `<CaseCTA>` (page chrome)

**Verify:**
1. `pnpm format`
2. `pnpm tsc -b --noEmit` — zero type errors across the project
3. `pnpm lint` — no new lint errors

---

### Task 11 — Migrate bodrost.json data

Convert existing portfolio data to the new block-based structure.

**Modify:**
- `data/portfolio/bodrost.json`

**What to do:**
- Replace `gradient` with `hero: { gradient: "..." }` (no image yet — add later when asset available)
- Remove `challenge`, `solution`, `results`, `testimonialId`, `images.gallery`
- Keep `images: { preview, og }` (drop `gallery` key)
- Add `content` array converting old fields:
  - `challenge` → `heading` (level 2, text from `portfolioCaseContent.challengeTitle`) + `paragraph`
  - `solution` → `cards` block with `gradient: true`
  - `results` → `metrics` block with `gradient: true`
  - `images.gallery` → `gallery` block
  - `testimonialId` → `blockquote` block (variant A)

**Verify:**
1. `pnpm format`
2. `pnpm tsc -b --noEmit` — data satisfies updated PortfolioCase interface
3. `pnpm lint` — no new lint errors
4. `pnpm dev` — visual check: bodrost case page renders all blocks correctly

---

### Task 12 — Update schema example

Update the schema example to document the new structure.

**Modify:**
- `data/_schema/portfolio.example.json`

**What to do:**
- Replace old fixed fields with `hero` object + `content[]` array
- Show at least one example of each core block type (heading, paragraph, image, gallery, metrics, cards, blockquote)
- Show simplified `images` (preview + og only)
- Remove `challenge`, `solution`, `results`, `testimonialId`, `images.gallery`

**Verify:**
1. `pnpm format`
2. `pnpm tsc -b --noEmit` — schema file valid
3. `pnpm lint` — no new lint errors

---

### Task 13 — Delete deprecated components

Remove old components whose logic has been absorbed into block renderers.

**Delete:**
- `src/components/portfolio/CaseSolution.tsx` → replaced by `CardsBlock.tsx`
- `src/components/portfolio/CaseResults.tsx` → replaced by `MetricsBlock.tsx`
- `src/components/portfolio/CaseGallery.tsx` → replaced by `GalleryBlock.tsx`

**Verify:**
1. `pnpm format`
2. `pnpm tsc -b --noEmit` — no remaining imports of deleted files
3. `pnpm lint` — no new lint errors

---

### Task 14 — Update docs (CLAUDE.md, data/README.md, _schema)

Update all documentation to reflect the new architecture.

**Modify:**
- `CLAUDE.md` — update Project Structure tree, component list, data architecture tables, PortfolioCase description
- `data/README.md` — add block types reference, update new-client setup guide with `content[]` explanation

**Verify:**
1. `pnpm format`
2. `pnpm tsc -b --noEmit` — no errors
3. `pnpm lint` — no new lint errors
4. Docs accurately describe the new file tree and data shape

---

### Task 15 — Final verification

Run full build pipeline and verify everything works.

**Steps:**
1. `pnpm format`
2. `pnpm tsc -b --noEmit` — zero errors
3. `pnpm lint` — no new errors (ignore pre-existing shadcn errors)
4. `pnpm build` — SSG build succeeds, `dist/portfolio/bodrost/index.html` generated
5. `pnpm preview` — visual check: bodrost case page renders all blocks correctly

---

### Task dependency graph

```
Task 1  (block types)
  └→ Task 2  (PortfolioCase interface)
       ├→ Task 3  (CaseHero image+gradient)
       ├→ Task 4  (PortfolioThumbnail hero.gradient)
       ├→ Task 5  (BlockRenderer dispatcher)
       │    ├→ Task 6  (text blocks: heading, paragraph, list)
       │    ├→ Task 7  (media blocks: image, gallery, video)
       │    ├→ Task 8  (data blocks: metrics, cards, table, chart)
       │    └→ Task 9  (utility blocks: blockquote, callout, divider, code)
       │         └→ Task 10  (refactor PortfolioCasePage)
       │              └→ Task 11  (migrate bodrost.json)
       │                   └→ Task 12  (update schema example)
       └→ Task 13  (delete deprecated components) — after Task 10
            └→ Task 14  (update docs)
                 └→ Task 15  (final verification)
```

Tasks 3, 4, 5 can run in parallel after Task 2.
Tasks 6, 7, 8, 9 can run in parallel after Task 5.
Task 10 requires Tasks 3–9 all complete.
Task 13 requires Task 10 (no remaining imports of old components).

---

## File tree after implementation

```
src/components/portfolio/
├── blocks/
│   ├── BlockRenderer.tsx       # Switch dispatcher for all block types
│   ├── HeadingBlock.tsx        # h2/h3/h4
│   ├── ParagraphBlock.tsx      # Rich text paragraph
│   ├── ImageBlock.tsx          # Single image + caption
│   ├── GalleryBlock.tsx        # Multi-image lightbox gallery
│   ├── BlockquoteBlock.tsx     # Quote (testimonial ref or inline)
│   ├── MetricsBlock.tsx        # KPI cards grid
│   ├── CardsBlock.tsx          # Generic card grid
│   ├── TableBlock.tsx          # Data table
│   ├── ChartBlock.tsx          # CSS bar charts
│   ├── DividerBlock.tsx        # Visual separator
│   ├── CalloutBlock.tsx        # Info/warning/note box
│   ├── ListBlock.tsx           # Ordered/unordered/checklist
│   ├── VideoBlock.tsx          # Embedded video
│   └── CodeBlock.tsx           # Code snippet
├── CaseHero.tsx                # MODIFY (image + gradient fallback)
├── CaseOverview.tsx            # Stays (page chrome)
├── CaseCTA.tsx                 # Stays (page chrome)
├── CaseSolution.tsx            # DELETE (→ CardsBlock)
├── CaseResults.tsx             # DELETE (→ MetricsBlock)
└── CaseGallery.tsx             # DELETE (→ GalleryBlock)
```

---

## Design decisions

1. **`__component` key** — follows Strapi convention; double underscore signals system field, string value enables easy `switch` dispatch
2. **No nesting** — blocks are flat (no blocks-inside-blocks). Keeps rendering simple and JSON easy to author by hand
3. **`hero` object with image + gradient fallback** — `hero.image` (optional) takes priority; `hero.gradient` (required) is the fallback for the hero section AND is reused by gradient-aware blocks (`metrics`, `cards`) and `PortfolioThumbnail`. This keeps gradient as the universal brand accent for each case
4. **Paragraph supports basic HTML only** (no markdown initially) — avoids adding `react-markdown` dependency; editorial team writes `<b>`, `<i>`, `<a>` directly in JSON. Can upgrade later
5. **Overview stays as structured fields** — it's page metadata (client, year, services), not editorial content. Same for CTA. Hero is also page chrome but now supports image backgrounds
6. **No block IDs** — blocks are identified by array index. If anchor linking to specific blocks is needed later, add optional `id` field

---

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| Increased JSON complexity for editors | Provide clear `_schema` examples + `data/README.md` guide |
| XSS via `dangerouslySetInnerHTML` in paragraph | Sanitize HTML at build time (SSG — no runtime user input); consider `DOMPurify` if HTML gets complex |
| Bundle size from new block components | All blocks are simple Tailwind components; tree-shaken if unused. No heavy libs |
| Breaking existing `bodrost.json` | Phase 4 migrates data; run typecheck to catch all breakage |
