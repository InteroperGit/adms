# Design system

[Documentation index](../../README.md)

## Direction

Use the workshop's signage vocabulary: precise alignment, measured spaces, clear lettering, restrained orange, and quiet framing around genuine work. Keep existing Russian content and the visually hidden homepage h1. No replacement oversized heading or invented proof is introduced.

| Opening concept | Shape | Assessment |
| --- | --- | --- |
| Service-led (selected) | Existing service copy and contact actions, followed by portfolio | Explains the offer without depending on unavailable approved photography. The first visible section heading remains the opening anchor. |
| Work-led (deferred) | Large installed-sign photograph beside brief service copy | Strong when approved installed-work photography exists. Current Picsum images and Pravatar portraits provide no evidence of agency work; they must not lead the page. |

The supplied content and map settings remain unchanged. Task 013 implements the service-led opening; tasks 014–015 refine work, reviews and legal composition. Foundations reduce shadows and unify containers without changing route architecture.

## Tokens and primitives

Header settings use a compact gear surface with the shared DaisyUI `btn-sm` sizing and `site-button` radius, matching the desktop phone button (32px at default text size). A separate centered target remains at least 44×44px. `Settings.astro` contains the panel and interaction boundary; `ThemeToggle.astro` renders only sun/moon/monitor radios with hidden Russian names. Selected double borders and outer keyboard outlines have distinct shapes. Bounded icon/gap/padding growth keeps the row compact at enlarged text sizes; see [theme verification](themes.md) for current measurements and limitations.

The source of truth is `src/styles/global.css`; Tailwind 4 registers reusable utilities through `@theme`, DaisyUI consumes the semantic color variables, and scoped components compose the shared classes.

| Role | Light | Dark |
| --- | --- | --- |
| Paper / base-100 | #FFFFFF | #18212B |
| Pale surface / base-200 | #F3F5F7 | #202C38 |
| Divider surface / base-300 | #DCE2E8 | #354555 |
| Ink / base-content | #18222D | #EDF2F7 |
| Muted text / muted | #526170 | #BDC8D4 |
| Action / primary | #B2380A | #FFA04D |
| Action content | #FFFFFF | #18222D |
| Accent | #9A3412 | #FDBA74 |
| Control boundary | #687787 | #8798AA |

Use `text-muted` rather than hardcoded gray or translucent body text. `base-300` is a quiet panel divider; use `border-control-border` when a boundary is essential to identify a control. Theme colors do not recolor photographs or the external Yandex iframe.

Per the user's preference, `brand` is the same darker orange `#EA580C` in both themes for the logo, contact/decorative icons, and About highlights. Action text, buttons, and keyboard-focus outlines retain theme-specific `primary` colors. The contrast table below describes semantic primary colors, not this brand override.

| Foundation | Value and use |
| --- | --- |
| Spacing | Tailwind's 4px unit; prefer 4/8/12/16/24/32/48/64/80px according to content hierarchy |
| Container | `site-container`: 75rem maximum, centered, gutter clamp(1rem, 3vw, 2rem) shared by header, sections, footer, cookie and detail/legal layouts |
| Section rhythm | `site-section`: block spacing clamp(3rem, 6vw, 5rem); scroll margin measured header height + 16px, with 5rem fallback |
| Section heading | clamp(1.75rem, 2.8vw, 2.5rem), weight 700, line-height 1.2 |
| Body | 1rem base, line-height 1.6, smaller metadata 0.875rem; reading measure 68ch |
| Controls | `site-button`: weight 600, 0.5rem radius; existing DaisyUI sizes preserved |
| Panels | `rounded-panel`: 1rem; smaller fields/selectors 0.5rem; portraits remain circular |
| Shadows | `shadow-panel`: 0 4px 16px / 8%; `shadow-elevated`: 0 8px 28px / 12%; dark 18% / 24% black |
| Focus/motion | 2px primary outline with 4px offset; reduced-motion removes smooth scrolling and minimizes transitions/animations |

### Typeface assessment

