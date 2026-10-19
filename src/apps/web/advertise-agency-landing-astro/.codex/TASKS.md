# Latest task — 124, 2026-10-19

- Expanded mobile navigation coverage for focus trapping, Escape, close button,
  resize, same-page hashes, cross-page hashes, and contact links.
- Fixed same-page hash focus in `MobileMenuDialog.astro` by preserving the
  URL with `history.pushState` and focusing after dialog close.
- Navigation and preferences Chromium suites: 11 tests passed.
- Archived the task in `docs/codex/fixed/20261019/`.

# Latest task — 123, 2026-10-19

- Expanded `tests/e2e/preferences.spec.ts` into six isolated browser tests.
- Covered accepted and declined consent, blocked storage, explicit and system
  themes, and synchronization across two pages.
- Focused Chromium run: 6 tests passed.
- Archived the task in `docs/codex/fixed/20261019/`.

# Latest task — 122, 2026-10-19

- Split the original E2E site scenarios into focused specs under `tests/e2e/`.
- Removed `tests/e2e/site.spec.ts` after preserving its assertions by topic.
- Archived the task in `docs/codex/fixed/20261019/`.

# E2E planning — 2026-10-19

- Created docs/codex/plan/20261019_e2e-test-suite-plan.md.
- Added 16 pending tasks, 121–136, under docs/codex/todo/.
- Each task specifies input files, allowed edits, steps, acceptance and
  a focused command; Luna is the default implementation model.
- Started with 121-e2e-network-fixture.md; task 122 is now archived.
- Planning only: no application/test code changed, no tests run.

# Latest task — 120, 2026-10-19

- Removed `tests/unit` and pointed `test:unit` at colocated pure logic suites.
- Updated verification documentation; quality CI already used the correct
  gates, and Vitest still discovers integration tests under `tests/**`.
- Unit: 32 files/451 tests; components: 64/234; integration: 2/58;
  full: 98/743. Check, lint, style, coverage and component gate pass.
- Repository-wide Prettier check reports 420 existing violations; changed
  code/config files pass focused formatting checks.
- Archive: `docs/codex/fixed/20261019/120-remove-legacy-unit-tree.md`.

# Latest task — 119, 2026-10-19

- Colocated content publication, pricing/category, catalog and server payload
  suites with their source modules.
- Removed migrated suites from `tests/unit`; task 120 owns the empty directory,
  scripts, CI and documentation cleanup.
- Focused run: 5 files and 223 tests pass; code-style check passes.
- Archive: `docs/codex/fixed/20261019/119-colocate-content-runtime-suites.md`.
- Next task: 120-remove-legacy-unit-tree.md.

# Latest task — 118, 2026-10-19

- Colocated validation contracts and boundary cases with their schemas;
  added `src/validation/image-carousel.test.ts`.
- Removed migrated validation suites from `tests/unit`; retained block
  publication coverage for task 119.
- Focused run: 18 files and 176 tests pass.
- Archive: `docs/codex/fixed/20261019/118-colocate-validation-suites.md`.
- Next task: 119-colocate-content-runtime-suites.md.

# Latest task — 113, 2026-10-18

- Completed route-handler and type-contract coverage; archived in
  fixed/20261018/.
- Added eight crawler response cases and strict compile-time fixtures for all
  18 `src/types` modules, including barrel exports and schema compatibility.
- Fifty-eight integration tests, the strict type harness, Astro check/build,
  lint, formatting, content, boundary, colocation and style checks pass.
- No task file is currently present in `docs/codex/todo/`; task 114 remains
  listed in the plan but has not been added to the active queue.
# Latest task — 112, 2026-10-18

- Completed route and layout integration coverage; archived in fixed/20261018/.
- Added full-document Astro render context and fixture-backed cases for both
  layouts and all 12 page templates, including metadata, publication states,
  pagination, heading hierarchy and no-JS reading order.
- Fifty focused integration tests pass; check, build, content, boundary,
  colocation, lint, formatting and whitespace checks pass.
- Next pending task: 113-route-and-type-contracts.md.
# Latest task — 108, 2026-10-18

- Completed article and contact section render tests and archived the task in
  fixed/20261018/.
