# Task 6 — Improve page headings and metadata

**Status:** Completed (production domain not yet configured; browser visual check outstanding)

Read the [shared implementation instructions and coordination plan](../../plan/20261001_222426_plan.md) before starting.

**Priority:** Medium

**Files:** `src/layouts/Layout.astro`, `src/pages/index.astro`, `src/pages/projects/[id].astro`, `src/layouts/LegalLayout.astro`, `astro.config.mjs`, site configuration

Add a clear homepage `<h1>` using supported agency information. Extend the layout to support canonical URLs and social sharing metadata. Supply page-specific descriptions for projects and legal pages. Obtain or document the missing production domain before generating absolute production URLs. Reuse centralized brand configuration in page titles.

**Acceptance criteria:**

- Each page has a meaningful main heading and description.
- Page titles use the shared agency name.
- Canonical and social metadata use the actual production domain when provided; no placeholder domain is emitted as production metadata.
- Generated HTML and build are checked.

## Implementation and verification

- Implemented by subagent task_006 and reviewed by the primary agent.
- Added a homepage heading from `site.title` while retaining the existing sections and anchors. Per the subsequent user request, the heading uses `sr-only` so it remains available to screen readers without appearing visually or adding page spacing.
- Centralized branded titles in the shared layout using `site.logoText`.
- Added project-specific and legal-page descriptions, Open Graph text metadata, and Twitter summary metadata.
- Canonical links and `og:url` derive from `Astro.site` when configured. No confirmed production domain was found, so these tags remain omitted. README documents configuring the actual domain and supplying a real social-sharing image later.
- `pnpm check` passed for 35 files with zero diagnostics; `pnpm build` generated six pages.
- Generated HTML checks confirmed exactly one meaningful h1 per page, distinct descriptions, branded titles, expected social tags, and no canonical/production URL metadata while the domain is unset.
- Primary-agent diff review and `git diff --check` passed.
- Browser visual verification remains outstanding because browser automation tools were unavailable.
