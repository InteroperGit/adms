# Setup and development

[Documentation index](../../README.md)

Use Node.js **22.12.0 or newer** (see `package.json`) and pnpm **10.7.0**, the version used for the documented verification workflow. Run commands from this application directory, `src/apps/web/advertise-agency-landing-astro` in the containing repository.

```sh
pnpm install --frozen-lockfile
pnpm dev --background
```

The second command runs `astro dev --background`, as required by `AGENTS.md`. The default development address is `http://localhost:4321`; check server output for the actual port.

| Command | Purpose |
| --- | --- |
| `pnpm astro dev status` | Check the background server |
| `pnpm astro dev logs` | Read development logs |
| `pnpm astro dev stop` | Stop the background server |
| `pnpm check` | Check Astro and TypeScript files |
| `pnpm build` | Validate imported content and generate `dist/` |
| `pnpm preview` | Preview the production build locally |
| `pnpm astro --help` | Show Astro CLI help |

Run `pnpm check` and `pnpm build` after code or content changes. Build success does not verify browser interaction, appearance, accessibility, or the availability of remote media; review those separately when affected.
