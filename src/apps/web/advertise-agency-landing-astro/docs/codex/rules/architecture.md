# Architecture

## Responsibilities and dependencies

- `data/content/`: externally supplied runtime content, outside version control.
- `tests/fixtures/content/`: versioned synthetic test inputs.
- `src/types/`: plain domain contracts, independent of validation and content.
- `src/validation/`: schemas, parsing and invariants; imports domain types with
  `import type`. Validate untrusted input before application use.
- `src/content/`: loaders and validated typed exports. Components consume these
  exports; browser code must not import runtime content or server validation.
- `src/pages/`: route composition; `src/layouts/`: document shells;
  `src/components/`: reusable rendering and interaction boundaries.

Keep the dependency direction: domain types → validation → loaders → consumers.
Change a shared contract with its validators, callers and tests. Keep authored
content out of source objects and markup; see [content](content.md).

## Rendering and state

Render readable semantic HTML in Astro. Add browser code only for interactions
requiring it; preserve usable native navigation and content without JavaScript.
Prepare data in frontmatter/server code. Keep browser modules scoped to their
own behavior, adjacent to its component when appropriate.

Each interactive instance owns its state, listeners, observers and timers, with
cleanup on removal/navigation. Initialization must be safe to repeat without
duplicate handlers. Recover from missing APIs or unavailable storage with the
documented fallback; do not let one instance affect another.

Keep trust decisions at the owning boundary: authored data cannot authorize
forms, publication or privileged operations. Server validation remains necessary
regardless of client controls. Shared renderers should consume validated values
and explicit context, not infer permissions from visible markup.

## Composition and styles

Use native semantics and existing shared components before introducing another
abstraction or client dependency. Preserve public props, slots, accessible names
and observable behavior when refactoring. Keep data preparation, rendering and
browser interaction responsibilities explicit without adding redundant layers.

Use one global style entry. Shared tokens own geometry and semantic aliases;
theme definitions own palettes; foundations own document defaults and reusable
primitives. Component-scoped styles own local layout and states. Register
framework plugins once and preserve the existing cascade/layer order. Changes to
shared tokens or public classes require checking all affected consumers.
Reduced-motion rules must remain effective regardless of layer.

Apply [code style](code-style.md), [design](design.md) and [testing](testing.md)
at their respective boundaries. Implementation details and individual component
contracts belong beside their source, not in this guide.
