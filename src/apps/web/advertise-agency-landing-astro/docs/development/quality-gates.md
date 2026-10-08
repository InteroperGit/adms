# Performance and accessibility gates

Run the build quality gate before deployment:

```powershell
pnpm build
pnpm verify:quality
```

The gate checks every generated HTML route for a document language, title,
description, one each of `header`, `main`, and `footer`, one `h1` with no
heading-level jumps, safe links, non-positive `tabindex` values, and image
alternative text, intrinsic dimensions, and loading policy. These checks
protect semantics and cumulative-layout-shift basics in the generated output.

Static checks cannot prove color contrast over remote images, keyboard focus in
all states, screen-reader speech, native 200% zoom, touch behavior, field
performance, or real-world Core Web Vitals. Continue the Playwright viewport
matrix and deployed-host audits documented in
`docs/site/design-verification.md` for those checks.
