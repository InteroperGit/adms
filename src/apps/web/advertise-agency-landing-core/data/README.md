# data/

All client-facing configuration lives here. To create a site for a new client, copy this folder, edit the JSON files listed below, and run `pnpm build`. Zero component code changes required.

> **Important:** actual data files (`*.json` outside `_schema/`) are gitignored. Only `_schema/` examples and `portfolio/*.json` case studies are tracked.

---

## Files

### Brand & identity

| File | Purpose |
|------|---------|
| `theme.json` | Colors (HSL), border radius, heading/body font families, Google Fonts URLs. Injected as CSS vars at build time by `src/plugins/themePlugin.ts`. |
| `site.json` | Global contact info: phone, email, address, social links (Telegram, VK), working hours. |

### UI copy

| File | Purpose |
|------|---------|
| `content.json` | Every piece of UI text: nav labels, hero, about, services, portfolio, advantages, CTA, testimonials, contact form, footer, cookie banner, portfolio case labels. |

### Section data

| File | Purpose |
|------|---------|
| `carousel.json` | Hero carousel slides — `[{ id, image?, alt, gradient, title, subtitle }]`. `image` is optional; `gradient` is used as fallback. |
| `about-values.json` | Values list shown in the About section — `[{ title, description }]`. |
| `services.json` | Services grid — `[{ icon, title, description }]`. `icon` is a key from `src/lib/iconMap.ts`. |
| `advantages.json` | Advantages cards — `[{ icon, title, description }]`. Same `icon` convention as services. |
| `testimonials.json` | Client testimonials — `[{ id, name, role, company, avatar?, avatarColor, rating, text }]`. |
| `portfolio/<slug>.json` | One file per case study. Filename becomes the URL slug (`/portfolio/<slug>`). See schema below. |

### Legal

| File | Purpose |
|------|---------|
| `legal.json` | Company legal details and document metadata used by `/privacy-policy`, `/consent`, `/user-agreement` pages. |

---

## Schema examples

`_schema/` contains example files showing the full structure of every JSON file. Use these as templates:

```
_schema/
  content.example.json
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
2. Edit the four core files:
   - `content.json` — all UI copy and labels
   - `theme.json` — brand colors and fonts
   - `site.json` — contact details and social links
   - `legal.json` — company registration data
3. Replace the data collections to match the client's content:
   - `services.json`, `advantages.json`, `testimonials.json`
   - `carousel.json`, `about-values.json`
   - `portfolio/<slug>.json` — one file per case study (delete the example file)
4. Run `pnpm build`.

---

## Adding a portfolio case

1. Create `data/portfolio/<slug>.json` following `_schema/portfolio.example.json`.
2. The SSG build auto-discovers all files matching `data/portfolio/*.json` and generates a static page at `/portfolio/<slug>`.
3. To link the case to a testimonial, set `"testimonialId"` to a matching `id` in `testimonials.json`.

---

## Icon keys

`services.json` and `advantages.json` reference icons by string key (e.g. `"Lightbulb"`, `"BarChart3"`). Valid keys are defined in `src/lib/iconMap.ts`. To add a new icon, import it from `lucide-react` and add it to `ICON_MAP` in that file.
