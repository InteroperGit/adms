# 208 — Перенос модулей content и обновление импортов

- **Executor:** Luna (`gpt-6-luna`), reasoning: `high`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `high`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `high`.

**Статус:** fixed. Создано и выполнено: 2026-11-17.
**Мастер:** [205](205-content-refactor-master.md).
**Зависимость:** [207](../fixed/20261117/207-content-target-structure.md),
принята до начала этой задачи.

## Scope

- Перенести исходники и colocated-тесты строго по карте 207;
  этот этап меняет структуру, сохраняя алгоритмы и экспортируемые значения.
- Обновить всех потребителей, mocks и пути синтетических fixtures,
  включая src/types, src/validation, scripts и конфигурации.
- Сохранить работоспособность mdx-blocks.mjs в Astro и standalone-компиляторе;
  не переносить authored runtime или fixture-данные.
- Текущая авторизация разрешает автоматическое выполнение серии 205–211;
  задача начинается после принятия 207.
- Сохранять runtime в `data/content/`, fixtures в
  `tests/fixtures/content/`, не менять authored данные.

## Execution

Участник: primary координирует; делегирования нет. Исполнение, ревью и
проверки: Luna (`gpt-6-luna`), reasoning high. Навыки: `ponytail` и
`astro-best-practices`; Context7 не потребовался, framework API не меняется.

- [x] Прочитать [правила](../../rules/index.md), workflow, code-style,
      architecture, content, testing и verification; сверить diff.
- [x] Проверить разрешение исполнения и завершение зависимости;
      перенести задачу в todo и обновить ссылки.
- [x] Выполнить перенос и обновить все импорты по карте 207.
- [x] Проверить rg-поиском старые пути; отличить исторические записи задач
      от действующих импортов, конфигураций и команд.
- [x] Запустить затронутые colocated suites, pnpm test:types,
      pnpm verify:boundaries и pnpm check.
- [x] Запустить pnpm test:content-catalog, pnpm test:content-blocks,
      pnpm test:publication-policy; проверить pnpm build на fixtures.
- [x] Провести ревью diff, проверок и acceptance; устранить замечания.
- [x] Записать фактические модели/effort, файлы, команды, результаты
      и ограничения в Handoff; обновить мастер и индекс задач.
- [x] После принятия оформить отдельный локальный коммит;
      архивировать только по правилам workflow, без push.

## Acceptance

- [x] Все действующие импорты разрешаются; не осталось временных re-export shim.
- [x] Каждый перенесённый TS-модуль имеет colocated-тест с корректными mocks.
- [x] Экспорты, маршруты и публикация совпадают с baseline 206.
- [x] Runtime и fixture-данные не изменены; исходные сбои выделены отдельно.
- [x] Проверки завершились успешно; оставшиеся блокеры явно записаны,
      незавершённые критерии не отмечены выполненными.

## Handoff

Выполнено 2026-11-17 Luna (`gpt-6-luna`), reasoning high; делегирования нет.
Перенесены восемь policy modules и colocated tests из `src/content` в
`src/validation/policies`; импорты consumers, Astro-компонентов, scripts,
fixtures и sitemap обновлены. Runtime/fixture-authored данные не менялись.

Доменные `ProjectCategory` и `ProjectCategoryConfig` находятся в
`src/types/project.ts`. Runtime значения категорий экспортируются только
из `src/content/project-categories.ts`; внутренние value consumers используют
этот loader напрямую. `src/validation/projects.ts` предоставляет
`createProjectSchemas(categorySlugs)`, чтобы сохранить strict category enum
без зависимости validation от content; project publication получает список
категорий аргументом и сохраняет порядок реестра. Удалены обратные runtime
re-exports типов из `src/types`.

Проверки: `pnpm exec vitest run src/content src/validation
src/pages/_sitemap.xml.test.ts tests/integration` — 54 файла / 365 тестов;
после injection: `pnpm exec vitest run src/validation/projects.test.ts
src/validation/policies/project-publication.test.ts src/content/projects.test.ts
tests/integration/catalog.test.ts` — 4 файла / 28 тестов;
`pnpm exec vitest run src/validation/policies` — 8 файлов / 22 теста;
component suite — 79 файлов / 273 теста; `pnpm test:types`, `pnpm check`,
`pnpm test:content-catalog`, `pnpm test:content-blocks`,
`pnpm test:publication-policy`, `pnpm verify:boundaries` и
`pnpm verify:content` (20 runtime JSON) прошли. Fixture build прошёл на 15
страницах; Astro сообщил nonfatal duplicate slug для fixture/runtime `1.mdx`
из-за накопленного `.astro` content cache при смене корня, а также известное
предупреждение о chunk >500 kB. Полный verification suite не запускался:
после реализации пользователь его отдельно не запрашивал.

Старые действующие policy import paths не найдены поиском в `src`, `tests`
и `scripts`. Изменённые authored runtime и fixture данные отсутствуют.
