# Development Workflow & Commands

## Core Commands

```bash
pnpm dev              # Dev server → http://localhost:5173
pnpm build            # SSG build → dist/ (tsc -b && vite-react-ssg build)
pnpm preview          # Preview production build locally
pnpm lint             # ESLint check
pnpm format           # Prettier format src/**/*.{ts,tsx,css}
pnpm typecheck        # tsc -b (check type errors)
pnpm validate         # Validate all JSON data against schemas (vite-node)
pnpm gen-schemas      # Generate JSON schemas + IDE settings
pnpm new-client       # Bootstrap a new client (interactive CLI)
```

## Workflow After Every Task

1. **Format changed files**
   ```bash
   pnpm format
   ```

2. **Typecheck source code**
   ```bash
   pnpm typecheck
   ```
   - Ignore "Cannot find module" errors for gitignored `data/` JSON files (pre-existing, expected)
   - Fix all other errors in edited source files

3. **Lint and fix violations**
   ```bash
   pnpm lint
   ```
   - Auto-fix ESLint errors where possible
   - Note: `badge.tsx` / `button.tsx` (shadcn-generated) have `react-refresh` rule suppressed — do not edit these files

4. **Validate data JSON**
   ```bash
   pnpm validate
   ```
   - Ensures all JSON in `data/` matches Zod schemas
   - Fix schema violations before committing

5. **Update documentation**
   - Reflect new/changed files, routes, conventions in `CLAUDE.md`
   - Update task plan file (`ai/tasks/NNN_*.md`) with completion status (**✅ done**)

## New Client Setup

**Interactive CLI:**
```bash
pnpm new-client
```

The CLI prompts for:
- Agency/company name
- Brand colors (hex format → auto-converted to HSL)
- Font families (custom Google Fonts URLs optional)

**Output:**
- Generates customized `data/content/config/` with:
  - `site.json` — agency info, social links, contact details
  - `theme.json` — brand colors, font URLs
  - `seo.json` — site URL, title, locale
  - `header.json` — navigation structure
- Template copies of all other data files with `$schema` references (for IDE autocomplete)
- Ready for immediate content customization

## Git & Commit Workflow

**Before committing:**
1. Run workflow checks (format, typecheck, lint, validate)
2. Review changes: `git diff`, `git status`
3. Stage files: `git add <files>`
4. Create commit with descriptive message
5. Push to remote (if applicable)

**Commit message format:**
- Type prefix: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`
- Example: `feat(portfolioCase): add publishDate field to case schema`
- Reference task: `closes #NNN` or task ID if applicable

**Branch convention:**
- Feature/task branches from `main`
- Example: `feature/portfolio-page` or `task/update-dark-mode`

## SSG Build Process

**Build command:** `tsc -b && vite-react-ssg build`

**Steps:**
1. TypeScript compilation (`tsc -b`)
2. Vite bundling + React SSG generation
3. Routes are auto-generated from:
   - `src/router.tsx` static routes (`/`, `/privacy-policy`, etc.)
   - Portfolio cases (recursive glob from `data/content/portfolio/**/*.json`)
   - Categories (from `data/content/config/categories.json`)
4. Output: `dist/` (ready to deploy)

**Route generation examples:**
- `/` → Home page
- `/portfolio` → All cases, paginated
- `/portfolio/branding` → Cases in "branding" category
- `/portfolio/branding/artplex` → Specific case
- `/privacy-policy`, `/user-agreement`, `/consent` → Legal pages
- `/order?form=contact` → Order form with pre-selected form type

## Schema & IDE Setup

**Generate JSON schemas:**
```bash
pnpm gen-schemas
```

**Output:**
- `data/_schema/schema/<name>.schema.json` — Zod-generated JSON Schema files (gitignored)
- `.vscode/settings.json` — IDE schema mappings for autocomplete

**Example schema mapping:**
```json
{
  "json.schemas": [
    {
      "fileMatch": ["data/content/config/site.json"],
      "url": "../../_schema/schema/siteData.schema.json"
    },
    {
      "fileMatch": ["data/content/portfolio/**/*.json"],
      "url": "../../_schema/schema/portfolioCase.schema.json"
    }
  ]
}
```

- Object-root files (e.g., `site.json`, `theme.json`) have `$schema` ref inline
- Array/paginated-root files (e.g., `categories.json`, `carousel.json`) are configured via `.vscode/settings.json`

## Package Management

**pnpm only** — never use npm or yarn:
```bash
pnpm install         # Install dependencies
pnpm add <package>   # Add new dependency
pnpm remove <package> # Remove dependency
pnpm update          # Update all dependencies
```

**Add shadcn/ui component:**
```bash
pnpm dlx shadcn@latest add <component-name>
# Installs to src/components/ui/
```

## Development Tips

**Fast local development:**
- `pnpm dev` watches files and HMR (Hot Module Reload) updates the browser
- No manual refresh needed when editing components, styles, or type modules

**Debugging type errors:**
- `pnpm typecheck` shows detailed TypeScript errors with line numbers
- Use `satisfies` sparingly — Zod parse is preferred for data validation

**Schema validation during dev:**
- While editing JSON, run `pnpm validate` to check against schemas in real-time
- Errors show which field violates the schema (helpful for data structure changes)

**Building for production:**
- `pnpm build` generates static HTML files in `dist/`
- Preview locally with `pnpm preview` before deploying
- No runtime dependencies — fully static output ready for CDN/S3

## Troubleshooting

**Type errors on gitignored JSON:**
- Expected behavior — `pnpm typecheck` warns about missing `data/` JSON files
- Harmless; only fix errors in `src/` source files

**Peer dependency warnings:**
- `react-helmet-async` unmet peer (React 19) — harmless, vite-react-ssg still works
- `react-router-dom@^6.14.1` required — v6 is locked in, v7 not compatible

**Schema not updating in IDE:**
- Run `pnpm gen-schemas` to regenerate `.vscode/settings.json`
- Reload VSCode window if schema mappings don't appear

**Portfolio cases not showing:**
- Ensure case JSON includes required fields: `slug`, `publishDate`, `category`, `title`, `description`, `hero`, `tags`, `meta`, `overview`, `content`
- Run `pnpm validate` to check schema compliance
- Verify category name matches entry in `data/content/config/categories.json`
