---
name: vite
description: Use this skill when configuring Vite, writing Vite plugins, or working with the SSG build. Fetches up-to-date Vite documentation via context7 (context7 library ID: /vitejs/vite, version v7.0.0).
---

When working with Vite in this project:

1. Use context7 MCP tools to retrieve current Vite documentation:
   - Call `resolve-library-id` with libraryName "vite" to confirm the library ID (`/vitejs/vite`)
   - Then call `query-docs` with that ID and a specific query (e.g. "plugin API transform hook", "define config alias")
   - This project uses **Vite 7** — use the `v7.0.0` version if available

2. Project-specific setup:
   - Config file: `vite.config.ts`
   - Plugins loaded: `themePlugin` (custom), `@tailwindcss/vite`, `@vitejs/plugin-react`
   - Path aliases: `@/` → `./src/`, `@data/` → `./data/`
   - SSG build via `vite-react-ssg` — `ssgOptions` type augmentation requires `import 'vite-react-ssg'` at top of `vite.config.ts`
   - SSG `dirStyle: 'nested'` → `dist/<path>/index.html`
   - `includedRoutes` callback generates all static paths (portfolio + category pages)

3. Custom plugin (`src/plugins/themePlugin.ts`):
   - Reads `data/config/theme.json` at build time
   - Injects CSS custom properties + Google Fonts `<link>` tags into `index.html`
   - Uses its own local `Theme` type (cannot import from `src/types/` due to `tsconfig.node.json` constraints)

4. SSG route generation rules:
   - Adding a new category → add entry to `data/config/categories.json`; `includedRoutes` picks it up automatically
   - Adding a new case → add `data/portfolio/{slug}.json`; no config change needed
   - Portfolio cases loaded via `import.meta.glob('@data/portfolio/*.json', { eager: true, import: 'default' })`

5. Build command: `tsc -b && vite-react-ssg build` (run via `pnpm build`)
