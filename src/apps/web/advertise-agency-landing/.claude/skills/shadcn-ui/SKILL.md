---
name: shadcn-ui
description: Use this skill when adding, configuring, or working with shadcn/ui components. Fetches up-to-date shadcn/ui documentation via context7 (context7 library ID: /shadcn/ui).
---

When working with shadcn/ui in this project:

1. Use context7 MCP tools to retrieve current shadcn/ui documentation:
   - Call `resolve-library-id` with libraryName "shadcn/ui" to confirm the library ID (`/shadcn/ui`)
   - Then call `query-docs` with that ID and a specific query (e.g. "Button component props", "Form with zod validation")

2. Installing new components — always use pnpm:
   ```bash
   pnpm dlx shadcn@latest add <component>
   ```
   Files land in `src/components/ui/` — **never edit them manually**.

3. Project-specific conventions:
   - shadcn/ui config is in `components.json` (aliases use `src/` paths)
   - Available primitives already installed: `badge`, `button`, `card`, `input`, `separator`, `textarea`
   - Custom UI components live alongside shadcn primitives in `src/components/ui/` but are hand-written (e.g. `SocialLinks.tsx`, `SectionHeader.tsx`, `PortfolioCard.tsx`)
   - Do NOT confuse hand-written components in `src/components/ui/` with shadcn-generated ones — only the lowercase files (`badge.tsx`, `button.tsx`, `card.tsx`, `input.tsx`, `separator.tsx`, `textarea.tsx`) are shadcn-generated
   - ESLint `react-refresh` rule is suppressed for `badge.tsx` and `button.tsx` via override — do not edit those files

4. Theming:
   - Colors are CSS variables injected at build time by `src/plugins/themePlugin.ts` from `data/config/theme.json`
   - `@theme inline` in `index.css` is required for Tailwind v4 + shadcn compatibility — do not revert to `@theme`
   - Use `bg-primary`, `text-primary-foreground`, `bg-muted` etc. — they resolve through CSS vars, never hardcode hex values
