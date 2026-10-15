# Type checking and CI

[Documentation index](../../README.md)

Unit contracts run with `pnpm test:unit`; `pnpm test --coverage` also runs
component tests and writes ignored HTML/LCOV reports under `coverage/`.
The current coverage baseline covers validation, image resolution,
publication, pricing/categories, inquiry payload/form and catalog state.
It is a task-specific baseline, not a project-wide coverage claim.
Task 090 adds DOM contract tests for Button, Section, Breadcrumbs,
ContactInfo, ServiceCard, ProjectCard, ReviewCard and PricingExample.
Run these with `pnpm test:components`. Astro assets stay in Vite's module
pipeline so bundled-image tests render real responsive image markup.
The explicit coverage scope includes these eight `.astro` files; the report
measures their mapped server render code, not CSS or browser interactions.
Review portraits are required by the current Review type and validator.
The older component reference's optional-portrait wording does not describe
an accepted input; tests use valid portraits with alt text and dimensions.
Tests use versioned synthetic JSON under `tests/fixtures/content/`; the
Vitest category-registry alias avoids importing deployment content.

Run `pnpm verify:boundaries`, `pnpm verify:content`, `pnpm check`, and
`pnpm build` before submitting changes. The boundary check prevents runtime
content from entering a change, validates the template manifest, and scans
templates for unsafe values. The check command uses the installed
`@astrojs/check` package; no interactive dependency installation is needed.
TypeScript is kept on version 6 because `@astrojs/check` 0.9.10 does not
support TypeScript 7. See the [Astro TypeScript guide](https://docs.astro.build/en/guides/typescript/#type-checking).

The repository workflow at `.github/workflows/quality.yml` runs on pull
requests and pushes that affect
`src/apps/web/advertise-agency-landing-astro/**`. It provisions Node.js 22.12
and pnpm 10.7.0, then runs the following commands from this application:

```sh
pnpm install --frozen-lockfile
pnpm verify:boundaries
pnpm verify:content
pnpm check
pnpm build
```

Each command fails the job on a nonzero exit status. The workflow path is
included in the application trigger so edits to the job itself are verified.
Runtime content is supplied
outside Git and initialized from `data/templates/` with an explicit generator
command. Never use `--force` against an existing content reserve without a
backup and a recorded hash manifest.
