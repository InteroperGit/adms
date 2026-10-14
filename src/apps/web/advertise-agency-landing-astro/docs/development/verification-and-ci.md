# Type checking and CI

[Documentation index](../../README.md)

Run `pnpm verify:boundaries`, `pnpm verify:content`, `pnpm check`, and
`pnpm build` before submitting changes. The boundary check prevents runtime
content from entering a change, validates the template manifest, and scans
templates for unsafe values. The check command uses the installed
`@astrojs/check` package; no interactive dependency installation is needed.
TypeScript is kept on version 6 because `@astrojs/check` 0.9.10 does not
support TypeScript 7. See the [Astro TypeScript guide](https://docs.astro.build/en/guides/typescript/#type-checking).

No repository CI configuration was found in the repository root or in its GitHub, GitLab, Buildkite, Jenkins, or Azure Pipelines configuration locations. CI integration remains to be added at repository level. Configure a job for pull requests and pushes that affect `src/apps/web/advertise-agency-landing-astro/**`, provision Node.js 22.12 or newer and pnpm 10.7.0, and run the following commands with `src/apps/web/advertise-agency-landing-astro` as its working directory:

```sh
pnpm install --frozen-lockfile
pnpm verify:boundaries
pnpm verify:content
pnpm check
pnpm build
```

Each command must fail the job on a nonzero exit status. The workflow is
`.github/workflows/quality.yml`; its path is included in the application
trigger so edits to the job itself are verified. Runtime content is supplied
outside Git and initialized from `data/templates/` with an explicit generator
command. Never use `--force` against an existing content reserve without a
backup and a recorded hash manifest.
