# Code style checks

The repository requires source lines to stay at or below 80 columns and asks
Astro components to explain each logical markup and CSS section. The current
codebase contains older long lines, so the automated gate applies the column
rule to changed source files. This prevents new violations while allowing
incremental cleanup of legacy files.

Run the gate before review:

```powershell
pnpm check:style
pnpm check
```

When adding or editing an Astro component, keep a short file-purpose comment,
comments before logical markup sections, and a purpose comment before every
CSS selector, including responsive and state rules. Use the existing component
styles as the formatting reference while cleanup proceeds.
