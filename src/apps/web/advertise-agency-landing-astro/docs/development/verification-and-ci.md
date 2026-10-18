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
`pnpm test:types`, `pnpm verify:component-tests`, and `pnpm build` before
submitting changes. The boundary check prevents runtime content from entering a
change, validates the template manifest, and scans templates for unsafe values.
The check command uses the installed `@astrojs/check` package; no interactive
dependency installation is needed. TypeScript is kept on version 6 because
`@astrojs/check` 0.9.10 does not support TypeScript 7. See the
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
pnpm test:types
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

## Compile-time domain contracts

Run `pnpm test:types`, which invokes
`tsc --noEmit --project tsconfig.type-contracts.json`. The dedicated config
inherits the application's Astro strict config, keeps `strict: true`, and
enables unused-local and unused-parameter diagnostics. Its `@/*` alias resolves
source modules; `@/data/content/config/*` resolves versioned synthetic config.
It works without deployment content or generated `.astro` declarations. Fixtures
are compiled, never executed or discovered as Vitest runtime tests.

Each source module maps to the same basename under
`tests/fixtures/content/type-contracts/`:

| Source in `src/types/`         | Compile-time fixture           |
| ------------------------------ | ------------------------------ |
| `about.ts`                     | `about.ts`                     |
| `business-solutions.ts`        | `business-solutions.ts`        |
| `content-blocks.ts`            | `content-blocks.ts`            |
| `faq.ts`                       | `faq.ts`                       |
| `icons.ts`                     | `icons.ts`                     |
| `image-carousel.ts`            | `image-carousel.ts`            |
| `index.ts`                     | `index.ts`                     |
| `introduction.ts`              | `introduction.ts`              |
| `legal.ts`                     | `legal.ts`                     |
| `offer.ts`                     | `offer.ts`                     |
| `order-inquiry.ts`             | `order-inquiry.ts`             |
| `ordering-process.ts`          | `ordering-process.ts`          |
| `pricing.ts`                   | `pricing.ts`                   |
| `production-and-guarantees.ts` | `production-and-guarantees.ts` |
| `project.ts`                   | `project.ts`                   |
| `review.ts`                    | `review.ts`                    |
| `services.ts`                  | `services.ts`                  |
| `site.ts`                      | `site.ts`                      |

Positive literals use `satisfies` for domain and nested types, including every
content-block discriminant. Each module has an addressed negative case using
`@ts-expect-error` with an explanation on the line before its expected error.
TypeScript rejects unused directives, so a weakened domain type fails the job.
Keep each negative expression small: a missing property is checked on its own
expression line, and an invalid property on its own property line. This also
keeps diagnostics stable after formatting. Do not use `@ts-ignore` or cast
negative fixtures into the expected domain type.

`index.ts` checks every current barrel type against its direct module export and
checks the category registry value export. `schema-compatibility.ts` uses the
existing `AssertContract`/`SameContract` helpers to compare schema outputs with
domain types in both directions, including surplus keys. Importing schemas also
compiles their existing nested contract assertions. Raw schema inputs can differ
from normalized outputs: FAQ/business paragraphs normalize to strings, and
carousel settings acquire defaults. About, icons, legal and site have no
matching Zod schemas; their fixtures check their plain domain contracts.

When adding a type module or barrel export, update this matrix and its fixture.
The CI `pnpm test:types` step must retain the regular nonzero exit handling; do
not filter diagnostics or relax strict checking to accept a negative case.
Crawler route responses are exercised separately by
`tests/integration/crawler-routes.test.ts` with full text/XML output checks.