- OrderingProcess, BusinessSolutions, ProductionAndGuarantees, Faq, Contacts
  and ServiceArticle now cover output ordering, approval filtering, native
  links, empty sections, demo disclosure and unknown-service failure.
- Seven focused tests pass and changed-file code style passes.
- Next pending task: 109-project-catalog-components.md.

# Latest task — 107, 2026-10-18

- Completed homepage section render tests and archived the task in
  fixed/20261018/.
- About, Introduction, OffersCarousel, Services, Projects, Reviews and
  PricingExamples now cover section output, optional media, ordering, links,
  empty collections and demo/provider branches.
- Eight focused tests pass and changed-file code style passes.
- Next pending task: 108-article-and-contact-sections.md.

# Latest task — 106, 2026-10-18

- Completed form component render tests and archived the task in
  fixed/20261018/.
- LedLettersForm and OrderInquiry now cover context fields, required and
  conditional controls, consent, legal links, disabled initial submission,
  status wiring and accessible error associations.
- Five focused tests pass; code style and component colocation pass.
- Next pending task: 107-home-sections.md.

# Latest task — 105, 2026-10-18

- Completed media and form block contract tests and archived the task in
  fixed/20261018/.
- ContentImage, image, gallery, chart, video and order-form suites cover
  metadata, captions, fallbacks, safe native links, MIME/poster handling and
  registered/demo/general form publication cases.
- Nineteen focused tests pass; code style and component colocation pass.
- Next pending task: 106-form-components.md.

# Latest task — 104, 2026-10-18

- Completed basic content block contract tests and archived the task in
  fixed/20261018/.
- Heading, paragraph, list, table, quote and footnote suites now cover
  semantic HTML, optional fields, escaping and safe links; the MDX allowlist
  has an exact export assertion.
- Fifteen focused tests pass and changed-file code style passes.
- Next pending task: 105-media-and-form-block-components.md.

# Latest task — 103, 2026-10-18

- Completed card component contract tests and archived the task in
  fixed/20261018/.
- ServiceCard, ProjectCard, ReviewCard and PricingExample now have focused
  colocated suites covering normal, empty/media, escaping, links, dimensions,
  thumbnail selection, price context and disclosures.
- All four card components reach 100% statements, branches, functions and
  lines in the focused coverage run; 18 tests pass.
- Next pending task: 104-basic-content-block-components.md.

# TODO model assessment — 2026-10-18

- Assessed all 11 pending tasks, 103–113, with Luna as the default.
- Added model IDs, reasoning effort, rationale and runnable subtasks.
- Six tasks use Luna throughout; five split work between Luna and Sol.
- Subtasks: 34 Luna, 8 Sol. Implementation tasks remain planned.
- Summary: [model assessment][todo-model-assessment].
- Documentation only; no implementation tests or model trials run.

[todo-model-assessment]: ../docs/codex/plan/20261018_todo-model-assessment.md

# Task created — 115, 2026-10-16

- Added planned task for Prettier, ESLint and Playwright Test setup.
- Task: [115](../docs/codex/todo/115-prettier-eslint-playwright.md).
- Includes Astro support, CLI smoke migration, browser matrix and CI gates.
- Implementation is pending; dependencies and application code unchanged.

# Latest task — 099, 2026-10-16

- Completed task 099 without subagents; archived in fixed/20261016/.
- Expanded colocated inquiry browser suite from 18 to 42 tests.
- Inquiry: 100% statements/functions/lines, 96.1% branches.
- Full regression suite: 100 files, 628 tests pass.
- Type/style, colocation, content checks and build pass (39 pages).
- Existing Zod hint and large-chunk warning remain.
- Production code and runtime content unchanged; fetch is mocked.
- Next pending task: 100-carousel-and-reveal-scripts.md.

# Previous task — 098, 2026-10-16

- Completed task 098 without subagents; archived in fixed/20261016/.
- Added 17 chart runtime tests and expanded image resolver tests to five.
- Chart: 100% coverage; image resolver: 100% lines and functions.
- Full regression suite: 100 files, 604 tests pass.
- Type/style, colocation, content checks and build pass (39 pages).
- Existing Zod hint and large-chunk warning remain.
- Production code and runtime content unchanged.
- Next pending task: 099-inquiry-browser-module.md.

