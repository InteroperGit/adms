# Browser coverage

[Documentation index](../../README.md)

Playwright Test runs the versioned E2E contracts in `tests/e2e/` against
Chromium, Firefox and WebKit. There are 81 scenarios per browser, for 243
executions in the normal matrix. Vitest owns unit, component and integration
contracts; it excludes `tests/e2e/`.

## Contracts

Every spec imports `test` and `expect` from `tests/e2e/fixtures.ts`. The shared
fixture automatically blocks HTTP(S) requests outside `http://127.0.0.1:4327`,
so a test can use only the local preview and explicit local route handlers. The
specs cover:

- `carousel.spec.ts`: manual navigation, announcements and reduced motion.
- `catalog.spec.ts` and `catalog-pagination.spec.ts`: search, filters, history,
  pagination and boundary links.
- `content-media.spec.ts`: chart resize/table fallback and video 404 state.
- `gallery.spec.ts`: dialog keyboard behavior, wrapping and focus restore.
- `inquiry-delivery.spec.ts` and `inquiry-validation.spec.ts`: protected,
  rejected, retried, aborted and timed out inquiry delivery.
- `led-letters.spec.ts`: the service lettering form and retry behavior.
- `navigation.spec.ts`: mobile menu focus, hash links and contact links.
- `network.spec.ts`: external request isolation.
- `no-javascript.spec.ts`: native navigation, readable media, legal links,
  submission protection and computed system palettes with JavaScript disabled.
- `preferences.spec.ts`: cookie consent, theme persistence, computed palettes,
  explicit choices over the OS theme, document keyboard focus and reduced
  motion.
- `responsive.spec.ts`: four routes at 320, 375 and 1440 pixels in both themes,
  plus failed-image geometry.

The route coverage uses `/`, `/projects/`, `/projects/page/2/`, `/projects/1/`,
`/services/neon/`, the local legal documents, and the local fixture paths
`/__fixture/inquiry` and `/__fixture/broken.mp4`. Assertions also cover
same-page section hashes and the chart runtime request.

## Fixtures and overrides

The E2E server copies synthetic data from `tests/fixtures/content/site/` to
`output/playwright/content/`. `scripts/e2e.config.mjs` aliases the content
imports to that generated directory, while `data/content/` is never read or
rewritten by the E2E build. Article fixtures are copied from
`tests/fixtures/content/articles/`.

`tests/fixtures/content/e2e-overrides.json` enables inquiry submission for
tests, publishes the `svetovye-bukvy` service with its synthetic article and
form, and appends chart and video blocks to project 1. Those blocks use local
fixture URLs and synthetic provenance; no deployment or external content is
introduced.

## Install and run

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install --with-deps
pnpm test:e2e
pnpm test:e2e tests/e2e/responsive.spec.ts --project=chromium
pnpm test:e2e:ui
```

Playwright starts `scripts/e2e-server.mjs`, builds the production application
with `scripts/e2e.config.mjs`, and serves it through Astro's preview API at
`http://127.0.0.1:4327`. Playwright owns that preview process and stops it after
the run. `reuseExistingServer` is disabled, so the port must be free and stale
output cannot satisfy the suite. A development server is not needed.

For order and state diagnostics, repeat the complete E2E matrix with:

```sh
pnpm test:e2e --repeat-each=2
```

## Diagnostics and limits

On failure Playwright retains screenshots and traces in
`output/playwright/results/` and writes an HTML report to
`output/playwright/report/`:

```sh
pnpm exec playwright show-report output/playwright/report
pnpm exec playwright show-trace path/to/trace.zip
```

The earlier 2026-10-20 acceptance runs used three browsers with zero local
retries. The normal matrix reported 210 passed and 24 failed. The repeated
matrix ran 468 executions and reported 415 passed and 53 failed. Persistent
failures are the video 404 fallback remaining in `loading` and homepage
horizontal overflow at every responsive width and theme. The repeat run also
exposed intermittent Firefox and WebKit failures in pagination, menu/theme,
carousel and pending-delivery timing. These describe the state of those runs;
later scoped checks do not establish a new full-suite result. Tests are not
weakened, skipped or hidden behind longer timeouts.

## Global CSS refactor checks (task 140, 2026-10-20)

The initial full run could not build until three obsolete `notice` fields were
removed from the synthetic project fixture. With that fixture repaired, 233 of
234 existing executions passed; one Firefox test timed out creating its page.
Capture-only checks are recorded separately in task 140.

The first affected matrix reported 135/138 passed. All 84 responsive/carousel
executions passed; Firefox had a context teardown/compositor failure, and WebKit
exposed a new focus-test assumption and a theme-test timeout. The focus test now
navigates a known native input rather than assuming that the first Tab stops on
a link. Computed styles are read in one sample per poll. The final
preferences/no-JS/navigation diagnostic passed 54/54 executions across all three
browsers using `--workers=1`, with unchanged timeouts and assertions. This does
not replace a fresh full parallel matrix result.

See [task 140](../codex/fixed/20261020/140-refactor-global-css.md) for the 20
visual comparisons across routes, themes and viewports, retained traces and
unrelated TypeScript gate failures. Artifacts live under
`output/playwright/task-140/`.

The suite uses synthetic fixtures and intercepted inquiry delivery. It does not
verify real email delivery, physical mobile devices or browser chrome, actual
video playback, external services, deployment content, or a numeric E2E
code-coverage percentage. The responsive checks emulate viewport sizes on
desktop browser projects.
