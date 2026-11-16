# Code style and Astro

Code lines, including indentation, markup, scripts, styles, configuration and
examples, must be <=80 characters. Wrap with valid syntax. Prettier
`printWidth: 80` is a target; `pnpm check:style` enforces the hard limit on
changed sources so legacy lines can be cleaned incrementally. The rule still
applies to every new/edited line. Run `pnpm check:style`, `pnpm check` before
review, and `pnpm format:check` alongside final tests.

## Syntax and comments

- Wrap every `if`/`else if`/`else` body in braces with the body on its own line.
- Put each HTML/Astro attribute on its own indented line when there are several;
  put closing `>` on its own line (`singleAttributePerLine`).
- Use descriptive names, straightforward flow and expanded readable blocks.
  Explain purpose/reasoning/behavior, not obvious syntax; remove stale comments.
- Every Astro file has a short purpose/responsibility source comment. Explain
  meaningful props, defaults, slots, caller assumptions and data/a11y
  constraints near definitions. Comment logical markup sections with source-only
  `{/* ... */}`; retain intentional rendered HTML comments where needed.
- Explain nontrivial transformations, browser initialization, event/state/focus
  handling, storage fallback, cleanup, timing and theme decisions. Readability
  refactors preserve semantic markup, native links, keyboard behavior and APIs.
- Component CSS uses one declaration per indented line, braces separate from
  declarations, and blank lines between rules. Put a short purpose comment
  before **every** class rule, including descendants, states and media-query
  rules; explain responsive intent before media queries. Comments explain layout
  or behavior, not property names. Custom properties follow the same format.

## Astro

Before creating/changing/reviewing/refactoring `.astro` components, layouts or
pages, read and apply `astro-best-practices` for architecture, a11y, performance
and styling. If unavailable, report it rather than claiming application.
Explicit user/project instructions take precedence. Keep static content in
Astro, browser JavaScript minimal and styles scoped unless shared conventions
require otherwise; follow [architecture](architecture.md). Keep component props
types in the component source. Do not create a separate props module for a
single component; shared domain types belong in `src/types/`.

Consult the relevant official guide before related work:
[routing/middleware](https://docs.astro.build/en/guides/routing/),
[components](https://docs.astro.build/en/basics/astro-components/),
[framework components](https://docs.astro.build/en/guides/framework-components/),
[content collections](https://docs.astro.build/en/guides/content-collections/),
[styles/Tailwind](https://docs.astro.build/en/guides/styling/),
[i18n](https://docs.astro.build/en/guides/internationalization/).

## Commits

Use `<type>: <specific title>`, a blank line, then a description of what/why,
user/technical impact and verification commands. Title has no trailing period;
avoid vague “fix”, “changes” or “update”. Types: `feat`, `fix`, `docs`, `style`,
`refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
