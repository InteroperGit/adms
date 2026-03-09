# data/

All client-facing configuration lives here. To create a site for a new client, copy this folder, edit the JSON files listed below, and run `pnpm build`. Zero component code changes required.

> **Important:** actual data files (`*.json` outside `_schema/`) are gitignored. Only `_schema/` examples and `portfolio/*.json` case studies are tracked.

---

## Files

### Brand & identity

| File | Purpose |
|------|---------|
| `theme.json` | Colors (HSL), border radius, heading/body font families, Google Fonts URLs. Injected as CSS vars at build time by `src/plugins/themePlugin.ts`. |
| `site.json` | Global contact info: phone, email, address, social links (Telegram, VK), working hours. Optional: `yandexMapsOrgId` (enables Yandex reviews widget), `yandexMapUrl` (enables map iframe in Contact). |

### UI copy — per section

UI copy is split into one file per section. Each component imports only the file it needs.

| File | Purpose |
|------|---------|
| `header.json` | Lang, logo letter/text, nav links array, nav CTA button label. |
| `hero.json` | Badge, title, titleHighlight, subtitle, CTA buttons, stats (value + label). |
| `carousel-content.json` | Agency label shown on carousel slides: `{ label }`. |
| `about-content.json` | About section headings, body text (supports `{name}` token), info card (tagline, stats, NPS). |
| `services-content.json` | Services section heading: label, title, description. |
| `portfolio-section.json` | Portfolio section headings, "all categories" label, details link label, CTA button. |
| `advantages-content.json` | Advantages section headings: label, title, titleHighlight, description. |
| `call-to-action.json` | Mid-page CTA banner: title, subtitle, two CTA buttons. |
| `testimonials-content.json` | Testimonials section headings: label, title, description. |
| `contact.json` | Contact section headings, all form labels/placeholders/messages, direct contact labels, social/hours labels. |
| `footer.json` | Footer description (supports `{description}` token), column titles, copyright (supports `{year}`, `{name}` tokens), tagline, legal links. |
| `portfolio-case.json` | Portfolio case page labels: back link, overview column headers, photo alt template, CTA block, not-found message. |
| `image-gallery.json` | Image gallery UI labels: prev/next button aria-labels, counter template (`{current} из {total}`). |
| `cookies.json` | Cookie banner copy: aria-label, close label, title, body text, privacy link, accept/necessary-only button labels. |

### Section data

| File | Purpose |
|------|---------|
| `carousel.json` | Hero carousel slides — `[{ id, image?, alt, gradient, title, subtitle }]`. `image` is optional; `gradient` is used as fallback. |
| `about-values.json` | Values list shown in the About section — `[{ title, description }]`. |
| `services.json` | Services grid — `[{ icon, title, description }]`. `icon` is a key from `src/types/iconMap.ts`. |
| `advantages.json` | Advantages cards — `[{ icon, title, description }]`. Same `icon` convention as services. |
| `testimonials.json` | Client testimonials — `[{ id, name, role, company, avatar?, avatarColor, rating, text }]`. Used on portfolio case pages; the Testimonials section uses the Yandex widget instead. |
| `portfolio/<slug>.json` | One file per case study. Filename becomes the URL slug (`/portfolio/<slug>`). See **Portfolio case structure** below. |

### Legal

| File | Purpose |
|------|---------|
| `legal.json` | Company legal details and document metadata used by `/privacy-policy`, `/consent`, `/user-agreement` pages. |

---

## Schema examples

`_schema/` contains example files showing the full structure of every JSON file. Use these as templates:

```
_schema/
  header.example.json
  hero.example.json
  carousel-content.example.json
  about-content.example.json
  services-content.example.json
  portfolio-section.example.json
  advantages-content.example.json
  call-to-action.example.json
  testimonials-content.example.json
  contact.example.json
  footer.example.json
  portfolio-case.example.json
  image-gallery.example.json
  cookies.example.json
  theme.example.json
  site.example.json
  legal.example.json
  about-values.example.json
  carousel.example.json
  services.example.json
  advantages.example.json
  testimonials.example.json
  portfolio.example.json
```

---

## Creating a new client config

1. Copy the `data/` folder (or start from `_schema/` examples).
2. Edit the core identity files:
   - `theme.json` — brand colors and fonts
   - `site.json` — contact details and social links
   - `legal.json` — company registration data
