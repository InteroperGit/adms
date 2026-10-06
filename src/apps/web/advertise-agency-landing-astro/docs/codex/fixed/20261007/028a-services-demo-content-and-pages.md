# Enable Services with test images and article pages

**Status:** Completed

**Completed:** 2026-10-07

**Priority:** High

**Created:** 2026-10-06

**Depends on:** [Task 028](028-services-section.md)

## Goal

Enable the homepage Services section with test imagery and a dedicated test
article for every service item, as requested by the user. Extend the
[sales and SEO plan](../../plan/sales-and-seo-plan.md) with a reviewable demo
catalog before agency-approved production content becomes available.

Read [project instructions](../../../../AGENTS.md),
[task management](../../task-management.md), and applicable development rules.
Apply frontend-design and astro-best-practices; use Playwright for browser
verification and follow the background development-server rules.

## Scope

- Enable all five existing services in `data/content/services.json`:
  световые буквы, вывески, неон, объёмные конструкции, and монтаж.
- Add an explicit editable demo mode to the existing content contract and
  validation/loader so test entries can render without marking their claims,
  copy, or image rights as agency-approved. Preserve the approval-based
  publication behavior when demo mode is disabled.
- Show Services directly after About, retaining Offers → Introduction →
  About → Services and alternating section surfaces. Enable the configured
  «Услуги» navigation entry whenever the demo section is rendered.
- Supply a relevant test image for every item, with dimensions, descriptive
  alt, source/usage information, and mobile/desktop focal points. Prefer
  reliable local assets and the established Astro image pipeline. Test
  illustrations or licensed sample photos must not imply agency projects.
- Clearly identify the catalog and article content as demonstration content
  with concise Russian wording visible to visitors. Do not expose approval
  flags, schema details, or other implementation information in the UI.
- Create a static dedicated article page for every service and link each
  card to its corresponding page. Expected routes:
  `/services/svetovye-bukvy/`, `/services/vyveski/`, `/services/neon/`,
  `/services/obyomnye-konstruktsii/`, and `/services/montazh/`.
- Follow existing layouts and content loading/validation conventions.
  Keep pages mostly static and share article presentation where useful.
  If routes use dynamic generation, update existing route-existence
  validation to recognize generated pages and reject missing destinations.
- Give each article its own title, description, visible H1, relevant test
  image, and useful category-specific Russian text explaining the service,
  common variants, and what a customer can describe in an inquiry. Avoid
  invented agency prices, guarantees, timelines, materials, or outcomes.
- Include native links back to `/#services` and to `/#order-inquiry`.
  Keep the form's existing unavailable state and direct contact fallback.
- Exclude demonstration articles from indexing with page-specific noindex
  metadata until their actual production content is approved. Do not change
  unrelated pages' indexing behavior.
- Update the content handoff with demo-mode behavior, asset sources, routes,
  and steps for replacing test content and returning to approved publication.

## Acceptance and verification

- The homepage visibly shows all five Services cards after About, each with
  a working relevant test image and native link to its own article.
- Demo mode is explicit, editable, and validated. Existing agency approval
  flags remain honest; disabling demo mode restores the publication gate.
- All five article routes build and render distinct useful content, one H1,
  title/description, a demo notice, noindex metadata, and working back/inquiry
  links. Cards and articles make no false agency-work claims.
- Verify image requests, dimensions, responsive output and crops, including
  production optimization through the installed Sharp dependency.
- Verify light/dark themes at 320/768/1440px, enlarged text, keyboard focus,
  native link activation, menu closing, sticky-header clearance, and essential
  navigation without JavaScript. Check for clipping and horizontal overflow.
- Confirm offers/settings, project navigation, cookie behavior, and inquiry
  availability remain functional. Do not claim actual inquiry delivery.
- Run `pnpm check`, `pnpm build`, and diff checks. Record browser evidence,
  actual generated route count, and any unavailable checks or agency inputs.
