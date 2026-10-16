# Type checking and CI

[Documentation index](../../README.md)

Unit contracts run with `pnpm test:unit`; component contracts run with
`pnpm test:components`. Every component test belongs beside its source file,
using the same basename, such as `Button.astro` and `Button.test.ts`.
`pnpm verify:component-tests` fails if a component test is added back under
`tests/components`. `pnpm test:coverage` runs the full suite and writes ignored
HTML/LCOV reports under `coverage/`. The coverage include covers every component
plus the pure validation, content, server, form, and catalog modules. The report
measures mapped server render code for Astro components, not CSS or browser
behavior. Review portraits are required by the current Review type and
validator. The older component reference's optional-portrait wording does not
describe an accepted input; tests use valid portraits with alt text and
dimensions. Tests use versioned synthetic JSON under `tests/fixtures/content/`;
the Vitest category-registry alias avoids importing deployment content.

Run `pnpm verify:boundaries`, `pnpm verify:content`, `pnpm check`,
`pnpm verify:component-tests`, and `pnpm build` before submitting changes. The
boundary check prevents runtime content from entering a change, validates the
template manifest, and scans templates for unsafe values. The check command uses
the installed `@astrojs/check` package; no interactive dependency installation
is needed. TypeScript is kept on version 6 because `@astrojs/check` 0.9.10 does
not support TypeScript 7. See the
[Astro TypeScript guide](https://docs.astro.build/en/guides/typescript/#type-checking).

After `pnpm test:coverage`, run `pnpm verify:coverage`. It enforces 90% line
coverage for validation/content/server logic, 85% for client state, 70% for
components, and 80% overall. The component baseline covers every colocated Astro
renderer, including static branches that are only exercised in browser
acceptance. The JSON report is emitted beside the HTML and LCOV reports.

The repository workflow at `.github/workflows/quality.yml` runs on pull requests
and pushes that affect `src/apps/web/advertise-agency-landing-astro/**`. It
provisions Node.js 22.12 and pnpm 10.7.0, then runs the following commands from
this application:

```sh
pnpm install --frozen-lockfile
node scripts/prepare-ci-content.mjs
pnpm format:check
pnpm lint
pnpm verify:boundaries
pnpm verify:content
pnpm check
pnpm verify:component-tests
pnpm test
pnpm test:coverage
pnpm verify:coverage
pnpm build
pnpm verify:quality
pnpm exec playwright install --with-deps
pnpm test:e2e
```

Each command fails the job on a nonzero exit status. The workflow path is
included in the application trigger so edits to the job itself are verified.
Pull requests also run focused unit/component commands before the full suite;
Playwright Test then runs the Chromium, Firefox and WebKit E2E matrix. Runtime
content is supplied outside Git and initialized from `data/templates/` with an
explicit generator command. Never use `--force` against an existing content
reserve without a backup and a recorded hash manifest.

Formatting uses Prettier with Astro support and an 80-column target. Run
`pnpm format` to write or `pnpm format:check` to check; the existing hard
80-column gate remains in `pnpm check`. ESLint owns correctness rules for Astro,
TypeScript and JavaScript: `pnpm lint` checks without writing, while
`pnpm lint:fix` applies safe fixes. Prettier rules are disabled in ESLint to
avoid competing formatters. Generated output, runtime content and agent service
folders are excluded from formatting.

ESLint 9 and eslint-plugin-astro 1.6 support the project Node.js 22.12 minimum.
Newer major versions require a higher Node.js minimum; upgrade them together
with the project engine and CI version. TypeScript remains on 6, within the
installed typescript-eslint supported range.

CI explicitly provisions a missing runtime directory with synthetic site
fixtures before the normal build. The helper requires CI=true and refuses an
existing directory. Local runtime content is never overwritten. Vitest resolves
content imports to versioned fixtures. See
[browser coverage](browser-coverage.md) for E2E setup and diagnostics.
