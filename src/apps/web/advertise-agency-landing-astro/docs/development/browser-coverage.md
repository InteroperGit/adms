# Browser coverage

[Documentation index](../../README.md)

Playwright Test runs the versioned E2E contracts in `tests/e2e/` against
Chromium, Firefox and WebKit. There are 78 scenarios per browser, for 234
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
- `no-javascript.spec.ts`: native navigation, readable media, legal links and
  submission protection with JavaScript disabled.
- `preferences.spec.ts`: cookie consent and theme persistence.
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

The 2026-10-20 acceptance runs used three browsers with zero configured local
retries. The normal matrix reported 210 passed and 24 failed. The repeated
matrix ran 468 executions and reported 415 passed and 53 failed. Persistent
failures are the video 404 fallback remaining in `loading` and homepage
horizontal overflow at every responsive width and theme. The repeat run also
exposed intermittent Firefox and WebKit failures in pagination, menu/theme,
carousel and pending-delivery timing. These remain defects; tests are not
weakened, skipped or hidden behind longer timeouts.

The suite uses synthetic fixtures and intercepted inquiry delivery. It does not
verify real email delivery, physical mobile devices or browser chrome, actual
video playback, external services, deployment content, or a numeric E2E
code-coverage percentage. The responsive checks emulate viewport sizes on
desktop browser projects.
