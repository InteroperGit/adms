# data/

All client-facing configuration lives here. To create a site for a new client, copy this folder, edit the JSON files listed below, and run `pnpm build`. Zero component code changes required.

> **Important:** actual data files (`*.json` outside `_schema/`) are gitignored. Only `_schema/examples/` files and `articles/portfolio/` case studies are tracked.

> **Required before first run:** all data JSON files must exist locally before `pnpm dev` or `pnpm build` — a missing file causes a hard startup error ("Cannot find module"). Bootstrap from the schema examples:
> ```bash
> # copy every _schema/examples/**/*.example.json → the corresponding data file, then fill in real values
> cp data/_schema/examples/config/site.example.json       data/content/config/site.json
> cp data/_schema/examples/config/theme.example.json      data/content/config/theme.json
> cp data/_schema/examples/config/legal.example.json      data/content/config/legal.json
> mkdir -p data/content/legal
> cp data/_schema/examples/legal/legalContent.example.json data/content/legal/privacyPolicy.json
> cp data/_schema/examples/legal/legalContent.example.json data/content/legal/userAgreement.json
> cp data/_schema/examples/legal/legalContent.example.json data/content/legal/consent.json
> # … repeat for remaining files listed in the Files section below
> ```

---

## Files

### Brand & identity

| File | Purpose |
|------|---------|
| `config/theme.json` | Colors (HSL), border radius, heading/body font families, Google Fonts URLs. Injected as CSS vars at build time by `src/plugins/themePlugin.ts`. |
| `config/site.json` | Global contact info: phone, email, address, social links (Telegram, VK), working hours. Optional: `yandexMapsOrgId` (enables Yandex reviews widget), `yandexMapUrl` (enables map iframe in Contact). |

### UI copy — per section

UI copy is split into one file per section. Each component imports only the file it needs.

| File | Purpose |
|------|---------|
| `sections/header/header.json` | Lang, logo letter/text, nav links array, nav CTA button label. |
| `sections/hero/hero.json` | Badge, title, titleHighlight, subtitle, CTA buttons, stats (value + label). |
| `sections/carousel/carouselContent.json` | Agency label shown on carousel slides: `{ label }`. |
| `sections/about/aboutContent.json` | About section headings, body text (supports `{name}` token), info card (tagline, stats, NPS). |
| `sections/services/servicesContent.json` | Services section heading: label, title, description. |
| `sections/portfolio/portfolioSection.json` | Portfolio section headings, "all categories" label, details link label, CTA button. |
| `sections/advantages/advantagesContent.json` | Advantages section headings: label, title, titleHighlight, description. |
| `sections/call-to-action/callToAction.json` | Mid-page CTA banner: title, subtitle, two CTA buttons. |
| `sections/testimonials/testimonialsContent.json` | Testimonials section headings: label, title, description. |
| `sections/contact/contact.json` | Contact section headings, all form labels/placeholders/messages, direct contact labels, social/hours labels. |
| `sections/footer/footer.json` | Footer description (supports `{description}` token), column titles, copyright (supports `{year}`, `{name}` tokens), tagline, legal links. |
| `config/imageGallery.json` | Image gallery UI labels: prev/next button aria-labels, counter template (`{current} из {total}`). |
| `config/cookies.json` | Cookie banner copy: aria-label, close label, title, body text, privacy link, accept/necessary-only button labels. |
| `config/notFound.json` | 404 page: title, code, description, back button label/href. |
| `config/defaultArticleCta.json` | Default CTA block rendered at the bottom of article pages when the article has no inline `cta`. |
| `config/articleTypes.json` | Article type labels: tab names for the article category filter. |

### Section data

| File | Purpose |
|------|---------|
| `sections/carousel/carousel.json` | Hero carousel slides — `[{ id, image?, alt, gradient, title, subtitle }]`. `image` is optional; `gradient` is used as fallback. |
| `sections/about/aboutValues.json` | Values list shown in the About section — `[{ title, description }]`. |
| `sections/services/services.json` | Services grid — `[{ icon, title, description }]`. `icon` is a key from `src/types/iconMap.ts`. |
| `sections/advantages/advantages.json` | Advantages cards — `[{ icon, title, description }]`. Same `icon` convention as services. |
| `sections/testimonials/testimonials.json` | Client testimonials — `[{ id, name, role, company, avatar?, avatarColor, rating, text }]`. Used on portfolio case pages; the Testimonials section uses the Yandex widget instead. |

