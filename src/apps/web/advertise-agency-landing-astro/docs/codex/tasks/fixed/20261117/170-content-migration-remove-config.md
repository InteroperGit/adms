# 170 — Удаление config и итоговая приёмка

- **Executor:** Luna (`gpt-6-luna`), reasoning: `high`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `high`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `high`.

Дата: 2026-11-17. Статус: complete. Этап: MIG-009.

План: [миграция контента](../plan/20261114_site-content-structure-migration-plan.md).

## Scope

- Boundary/tooling aliases, пустые legacy каталоги, maintained docs,
  manifest проверки и оставшиеся active path references.
  Изменения fields/publication policy в эту задачу не входят.

- Runtime не коммитить и не заменять starter/fixture данными.

- JSON payload, MDX, approvals, IDs, ordering и public exports сохранять.
- Все JSON в `data/` и зеркальных `tests/fixtures/content/site/` используют
  camelCase basename; страница каталога проектов — `site/pages/projects.json`.

- Временные скрипты и private evidence хранить только в ignored output.

## Execution

Grilling уже завершён: структура, scope и поэтапный переход согласованы.
Применять ponytail; перед изменением Astro читать astro-best-practices.
Исполнение, focused checks и review: Luna high. Без делегации.
В отчёте записать фактическую модель/effort и причины эскалации.

Начать после [169](../fixed/20261117/169-content-migration-pages.md).
При архивировании предшественника обновить ссылку на его фактический путь.
Мастер: [204](../todo/204-automate-content-migration-161-170.md).
В автоматической серии выполнять под его управлением;
следующий шаг начинать только после приёмки и коммита текущего.

Прочитать AGENTS.md и docs/codex/rules/index.md, workflow.md,
code-style.md, architecture.md, content.md, testing.md, verification.md.
Затем прочитать только перечисленные ниже loaders, callers и checks.

- [x] До реализации переместить задачу из backlog в todo;
      обновить статус, ссылки плана и `.codex/TASKS.md`.
- [x] Подтвердить перенос всех доменов и отсутствие активных старых imports.
- [x] Проверить пути перед удалением только пустых config-каталогов
  в runtime/templates/fixtures. Не удалять неизвестные файлы рекурсивно.
- [x] Удалить переходные aliases и разрешения config в tooling.
- [x] Boundary checker отклоняет JSON basename вне camelCase.
- [x] Boundary checker требует site/settings, sections, pages или lists
  для manifest JSON; MDX остаётся articles.
- [x] Проверить manifest parity с tracked templates и fixtures,
  отсутствие старых файлов и двойных копий доменов.
- [x] Обновить README и актуальную документацию, включая source diagnostics
  parse-content.test.ts. Исторические fixed records сохранять.
- [x] Проверить root alias scripts/e2e.config.mjs и collections
  src/content.config.ts; не менять article fixtures collection.
- [x] Сравнить runtime с backup/hash audit, routes и visible records.
- [x] Подтвердить clean CI, normal runtime build и isolated E2E build.

- [x] Обновить colocated tests изменённых модулей и mocks путей;
      сохранить проверки, добавленные задачами 175–203.
- [x] Выполнить focused checks затронутых loaders, renderers,
      integration и E2E по актуальным путям; затем boundary/content
      проверки и runtime build для подтверждения рабочего сайта.
- [x] Полный verification запускать только по явному запросу
      пользователя после реализации; без него записать ограничение
      в Handoff, не выдавая focused pass за полный прогон.

- [x] Прочитаны применимые правила, skills и ограниченный набор файлов.
- [x] Проверены зависимости и зафиксировано состояние до изменений.
- [x] Выполнены действия и обновлены все потребители путей группы.
- [x] Сохранены payload и валидность runtime/template/fixture наборов.
- [x] Проверены diff, formatting, ссылки и требуемые gates.
- [x] В отчёт внесены файлы, команды/результаты, откат и ограничения.
- [x] Обновлены план и .codex/TASKS.md; в автоматической серии задача
      архивирована
      в docs/codex/tasks/fixed/yyyyMMdd с исправлением входящих ссылок.
- [x] После приёмки выполнить review и отдельный локальный коммит
      этой задачи до начала следующей; не push. При автоматическом
      выполнении архивировать по workflow.md, иначе только по запросу.

## Acceptance

- [x] Config полностью отсутствует во всех трёх деревьях.
      Все loaders, provisioning и test suites используют финальные пути;
      полный набор проверок проходит без ослабления assertions.
- [x] JSON basenames в `data/` и site fixtures используют camelCase;
      каталог проектов остаётся `site/pages/projects.json`.

- [x] Проверки выбирать по текущим testing.md и verification.md.
      При изменении content/tooling выполнить test:content-catalog,
      test:content-blocks и test:publication-policy. Проверить clean CI
      provisioning в изолированном checkout без authored runtime.
      E2E использует собственный fixture preview и локальные mocks.

## Recovery

После переносов сверить SHA-256 с локальной копией до задачи;
при редакторских изменениях между задачами сохранить новый snapshot,
не восстанавливать старый baseline поверх свежего контента.
Откат: вернуть пути группы и её callers из локальной копии/диффа задачи.
Откат исходников без обратного переноса ignored runtime недостаточен.
Ошибки не скрывать skip/retries или ослаблением schemas и coverage.
При непроходящих gates задача остаётся незавершённой; следующую не начинать.

## Handoff

Выполнено основным агентом: Luna (`gpt-6-luna`), high; эскалаций не было.
Удалены переходные config aliases из manifest validator, E2E matcher и TS path
maps; удалены только проверенные пустые config-каталоги. Boundary checker
нормализует Git prefix вложенного приложения, проверяет JSON basenames на
camelCase и допускает прежний tracked service-файл только при совпадении его
Git blob с новым runtime-путём. SHA-1 обоих service-файлов совпал:
`6bc6d2112e7ec5e3d097f26fdff88a0eedd32393`.

Изменены `scripts/lib/content-manifest.mjs`, `scripts/test-content-catalog.mjs`,
`scripts/e2e-server.mjs`, `scripts/verify-content-boundaries.mjs`,
`tsconfig.json`, `tsconfig.type-contracts.json`,
`src/validation/parse-content.test.ts`, `data/templates/README.md`, актуальный
план и task index. Production manifest содержит 20 JSON и 2 MDX; все source
пути есть в templates/fixtures, старых файлов и лишних доменов нет. Структура
`scripts/e2e.config.mjs` и `src/content.config.ts` сохранена.

Проверки: `test:content-catalog`, `test:types`, `test:content-blocks`,
`test:publication-policy`, `verify:boundaries`, `verify:content`, полный
Vitest (`139` файлов, `881` тест), `check` (0 errors), `build` (39 страниц),
E2E (22/22 Chromium), CI provisioning в изолированной площадке без
`data/content`, focused Prettier. Имена JSON и отсутствие `config/` проверены
во всех runtime/template/site-fixture деревьях. Известные предупреждения:
существующий Zod deprecation hint и Vite chunk >500 kB.

Полный verification из `verification.md` не запускался: он не был запрошен
после реализации; `verify:external` пропущен по региональному ограничению.
Runtime payload не менялся; прежний tracked `data/content/config/services.json`
остался локальным unstaged deletion, новый site-файл имеет идентичный Git blob
и не включается в commit. Исторические synthetic MDX fixtures намеренно не
сверяются побайтово с starter templates. Review не выявил нерешённых проблем;
отдельный commit создан без push. Deploy не выполнялся.
