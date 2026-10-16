# Type checking and CI

[Documentation index](../../README.md)

Unit contracts run with `pnpm test:unit`; component contracts run with
`pnpm test:components`. Every component test belongs beside its source file,
using the same basename, such as `Button.astro` and `Button.test.ts`.
`pnpm verify:component-tests` fails if a component test is added back under
`tests/components`.
`pnpm test:coverage` runs the full suite and writes ignored HTML/LCOV reports
under `coverage/`. The coverage include covers every component plus the pure
validation, content, server, form, and catalog modules. The report measures
mapped server render code for Astro components, not CSS or browser behavior.
Review portraits are required by the current Review type and validator.
The older component reference's optional-portrait wording does not describe
an accepted input; tests use valid portraits with alt text and dimensions.
Tests use versioned synthetic JSON under `tests/fixtures/content/`; the
Vitest category-registry alias avoids importing deployment content.

Run `pnpm verify:boundaries`, `pnpm verify:content`, `pnpm check`,
`pnpm verify:component-tests`, and `pnpm build` before submitting changes.
The boundary check prevents runtime
content from entering a change, validates the template manifest, and scans
templates for unsafe values. The check command uses the installed
`@astrojs/check` package; no interactive dependency installation is needed.
TypeScript is kept on version 6 because `@astrojs/check` 0.9.10 does not
support TypeScript 7. See the [Astro TypeScript guide](https://docs.astro.build/en/guides/typescript/#type-checking).

After `pnpm test:coverage`, run `pnpm verify:coverage`. It enforces 90% line
coverage for validation/content/server logic, 85% for client state, 70% for
components, and 80% overall. The component baseline covers every colocated
Astro renderer, including static branches that are only exercised in browser
acceptance. The JSON report is emitted beside the HTML and LCOV reports.

The repository workflow at `.github/workflows/quality.yml` runs on pull
requests and pushes that affect
`src/apps/web/advertise-agency-landing-astro/**`. It provisions Node.js 22.12
and pnpm 10.7.0, then runs the following commands from this application:

```sh
pnpm install --frozen-lockfile
pnpm verify:boundaries
pnpm verify:content
pnpm check
pnpm verify:component-tests
pnpm test
pnpm test:coverage
pnpm verify:coverage
pnpm build
pnpm verify:quality
```

Each command fails the job on a nonzero exit status. The workflow path is
included in the application trigger so edits to the job itself are verified.
Pull requests also run focused unit/component commands before the full suite;
the final build starts the existing Playwright CLI smoke flow.
Runtime content is supplied
outside Git and initialized from `data/templates/` with an explicit generator
command. Never use `--force` against an existing content reserve without a
backup and a recorded hash manifest.
