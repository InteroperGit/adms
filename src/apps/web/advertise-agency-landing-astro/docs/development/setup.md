# Setup and development

[Documentation index](../../README.md)

Use Node.js **22.12.0 or newer** (see `package.json`) and pnpm **10.7.0**, the
version used for the documented verification workflow. Run commands from this
application directory, `src/apps/web/advertise-agency-landing-astro` in the
containing repository.

```sh
pnpm install --frozen-lockfile
pnpm dev --background
```

The second command runs `astro dev --background`, as required by `AGENTS.md`.
The default development address is `http://localhost:4321`; check server output
for the actual port.

| Command                  | Purpose                                        |
| ------------------------ | ---------------------------------------------- |
| `pnpm astro dev status`  | Check the background server                    |
| `pnpm astro dev logs`    | Read development logs                          |
| `pnpm astro dev stop`    | Stop the background server                     |
| `pnpm check`             | Check Astro and TypeScript files               |
| `pnpm format:check`      | Check Prettier formatting                      |
| `pnpm lint`              | Run ESLint for Astro and TypeScript            |
| `pnpm test:e2e`          | Run Chromium, Firefox and WebKit E2E tests     |
| `pnpm test:e2e:ui`       | Open the Playwright test runner UI             |
| `pnpm verify:boundaries` | Check runtime-content and template boundaries  |
| `pnpm verify:content`    | Check structured content invariants            |
| `pnpm build`             | Validate imported content and generate `dist/` |
| `pnpm preview`           | Preview the production build locally           |
| `pnpm astro --help`      | Show Astro CLI help                            |

Run `pnpm check` and `pnpm build` after code or content changes. Build success
does not verify browser interaction, appearance, accessibility, or the
availability of remote media; review those separately when affected.

Runtime content is delivered separately from the repository. For a new site,
generate a clean catalog with
`node scripts/generate-content-catalog.mjs --source data/templates --output <content-directory>`.
The generator refuses a non-empty destination unless `--force` is supplied. Keep
a file hash manifest before any deliberate replacement and run
`pnpm verify:boundaries` afterward.

Install Playwright browser binaries before local E2E runs with
`pnpm exec playwright install chromium firefox webkit`. CI uses
`pnpm exec playwright install --with-deps`; failed-run traces and screenshots
are retained under `output/playwright/`.
