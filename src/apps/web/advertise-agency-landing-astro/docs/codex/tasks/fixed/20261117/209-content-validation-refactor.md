# 209 — Унификация валидации и чистых контрактов

- **Executor:** Luna (`gpt-6-luna`), reasoning: `high`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `high`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `high`.

**Статус:** fixed. Создано и выполнено: 2026-11-17.
**Мастер:** [205](205-content-refactor-master.md).
**Зависимость:** [208](../fixed/20261117/208-content-module-migration.md), принять до начала
этой задачи.

## Scope

- Устранить подтверждённое дублирование projectCatalogSchema,
  используя src/validation/project-catalog.ts как владельца.
- Обеспечить source-aware runtime-валидацию входов, выявленных аудитом;
  тип TypeScript сам по себе не считать валидацией.
- Разорвать импорты загрузчиков из доменных типов и валидаторов по плану 207;
  сохранить доменные URL-правила, defaults и strict unknown-field handling.
- Текущая авторизация разрешает автоматическое выполнение серии 205–211;
  задача начинается после принятия 208.
- Сохранять runtime в `data/content/`, fixtures в
  `tests/fixtures/content/`, не менять authored данные.

## Execution

Участник: primary координирует; делегирования нет. Исполнение, ревью и
проверки: Luna (`gpt-6-luna`), reasoning high.
Это планируемые роли. Навыки: `ponytail`; `astro-best-practices`
при изменении Astro-файлов; Context7 при решениях о framework API.

- [x] Прочитать [правила](../../rules/index.md), workflow, code-style,
      architecture, content, testing и verification; сверить diff.
- [x] Проверить разрешение исполнения и завершение зависимости;
      только затем перенести задачу в todo и обновить ссылки.
- [x] Сверить валидаторы site/about/icons/legal и категорий с результатами 206;
      переиспользовать имеющиеся схемы и parseContent.
- [x] Устранить дублирование и обратные зависимости, обновить потребителей,
      типы, схемы и паритет экспортов.
- [x] Обновить colocated-тесты на неверные/отсутствующие поля, defaults,
      source-aware ошибки, disabled/unpublished записи и границы публикации.
- [x] Выполнить затронутые suites, pnpm test:types, pnpm check,
      pnpm verify:boundaries и pnpm verify:content.
- [x] Выполнить три standalone content-теста из package.json;
      сверить output схем с доменными типами в обе стороны.
- [x] Провести ревью diff, проверок и acceptance; устранить замечания.
- [x] Записать фактические модели/effort, файлы, команды, результаты
      и ограничения в Handoff; обновить мастер и индекс задач.
- [x] После принятия оформить отдельный локальный коммит;
      архивировать только по правилам workflow, без push.

## Acceptance

- [x] У каждой изменённой схемы один владелец; нет ослабляющих casts и
      strictness.
- [x] Типы независимы от загрузки runtime; валидаторы не запускают загрузчики.
- [x] Валидные fixtures дают прежние значения; невалидные входы явно
      отвергаются.
- [x] Ограничения публикации, provenance и MDX не ослаблены.
- [x] Проверки завершились успешно; оставшиеся блокеры явно записаны,
      незавершённые критерии не отмечены выполненными.

## Handoff

Выполнено 2026-11-17 Luna (`gpt-6-luna`), reasoning high; делегирования нет.
`src/content/project-catalog.ts` теперь импортирует единственную схему из
`src/validation/project-catalog.ts`. Добавлены strict схемы `siteSchema`,
`aboutSchema`, `iconsSchema`, `legalDocumentSchema`; соответствующие content
loaders валидируют JSON через `parseContent` с точным путём исходного файла.
Исходные интерфейсы в `src/types` сохранены; compile-only type contracts
доказывают равенство output типов схем и доменных типов в обе стороны.
Существующая схема категорий уже strict, проверяет уникальность slug и
осталась единственным владельцем JSON category input; обратные импорты типов
в loaders/validation отсутствуют. Не добавлялись URL/email/непустые строки
ограничения, отсутствующие в прежних доменных контрактах.

Проверки: `pnpm exec vitest run src/validation src/content` — 52 файла /
297 тестов; `pnpm test:types`; `pnpm check` (385 файлов, 0 errors, 0 warnings,
1 существующая deprecation hint в неизменённом `src/validation/content-blocks.ts`);
`pnpm verify:boundaries`; `pnpm verify:content` (20 runtime JSON);
`pnpm test:content-catalog`; `pnpm test:content-blocks`;
`pnpm test:publication-policy`. `site.test.ts` подтверждает исходный путь и
вложенное поле в ошибке `parseContent`; validator tests отвергают пропуски,
неверные типы и неизвестные ключи, валидные fixtures остаются без изменений.
Runtime и fixture authored данные не изменялись. Полный verification suite
не запускался: post-implementation full run не запрашивался отдельно.

