# Current task state — 2026-10-22

`.codex/TASKS.md` is a compact handoff, not a historical task journal.
Detailed scope and verification belong to the linked task files.

## Active tasks

- [145 — CarouselControl API and styles](../docs/codex/todo/145-refactor-carousel-control-api-and-styles.md)
  — planned. Clarify the shared control API and CSS ownership while preserving
  runtime selectors and accessibility behavior.

No other files are currently present in `docs/codex/todo/`.

## Recent completed work

- [141 — ImageGallery tile layout](../docs/codex/fixed/20261021/141-image-gallery2-tile-layout.md)
  — archived after implementation and verification.
- [142 — NavLinks refactor](../docs/codex/fixed/20261022/142-refactor-nav-links.md)
  — archived after implementation and verification.
- [144 — Breadcrumbs contract](../docs/codex/fixed/20261022/144-refactor-breadcrumbs-component-contract.md)
  — archived after implementation and verification.

## Handoff

1. Work on task 145 only after reading its task file and the applicable
   project rules.
2. Keep runtime content in `data/content/` and versioned fixtures in
   `tests/fixtures/content/`.
3. After verification, move the completed task file to
   `docs/codex/fixed/yyyyMMdd/` and update this handoff with a short result.

## Source of truth

- Active tasks: `docs/codex/todo/`
- Deferred tasks: `docs/codex/backlog/`
- Completed tasks: `docs/codex/fixed/yyyyMMdd/`
- Task storage rules: `docs/development/task-management.md`
