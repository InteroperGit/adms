# 161 — Исходное состояние миграции

- **Executor:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `medium`.

Дата: 2026-11-17. Статус: fixed. Этап: MIG-000.

План: [миграция контента](../../plan/20261114_site-content-structure-migration-plan.md).

## Scope

- Изменять только ignored evidence и task/plan handoff.
  Исходники, runtime, шаблоны и fixtures на этом этапе не менять.

- Runtime не коммитить и не заменять starter/fixture данными.

- JSON payload, MDX, approvals, IDs, ordering и public exports сохранять.

- Временные скрипты и private evidence хранить только в ignored output.

## Execution

Grilling уже завершён: структура, scope и поэтапный переход согласованы.
Применять ponytail; перед изменением Astro читать astro-best-practices.
Исполнение, focused checks и review: Luna medium. Без делегации.
В отчёте записать фактическую модель/effort и причины эскалации.

Первая задача серии; реализация миграции ещё не начата.
При архивировании предшественника обновить ссылку на его фактический путь.
Мастер: [204](../../fixed/20261117/204-automate-content-migration-161-170.md).
В автоматической серии выполнять под его управлением;
следующий шаг начинать только после приёмки и коммита текущего.

Прочитать AGENTS.md и docs/codex/rules/index.md, workflow.md,
code-style.md, architecture.md, content.md, testing.md, verification.md.
Затем прочитать только перечисленные ниже loaders, callers и checks.

- [x] До реализации переместить задачу из backlog в todo;
      обновить статус, ссылки плана и `.codex/TASKS.md`.
- [x] Прочитать loaders группы, manifest и scripts provisioning.
- [x] Сохранить локальную резервную копию JSON/MDX и SHA-256 под
  ignored `output/content-migration/baseline/`.
- [x] Составить inventory runtime, templates и fixtures с map старый → новый.
- [x] Учесть 20 runtime/fixture JSON против 19 template JSON:
  отсутствующий template action-rail устраняется задачей 162.
- [x] Зафиксировать исходные маршруты, видимые записи, IDs и порядок секций.
- [x] Выполнить focused baseline checks. Сетевые ограничения зафиксировать;
  они не мешают локальной сборке и проверкам сайта.
- [x] Git не показывает изменения ignored runtime: использовать backup/hash audit.

- [x] Обновить colocated tests изменённых модулей и mocks путей;
      не применимо к MIG-000: исходники и mocks не менялись.
- [x] Выполнить focused checks loaders, integration, E2E,
      boundary/content и runtime build для подтверждения рабочего сайта.
- [x] Полный verification запускать только по явному запросу
      пользователя после реализации; не запрошен и не выполнялся.

- [x] Прочитаны применимые правила, skills и ограниченный набор файлов.
- [x] Проверены зависимости и зафиксировано состояние до изменений.
- [x] Выполнены действия; обновление потребителей путей не относится к
      baseline и не требовалось.
- [x] Сохранены payload и валидность runtime/template/fixture наборов.
- [x] Проверены diff, formatting, ссылки и требуемые gates.
- [x] В отчёт внесены файлы, команды/результаты, откат и ограничения.
- [x] Обновлены план и .codex/TASKS.md; задача архивирована в
      docs/codex/tasks/fixed/20261117 с исправлением входящих ссылок.
- [x] После приёмки выполнить review и отдельный локальный коммит
      этой задачи до начала следующей; не push.

## Acceptance

- [x] Есть восстанавливаемая копия, полная карта файлов и достоверный baseline.
      Следующая задача начинается только с подтверждённого рабочего состояния.

- [x] Применимые проверки прошли; content/tooling не менялись, поэтому
      clean CI provisioning не затрагивался. E2E использовал свой fixture
      preview и локальные mocks.

## Recovery

После переносов сверить SHA-256 с локальной копией до задачи;
при редакторских изменениях между задачами сохранить новый snapshot,
не восстанавливать старый baseline поверх свежего контента.
Откат: вернуть пути группы и её callers из локальной копии/диффа задачи.
Откат исходников без обратного переноса ignored runtime недостаточен.
Ошибки не скрывать skip/retries или ослаблением schemas и coverage.
При непроходящих gates задача остаётся незавершённой; следующую не начинать.

## Handoff

Выполнено 2026-11-17 в автоматической серии 204. Node `26.13.1` и pnpm
`10.7.0` доступны; для pnpm `TEMP`/`TMP` указывались на ignored
`output/content-migration/tmp`. Сверены 20 runtime JSON, 32 runtime MDX,
20 fixture JSON, 19 template JSON и 2 template MDX. Snapshot,
`json-path-inventory.csv`, `runtime-sha256.csv` и
`runtime-report.json` находятся в ignored `output/content-migration/`;
все 52 runtime hashes совпали. Отчёт фиксирует 39 HTML страниц, `robots.txt`,
`sitemap.xml`, маршруты, порядок IDs и статусы записей без authored copy.

Прошли `test:content-catalog`, `verify:boundaries`, `verify:content`,
`test:content-blocks`, `test:publication-policy`,
`pnpm exec vitest run src/content tests/integration` (35 файлов, 177 тестов),
`check` (0 ошибок, один существующий deprecation hint), `test:types`,
`build` (39 страниц) и focused Chromium E2E для каталога/header settings
(6/6). `verify:external` запускался один раз: часть внешних ресурсов вернула
403, `t.me` завершился timeout; пользователь указал пропускать такие
проверки из-за сетевых ограничений в РФ. Runtime и fixtures не менялись;
`git diff -- data/content data/templates tests/fixtures/content` пуст.
Полный verification не запрашивался и не выполнялся. Откат кода не нужен;
для сверки сохранены private snapshot и SHA-256.

Приёмка выполнена основным Codex агентом; точный runtime model ID в этой
сессии недоступен. Проверки и review завершены до отдельного commit задачи.
