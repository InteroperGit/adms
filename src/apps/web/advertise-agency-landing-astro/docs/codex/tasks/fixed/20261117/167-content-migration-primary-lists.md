# 167 — Перенос каталогов услуг и проектов

- **Executor:** Luna (`gpt-6-luna`), reasoning: `high`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `high`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `high`.

Дата: 2026-11-17. Статус: complete. Этап: MIG-006.

План: [миграция контента](../../plan/20261114_site-content-structure-migration-plan.md).

## Scope

- Loaders services/projects, manifest, три набора JSON,
  scripts/e2e-server.mjs, test-publication-policy.mjs,
  verify-external-assets.mjs, affected route/component tests.

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
Без делегации.
В отчёте записать фактическую модель/effort и причины эскалации.

Начать после [166](166-content-migration-commercial-sections.md).
При архивировании предшественника обновить ссылку на его фактический путь.
Мастер: [204](../../fixed/20261117/204-automate-content-migration-161-170.md).
В автоматической серии выполнять под его управлением;
следующий шаг начинать только после приёмки и коммита текущего.

Прочитать AGENTS.md и docs/codex/rules/index.md, workflow.md,
code-style.md, architecture.md, content.md, testing.md, verification.md.
Затем прочитать только перечисленные ниже loaders, callers и checks.

- [x] До реализации переместить задачу из backlog в todo;
      обновить статус, ссылки плана и `.codex/TASKS.md`.
- [x] Перенести services.json и projects.json в site/lists.
- [x] Обновить loaders, diagnostics, manifest, E2E path matching,
  scripts/test-publication-policy.mjs и verify-external-assets.mjs.
- [x] Не перемещать articles/services и articles/projects.
- [x] Проверить article.entry, IDs/frontmatter, href, JSON fallback reason,
  publication gates, sitemap и выдачу static routes.
- [x] Обновить mocks и проверить tests/integration/{crawler-routes,articles-content,catalog}.test.ts,
  service/project/card rendering, catalog и gallery E2E.
- [x] Убедиться, что E2E overrides по-прежнему применяются именно
  к synthetic service/project records.

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

- [x] Каталоги работают из site/lists; MDX разрешается без fallback,
      маршруты и публикационные ограничения совпадают с baseline.

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

Выполнение начато 2026-11-17 после приёмки и коммита 166 (`b3194ee3`).
Модель/effort: Luna, high. Перед переносом шесть файлов скопированы в
`output/task-204/migration-167/`; SHA-256 исходников:

- runtime services: `8E4C1A6F90D49A7C6BA75691DC06C9AC9F063A8BF4A1E4A05E9D3980A357CBA2`;
- runtime projects: `22166B908A49B0783E4E2F012991CF6DF3474D778B2276EB22DCE3AE9665C6B8`;
- template services: `7C186C2D3D013A4B49F91C165A34939C0DB6481D12B65D99BBDCABCE6BE176E4`;
- template projects: `97DCC8243B7A897497410FEFBE058BA6F721230B0B8C469C0F0CAFA207E51F26`;
- fixture services: `2F4E5775DA072C06B1CA1230AD8CFA352E570553860845740E91C70E1547A469`;
- fixture projects: `22A8893B59BD4F104E3B04EA7C074AEC30D7D679AB94E7E75FB925A8096763C3`.

Пути runtime после переноса проверены с этими snapshots; все шесть SHA-256
совпали, JSON payload сохранился. Изменены два loader и их colocated tests,
template manifest, publication policy и external asset path, catalog migration
regression, а также template/fixture paths. `scripts/e2e-server.mjs` уже
поддерживал оба пути и применил overrides к synthetic records в E2E. Старые
`config/services.json` и `config/projects.json` остаются только в этом
переходном path matcher; runtime, templates и fixture catalog используют
`site/lists`. Runtime ignored и в коммит не включён.

Проверки прошли: `test:content-catalog`, `verify:boundaries`,
`verify:content` (20 JSON), `test:types`, `test:content-blocks`,
`test:publication-policy`; focused loader/publication/integration suites —
64 теста; card/catalog component tests — 12; Chromium catalog/gallery E2E —
14/14. Изолированный snapshot HEAD без `data/content` прошёл catalog
provisioning. `pnpm check` — 0 ошибок, `build` — 39 страниц; Prettier,
code style и `git diff --check` прошли. Сохраняются известные deprecation
подсказка для `z.number().finite()` и предупреждение о chunk больше 500 kB.
`verify:external` пропущен по ранее заданному региональному ограничению;
полный verification не запрошен и не запускался.

Rollback: вернуть template/fixture JSON в `site/config`, восстановить runtime
из `output/task-204/migration-167/` и вернуть loaders, mocks, diagnostics,
manifest и scripts к paths из отдельного коммита задачи. Один Git revert не
возвращает ignored runtime. Review не выявил неразрешённых проблем. Изменения
зафиксированы отдельным локальным коммитом; push не выполнялся.
