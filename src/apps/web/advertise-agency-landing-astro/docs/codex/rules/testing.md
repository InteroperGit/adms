# Testing

## Scope and placement

Test changed behavior and its affected callers, failure paths and trust
boundaries. Use focused tests during iteration, then the final gates in
[verification](verification.md). Prefer observable outcomes over assertions
mirroring implementation. Trivial reversible documentation/style changes need
appropriate static checks, not new tests for the sake of coverage.

- Pure logic: tests beside source; run `pnpm test:unit`.
- Every Astro component and application TypeScript source module has a colocated
  unit-test file in the same directory. For camelCase TypeScript modules, name
  it `<source-basename>.test.ts`; for PascalCase Astro components, retain the
  component basename in `<Component>.test.ts`. Add or update that test with the
  source change and keep assertions synchronized with its public behavior and
  failure cases. This rule excludes test files, declaration files and generated
  files.
- Components: matching-basename colocated tests; `pnpm test:components`.
  `pnpm verify:component-tests` prevents tests returning to `tests/components`.
- Integration: `tests/integration/`, for composition and cross-module contracts.
- Browser: `tests/e2e/`, excluded from Vitest, for actual user interactions.

Use minimal valid synthetic fixtures under `tests/fixtures/content/`, never
production content or personal data. Cover invalid/empty/boundary values,
missing optional fields, publication restrictions and failed dependencies. Keep
schema tests separate from claims about factual approval or delivery.

## Types and coverage

`pnpm test:types` compiles fixtures in `tests/fixtures/content/type-contracts/`
with `tsconfig.type-contracts.json`; it does not execute them. Keep strict and
unused checks, source aliases and synthetic config resolution independent of
runtime data or generated declarations. Add matching fixtures with type modules
and barrel exports. Positive cases use `satisfies`; negatives use explained
`@ts-expect-error` immediately before the expected diagnostic. Do not cast
negative cases or suppress them with `@ts-ignore`.

Check domain/schema output compatibility in both directions, including surplus
and optional keys. Account for normalization/defaults: schema inputs may differ
from output. Use existing contract assertion helpers; preserve barrel parity.
Never filter diagnostics or weaken strictness to accept a negative case.

Run `pnpm test:coverage`, then `pnpm verify:coverage`. Minimum line coverage:
logic 90%, client state 85%, components 70%, overall 80%. Include every
colocated Astro renderer and its static branches; mapped server-render coverage
does not measure CSS or browser interactions. HTML/LCOV/JSON output lives in
ignored `coverage/`. Do not skip assertions or exclude difficult branches to
pass a threshold.

## Browser isolation and diagnosis

Use the shared `tests/e2e/fixtures.ts` imports for every spec. Preserve external
HTTP(S) blocking and explicit local mocks. Playwright owns an isolated
production fixture build/preview on port 4327 and its shutdown; keep the port
free and `reuseExistingServer` disabled. Fixture overrides must never read or
rewrite runtime content. Test configuration is authoritative for browsers, ports
and artifacts; do not duplicate scenario counts in documentation.

Install browsers with `pnpm exec playwright install --with-deps`. Run
`pnpm test:e2e`, or pass a spec and `--project=chromium` for diagnosis. Use
`--repeat-each=2` for order/state failures. Inspect retained screenshots and
traces under `output/playwright/results/` and the report under
`output/playwright/report/` with Playwright's `show-trace` / `show-report`. Do
not use longer timeouts, skipped tests or retries to conceal a defect.

Check keyboard/focus, responsive themes, no-JavaScript behavior, navigation and
history, media/network fallbacks, input preservation, retries and publication
boundaries as affected. Wait for bounded meaningful state rather than sleeps or
unrelated network idle. Stub external delivery; real submissions require
explicit authorization and separate receipt evidence.

Private visual fixtures are for isolated acceptance builds only. Never deploy
acceptance routes, test origins or synthetic approvals; keep them noindex and
out of sitemaps. Check actual emitted assets, not only schema validity.

## Evidence limits

Run generated HTML quality checks after build for semantics, metadata, headings,
links, IDs and media geometry/loading. DOM tests and screenshot captures do not
prove screen-reader speech, physical touch, native 200% zoom, actual delivery,
external availability or field performance. Perform the applicable manual checks
in [design](design.md). Report which browsers, fixtures and conditions were
tested; a focused pass does not establish a passing full matrix. Reuse evidence
only until a relevant change invalidates it.
