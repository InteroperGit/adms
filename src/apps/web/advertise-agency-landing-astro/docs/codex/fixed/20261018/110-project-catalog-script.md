# 110 — Project catalog browser script

Дата: 2026-10-16. Статус: completed 2026-10-18.

## Модель и оценка

Рекомендуемая модель: `gpt-6.1-sol`; reasoning effort: `high`.
Оценка: 2026-10-18, с приоритетом экономии ресурсов.

Автоинициализация, debounce и History API разделяют состояние DOM и URL.
Luna может покрыть pure logic и локальные события; Sol нужен для связанной
последовательности URL/history/timers и изоляции listeners между тестами.

## Подзадачи для отдельных запусков

- [x] 110.a — `gpt-6-luna`, medium: normalizeSearch, matchesSearch,
  filterCatalog. Проверить регистр/ё/пробелы, слова и сочетания категорий.
- [x] 110.b — `gpt-6.1-sol`, medium: тестовая DOM-база для module import.
  Подготовить synthetic grid, URL, fake timers и сброс module/global state;
  подтвердить, что повторная инициализация не загрязняет соседний тест.
- [x] 110.c — `gpt-6-luna`, high: на базе b проверить input debounce,
  category/reset/submit, count/empty, pagination output и focus.
- [x] 110.d — `gpt-6.1-sol`, high: initial URL, push/replace, сохранение
  server pagination/query/hash, popstate и pending debounce при переходах.
  Проверить итоговые DOM и URL; собрать client-state coverage не ниже 85%.

Порядок: a отдельно; b → c → d. Шаг b передаёт Luna готовый способ загрузки
модуля и очистки среды. Все проверки остаются без реального browser/server.

Общий порядок работы и условия перехода на более сильную модель:
[оценка моделей][model-assessment].

[model-assessment]: ../../plan/20261018_todo-model-assessment.md

## Задача

Покрыть `src/scripts/project-catalog.ts` отдельно от Astro catalog components.

## Сценарии

Search/category combinations, debounce, count and empty updates, URL query
serialization, server pagination preservation, initial URL state and
back/forward restoration.

## Готово, когда

Fake timers и synthetic DOM grid are used; no real browser/server required;
client-state coverage не ниже 85%.

Зависимость: 100, 109.

## Результат и проверка

Добавлен colocated suite `src/scripts/project-catalog.test.ts`:
34 проверки pure logic, synthetic DOM, fake timers и History API.
Каждая browser-проверка получает отдельный JSDOM, storage и module state;
окно и timers очищаются после проверки. Данные находятся в versioned fixture
`tests/fixtures/content/project-catalog-runtime.json`.

Исправлены найденные регрессии:

- Pending debounce отменяется при paging, submit, category/reset и popstate.
- Disabled arrows не получают `aria-current`; marker остаётся у номера страницы.
- Modified clicks сохраняют native link behavior.

Заодно исправлены два selector type errors в существующих component tests
и длинные test titles из задачи 109, блокировавшие общий check.

Проверки:

- Catalog suites: 36 tests passed; вместе с двумя затронутыми component suites
  — 41 tests passed.
- `project-catalog.ts`: 100% statements, branches, functions и lines
  по V8; отчёт `coverage/task-110/` (ignored).
- Content boundaries/invariants, component colocation, focused ESLint,
  Prettier, `pnpm check` и `pnpm build` passed.
- Build сохраняет существующее предупреждение о chunk больше 500 kB;
  Astro check сообщает один существующий Zod deprecation hint.
