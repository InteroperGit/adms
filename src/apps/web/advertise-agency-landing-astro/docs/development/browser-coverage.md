# Browser coverage

[Documentation index](../../README.md)

Playwright Test runs versioned E2E contracts in `tests/e2e/` against Chromium,
Firefox and WebKit. Each browser runs the complete suite. Vitest continues to
own unit, component and integration contracts; it excludes `tests/e2e/`.

## Install and run

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install --with-deps
pnpm test:e2e
pnpm test:e2e --project=chromium
pnpm test:e2e:ui
```

Playwright starts `scripts/e2e-server.mjs`, builds the real application with
`scripts/e2e.config.mjs` and serves production HTML through Astro's preview API
at `http://127.0.0.1:4327`. Playwright owns the process and stops it after the
run. An existing preview daemon is left alone. The port must be free; server
reuse is disabled so stale deployment content cannot pass the tests. No
development server is needed. Manual development servers still follow the
[background-server rules](rules/dev-server.md).

## Fixtures and safety

`tests/fixtures/content/site/` contains synthetic site data shared with Vitest.
The E2E server copies it under `output/playwright/content/`, enables the fixture
inquiry endpoint and redirects content imports and collections there. Output and
cache live under `output/playwright/`. Runtime content in `data/content/` is
never read or rewritten by the E2E build.

Delivery is intercepted at `/__fixture/inquiry`; no actual inquiry is sent.
Tests block remote resources and use local media. Keep new fixture data
synthetic, versioned and independent of deployment flags and external sites.
Normal builds never select the E2E configuration or its content root.

## Contracts and diagnosis

The suite covers cookies and theme persistence, mobile menu keyboard focus,
reduced-motion manual carousel navigation, catalog search/filter/history and
pagination, gallery interaction and focus restoration, responsive service
content, media failure, no-JavaScript navigation and protected submission, and
unavailable/rejected/confirmed inquiry delivery with retry IDs.

Assertions wait for observable state rather than arbitrary delays. Desktop
projects use a mobile viewport inside the responsive/menu contracts; this does
not emulate physical mobile devices or their browser chrome.

Reports are ignored by Git. On failure Playwright keeps screenshots and traces
in `output/playwright/results/`, plus an HTML report in
`output/playwright/report/`. CI uploads the diagnostics for seven days.

```sh
pnpm exec playwright show-report output/playwright/report
pnpm exec playwright show-trace path/to/trace.zip
```

The former CLI-only `browser-coverage.js` flow is migrated to these tests; there
is one supported smoke runner. Historical acceptance scripts and their archived
evidence remain available for their original tasks.
