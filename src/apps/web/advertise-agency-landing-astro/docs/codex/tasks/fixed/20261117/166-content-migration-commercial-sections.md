# 166 — Перенос цен и гарантий

- **Executor:** Luna (`gpt-6-luna`), reasoning: `high`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `high`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `high`.

Дата: 2026-11-17. Статус: complete. Этап: MIG-005.

План: [миграция контента](../../plan/20261114_site-content-structure-migration-plan.md).

## Scope

- Два loader-модуля, manifest, три набора JSON и соответствующие tests.
  Не менять pricing/publication semantics ради переноса.

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

Начать после [165](165-content-migration-home-sections.md).
При архивировании предшественника обновить ссылку на его фактический путь.
Мастер: [204](../../fixed/20261117/204-automate-content-migration-161-170.md).
В автоматической серии выполнять под его управлением;
следующий шаг начинать только после приёмки и коммита текущего.

Прочитать AGENTS.md и docs/codex/rules/index.md, workflow.md,
code-style.md, architecture.md, content.md, testing.md, verification.md.
Затем прочитать только перечисленные ниже loaders, callers и checks.

- [x] До реализации переместить задачу из backlog в todo;
      обновить статус, ссылки плана и `.codex/TASKS.md`.
- [x] Перенести pricing.json и production-and-guarantees.json
  в site/sections.
- [x] Обновить loaders pricing и production-and-guarantees,
  diagnostic paths, manifest и связанные mocks.
- [x] Проверить pricing-publication и render tests PricingExamples,
  ProductionAndGuarantees.
- [x] Подтвердить сохранение ссылок на опубликованные проекты,
  формата цен и ограничений claims/media.

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

- [x] Цены и гарантии загружаются с новых путей; project references
      валидны до последующего переноса каталогов.

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

Принята и архивирована 2026-11-17. Модель: Luna (`gpt-6-luna`),
reasoning high; эскалации не потребовались. Перенесены pricing и
production-and-guarantees в site/sections во всех трёх деревьях;
обновлены два loader, diagnostics, tests, manifest и synthetic
catalog migration regression. Runtime не добавлялся в Git.

Перед переносом сохранены шесть исходных файлов и SHA-256 в
`output/task-204/migration-166/`; все шесть хешей после переноса
совпали, все JSON успешно разобраны.

Проверки прошли: `test:content-catalog`, `verify:boundaries`,
`verify:content`, `test:types`, `test:content-blocks`,
`test:publication-policy`; затронутые loader/publication, component
и integration Vitest suites — 22 теста; catalog E2E — 3/3;
`astro check` — 0 ошибок; `build` — 39 страниц; Prettier и
`git diff --check`. `astro check` сохраняет существующую deprecation
подсказку для `z.number().finite()` в `src/validation/content-blocks.ts`.
Полный verification не запрошен и не запускался.

Изменённые файлы: loaders и tests для pricing/guarantees,
`data/templates/manifest.json`, `scripts/test-content-catalog.mjs`,
template/fixture JSON в `site/sections`, этот task record, план,
мастер и компактный индекс задач. Runtime расположен в ignored
`data/content/site/sections/` и не включён в коммит.

Откат: восстановить шесть runtime JSON из snapshot в
`output/task-204/migration-166/`, вернуть шаблоны/fixtures и
исходные пути модулей/manifest/regression script из коммита задачи.
Один Git revert не возвращает ignored runtime. Отдельный локальный
коммит создан после проверки; push не выполнялся.
