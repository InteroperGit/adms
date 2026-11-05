# Current task state — 2026-10-25

`.codex/TASKS.md` is a compact handoff, not a historical task journal.
Detailed scope and verification belong to the linked task files.

## Active tasks

None currently.

## Recent completed work

- [155 — Services section visual, UX and code improvement](../docs/codex/fixed/20261105/155-improve-services-section-visual-ux-and-code.md): shared catalog card, public service images and responsive card UX completed.
- [154 — Scroll-triggered action rail](../docs/codex/fixed/20261025/154-scroll-triggered-action-rail.md):
  upper contact controls and a separate lower return-to-top action; focused
  tests and project checks passed.
- [153 - Carousel](../docs/codex/fixed/20261025/153-image-carousel-full-width-controls.md): 12 E2E tests passed in Chromium, Firefox and WebKit.
  Vite dev excludes output/ from watching and serving.
- [135 — Адаптивность и геометрия](../docs/codex/fixed/20261023/135-e2e-responsive-and-media-failure.md)
  — завершено; 25 Chromium-тестов прошли, включая 24 адаптивные комбинации.
- [134 — Пути без JavaScript](../docs/codex/fixed/20261023/134-e2e-without-javascript.md)
  — завершено; 6 Chromium-тестов прошли.

- [133 — Chart/Video E2E](../docs/codex/fixed/20261023/133-e2e-chart-and-video.md)
  — завершено; реальный 404 проверен; 3 Chromium-теста пройдены.
- [152 — ThemeInit](../docs/codex/fixed/20261023/152-refactor-theme-init-control-flow.md)
  — завершено; синхронный inline-script сохранён; проверки пройдены.
- [151 — Settings](../docs/codex/fixed/20261023/151-refactor-settings-popup-handlers.md)
  — завершено; позиционирование и обработчики разделены; проверки пройдены.
- [150 — MobileMenuDialog](../docs/codex/fixed/20261023/150-refactor-mobile-menu-dialog-handlers.md)
  — завершено; обработчики и временная фокусируемость разделены; browser/unit checks passed.
- [149 — ImageCarousel](../docs/codex/fixed/20261022/149-refactor-image-carousel-style-scope.md)
  — завершено; scoped CSS, развернутые ветвления; проверки пройдены.
- [148 — Button](../docs/codex/fixed/20261022/148-refactor-button-native-props.md)
  — завершено; нативные атрибуты типизированы, render-тесты пройдены.
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
