# 001 — Create Landing Page Structure

> Advertising agency landing page — full build plan from scaffolded project to production-ready site.

## Current State

- Vite 7 + React 19 + TypeScript scaffolded and building
- Tailwind CSS v4 + shadcn/ui configured
- Directory structure created, `cn()` utility and constants in place
- No visual components yet — `App.tsx` is a blank shell

---

## Phase 1: Design Foundation

### Task 1.1 — Define design tokens and typography

**File:** `src/index.css`

- Choose a primary font pair (heading + body), add via Google Fonts or local files
- Define CSS custom properties for the brand palette:
  - `--primary` — main brand color (CTA buttons, accents)
  - `--secondary` — supporting color
  - `--accent` — highlights, hover states
  - `--background`, `--foreground`, `--muted` — neutral tones
- Set base `font-size`, `line-height`, heading scale
- Configure `border-radius` token (`--radius`)

### Task 1.2 — Add shadcn/ui base components

```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add input
pnpm dlx shadcn@latest add textarea
pnpm dlx shadcn@latest add separator
pnpm dlx shadcn@latest add badge
```

### Task 1.3 — Create shared layout component

**File:** `src/components/layout/Container.tsx`

- Centered max-width wrapper (`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`)
- Used by every section for consistent horizontal padding

---

## Phase 2: Header & Navigation

### Task 2.1 — Create Header component

**File:** `src/components/sections/Header.tsx`

- Sticky top navigation bar
- Logo (text or SVG) on the left
- Navigation links from `NAV_LINKS` constant on the right
- CTA button ("Get a Quote" / "Связаться") on the far right
- Responsive: hamburger menu on mobile (< 768px)

### Task 2.2 — Create MobileMenu component

**File:** `src/components/sections/MobileMenu.tsx`

- Slide-in or overlay menu triggered by hamburger icon
- Full list of nav links + CTA
- Close on link click or outside click
- `useScrollLock` hook to prevent background scroll

---

## Phase 3: Hero Section

### Task 3.1 — Create Hero section

**File:** `src/components/sections/Hero.tsx`

- Full-viewport height (`min-h-screen`) or prominent height (`min-h-[80vh]`)
- Main headline (h1) — agency value proposition
- Subheadline (p) — brief description
- Primary CTA button — scrolls to contact or services
- Background: gradient, image, or abstract shapes (decide with user)
- Responsive text sizing (`text-4xl md:text-5xl lg:text-6xl`)

---

## Phase 4: Content Sections

### Task 4.1 — Create About section

**File:** `src/components/sections/About.tsx`

- Section id `#about` for anchor navigation
- Agency story / mission statement
- Optional: key stats (years of experience, clients served, projects completed)
- Two-column layout on desktop: text + image/illustration

### Task 4.2 — Create Services section

**File:** `src/components/sections/Services.tsx`

- Section id `#services`
- Grid of service cards (3 or 4 columns on desktop, 1 on mobile)
- Each card: icon (Lucide), title, short description
- Services data in `src/lib/constants.ts` as typed array
- Use shadcn `Card` component

### Task 4.3 — Create Portfolio / Cases section

**File:** `src/components/sections/Portfolio.tsx`

- Section id `#portfolio`
- Grid or carousel of project showcases
- Each item: image/thumbnail, project name, category badge, brief description
- Optional: filter by category (tabs or buttons)
- Portfolio data in `src/lib/constants.ts`

### Task 4.4 — Create Advantages / Why Us section

**File:** `src/components/sections/Advantages.tsx`

- Differentiators / competitive advantages
- Icon + title + description for each point (3–4 items)
- Horizontal layout on desktop, stacked on mobile

### Task 4.5 — Create Testimonials section (optional)

**File:** `src/components/sections/Testimonials.tsx`

- Client reviews / quotes
- Card-based layout or simple carousel
- Avatar, name, company, quote text
- Data in constants