3. Edit the UI copy files for each section (see **UI copy — per section** table above). At minimum update `header.json`, `hero.json`, `about-content.json`, `footer.json`, and `cookies.json`.
4. Replace the data collections to match the client's content:
   - `services.json`, `advantages.json`, `testimonials.json`
   - `carousel.json`, `about-values.json`
   - `portfolio/<slug>.json` — one file per case study (delete the example file)
5. Run `pnpm build`.

---

## Adding a portfolio case

1. Create `data/portfolio/<slug>.json` following `_schema/portfolio.example.json`.
2. The SSG build auto-discovers all files matching `data/portfolio/*.json` and generates a static page at `/portfolio/<slug>`.
3. The case page renders each block in `content[]` top-to-bottom via `BlockRenderer`.

---

## Portfolio case structure

Each `data/portfolio/<slug>.json` file has this shape:

```jsonc
{
  "slug": "my-project",
  "title": "...",
  "category": "...",
  "description": "...",        // card preview text
  "hero": {
    "image": "/images/...",    // optional — shown when present
    "gradient": "from-orange-400 to-rose-500"  // required — fallback + used by blocks
  },
  "tags": ["Tag1", "Tag2"],
  "meta": { "title": "...", "description": "...", "ogUrl": "...", "ogImage": "..." },
  "overview": { "client": "...", "year": "2024", "services": "..." },
  "content": [ /* ordered array of content blocks — see below */ ],
  "images": {
    "preview": "/images/.../preview.jpg",   // card thumbnail
    "og": "/images/.../og.jpg"              // optional OG image
  }
}
```

The `hero.gradient` value is a pair of Tailwind gradient color stops (e.g. `"from-violet-500 to-purple-700"`). It is used as the hero background fallback when no `hero.image` is provided, and also passed to gradient-aware content blocks (`metrics`, `cards`, `chart`).

---

## Content blocks (`content[]`)

The `content` array is a **dynamic zone** — an ordered list of typed blocks rendered top-to-bottom on the case page. Each block has a `__component` discriminator field.

| `__component` | Purpose | Key fields |
|---|---|---|
| `heading` | Section heading | `level: 2\|3\|4`, `text` |
| `paragraph` | Rich text paragraph | `text` (basic HTML: `<b>`, `<i>`, `<a>`), `align?: "left"\|"center"` |
| `list` | Ordered / unordered / checklist | `style: "ordered"\|"unordered"\|"checklist"`, `items: string[]` |
| `image` | Single image with caption | `src`, `alt`, `caption?`, `size?: "small"\|"medium"\|"full"` |
| `gallery` | Multi-image lightbox gallery | `images: { src, description? }[]` |
| `video` | Embedded video | `url` (YouTube, Rutube, or local path), `caption?`, `aspectRatio?` |
| `metrics` | KPI cards grid | `items: { metric, label, description }[]`, `title?`, `gradient?` |
| `cards` | Generic card grid | `items: { title, description }[]`, `title?`, `columns?: 2\|3\|4`, `gradient?` |
| `table` | Data table | `head: string[]`, `rows: string[][]`, `title?`, `caption?`, `highlight?: number[]` |
| `chart` | CSS/SVG chart | `type: "bar"\|"horizontal-bar"\|"progress"\|"line"\|"pie"`, `items: { label, value, suffix? }[]`, `title?`, `color?: "gradient"\|"primary"\|"accent"` |
| `blockquote` | Pull quote | Variant A: `testimonialId: number` — looks up `testimonials.json`; Variant B: `text`, `author`, `role?`, `company?` |
| `callout` | Info/warning/note box | `type: "info"\|"success"\|"warning"\|"note"`, `text`, `title?` |
| `divider` | Visual separator | `style?: "line"\|"dots"\|"space"` |
| `code` | Code snippet | `code`, `language?`, `caption?` |

`gradient: true` on `metrics`, `cards`, and `color: "gradient"` on `chart` use the case's `hero.gradient` value for coloring.

See `_schema/portfolio.example.json` for a full example with every block type.

---

## Icon keys

`services.json` and `advantages.json` reference icons by string key (e.g. `"Lightbulb"`, `"BarChart3"`). Valid keys are defined in `src/types/shared/iconMap.ts`. To add a new icon, import it from `lucide-react` and add it to `ICON_MAP` in that file.

The `callout` block also uses icons from `ICON_MAP` (mapped internally by callout type — `Info`, `CheckCircle`, `AlertTriangle`, `StickyNote`). No icon field needed in the JSON.
