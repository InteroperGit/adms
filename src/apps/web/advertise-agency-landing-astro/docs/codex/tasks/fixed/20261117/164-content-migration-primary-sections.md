# 164 — Перенос базовых секций

- **Executor:** Luna (`gpt-6-luna`), reasoning: `high`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `high`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `high`.

Дата: 2026-11-17. Статус: complete. Этап: MIG-003.

План: [миграция контента](../plan/20261114_site-content-structure-migration-plan.md).

## Scope

- Четыре loader-модуля, manifest, три набора JSON,
  scripts/verify-external-assets.mjs и связанные colocated tests.

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

- Временные скрипты и private evidence хранить только в ignored output.

## Execution

Grilling уже завершён: структура, scope и поэтапный переход согласованы.
Применять ponytail; перед изменением Astro читать astro-best-practices.
Исполнение, focused checks и review: Luna high. Без делегации.
В отчёте записать фактическую модель/effort и причины эскалации.

Начать после [163](163-content-migration-settings.md).
При архивировании предшественника обновить ссылку на его фактический путь.
Мастер: [204](../todo/204-automate-content-migration-161-170.md).
В автоматической серии выполнять под его управлением;
следующий шаг начинать только после приёмки и коммита текущего.

Прочитать AGENTS.md и docs/codex/rules/index.md, workflow.md,
code-style.md, architecture.md, content.md, testing.md, verification.md.
Затем прочитать только перечисленные ниже loaders, callers и checks.

- [x] До реализации переместить задачу из backlog в todo;
      обновить статус, ссылки плана и `.codex/TASKS.md`.
- [x] Перенести about.json, about-carousel.json, introduction.json,
  action-rail.json в site/sections.
- [x] Обновить loaders about, about-carousel, introduction, action-rail,
  source-aware diagnostics и manifest для каждого файла.
- [x] Обновить asset scan и обнаруженные mocks/imports.
- [x] Проверить About, Introduction, ImageCarousel и ActionRail,
  включая disabled, keyboard и reduced-motion поведение.

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

- [x] Четыре секции работают с новых путей; настройки каруселей, IDs,
      публикационные ограничения и вывод совпадают с исходными.

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

Реализация выполнена и прошла review; Luna high, без эскалации и делегации.
Все четыре секции перенесены в runtime/templates/fixtures `site/sections/`;
loaders, diagnostics, manifest и asset scan используют новые пути. SHA-256
12 файлов совпали со свежими копиями в ignored
`output/task-204/migration-164/`; runtime payload сохранён и не включён в Git.

Проверки прошли: `test:content-catalog`, `verify:boundaries`, `verify:content`,
`test:types`, `test:content-blocks`, `test:publication-policy`, 36 focused
loader/component/integration tests, carousel Chromium E2E (4 tests), `check`,
`build` (39 pages), Prettier и `git diff --check`. `check` сообщил только
существующий deprecation hint в `src/validation/content-blocks.ts`; build
сообщил о большом chunk, но успешно завершился. Полный verification отложен
до завершения серии и явного запроса пользователя. Commit — отдельный локальный,
без push.