- Hand off the enabled demo catalog and all article pages to
  [task 029](029-services-verification.md) for updated populated verification.

## Completion

Archive after the demonstration acceptance above passes, updating plan links
and task status under the task-management guide. Completion of this task
means the requested demo is implemented; genuine agency copy/photo approval
and production service-page SEO acceptance remain separate open inputs.

## Implementation and verification — 2026-10-07

- Enabled five demo cards after About and the shared «Услуги» menu link.
  Added editable `demoMode`, visible Russian `demoNotice`, and validated
  article fields. The loader exposes `visibleServices` separately from
  approval-only `publishedServices`; agency approval flags stay false.
- Added original category illustrations in `src/assets/services/`: SVG
  sources and 1200×900 PNGs, with explicit test alt/provenance/context.
  They depict signs, neon, dimensional advertising and installation without
  claiming client work. Reviewed mobile/desktop visuals and corrected neon
  lettering to a readable Russian «НЕОН» before the final build.
- Added five static `/services/slug/` routes sharing `ServiceArticle.astro`.
  Each has distinct Russian copy, title/description, one H1, inquiry inputs,
  illustration, demo notice, and native Services/inquiry links.
- Added optional layout noindex metadata. All demo articles emit
  `noindex, follow`; the homepage and existing pages retain their indexing
  behavior. Articles remain noindex while agency/article approval is absent
  even if demo mode is subsequently disabled.
- Shared article imagery uses Astro Image with eager/high-priority loading;
  cards use lazy responsive images. Sharp generates 20 optimized WebP assets
  across five originals (320/480/768/1200px variants). Images load locally.
- Used frontend-design, astro-best-practices and Playwright skills. Reused
  `http://localhost:4321`, then restarted it in required background mode to
  clear a cached missing-module error created before the component existed.
  The existing server manager prevented starting a second managed server.
- Browser matrix: homepage and all five articles × light/dark themes ×
  320/768/1440px = 36 passing cases. All images decode, have alt/srcset,
  notices are present, routes return 200, and no page/section overflow.
  Repeated all cases with 200% root text and appended long/unbroken text;
  no section overflow. This does not establish native browser zoom coverage.
- Mobile/desktop header navigation from a project page reaches Services
  with header clearance and closes the mobile menu. Every card link works
  by Enter with a visible 2px outline; every article return link works.
- Both system themes at 320px without JavaScript: all five card/article/back
  link flows pass with local image requests. Unrelated external requests
  were aborted to isolate native loading/navigation from remote delays.
- Article inquiry action reaches the existing form, whose submission stays
  disabled. Offers arrows/dots/autoplay, header navigation, theme settings,
  a project page, and cookie dismissal/persistence pass regression checks.
- Content checks: demo exposes five cards; disabling it hides the unapproved
  catalog; a properly approved fixture exposes one card. Invalid demo type,
  missing image/link, nonexistent route, empty article sections and invalid
  image dimensions are rejected. All real approval flags remain false.
- Generated HTML checks pass for each article's H1, distinct metadata,
  notice, noindex, image srcset, and Services/inquiry links. Homepage has
  Services and no new noindex tag. All five static route directories exist.
- Final `pnpm check`: zero errors/warnings; one pre-existing unused-variable
  hint in ignored `output/playwright/task-018/matrix.js`.
- Final `pnpm build`: passed, 11 static pages, 20 optimized image variants.
  `git diff --check` and changed source line-length checks pass.
- Ignored evidence/helpers: `output/playwright/task-028a/`. Screenshots
  include catalog and neon article in both themes at all three widths.
  Cookie/header/toolbar suppression was DOM-only during visual captures;
  some existing toolbar chrome remains visible in screenshots.
- Updated the services content handoff and task 029's current state.

Demo acceptance passes; task 028a is complete. Real agency confirmation,
approved production articles, photographs, rights/crops and broader SEO
acceptance remain open in tasks 027–029 and the plan's production phase.