---

## Phase 5: Contact & CTA

### Task 5.1 — Create Contact section

**File:** `src/components/sections/Contact.tsx`

- Section id `#contact`
- Contact form: name, email/phone, message (shadcn `Input`, `Textarea`, `Button`)
- Form is static (no backend) — `mailto:` link, or show success message on submit
- Contact info alongside form: phone, email, address, social links
- Two-column layout: form left, info right

### Task 5.2 — Create CallToAction banner

**File:** `src/components/sections/CallToAction.tsx`

- Full-width colored banner between sections
- Bold text + CTA button
- Used to break up content and drive conversions

---

## Phase 6: Footer

### Task 6.1 — Create Footer component

**File:** `src/components/sections/Footer.tsx`

- Company logo + tagline
- Navigation links (mirror header)
- Contact info (phone, email)
- Social media icon links
- Copyright line with current year
- Multi-column layout on desktop, stacked on mobile

---

## Phase 7: Assembly & Polish

### Task 7.1 — Compose all sections in App.tsx

**File:** `src/App.tsx`

```tsx
<Header />
<Hero />
<About />
<Services />
<Portfolio />
<Advantages />
<CallToAction />
<Testimonials />
<Contact />
<Footer />
```

### Task 7.2 — Smooth scroll behavior

- Add `scroll-behavior: smooth` to `html` in CSS
- Implement `useScrollToSection` hook for header nav clicks
- Optional: active nav link highlighting based on scroll position (`IntersectionObserver`)

### Task 7.3 — Responsive audit

- Test all sections at breakpoints: 320px, 375px, 768px, 1024px, 1280px, 1536px
- Fix any overflow, spacing, or typography issues
- Verify touch targets are >= 44px on mobile

### Task 7.4 — Accessibility pass

- Semantic HTML: `<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`
- All images have `alt` text
- Focus states visible on all interactive elements
- Color contrast meets WCAG AA (4.5:1 for text)
- Skip-to-content link
- `aria-label` on icon-only buttons

### Task 7.5 — Performance & SEO

- Update `index.html`: `<title>`, `<meta description>`, Open Graph tags
- Add favicon set (`public/favicon.ico`, `public/apple-touch-icon.png`)
- Lazy-load images below the fold
- Verify Lighthouse score > 90 on all categories

---

## Phase 8: Build & Deploy Preparation

### Task 8.1 — Production build verification

```bash
pnpm build
pnpm preview
```

- Verify all assets load correctly from `dist/`
- Check no console errors or warnings
- Test in Chrome, Firefox, Safari (if available)

### Task 8.2 — Docker / deploy config (if needed)

- Create `Dockerfile` for static build (nginx or similar)
- Or configure for Cloudflare Pages / Vercel / Netlify static deploy

---

## Execution Order (recommended)

| Order | Task  | Dependency    |
|-------|-------|---------------|
| 1     | 1.1   | —             |
| 2     | 1.2   | —             |
| 3     | 1.3   | —             |
| 4     | 2.1   | 1.2, 1.3      |
| 5     | 2.2   | 2.1           |
| 6     | 3.1   | 1.1, 1.3      |
| 7     | 4.1   | 1.2, 1.3      |
| 8     | 4.2   | 1.2, 1.3      |
| 9     | 4.3   | 1.2, 1.3      |
| 10    | 4.4   | 1.2, 1.3      |
| 11    | 4.5   | 1.2 (optional)|
| 12    | 5.1   | 1.2           |
| 13    | 5.2   | 1.1           |
| 14    | 6.1   | 1.2, 1.3      |
| 15    | 7.1   | all sections  |
| 16    | 7.2   | 7.1           |
| 17    | 7.3   | 7.1           |
| 18    | 7.4   | 7.1           |
| 19    | 7.5   | 7.1           |
| 20    | 8.1   | 7.*           |
| 21    | 8.2   | 8.1           |
