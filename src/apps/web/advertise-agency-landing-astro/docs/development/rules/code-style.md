# Code style rules

Every line of code must be at most 80 characters, including indentation.
Apply this limit to all code, including Astro markup, scripts, styles,
configuration and code examples. Wrap long lines using valid syntax.

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