### Article content

Articles live under `data/content/articles/<type>/` and are auto-discovered by the SSG build.

| Directory | Purpose |
|-----------|---------|
| `articles/portfolio/<category>/<year>/<month>/<date>_<slug>.json` | Portfolio case studies. Nested by category slug, year, and month. See **Portfolio case structure** below. |
| `articles/services/**/*.json` | Service article pages (optional). |
| `articles/news/**/*.json` | News article pages (optional). |
| `articles/blog/**/*.json` | Blog article pages (optional). |

Each article file must include `"type": "portfolio"|"service"|"news"|"blog"` and `"publishedAt"` (ISO datetime, e.g. `"2024-08-01T00:00:00Z"`). The legacy `publishDate` field is no longer supported.

### Legal

| File | Purpose |
|------|---------|
| `config/legal.json` | Company legal details and document metadata: registration info, document versions and effective dates. |
| `legal/privacyPolicy.json` | Full content of the Privacy Policy page — sections with blocks of text, lists, and contact info. |
| `legal/userAgreement.json` | Full content of the User Agreement page — same structure. |
| `legal/consent.json` | Full content of the Data Processing Consent page — same structure. |

All three `legal/*.json` files are required. If any is missing the app fails to start. Bootstrap from `_schema/examples/legal/legalContent.example.json` (see **Required before first run** above). Tokens like `{company.name}` in text fields are resolved at render time from `config/legal.json`.

---

## Schema examples

`_schema/examples/` mirrors the `data/content/` subfolder structure and contains example files showing the full structure of every JSON file. Use these as templates:

```
_schema/examples/
  config/
    site.example.json
    theme.example.json
    cookies.example.json
    portfolioConfig.example.json
    categories.example.json
    legal.example.json
    orderForms.example.json
    seo.example.json
    notFound.example.json
    defaultArticleCta.example.json
    imageGallery.example.json
  sections/
    header/header.example.json
    hero/hero.example.json
    carousel/carousel.example.json
    carousel/carouselContent.example.json
    about/aboutContent.example.json
    about/aboutValues.example.json
    services/servicesContent.example.json
    services/services.example.json
    portfolio/portfolioSection.example.json
    advantages/advantagesContent.example.json
    advantages/advantages.example.json
    call-to-action/callToAction.example.json
    testimonials/testimonialsContent.example.json
    testimonials/testimonials.example.json
    contact/contact.example.json
    footer/footer.example.json
  legal/
    legalContent.example.json
  articles/
    portfolio/portfolio.example.json
    services/service.example.json
    news/news.example.json
    blog/blog.example.json
```

Run `pnpm gen-schemas` to regenerate all JSON Schema files from Zod schemas and update `.vscode/settings.json` for IDE autocomplete.

---

## Creating a new client config

1. Copy the `data/` folder (or start from `_schema/examples/` files).
2. Edit the core identity files:
   - `config/theme.json` — brand colors and fonts
   - `config/site.json` — contact details and social links
   - `config/legal.json` — company registration data
   - `legal/privacyPolicy.json`, `legal/userAgreement.json`, `legal/consent.json` — legal page content; tokens like `{company.name}` are auto-substituted from `config/legal.json`
3. Edit the UI copy files for each section (see **UI copy — per section** table above). At minimum update `header.json`, `hero.json`, `aboutContent.json`, `footer.json`, and `cookies.json`.
4. Replace the data collections to match the client's content:
   - `services.json`, `advantages.json`, `testimonials.json`
   - `carousel.json`, `aboutValues.json`
   - `articles/portfolio/` — one file per case study (delete the example files)
5. Run `pnpm build`.

---

## Adding a portfolio case

1. Create `data/content/articles/portfolio/<category-slug>/<year>/<month>/<yyyy_mm_dd>_<slug>.json` following `_schema/examples/articles/portfolio/portfolio.example.json`.
2. The SSG build auto-discovers all files matching `data/content/articles/portfolio/**/*.json` and generates a static page at `/portfolio/<slug>`.
3. The case page renders each block in `content[]` top-to-bottom via `BlockRenderer`.

---

## Portfolio case structure

Each `data/content/articles/portfolio/<category>/<year>/<month>/<date>_<slug>.json` file has this shape:

