# Code style rules

Every line of code must be at most 80 characters, including indentation. Apply
this limit to all code, including Astro markup, scripts, styles, configuration
and code examples. Wrap long lines using valid syntax. Configure Prettier with
`printWidth: 80` to match this limit. Prettier treats that width as a wrapping
target, so `pnpm check:style` remains the strict line-length check.

At the end of each task, run `pnpm format:check` in the same final verification
pass as the relevant tests.

## Git commits

Use this format for every commit message:

```text
<type>: <title>

<description>
```

Choose a type that describes the change: `feat`, `fix`, `docs`, `style`,
`refactor`, `perf`, `test`, `build`, `ci`, `chore` or `revert`. Write a concise,
specific title after the type; do not end it with a period. Use the description
to explain what changed, why it was needed, its user or technical impact, and
which verification commands were run. Do not use vague titles such as `fix`,
`changes` or `update` without describing the actual work.

## Conditional blocks

Always wrap if, else, and else if bodies in braces, including one-line branches.
Keep the branch body on its own line inside the braces. ESLint's curly rule
enforces braces; Prettier formats the resulting blocks.

## HTML component attributes

For HTML and Astro elements with multiple attributes, put each attribute on its
own indented line. Put the closing `>` on its own line after the attributes.
Prettier's `singleAttributePerLine` option enforces this layout.

```astro
<a
  class="project-link"
  href={`/projects/${project.id}/`}
  data-project-link
>
```

## Astro component readability and comments

Apply `astro-best-practices` as required by [Astro rules](astro-guides.md).
These conventions cover every `.astro` component, layout and page:

- Use descriptive names and straightforward control flow. Expand compressed
  markup, scripts and styles into readable blocks with consistent indentation.
- Document each file's purpose and responsibilities with a short source comment.
  Explain meaningful props, defaults, slots and caller assumptions near their
  definitions, including accessibility or data constraints.
- Comment each logical markup section to explain its role. Use Astro source
  comments (`{/* ... */}`) for internal explanations that should not appear in
  rendered HTML; retain intentional HTML comments where appropriate.
- Fully explain nontrivial data transformations, browser initialization, event
  handlers, state changes, cleanup and failure/fallback behavior. Describe
  timing, accessibility and theme decisions where they affect users.
- Comment CSS rules and responsive/state behavior as specified below.
- Comments must explain purpose, reasoning or behavior in plain language. Keep
  them accurate when code changes; avoid comments that only restate syntax,
  obsolete explanations, and unnecessary narration of obvious lines.
- Preserve semantic markup, native links, keyboard behavior and the existing
  component API when performing readability-only refactors.

## Astro component styles

Keep component `<style>` sections readable:

- Put each CSS declaration on its own indented line, including custom
  properties.
- Put opening and closing braces on separate lines from declarations; do not
  compress rules into one line.
- Add a short comment immediately before every class selector/rule explaining
  its purpose. Include descendant selectors, state variants and rules inside
  media queries.
- Separate rules with a blank line and comment media queries to explain their
  responsive intent.
- Comments should explain layout or behavior, rather than repeat property names.

See [component CSS conventions][component-css] for an example.

[component-css]: ../project-structure.md#astro-component-css
