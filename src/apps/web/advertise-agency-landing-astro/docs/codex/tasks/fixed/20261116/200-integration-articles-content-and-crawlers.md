# 200 - Complete articles, content and crawler consistency

- **Executor:** Sol (`gpt-6.1-sol`), reasoning: `medium`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `medium`.

**Status:** complete

**Created:** 2026-11-16

**Parent:** [195](195-automate-integration-test-improvements.md)

**Dependency:** [199](199-integration-project-catalog-contracts.md)

## Goal

Complete articles, content and crawler consistency for tests/integration/.

## Scope

- Own article/content and crawler integration suites.
- Inspect project and service dynamic routes, ContentBlocks, article-context,
  publication policies, robots.txt and sitemap.xml.
- Exercise real publication decisions for approved/draft/demo, empty and nested
  restricted blocks, owner context, service IDs and generated route props.
- Cover representative rich-content composition, links/media fallbacks and form
  owner propagation without retesting each renderer.
- Compare route eligibility, rendered indexability, canonical paths and sitemap
  inclusion from the same synthetic scenarios.
- Preserve no-site/base-path/XML escaping/response-header contracts; resolve
  expected behavior from source rather than inventing URL semantics.
- Run owned suites and pnpm test:integration.
- Runtime content stays in data/content/; synthetic fixtures belong in
  tests/fixtures/content/.
- Production behavior changes require a separate explicit scope decision.
- Preserve unrelated work and existing test gates.

## Execution

Skills: ponytail; Astro skill if changing .astro; playwright only for browser
diagnosis. Primary owns review and acceptance. No delegation by default.
Luna medium for inventory, scoped test edits, focused checks and docs;
Sol medium for conflicting cross-module contracts. Record actual routing
and concrete evidence for escalation in Handoff.

- [x] Read AGENTS.md and rules index, workflow, style, testing, verification.
- [x] Read parent, dependency evidence and affected source/callers.
- [x] Move this file backlog -> todo; update status and all task links.
- [x] Implement the scoped outcomes and record changed files.
- [x] Run checks named in Scope; record commands and actual results.
- [x] Review diff and resolve findings without weakening assertions.
- [x] Reconcile acceptance and execution; record evidence and limitations.
- [x] On accepted automatic execution archive to fixed/yyyyMMdd and update
  parent, sibling links and .codex/TASKS.md using Europe/Moscow date.

## Acceptance

- [x] Route generation, indexability and sitemap decisions agree by fixture.
- [x] Restricted article/block content does not leak through composition.
- [x] No-site, escaping, native actions and owner context retain evidence.

## Handoff

Actual implementation, focused checks and local review: Sol
(`gpt-6.1-sol`), medium, delegated by the coordinator for this bounded
cross-module task. No nested delegation or escalation. The coordinator moved
the task to todo and owns final Luna review, acceptance and archive.

Changed `tests/integration/articles-content.test.ts` only, plus this record.
Preserved all original 23 article cases and all eight crawler cases/assertions.
Added seven cases: five publication scenarios shared across project/service
static routes, rendered metadata/canonical and the real sitemap endpoint;
two rich-content compositions through actual project/service routes. Article
count is now30; crawler remains8. The full suite totals70 after63 in199.
No runtime source/data, dependencies, fixture files or crawler code changed.
New synthetic records are built from cloned versioned fixtures; local project
and service overrides reset before each test.

Source findings: projects loader applies getVisibleProjects before static
routes; draft projects have no route. Demo projects retain routes with noindex.
A published project with empty content is indexable under the existing policy;
an empty service article is not. Services generate routes from href-bearing
records regardless of approval, while sitemap/noindex use article publication.
The same five synthetic scenarios cover approved, draft, demo, nested demo
media and empty articles. Generated params/props, unlinked-service exclusion,
metadata, normalized canonical paths and exact dynamic sitemap locations agree.
Nested draft media and draft prose remain absent, while nested demo media stays
visible. Existing endpoint coverage retains no-site denial/empty XML, base URL
semantics, XML escaping, absolute URLs and response headers.

Rich-content cases verify safe native links, image source/status fallback,
video source fallback/transcript, native inquiry actions, and specialized form
owner IDs propagated through page -> ContentBlocks -> OrderFormBlock. No
browser failure, playback, client submit or live delivery is claimed.

Verification uses Windows, Node v25.7.0, pnpm10.7.0, Vitest4.0.18 with
process-local TEMP/TMP set to ignored output/task195.

- Owned run: `pnpm exec vitest run tests/integration/articles-content.test.ts
  tests/integration/crawler-routes.test.ts`: 38/38 pass, 56.01s.
- Scoped Prettier check for both owned suites: pass.
- Scoped ESLint for both owned suites with --max-warnings0: pass.
- `pnpm check:style`: pass.
- `pnpm test:integration`: 5 files, 70/70 pass, 53.71s.

Independent tester/reviewer: Luna (`gpt-6-luna`), medium. Reviewed the
article and crawler suites against project/service route generators,
publication helpers, ContentBlocks, sitemap route construction and the
versioned block fixture. Confirmed all five shared scenarios assert the
intended distinction: project draft records are filtered before route
generation; demo and nested-demo projects retain non-indexable routes; empty
published projects remain indexable; service route props require href while
indexability/sitemap inclusion require an approved article. Sitemap output
is checked against the rendered canonical/indexability decisions from the
same synthetic records. Nested draft image and prose are explicitly absent,
and the nested demo image remains visible. Both rich-content cases traverse
the page route and assert safe link output, image/video fallback markup and
form owner IDs. `crawler-routes.test.ts` is unchanged and preserves its eight
endpoint cases. `git diff --check` passed for the owned article suite and task
record. Reused Sol's owned 38/38 and combined 70/70 run plus scoped static-gate
evidence; no test rerun was needed. Review found no assertion loss, mock reset
leak or publication mismatch. Browser media activation and form delivery
remain outside AstroContainer coverage.

Initial implementation checks caught an invalid multiline context cast, a
builder defaulting the project to demo, and an incorrect assumption that the
specialized form shares the disabled general inquiry fieldset contract. The
cast and explicit published owner fixture were corrected; the specialized
form check now verifies the real form marker and propagated owner input.
Existing assertions were unchanged. Local diff review found no production or
fixture-boundary edits. Astro check is intentionally reused until203 by
coordinator instruction. No full verification matrix or browser run.