```jsonc
{
  "type": "portfolio",
  "publishedAt": "2024-08-01T00:00:00Z",
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
| `list` | Ordered / unordered / checklist | `style: "ordered"\|"unordered"\|"checklist"`, `items: string[]`, `colors?: { even: { background, text }, odd: { background, text } }` |
| `image` | Single image with caption | `src`, `alt`, `caption?`, `size?: "small"\|"medium"\|"full"` |
| `gallery` | Multi-image lightbox gallery | `images: { src, description? }[]` |
| `video` | Embedded video | `url` (YouTube, Rutube, or local path), `caption?`, `aspectRatio?` |
| `metrics` | KPI cards grid | `items: { metric, label, description }[]`, `title?`, `color?: { type, value? }` |
| `cards` | Generic card grid | `items: { title, description }[]`, `title?`, `columns?: 2\|3\|4`, `color?: { type, value? }` |
| `table` | Data table | `head: string[]`, `rows: string[][]`, `title?`, `caption?`, `highlight?: number[]` |
| `chart` | CSS/SVG chart | `type: "bar"\|"horizontal-bar"\|"progress"\|"line"\|"pie"`, `items: { label, value, suffix? }[]`, `title?`, `color?: { type, value? }` |
| `blockquote` | Pull quote | Variant A: `testimonialId: number` — looks up `testimonials.json`; Variant B: `text`, `author`, `role?`, `company?` |
| `callout` | Info/warning/note box | `type: "info"\|"success"\|"warning"\|"note"`, `text`, `title?` |
| `divider` | Visual separator | `style?: "line"\|"dots"\|"space"` |
| `code` | Code snippet | `code`, `language?`, `caption?` |
| `order-form` | Embedded order form | `formId` (key from `config/orderForms.json`), `title?` |

`gradient: true` on `metrics`, `cards`, and `color: "gradient"` on `chart` use the case's `hero.gradient` value for coloring.

See `_schema/examples/articles/portfolio/portfolio.example.json` for a full example with every block type.

---

### `color` object (metrics, cards, chart)

The `color` field on `metrics`, `cards`, and `chart` blocks is an object with a required `type` and an optional `value`:

```jsonc
// Use the case's hero.gradient (no value needed)
"color": { "type": "gradient" }

// Custom gradient stops
"color": { "type": "gradient", "value": "from-sky-400 to-blue-500" }

// Solid theme colors (no value needed)
"color": { "type": "primary" }
"color": { "type": "accent" }
// "solid" is an alias for "primary" in metrics blocks; prefer "primary"
```

| `type` | Effect on `metrics` | Effect on `cards` | Effect on `chart` bars |
|---|---|---|---|
| `gradient` | Gradient background on each card | Gradient accent bar | Gradient fill |
| `primary` | `bg-primary` background | `bg-primary` accent bar | `bg-primary` fill |
| `solid` | Alias for `primary` in metrics; hex value via `value` in cards/charts | `bg-primary` or hex accent bar | hex fill |
| `accent` | `bg-accent` background | `bg-accent` accent bar | `bg-accent` fill |
| _(omitted)_ | Neutral white card | No accent bar | `bg-primary` fill |

`value` is only used when `type` is `"gradient"` (for metrics) or `"solid"` (for cards/charts, as a hex color). When gradient `value` is omitted, falls back to the case's `hero.gradient`.

---

### List block colors

The `list` block supports a `colors` object with `even` and `odd` row styling. Each row has `background` and `text` fields that accept either:

- **Semantic tokens**: `"primary"`, `"primary-foreground"`, `"accent"`, `"secondary"`, `"muted"`, `"muted-foreground"`, `"border"`, `"foreground"`
- **Hex values**: `"#F5A623"` (advisory — prefer semantic tokens for theme consistency)

```jsonc
{
  "__component": "list",
  "style": "checklist",
  "items": ["Item 1", "Item 2"],
  "colors": {
    "even": { "background": "muted", "text": "muted-foreground" },
    "odd":  { "background": "secondary", "text": "accent" }
  }
}
```

---

## Icon keys

`services.json` and `advantages.json` reference icons by string key (e.g. `"Lightbulb"`, `"BarChart3"`). Valid keys are defined in `src/types/shared/iconMap.ts`. To add a new icon, import it from `lucide-react` and add it to `ICON_MAP` in that file.

The `callout` block also uses icons from `ICON_MAP` (mapped internally by callout type — `Info`, `CheckCircle`, `AlertTriangle`, `StickyNote`). No icon field needed in the JSON.
