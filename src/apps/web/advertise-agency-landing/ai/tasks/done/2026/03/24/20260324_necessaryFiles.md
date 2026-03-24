# PDR: Add missing production-required static files

**Date**: 2026-03-24

## Goal

Add the static files that every production website requires but are currently
missing from `public/`. These files affect SEO, social sharing, iOS home screen
bookmarks, and crawler behaviour.

Current gaps identified:

| File | Status | Impact |
|---|---|---|
| `public/robots.txt` | Missing | Crawlers have no directives; no sitemap pointer |
| `public/apple-touch-icon.png` | Missing | Referenced in `<head>` → 404 on iOS |
| `public/og-default.jpg` | Missing | Referenced in OG/Twitter meta → broken social previews |
| `public/site.webmanifest` | Missing | No PWA / "Add to homescreen" support |
| `public/favicon.ico` | Missing | Fallback for older browsers and tools |

---

## Changes

### 1. `public/robots.txt` (new)

Read `SITE_URL` from `.env` (`https://rmaster35.ru`) to populate the `Sitemap:` directive.
Block the `/order/` utility page (not useful to index).

```
User-agent: *
Allow: /
Disallow: /order/

Sitemap: https://rmaster35.ru/sitemap.xml
```

> **Implementation note**: The file is a plain static asset in `public/` — no
> build script is needed for a single-domain deployment. If `SITE_URL` changes
> across environments, add `scripts/postbuild-robots.ts` that writes
> `build/client/robots.txt` reading `process.env.SITE_URL` (same pattern as
> `postbuild-sitemap.ts`).

**Decision**: static file in `public/` (Option A) — sufficient for single domain.

---

### 2. `public/apple-touch-icon.png` (new — manual asset)

The built HTML already references this file:
```html
<link rel="apple-touch-icon" href="/apple-touch-icon.png"/>
```
Absence causes a 404 on iOS Safari when the user adds the site to their home screen.

- **Size**: 180×180 px PNG
- **Background**: primary brand colour `hsl(17 93% 52%)` (orange, from `theme-color` meta)
- **Source**: export from brand assets or designer
- **Temporary fallback**: a flat-colour square PNG with the logo mark is acceptable
  until the real asset is delivered

No code changes required — just place the file in `public/`.

---

### 3. `public/og-default.jpg` (new — manual asset)

All pages reference this as the default Open Graph and Twitter card image:
```html
<meta property="og:image" content="/og-default.jpg" />
<meta name="twitter:image" content="/og-default.jpg" />
```
Absence means every social share shows a broken image.

- **Size**: 1200×630 px JPEG (standard OG size)
- **Content**: agency logo + tagline on brand background
- **Source**: must be provided by designer
- **Temporary fallback**: a solid brand-colour rectangle with logo text is acceptable

No code changes required — just place the file in `public/`.

---

### 4. `public/site.webmanifest` (new)

Enables "Add to homescreen" on Android/Chrome and improves PWA scoring.
The `<link rel="manifest">` tag must also be added to the `<head>` in the root route.

**`public/site.webmanifest`**:
```json
{
  "name": "РА «Рекламастер»",
  "short_name": "Рекламастер",
  "description": "Рекламное агентство полного цикла",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "hsl(17, 93%, 52%)",
  "icons": [
    { "src": "/apple-touch-icon.png", "sizes": "180x180", "type": "image/png" },
    { "src": "/favicon.svg", "sizes": "any", "type": "image/svg+xml" }
  ]
}
```

**Root route `<head>` addition** (wherever meta tags are rendered):
```html
<link rel="manifest" href="/site.webmanifest" />
```

---

### 5. `public/favicon.ico` (new — manual asset)

Modern browsers use `favicon.svg` (already present), but many tools, RSS readers,
and older browsers fall back to `/favicon.ico`.

- **Size**: multi-resolution ICO containing 16×16 and 32×32 variants
- **Source**: convert from `public/favicon.svg` using any ICO tool
  (e.g. `sharp`, `imagemagick`, online converter)
- No `<link>` tag change required — browsers request `/favicon.ico` automatically

---

## File summary

| File | Action | Who |
|---|---|---|
| `public/robots.txt` | **Create** (text file, content defined above) | Dev |
| `public/apple-touch-icon.png` | **Create** (180×180 PNG) | Designer / Dev |
| `public/og-default.jpg` | **Create** (1200×630 JPEG) | Designer |
| `public/site.webmanifest` | **Create** (JSON, content defined above) | Dev |
| `public/favicon.ico` | **Create** (convert from SVG) | Dev |
| Root route `<head>` | **Edit** — add `<link rel="manifest">` | Dev |

---

## Env var dependency

| Var | Value | Used in |
|---|---|---|
| `SITE_URL` | `https://rmaster35.ru` | `robots.txt` → `Sitemap:` line |

---

## Validation

```bash
# Crawlers
curl https://rmaster35.ru/robots.txt
curl https://rmaster35.ru/sitemap.xml

# Assets
curl -I https://rmaster35.ru/apple-touch-icon.png  # 200
curl -I https://rmaster35.ru/og-default.jpg        # 200
curl -I https://rmaster35.ru/favicon.ico           # 200
curl -I https://rmaster35.ru/site.webmanifest      # 200

# Manifest link present in HTML
curl -s https://rmaster35.ru/ | grep 'rel="manifest"'

# Lighthouse PWA / SEO audit
npx lighthouse https://rmaster35.ru --only-categories=seo,pwa
```

---

## Acceptance criteria

- [ ] `GET /robots.txt` returns 200 with correct `User-agent`, `Disallow`, and `Sitemap` directives
- [ ] `Sitemap:` URL in `robots.txt` matches `SITE_URL` from `.env`
- [ ] `GET /apple-touch-icon.png` returns 200 (no more 404 on iOS)
- [ ] `GET /og-default.jpg` returns 200; social previews show the image
- [ ] `GET /site.webmanifest` returns 200 with valid JSON
- [ ] Root HTML contains `<link rel="manifest" href="/site.webmanifest">`
- [ ] `GET /favicon.ico` returns 200
- [ ] `pnpm build` completes without errors
- [ ] Lighthouse SEO score ≥ 95, no missing-icon warnings
