# Implement the FAQ section

**Status:** Implementation completed; agency publication approval pending

**Priority:** Priority 2

**Created:** 2026-10-09

**Depends on:**
[Task 044](044-faq-content.md), homepage section order, and
shared typed content-loader conventions.

## Goal

Add a mostly static FAQ section that answers customer questions clearly and
links visitors to the inquiry form when they need a project-specific answer.

## Scope and acceptance

- Add the section after `Reviews.astro` and before `OrderInquiry` in
  `src/pages/index.astro`.
- Render approved questions and answers from the Task 044 typed content
  contract; do not hardcode customer copy in the component.
- Use native accessible disclosure controls or an equivalent semantic pattern.
  Questions must remain readable and usable with JavaScript disabled.
- Preserve the complete reading order in the HTML and provide visible keyboard
  focus, suitable contrast, and usable enlarged text.
- Include a clear native link to the existing inquiry form without implying
  that inquiry delivery has been verified.
- Omit unapproved answers and unresolved agency claims from production output.
- Follow the existing section surface, heading, responsive, theme, and reduced
  motion conventions.
- Do not add FAQ structured data solely to pursue rich results.

## Handoff

Record the final visible copy, content contract, changed files, and any
remaining agency approvals for Task 046.

Task 044 provides `faq` in `src/content/faq.ts` and
`getPublishedFaqItems` in `src/content/faq-publication.ts`. Use the helper
and omit the whole section when it returns no items. All nine supplied
answers and section copy are drafts awaiting documented agency approval.

## Implementation and Task 046 handoff

Follow-up on 2026-10-09: user requested visible FAQ on the page. Explicit
`demoMode` now shows all nine supplied answers with a preliminary-copy
notice through `getVisibleFaqItems`. Approval data remains draft. Turning
demo mode off restores the original approval gate. Check/build and FAQ
schema/publication checks passed after this change.

Completed 2026-10-09. `src/components/sections/Faq.astro` renders a shared
`Section` after Reviews and before Contacts and OrderInquiry in
`src/pages/index.astro`. It calls `getPublishedFaqItems(faq)` before rendering;
an empty result omits the entire section, including its heading and link.

Final production-visible FAQ copy: none. All nine answers and the section
copy remain drafts, so no FAQ heading, answers, or inquiry action is currently
published. Future visible copy comes exclusively from `src/content/faq.ts`:
`heading`, the approved items' `question` and complete `answer`, plus
`inquiryLabel` and the fixed `inquiryHref` of `/#order-inquiry`. Task 044 and
`data/content/faq.json` remain the copy and approval source; no wording or
approval data changed in Task 045.

Each answer uses an independent native `details`/`summary`, retaining the
question immediately before its full answer in HTML. The native marker,
keyboard activation, and multiple simultaneously open answers work without
JavaScript. There are no custom disclosure scripts, animations, fixed text
heights, added claims, or structured data. Shared section surfaces and theme
tokens, visible focus rings, generous targets, bounded reading measure, and
wrapping text support both themes, narrow screens, and enlarged text.

Changed implementation files: `src/components/sections/Faq.astro` and
`src/pages/index.astro`. Updated this task, the sales plan, and Task 046's
dependency and handoff; the task is archived under `fixed/20261009`.

Validation: `pnpm check` and `pnpm build` pass. Check reports only the existing
unused-variable hint in `output/playwright/task-018/matrix.js`.
`node scripts/verify-faq.mjs` passes. An isolated Astro container check in
`output/playwright/task-045/render-check.mjs` passes draft omission and a
single in-memory approved-answer fixture: one native disclosure, complete
copy in question/answer order, omission of other drafts, correct inquiry
destination, and no script. It does not modify the source approval data.
The render harness emits a Vite transport-disconnected message on shutdown
after passing; no production build error occurs.

Task 046 still owns focused browser checks of the eligible branch: keyboard,
no-JavaScript, responsive/enlarged text, both themes, reduced motion, inquiry
navigation, and neighboring section regression. Use an isolated fixture;
do not mark production drafts approved to expose the section. Agency terms,
wording, sources, and named approvers remain required before publication.
Inquiry delivery and attachment support remain separate unverified concerns.
