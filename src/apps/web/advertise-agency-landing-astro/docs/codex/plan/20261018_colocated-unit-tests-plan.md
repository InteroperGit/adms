# План размещения unit-тестов рядом с исходными модулями

Дата: 2026-10-18
Статус: completed 2026-10-19

## Цель

Убрать тестовые suite-файлы из `tests/unit` и разместить каждый тест рядом с
модулем, который он проверяет. Для смешанных suite-файлов тесты нужно
разделить по владельцу логики и объединить с уже существующими colocated
тестами, не создавая дубликаты.

Runtime fixtures остаются в `tests/fixtures/content/`, общие helpers — в
`tests/helpers/`, композиционные проверки — в `tests/integration/`, а
браузерные сценарии — в `tests/e2e/`.

## Текущее состояние

Задачи 118 и 119 перенесли assertions из всех suite-файлов `tests/unit`
рядом с ответственными модулями. Задача 120 удалила пустую директорию,
обновила `test:unit` и документацию.

В `src/content`, `src/scripts`, `src/server` и `src/validation` уже есть
более полные colocated suite-файлы. Поэтому исходные файлы нельзя просто
переместить: их assertions нужно распределить и слить с существующими
проверками.

Vitest уже ищет оба дерева (`tests/**/*.{test,spec}.{ts,tsx}` и
`src/**/*.{test,spec}.{ts,tsx}`), поэтому изменение discovery не требуется.

## Целевая карта размещения

| Текущий файл | Новое место тестов |
| --- | --- |
| `blocks.test.ts` | `src/validation/content-blocks.test.ts` и `src/content/block-publication.test.ts` |
| `catalog.test.ts` | `src/scripts/project-catalog.test.ts` |
| `inquiry-payload.test.ts` | `src/server/inquiry-payload.test.ts` |
| `pricing-and-categories.test.ts` | `src/content/pricing-publication.test.ts` и `src/content/project-categories.test.ts` |
| `validation.test.ts` | соответствующие `src/validation/*.test.ts` по одной схеме на файл |
| `validator-boundaries.test.ts` | соответствующие `src/validation/*.test.ts`; общие правила — `src/validation/shared.test.ts` |

Для `image-carousel.ts`, у которого сейчас нет colocated suite, создаётся
`src/validation/image-carousel.test.ts`. Для остальных схем используются
существующие файлы: `business-solutions`, `faq`, `introduction`, `offers`,
`order-inquiry`, `ordering-process`, `pricing`,
`production-and-guarantees`, `project-catalog`, `projects`, `reviews`,
`services` и `parse-content`.

## Этапы

1. [x] Перенести и объединить проверки схем и validation boundaries.
2. [x] Перенести content publication, категории, каталог и server payload.
3. [x] Удалить пустой `tests/unit`, обновить команду `test:unit` и документацию.
4. [x] Выполнить полную проверку, включая coverage и CI-пути.

## Правила миграции

- Сохранять смысл и силу существующих assertions; удалять только точные
  дубликаты после слияния.
- Менять относительные импорты fixtures на пути из `src/**` без переноса
  самих fixtures.
- Каждый новый suite получает basename исходного модуля.
- Не переносить в unit-тесты сценарии, которые проверяют композицию страниц,
  browser navigation, reload, no-JavaScript или E2E behavior.
- Не изменять production content в `data/content/`.

## Критерии готовности

- [x] В `tests/unit` нет файлов `*.test.*` или `*.spec.*`; каталог удалён.
- [x] Каждый перенесённый assertion находится рядом с ответственным модулем.
- [x] Unit, full, component и integration suites проходят.
- [x] Astro check, style, lint, coverage и component colocation gates проходят.
- [x] Vitest продолжает искать integration suites в `tests/**`.
- [x] Документация описывает colocated unit tests.

## Задачи

- [118 — colocate validation suites][task-118] — completed 2026-10-19;
  18 focused suites and 176 tests pass.
- [119 — colocate content and runtime suites][task-119] — completed
  2026-10-19; 5 focused suites and 223 tests pass.
- [120 — remove legacy unit tree and update gates][task-120] — completed
  2026-10-19; unit, component, integration and full suites pass.

[task-118]: ../fixed/20261019/118-colocate-validation-suites.md
[task-119]: ../fixed/20261019/119-colocate-content-runtime-suites.md
[task-120]: ../fixed/20261019/120-remove-legacy-unit-tree.md

## Оценка моделей — 2026-10-19

| Задача | Рекомендуемая модель | Reasoning effort | Почему |
| --- | --- | --- | --- |
| 118 — validation suites | `gpt-6-luna` | `high` | Много однотипных переносов по известным Zod-suite; нужен высокий контроль полноты assertions, но не новая архитектура. |
| 119 — content/runtime suites | `gpt-6.1-sol` | `medium` | Задача объединяет разные среды Vitest: publication, DOM/timers и server node; нужен единый контроль границ и отсутствия дубликатов. |
| 120 — legacy tree and gates | `gpt-6-luna` | `medium` | Локальная правка scripts, CI-ссылок и документации после завершения миграции. |

Для 119 отдельные узкие шаги можно выполнять Luna: catalog — `high`, server
payload — `medium`, content publication — `medium`. Sol нужен как основной
исполнитель задачи и для итоговой сверки полного набора. Astra не требуется.
