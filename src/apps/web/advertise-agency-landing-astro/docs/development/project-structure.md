# Application structure

[Documentation index](../../README.md)

```text
.
|-- data/content/             # JSON settings/content and legal documents
|-- public/                   # Static files, including favicons
|-- src/
|   |-- components/           # Header, footer, cookie banner
|   |   |-- cards/            # Project and review cards
|   |   |-- sections/         # Homepage sections
|   |   `-- ui/               # Shared controls, navigation, mobile dialog
|   |-- content/              # Validated JSON exports and settings
|   |-- layouts/              # Shared page and legal document layouts
|   |-- pages/                # Homepage, projects/[id].astro, legal pages
|   |-- validation/           # Schemas, helpers and source-aware parser
|   |-- styles/               # Tailwind/DaisyUI and scrollbar styles
|   `-- types/                # Plain shared domain contracts
|-- docs/codex/               # Plans, pending tasks, and completed tasks
|-- astro.config.mjs          # Static output and Tailwind Vite plugin
|-- package.json
`-- pnpm-lock.yaml
```

Use `data/content/site.json` for the displayed agency name (`logoText`), site
title and description, contact information, navigation, section headings, and
footer description/copyright. The header, footer, and page metadata share that
configuration. The footer year is generated at build time; rebuild when it needs
to change. Keep approved legal copy in its legal JSON documents rather than
substituting brand names programmatically.

Domain contracts in `src/types/` remain independent of runtime validation.
Validators in `src/validation/` import contracts only as types and check
item/aggregate output compatibility. Content wrappers import JSON and
validators; components consume wrappers and `@/types`. See [content ownership
and field changes][source-1]. Validation belongs to server/build imports, never
client scripts.

## Code line length

Every line of code must be at most 80 characters, including indentation.
This applies to Astro markup, scripts, styles, configuration and code examples.
Wrap long lines using valid syntax when adding or editing code.

## Astro component CSS

Use readable multiline rules in component `<style>` sections. Write every
declaration, including custom properties, on a separate indented line. Keep
braces separate from declarations and leave a blank line between rules. Add a
short purpose comment before every class rule, including descendant selectors,
hover/focus states and responsive overrides. Comment media queries to explain
the layout change. Follow these rules when adding or editing component styles;
[AGENTS.md](../../AGENTS.md) makes them project instructions.

```css
/* Reserve the image frame while remote artwork loads. */
.offer-background {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.25;
}

/* Use the configured mobile crop on narrow screens. */
@media (max-width: 47rem) {
  /* Keep the image subject visible in the mobile frame. */
  .offer-background {
    object-position: var(--mobile-focal-point);
  }
}
```


[source-1]: ../site/content.md#changing-a-domain-field
