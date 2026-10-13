# 082. Playwright-приёмка универсальных страниц

Status: fixed. Created: 2026-10-12. Completed: 2026-10-13.
Plan: [Универсальные блоки](../../plan/20261012_universal-content-blocks-plan.md).
Dependencies: 076a, 078, 079, 080, 081.

## Актуальное состояние после 078

Reviewed: 2026-10-13. Исторический обзор перед приёмкой.

- 080 проверила Chromium DOM parity MDX/JSON для всех block types, published
  project/service identity/consent, owner gates, gallery arrows/Escape/focus
  return, no-JS и blocked storage. Evidence: `output/playwright/task-080/`.
  Расширить checks на touch/zoom, focus trap, reduced motion и chart interaction.
- После 080 все 27 проектов используют MDX; runtime converter и отдельные
  project/service adapters удалены. Общие responsive media и формы работают
  через `ContentBlocks`; media/evidence metadata сохранены без fake approval.
- 079 завершила сервисную MDX-миграцию со schema и built-page tests.
  Совместимость visual/form adapters проверена на данных и сборке;
  browser interaction и визуальное сравнение остаются здесь.
- Только две specialized tuples зарегистрированы: project/led-letters и
  service/svetovye-bukvy, обе используют `led-letters`. Для остальных
  категорий проверять общий fallback, а не требовать несуществующие формы.
- Текущие проекты demo; published/draft, минимальные статьи и редкие block
  types проверить на контролируемых fixtures без публикации тестовых данных.

## Работы

- [x] Проверить минимальную и полную страницу проекта.
- [x] Проверить каждую форму категории и service order-form.
- [x] Проверить table/chart/image-gallery/quote/footnote, ECharts interaction,
  chart table fallback and empty states.
- [x] Проверить paragraph, ordered-list и unordered-list, включая порядок,
  heading hierarchy и отсутствие пустых wrapper-ов для optional sections.
- [x] Проверить project return state на page 2 с query/filter.
- [x] Проверить service URLs, demo/noindex, themes, 375/1440px,
  keyboard, reduced motion and no-JS.
- [x] Сохранить сценарии, результаты и screenshots в output/playwright/task-082/.
- [x] Проверить gallery с одной, двумя и многими картинками: Escape, backdrop,
  arrows, dots, focus trap/return, scroll lock, hover/focus, touch и 200% zoom.
- [x] Проверить реальные изображения после production build, отсутствие
  asset 404, captions, alt и стабильность размеров при медленной загрузке.
- [x] Проверить published specialized формы: target anchors существуют,
  правильные projectId/serviceId, consent, validation и feedback. Не
  отправлять реальные заявки; использовать перехват/mock endpoint.
- [x] Проверить demo notices, draft exclusion и запрет specialized формы для
  demo; fallback работает для null/unknown category и без JavaScript.
- [x] Сравнить эквивалентные MDX и JSON fixtures в browser: порядок, текст,
  media, navigation и формы; зафиксировать разрешённые различия.

## Приёмка

- [x] Все сценарии проходят без page errors.
- [x] Артефакты и ограничения проверки задокументированы.
- [x] После приёмки задачу переместить в fixed и обновить ссылку в плане.

- [x] Verify sequential block order and absence of a persistent side panel at
  375px and 1440px. Semantic footnote `aside` and temporary lightbox overlay
  are allowed; do not reject these solely because of the element name.

## Results

All controlled Chromium scenarios pass. Astro check and production/isolated
build quality checks pass. Local artifacts: `output/playwright/task-082/`.
Reproduction and limits: [acceptance report](../../../site/content-block-acceptance.md).
