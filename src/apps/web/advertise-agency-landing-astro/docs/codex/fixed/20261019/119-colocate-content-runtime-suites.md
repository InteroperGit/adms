# 119 — Colocate content and runtime suites

Дата: 2026-10-18. Статус: completed 2026-10-19.

## Цель

Разнести оставшиеся root unit assertions по `src/content`, `src/scripts` и
`src/server`, объединив их с уже существующими colocated тестами.

## Объём

- Из `blocks.test.ts` перенести publication filtering, demo и approval
  assertions в `src/content/block-publication.test.ts`.
- Из `pricing-and-categories.test.ts` перенести price formatting и
  visibility в `src/content/pricing-publication.test.ts`, а category lookup —
  в `src/content/project-categories.test.ts`.
- Объединить `catalog.test.ts` с `src/scripts/project-catalog.test.ts`.
- Объединить `inquiry-payload.test.ts` с
  `src/server/inquiry-payload.test.ts`.
- Сохранить shared JSON fixtures в `tests/fixtures/content/` и общие builders
  в `tests/helpers/`.

## Зависимости

Зависит от задачи 118 только в части общей проверки полного Vitest-набора;
может выполняться после согласования целевой карты.

## Готово, когда

- [x] Каждый assertion принадлежит одному source module.
- [x] Colocated suites сохраняют прежние assertions и edge cases.
- [x] Focused content, script и server suites проходят: 5 файлов,
  223 теста.

## Выполнение — 2026-10-19

- Publication, catalog, pricing/category и inquiry payload assertions
  объединены с suites в `src/content`, `src/scripts` и `src/server`.
- Сохранены дополнительные проверки approval для всех block types,
  nested demo media status и filtered catalog return URL.
- Удалены четыре migrated suite-файла из `tests/unit`; осталась пустая
  директория для её final cleanup в задаче 120.
- Проверка: focused run по пяти colocated suites — 223 теста прошли;
  code-style check прошёл.

## Модель и оценка

Рекомендуемая модель: `gpt-6.1-sol`; reasoning effort: `medium`.

Задача объединяет три разных test environment и требует удержать общую карту
владельцев логики: DOM/timers для каталога, node boundary для payload и
publication rules для content. Sol оптимальнее как координатор миграции и
проверки дубликатов; отдельные переносы можно делегировать Luna.

Подзадачи:

- 119.a — catalog suite: `gpt-6-luna`, high;
- 119.b — server payload suite: `gpt-6-luna`, medium;
- 119.c — pricing/category/block publication: `gpt-6-luna`, medium;
- 119.d — merge review и полный focused run: `gpt-6.1-sol`, medium.

Astra не требуется: новая архитектура тестового harness в задаче не
планируется.
