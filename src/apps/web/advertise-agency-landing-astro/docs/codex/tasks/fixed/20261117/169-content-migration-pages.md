# 169 — Перенос данных страниц и формы

- **Executor:** Luna (`gpt-6-luna`), reasoning: `high`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `high`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `high`.

Дата: 2026-11-17. Статус: in progress. Этап: MIG-008.

План: [миграция контента](../../plan/20261114_site-content-structure-migration-plan.md).

## Scope

- Три loader-модуля, manifest, три набора JSON,
  scripts/e2e-server.mjs и affected page/form/type tests.

- Переместить согласованную группу JSON в трёх деревьях.

- data/content/config → data/content/site/<группа>;
- data/templates/config → data/templates/site/<группа>;
- tests/fixtures/content/site/config →
  tests/fixtures/content/site/<группа>.

- В fixtures каталог site соответствует runtime site; вложенный site
  не создавать. Старые fixtures пока остаются в site/config.

- Обновить path/output manifest в этой же задаче, не откладывать до финала.

- Старые файлы группы удалить, остальные домены оставить на текущих путях.

- Runtime не коммитить и не заменять starter/fixture данными.

- JSON payload, MDX, approvals, IDs, ordering и public exports сохранять.

- Все JSON в `data/` называть по camelCase-шаблону `fileName.json`;
  зеркальные site fixtures именовать так же. Для страницы каталога проектов
  использовать согласованное имя `site/pages/projects.json`.

- Временные скрипты и private evidence хранить только в ignored output.

## Execution

Grilling уже завершён: структура, scope и поэтапный переход согласованы.
Применять ponytail; перед изменением Astro читать astro-best-practices.
Исполнение, focused checks и review: Luna high. Без делегации.
В отчёте записать фактическую модель/effort и причины эскалации.

Начать после [168](168-content-migration-supporting-lists.md).
При архивировании предшественника обновить ссылку на его фактический путь.
Мастер: [204](../../fixed/20261117/204-automate-content-migration-161-170.md).
В автоматической серии выполнять под его управлением;
следующий шаг начинать только после приёмки и коммита текущего.

Прочитать AGENTS.md и docs/codex/rules/index.md, workflow.md,
code-style.md, architecture.md, content.md, inquiries.md, testing.md,
verification.md.
Затем прочитать только перечисленные ниже loaders, callers и checks.

- [x] До реализации переместить задачу из backlog в todo;
      обновить статус, ссылки плана и `.codex/TASKS.md`.
- [x] Перенести legal/privacyPolicy.json и legal/termsOfUse.json
  в site/pages/legal; projects.json и orderInquiry.json в site/pages.
- [x] Привести оставшиеся доменные JSON в `data/content/` и `data/templates/`
      к `fileName.json`, синхронизировать все site fixture filenames.
- [x] Обновить loaders legal, project-catalog, order-inquiry, diagnostics,
  manifest и inquiry path match в scripts/e2e-server.mjs.
- [x] Проверить legal metadata, catalog pagination и inquiry/form tests.
- [x] Сохранить exports, routes, consent, submission flags и form registry.
- [x] Проверить navigation, catalog-pagination, inquiry-validation
  и inquiry-delivery через локальные mocks, без реальных отправок.

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

- [x] Все рабочие JSON находятся в site; legal routes, pagination и формы
      работают, отправки в E2E перехватываются.
- [x] JSON basenames в `data/` и site fixtures используют camelCase;
      page catalog использует `site/pages/projects.json`, отдельно от
      `site/lists/projects.json`.

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

Принята 2026-11-17. Исполнитель/проверяющий/reviewer: Luna
(`gpt-6-luna`), high; эскалация не потребовалась. Перемещены legal
documents, inquiry settings и catalog settings в `site/pages`; page catalog
использует `projects.json`. По указанию пользователя все дефисные JSON
basenames в runtime/templates и зеркальных site fixtures приведены к
camelCase (`aboutCarousel`, `projectCategories` и другие); `manifest.json`,
`schema.json` и односоставные lowercase names оставлены без изменений.
Список `site/lists/projects.json` остаётся отдельным от `site/pages/projects.json`.

Обновлены loaders и colocated tests, `data/templates/manifest.json`,
`scripts/lib/content-manifest.mjs`, `scripts/e2e-server.mjs`, content catalog
regression и external asset scan. Явные path mappings позволяют безопасно
различать одинаковые basenames в `pages` и `lists`.

Сохранены 12 исходников pages и 18 исходников, переименованных по naming rule,
в `output/task-204/migration-169/`; все 30 SHA-256 совпали после переносов.
Все JSON в `data/` и зеркальном site fixture tree проверены на запрет дефисов.
Тесты прошли: `test:content-catalog`, `verify:boundaries`, `verify:content`
(20), `test:types`, `test:content-blocks`, `test:publication-policy`;
focused loader/integration suites — 48 tests; Chromium navigation/catalog/
inquiry E2E — 22/22 с локальными mocks. Изолированный catalog provisioning
прошёл без authored runtime. `pnpm check` — 0 ошибок, `build` — 39 страниц;
Prettier, code style и `git diff --check` прошли. Остались прежняя Zod
deprecation hint и build chunk >500 kB warning. `verify:external` пропущен по
региональному ограничению. Полный verification не запрошен.

Runtime не включён в коммит; tracked deletion исходного
`data/content/config/services.json` сохранён в worktree после переноса.
Откат runtime — восстановить файлы из snapshots; один Git revert недостаточен.
Review не выявил нерешённых проблем; отдельный коммит создан без push.