Manrope is a suitable engineered sans-serif candidate: [Google Fonts metadata](https://raw.githubusercontent.com/google/fonts/main/ofl/manrope/METADATA.pb) lists Cyrillic/Cyrillic-ext and a variable 200–800 weight axis. Its [SIL OFL 1.1 license](https://raw.githubusercontent.com/google/fonts/main/ofl/manrope/OFL.txt) permits embedding with retained notices. No local font asset exists in the project, so this task retains a dependable locally installed `Segoe UI, Arial, sans-serif` stack without adding font requests or claiming Manrope is hosted.

If adopting Manrope later, supply a verified local WOFF2 with Cyrillic glyphs plus its license under `public/fonts/`, use `@font-face` with `font-display: swap`, retain the system fallback, and verify Russian glyphs, selected weights and layout before deployment. Do not include a Latin-only subset or preload a missing file.

## Contrast measurements

Measured from Chrome's computed theme variables using sRGB relative luminance and the WCAG contrast formula. Columns are base-100 / base-200 / base-300. Targets: 4.5:1 normal text, 3:1 large text and essential control boundaries.

| Pair | Light ratios | Dark ratios |
| --- | --- | --- |
| Body text / surfaces | 16.09 / 14.72 / 12.32 | 14.44 / 12.61 / 8.74 |
| Muted text / surfaces | 6.36 / 5.82 / 4.87 | 9.58 / 8.37 / 5.80 |
| Primary / surfaces | 6.06 / 5.55 / 4.65 | 8.04 / 7.02 / 4.87 |
| Control boundary / surfaces | 4.59 / 4.20 / 3.51 | 5.50 / 4.80 / 3.33 |
| Primary button text / fill | 6.06 | 7.96 |

Primary meets normal-text contrast on all three tested surfaces. Existing footer branding and contact icons also meet their respective large-text and non-text targets. Bright orange with white text is replaced by darker light-theme orange; dark buttons use dark ink. Measurements validate the palette and actual default button colors, not every possible hover, opacity blend or third-party asset. Task 016 must audit the finished component states.

## Browser evidence and limitations

Task 011 captured all six routes before edits at 375×1000 and 1440×1000: `/`, `/projects/1`, `/projects/2`, `/projects/3`, `/privacy-policy`, `/terms-of-use`. Local evidence is in `output/playwright/task-011/before/` (12 full-page screenshots). Matching after captures cover both themes in `after/` (24 screenshots). Generated artifacts are ignored by Git; they remain available locally for review. Shared scripts `baseline.js`, `verify.js`, and `measure.js` record capture/measurement methodology.

Chrome mobile home before/after images were inspected: narrower duplicated section gutters were removed, shadows made quieter, muted text and dark surfaces made readable. Six routes have no horizontal overflow at 375px in either theme. Dark screenshots set `data-theme` directly only for task 011 verification. The current shared layout defaults to System and supports persisted Light/Dark/System selection; see [color themes](themes.md).

`pnpm check` passed for 40 files with zero errors/warnings/hints; `pnpm build` generated six pages. Build failures from an intermediate Windows batch edit were corrected before the successful checks. Remote demonstration images can fail to load (one Pravatar request reset); no claim is made about approved-media crops or map availability. The dev toolbar appears in captures. Some baseline cookie overlays and narrow desktop breakpoint behavior still need their planned component/behavior tasks. Full 320/768px, zoom, screen-reader, hover-state and interaction verification belong to task 016; this task does not claim them complete.

### Appearance settings

The header's appearance settings use a quiet, solid base-100 panel with shared field/panel radii, control boundaries and elevated shadow. A single gear opens a compact joined native radio control with local sun/moon/monitor SVGs, a left «Тема» label, Russian accessible names/tooltips and a border/surface selection indicator. Functional icons use semantic ink/primary tokens rather than decorative brand orange. The panel retains 16px viewport clearance and internal scrolling; enlarged mobile text wraps the header brand above its controls. See [theme behavior and measured contrast](themes.md) for keyboard boundaries, persistence and browser evidence.

Implementation references: [Astro styles](https://docs.astro.build/en/guides/styling/), [Astro components](https://docs.astro.build/en/basics/astro-components/), [DaisyUI themes](https://daisyui.com/docs/themes/).

## Header and service opening (task 013)

The opening is left aligned, led by the existing «О нас» heading and service paragraphs rather than the generic oversized sparkle. Lead copy has a 48ch maximum measure and responsive 1.25–1.875rem size. The contact action reuses `sections.contacts.panelTitle` and the contacts menu URL; its secondary action reuses the projects title and URL. Editable copy remains in JSON. Three unchanged statistics use a quiet divider and description-list semantics, changing to stacked value/label rows on narrow screens. Brand orange is retained for the large statistics; muted labels remain readable.

The header retains the decorative butterfly and approved appearance settings. Navigation switches to the native mobile dialog below 64rem, avoiding the previous crowded 768px desktop row; desktop links and the brand can wrap deliberately. Section links have 44px minimum height. Mobile navigation fills its actual dialog width, wraps long labels and keeps Escape, focus containment, destination focus and desktop-resize dismissal. Settings and phone surfaces both measured 32px high at default text size; their existing interaction design remains intact.

A ResizeObserver measures header height for shared section anchor clearance. Initial hash correction happens on the next animation frame and is cancelled by user input; it does not wait for remote-image load. Existing auto-hide stays visible with settings, navigation or keyboard focus and respects reduced motion.

Chrome verification covered 320/375/768/1440px in both themes, each with separate 16px and 32px root-text sizes (16 combinations). Header/opening content bounds, logo loading, visually hidden h1, measured anchor clearance, settings and mobile-menu/Escape flows passed. Additional checks passed for keyboard settings focus, both dialog Tab boundaries, mobile destination focus, opening actions, root-relative links from all five other routes, all four direct homepage hashes, scroll-direction hide/reveal, settings/dialog visibility, reduced motion and breakpoint-resize dismissal. Temporary longer Russian brand/stat labels at 320px with 32px text fit and were restored by navigation. Long-word overflow found in enlarged service paragraphs was fixed with wrapping.

Evidence: `output/playwright/task-013/` contains four before and four after screenshots (375/1440px, both themes), `baseline.js`, `verify.js`, `final-checks.js` and `measure.js`; artifacts are ignored. Desktop Light and mobile Dark screenshots were visually inspected. Before images include the cookie banner; after images use a saved accepted cookie choice to inspect the opening unobscured.

Computed contrast on the opening base surface (Light / Dark): lead text 16.09 / 14.44, detail/labels 6.36 / 9.58, orange 32px bold statistics 3.56 / 4.57, primary action 6.06 / 7.96, secondary action 6.06 / 8.04. Large statistic text exceeds 3:1; body/actions exceed 4.5:1. Native browser zoom was attempted with Control+plus but neither viewport width nor DPR changed in automated Chrome, so actual 200% browser zoom remains unverified. Root-text enlargement is a separate check. External placeholder image failures, final whole-site overflow (reviews/cookie/footer), screen-reader and full hover-state review remain tasks 014–016; these checks do not claim whole-site completion.