# Previous task — 097, 2026-10-16

- Completed task 097 without subagents; archived in fixed/20261016/.
- Added 169 colocated server inquiry tests and synthetic versioned fixtures.
- Validator: 100% statements, branches, functions and lines.
- Full regression suite: 99 files, 584 tests pass; colocation gate passes.
- Type checking and style pass; existing Zod deprecation hint remains.
- Production code and runtime content unchanged.
- Next pending task: 098-image-and-chart-utils.md.

# Previous task — 096, 2026-10-16

- Completed task 096 without subagents; archived in fixed/20261016/.
- Added eleven colocated content publication/registry suites (52 tests).
- All eleven scoped modules: 100% statements, branches, functions and lines.
- Full suite: 98 files, 415 tests pass; type/style and colocation gates pass.
- Content invariants/boundaries and production build pass.
- Existing Zod hint and build chunk warning remain. Runtime code unchanged.
- Next pending task: 097-inquiry-payload-tests.md.

# Previous task — 095, 2026-10-16

- Completed without subagents; archived in fixed/20261016/.
- Added seven colocated commerce/catalog validation suites (72 tests).
- All seven scoped modules: 100% statements, branches, functions and lines.
- Full suite: 87 files, 363 tests pass; check and colocation gate pass.
- Existing Zod deprecation hint remains. No production code changed.
- Next pending task: 096-content-publication-logic.md.

# Latest task — 090, 2026-10-15

- Completed without subagents; archived in fixed/20261015/.
- Added 38 UI/card DOM tests; 153 total tests pass.
- Eight scoped Astro components: 100% mapped render-code coverage.
- Pricing card imports pure formatter; Vite resolves Astro asset modules.
- Check/build/content gates pass; existing HTML audit findings in task 095.
- Next task: 091 content block tests. No commit or deployment made.

# Latest task — 089, 2026-10-15

- Completed without subagents; archived in fixed/20261015/.
- Added 114 unit tests using versioned JSON fixtures, plus existing smoke test.
- Full suite: 115 pass; task scope coverage: 99.21% lines, 95.34% branches.
- Fixed Russian search normalization and extracted conditional email wiring.
- Check, content boundaries/invariants and production build pass.
- HTML quality audit finds existing project duplicate IDs and homepage image
  loading-policy omission; recorded in task 095 for follow-up.
- Next task: 090 UI and card component tests. No commit or deployment made.

# Latest task — VCB-03, 2026-10-14

- Paragraph refinement completed without subagents; archived in fixed/20261014/.
- Added prose measure/rhythm, safe native URL links and heading label fallback.
- Four link fixtures and 14 browser cases pass; 12 screenshots in
  output/playwright/vcb-03/. Repeat steps: content-block-visual-matrix.md.
- Check, isolated/normal builds and content/publication checks pass.
- Next task: VCB-04 list block. No commit or deployment performed.
# Latest task — 2026-10-14

- VCB-02 implemented without subagents and archived in fixed/20261014/.
- Validated local fixture covers all ten current types and four variants.
- Browser: 36 matrix cases plus keyboard/reduced-motion checks pass.
- Evidence: output/playwright/vcb-02/; repeat instructions in
  docs/site/content-block-visual-matrix.md.
- Check, isolated/normal builds, block/publication/content checks pass.
- Next task: VCB-03 paragraph block. No commit or deployment performed.
# Current work

- User moved tasks 052-053 from fixed and all 13 todo tasks into
  docs/codex/backlog/ on 2026-10-10: 15 tasks, numbered 052-066.
- Backlog statuses and relative links updated; plan/content/README and
  task-management guide now describe the new deferred-task folder.
- Implementation/review evidence and outstanding agency inputs preserved.
- Todo is empty; task052/task053 are no longer in fixed. No commit created.


- Task 053 archived at user request 2026-10-10 in fixed/20261010/.
- Plan/content links updated; production approval dependencies preserved.


- Latest Introduction image: distinct CC0 photograph of dimensional lettering
  by PiperMcCorkle, cropped/optimized to 1200x900 WebP in
  src/assets/introduction/storefront-sign.webp. No offer image duplication.
