# Task 6 — Improve page headings and metadata

**Status:** Pending

Read the [shared implementation instructions and coordination plan](../plan/20261001_222426_plan.md) before starting.

**Priority:** Medium

**Files:** `src/layouts/Layout.astro`, `src/pages/index.astro`, `src/pages/projects/[id].astro`, `src/layouts/LegalLayout.astro`, `astro.config.mjs`, site configuration

Add a clear homepage `<h1>` using supported agency information. Extend the layout to support canonical URLs and social sharing metadata. Supply page-specific descriptions for projects and legal pages. Obtain or document the missing production domain before generating absolute production URLs. Reuse centralized brand configuration in page titles.

**Acceptance criteria:**

- Each page has a meaningful main heading and description.
- Page titles use the shared agency name.
- Canonical and social metadata use the actual production domain when provided; no placeholder domain is emitted as production metadata.
- Generated HTML and build are checked.

