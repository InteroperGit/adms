# 168 — Перенос отзывов и категорий

- **Executor:** Luna (`gpt-6-luna`), reasoning: `high`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `high`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `high`.

Дата: 2026-11-17. Статус: complete. Этап: MIG-007.

План: [миграция контента](../../plan/20261114_site-content-structure-migration-plan.md).

## Scope

- Loaders reviews/project-categories, manifest, три набора JSON,
  asset script, category mocks/type fixtures и affected tests.

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

Начать после [167](167-content-migration-primary-lists.md).
При архивировании предшественника обновить ссылку на его фактический путь.
Мастер: [204](../../todo/204-automate-content-migration-161-170.md).
В автоматической серии выполнять под его управлением;
следующий шаг начинать только после приёмки и коммита текущего.

Прочитать AGENTS.md и docs/codex/rules/index.md, workflow.md,
code-style.md, architecture.md, content.md, testing.md, verification.md.
Затем прочитать только перечисленные ниже loaders, callers и checks.

- [x] До реализации переместить задачу из backlog в todo;
      обновить статус, ссылки плана и `.codex/TASKS.md`.
- [x] Перенести reviews.json и project-categories.json в site/lists.
- [x] Обновить loaders reviews/project-categories, manifest, asset scan,
  vi.doMock/vi.doUnmock путей и type-contract resolution.
- [x] Проверить category slug uniqueness, badge colors, unknown fallback,
  ProjectCard и ProjectCatalogControls/Grid.
- [x] Не переносить отдельные scenario fixtures с похожими именами:
  tests/fixtures/content/project-categories.json остаётся test input.

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

- [x] Отзывы и категории читаются из site/lists, project validators/types
      разрешаются в чистом checkout без runtime dependencies.

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

Принята 2026-11-17. Модель: Luna (`gpt-6-luna`), reasoning high;
эскалация не потребовалась. Перемещены reviews и project-categories в
site/lists во всех трёх деревьях; JSON, approvals, IDs и порядок сохранены.
Тестовая категория из `tests/fixtures/content/project-categories.json`
оставлена на месте. Существующий wildcard `@/data/content/site/*` уже
разрешает новые fixture и type-contract paths в Vitest/TypeScript.

Шесть свежих SHA-256 snapshots в `output/task-204/migration-168/` совпали
после переноса:

- runtime reviews: `E986B3E1E7428E15B25E86AD04CDF1E21FEFCFEBCD5DA0B1F682C424B1BEF4E3`;
- runtime project categories: `B66480FAF709C30EBD3AAF1475782949D88772B47F84BDEAF85AF9C3C0937C8D`;
- template reviews: `651D49012B92B65403EEE18987AE86D322151484AF7B7EBAE32205A5D475D10F`;
- template project categories: `DE000890A720512EAA698F4879BBB1D917529DF981F0BAC2CBBA822729D804C8`;
- fixture reviews: `4168F125ED1211E8EA83AC23FB74515D908DF9223F3A0EBB20C305B8D344544D`;
- fixture project categories: `3FC1E3BB2C7FFF01250459E917C931B68EF98059792B7D200FF6EA23301F724C`.

Обновлены оба loader и tests/mocks, template manifest, external asset path и
catalog migration regression. `test:content-catalog`, `verify:boundaries`,
`verify:content` (20 JSON), `test:types`, `test:content-blocks` и
`test:publication-policy` прошли. Focused suites для reviews, категории,
publication, ProjectCard и catalog controls/grid — 40 тестов; Chromium catalog
E2E — 3/3. Изолированный snapshot HEAD без authored runtime прошёл CI
provisioning. `pnpm check` — 0 ошибок; build — 39 страниц; Prettier, code style
и `git diff --check` прошли. Остались известные deprecation-подсказка для
`z.number().finite()` и предупреждение о chunk больше 500 kB. `verify:external`
пропущен по региональному ограничению; полный verification не запрошен.

Review не нашёл нерешённых проблем. Rollback: вернуть template/fixture JSON в
`site/config`, восстановить runtime из snapshot и вернуть paths loaders, mocks,
manifest, scripts и task records из коммита. Git revert не вернёт ignored
runtime. Отдельный локальный коммит создан; push не выполнялся.