- Source/license/crop recorded in docs/site/content.md; check/build pass.
- AI generation was not performed: API key missing, dependency install failed;
  latest user request fulfilled using a licensed photograph instead.


- Introduction image updated at user request: local CC0 storefront with
  illuminated lettering replaces Picsum; real dimensions/alt/source updated.
- Reuses licensed Sharp-optimized offer asset with responsive Astro variants.
- Demo mode remains explicit; stock is not presented as actual agency work.
- pnpm check/build pass; task053 and content handoff updated.


- Task 053 follow-up: original Introduction Picsum photo restored at user
  request using explicit demoMode:true; photo.approved remains false.
- Normal publication gates apply outside demo mode. Three fixture tests,
  pnpm check/build and restored-image generated HTML verification pass.
- Previous text-only browser evidence describes the pre-restoration state.


- Task 053 implementation prepared 2026-10-10 by implement_053 and reviewed
  independently by review_053; two findings fixed, second review clean.
- Removed Picsum hero; introduction photo now requires copy/photo approvals.
- Refreshed draft catalog copy; shared publication gates cover cards, nav,
  article noindex and sitemap. Hidden catalog gets native homepage return.
- Three independent fixture tests, content invariants, pnpm check/build pass.
- Synthetic-origin sitemap excludes draft services; normal build restored.
- Browser: 320/1440px, light/dark, local image decode, draft metadata and no-JS
  pass. Evidence: output/task-053/. Unrelated remote assets outside scope.
- Task archived at user request; agency confirmations, approved copy/area and
  genuine project photos/publication rights remain missing; flags stay false.
- No commit or deployment performed.


- Task 052 archived at user request 2026-10-10; plan and task links updated.
- Implementation verified; agency publication approval remains pending.


- Task 052 follow-up 2026-10-10: four enabled offers now include stands
  and city architecture sign approval, with specific contacts CTAs.
- Original stand SVG added; approval offer reuses licensed storefront photo.
- pnpm check/build and generated-slide/link checks pass.


- Task 052 updated and technically verified 2026-10-10.
- Two evergreen service offers replace test copy; service-specific contact CTAs.
- Local CC0 sign/neon stock photos converted with Sharp and Astro srcsets.
- Sources/licenses documented in docs/site/offers-carousel.md.
- pnpm check/build, eight responsive/theme browser cases and no-JS pass.
- Evidence: output/task-052/; agency publication approval remains pending.
- Task archived at user request 2026-10-10 in fixed/20261010/.


- Task 051 progressed 2026-10-09 via separate implementation/review agents.
- Added src/server/inquiry-payload.ts and scripts/test-inquiry-payload.mjs;
  both-form validation is a backend prerequisite, not a live endpoint.
- One fix/review cycle corrected email label lengths and numeric syntax;
  final review found no actionable defects. Five synthetic test groups,
  pnpm check (one existing hint), code style, build and diff checks pass.
- Integration/rollback and legacy service incompatibilities documented in
  docs/site/order-inquiry.md; task and sales/SEO plan updated.
- Task 051 archived at user request 2026-10-09 in fixed/20261009/.
- Provider/recipient/consent decisions, backend
  integration, abuse protection, durable deduplication and real receipt open.
- Delivery remains disabled; no external submission or deployment performed.


- Task 050 prepared 2026-10-09 by an implementation subagent and reviewed
  independently by a second subagent; no actionable defects found.
- Register: docs/site/production-inputs.md; task 051 handoff linked.
- 94 reviewed local documentation links resolve; diff whitespace checks pass.
- Task 050 archived at user request on 2026-10-09 in fixed/20261009/.
- Agency business/legal approval, mailbox purposes, recipient, hosting/provider,
  retention and consent decisions remain pending.
- No legal JSON, application code or delivery activation was changed.


- Sales/SEO backlog audited 2026-10-09; pending tasks 050-066 created in
  docs/codex/todo/ and linked from docs/codex/plan/sales-and-seo-plan.md.
- Covers production inputs/content, live delivery, service SEO, metadata,
  indexing/listings, lead/sales measurement, and final acceptance.
- Existing sitemap/robots and service routes are reused by follow-ups.
- Task 066 tracks task-049 browser limits and task-046 CTA overflow.
- Archived demo/technical work does not establish production approval.


