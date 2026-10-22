# Current task state — 2026-10-22

`.codex/TASKS.md` is a compact handoff, not a historical task journal.
Detailed scope and verification belong to the linked task files.

## Active tasks

- [148 — Button](../docs/codex/todo/148-refactor-button-native-props.md)
  — запланировано; типизировать нативные атрибуты ссылки и кнопки.
- [149 — ImageCarousel](../docs/codex/todo/149-refactor-image-carousel-style-scope.md)
  — запланировано; ограничить CSS стрелок и развернуть ветвления модуля.
- [150 — MobileMenuDialog](../docs/codex/todo/150-refactor-mobile-menu-dialog-handlers.md)
  — запланировано; сделать обработчики и условные блоки читаемыми.
- [151 — Settings](../docs/codex/todo/151-refactor-settings-popup-handlers.md)
  — запланировано; упорядочить сценарий popup и условные блоки.
- [152 — ThemeInit](../docs/codex/todo/152-refactor-theme-init-control-flow.md)
  — запланировано; развернуть ветви, сохранив синхронный inline-script.

## Recent completed work

- [147 — форматирование review-контрактов](../docs/codex/fixed/20261022/147-refactor-review-schema-formatting.md)
  — завершено; compile-time проверки развернуты в пределах 80 колонок.
- [146 — форматирование парсера контента](../docs/codex/fixed/20261022/146-refactor-content-parser-formatting.md)
  — завершено; сигнатура и диагностики приведены к пределу 80 колонок.
- [141 — ImageGallery tile layout](../docs/codex/fixed/20261021/141-image-gallery2-tile-layout.md)
  — archived after implementation and verification.
- [142 — NavLinks refactor](../docs/codex/fixed/20261022/142-refactor-nav-links.md)
  — archived after implementation and verification.
- [144 — Breadcrumbs contract](../docs/codex/fixed/20261022/144-refactor-breadcrumbs-component-contract.md)
  — archived after implementation and verification.
- [145 — CarouselControl API and styles](../docs/codex/fixed/20261022/145-refactor-carousel-control-api-and-styles.md)
  — archived after implementation and verification.

## Handoff

1. Before each task, read its task file and the applicable project rules.
2. Keep runtime content in `data/content/` and versioned fixtures in
   `tests/fixtures/content/`.
3. After verification, move the completed task file to
   `docs/codex/fixed/yyyyMMdd/` and update this handoff with a short result.

## Source of truth

- UI review: [decisions for all 16 components](../docs/codex/plan/20261022-ui-components-review.md)
- Active tasks: `docs/codex/todo/`
- Deferred tasks: `docs/codex/backlog/`
- Completed tasks: `docs/codex/fixed/yyyyMMdd/`
- Task storage rules: `docs/development/task-management.md`