- Tasks 035-037, including 036a/036b, are in fixed/20261007.
- Archived at user request; plan and task links updated.
- Production evidence, photo approvals, and live delivery remain pending.

- Task 037 technically verified and archived on 2026-10-07.
- Archive: docs/codex/fixed/20261007/037-case-study-verification.md.
- 133 fixture/schema, 383 main-browser and 90 fixture-browser checks pass.
- 29 surrounding regressions, grouped form tests and 224 links pass.
- Fixed conditional email requirement label; reset verified.
- Final Astro check/build and source/diff checks pass.
- Evidence: output/playwright/task-037/; text contrast >= 5.55:1.
- Picsum failed to decode; local diagrams loaded. URLs retained by request.
- Genuine case approvals and live delivery remain separate dependencies.


- Task 036b created 2026-10-07: service-specific order forms.
- Task: docs/codex/fixed/20261007/036b-service-specific-order-forms.md.
- User scope: LedLetters only, after final results on case study pages.
- LedLetters implemented with contact/service fields and case context.
- Astro check/build and 18 responsive/theme browser cases passed.
- Simulated validation, failure, duplicate prevention and retry passed.
- Live delivery remains disabled: endpoint/approved consent not configured.
- Task 036b archived at user request; evidence: output/playwright/task-036b/.


- Task 036a completed and archived on 2026-10-07.
- Archive: docs/codex/fixed/20261007/036a-case-study-manufacturing-and-installation.md.
- Optional process text/images and empty-section omission implemented.
- Full copy and local diagrams supplied for all three development projects.
- 14 schema checks, 80 rendering checks, 18 browser cases passed.
- Astro check/build, source style and encoding checks passed.
- Evidence: output/playwright/task-036a/; no-JavaScript navigation passed.
- Task 037 technical verification complete; genuine agency acceptance open.


- Tasks 035-037 archived in fixed/20261007 at user request.
- Task 035: docs/codex/fixed/20261007/035-case-study-content-and-evidence.md.
- Task 036: docs/codex/fixed/20261007/036-expanded-case-study-pages.md.
- Task 037: docs/codex/fixed/20261007/037-case-study-verification.md.
- Task 035 technical implementation verified in a subagent on 2026-10-07.
- Preserved IDs 1-3 as labelled text-only demos; unsupported claims removed.
- Structured evidence/photos/details and shared publication rules implemented.
- 34 fixtures, Astro check/build and generated HTML/link checks passed.
- Evidence: output/task-035/verify.mjs; handoff: docs/site/case-studies.md.
- Task 035 archived; real records, approvals and photo rights still needed.
- Task 036 implemented and technically checked on 2026-10-07.
- Expanded details, static captioned photos and inquiry actions implemented.
- 32 generated fixture checks and focused responsive/navigation checks pass.
- Evidence: output/playwright/task-036/; source data unchanged.
- Task 036 archived; agency acceptance remains open; task 037 verified.
- Changes for tasks 035-036 remain uncommitted.

- Task 034 completed and archived on 2026-10-07.
- Archive: docs/codex/fixed/20261007/034-pricing-examples-verification.md.
- Pricing demo passed six light/dark viewport cases and enlarged-text checks.
- Minimum text contrast: 5.55:1 light; 7.02:1 dark.
- Images, keyboard/inquiry links, catalogs and both no-JavaScript themes pass.
- All 29 surrounding regression checks passed; no application fixes needed.
- Generated content audit and pnpm check/build pass; one pre-existing hint.
- Evidence: output/playwright/task-034/; plan and handoff updated.
- Tasks 032-034 are complete; fake examples retain false agency approvals.
- Real agency data/photos and inquiry delivery remain future production work.
- Task 031 completed on 2026-10-07: all 37 Astro files reviewed/refactored.
- Archived: docs/codex/fixed/20261007/031-refactor-astro-components-with-skill.md.
- Source/CSS audit and seven browser-script equivalence checks pass.
- Astro check/build and diff checks pass; 115 production behavior checks pass.
- Evidence: output/playwright/task-031/; 66 before and 66 after views.
- Task rules, implementation and verification documentation are complete.
