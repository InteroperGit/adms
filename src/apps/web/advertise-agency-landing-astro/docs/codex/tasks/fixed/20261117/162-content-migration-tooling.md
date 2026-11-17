# 162 — Подготовка tooling и полных шаблонов

- **Executor:** Sol (`gpt-6.1-sol`), reasoning: `medium`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `medium`.

Дата: 2026-11-17. Статус: complete. Этап: MIG-001.

План: [миграция контента](../../plan/20261114_site-content-structure-migration-plan.md).

## Scope

- Основные файлы: scripts/verify-content-boundaries.mjs,
  scripts/prepare-ci-content.mjs, scripts/test-content-catalog.mjs,
  vitest.config.ts, tsconfig.type-contracts.json,
  data/templates/manifest.json и новый action-rail template.
  Читать generate-content-catalog.mjs, e2e-server.mjs, action-rail schema.
  Генератор менять только при подтверждённой необходимости.

- Runtime не коммитить и не заменять starter/fixture данными.

- JSON payload, MDX, approvals, IDs, ordering и public exports сохранять.

- Временные скрипты и private evidence хранить только в ignored output.

## Execution

Grilling уже завершён: структура, scope и поэтапный переход согласованы.
Применять ponytail; перед изменением Astro читать astro-best-practices.
Исполнение: Sol medium; focused checks и review: Luna medium.
Без делегации.
В отчёте записать фактическую модель/effort и причины эскалации.

Начать после [161](161-content-migration-baseline.md).
При архивировании предшественника обновить ссылку на его фактический путь.
Мастер: [204](../../fixed/20261117/204-automate-content-migration-161-170.md).
В автоматической серии выполнять под его управлением;
следующий шаг начинать только после приёмки и коммита текущего.

Прочитать AGENTS.md и docs/codex/rules/index.md, workflow.md,
code-style.md, architecture.md, content.md, testing.md, verification.md.
Затем прочитать только перечисленные ниже loaders, callers и checks.

- [x] До реализации переместить задачу из backlog в todo;
      обновить статус, ссылки плана и `.codex/TASKS.md`.
- [x] Добавить безопасный template `config/action-rail.json` по текущей
  strict schema и synthetic fixture; не копировать authored runtime.
- [x] Включить его в manifest; обеспечить 20 JSON и 2 MDX starter.
- [x] Boundary checker принимает переходный map конкретных допустимых путей
  `config/**` и `site/**`, отклоняет неизвестные пути и дубли домена.
- [x] Сохранить denylist, уникальность outputs и проверки MDX.
- [x] Подготовить CI provisioning полного mixed fixture package.
      Отказывать при непустом destination; проверить отказ от перезаписи.
  Запуск только в чистом CI checkout, не поверх локального runtime.
- [x] Сохранить корень fixtures `tests/fixtures/content/site/`.
  Он соответствует `data/content/site/`: конечный путь settings будет
  `tests/fixtures/content/site/settings/site.json`.
- [x] Vitest/type-contract aliases явно сопоставляют runtime `config/*`
      с fixtures `site/config/*`, а runtime `site/*` с fixtures `site/*`
      относительно `tests/fixtures/content/`, без fallback к runtime.
- [x] CI/E2E используют те же соответствия при чтении manifest outputs;
      destinations сохраняют runtime layout. Не копировать весь fixture root:
      соседние scenario/type-contract fixtures не входят в provisioning.
- [x] Проверить оба пути в mixed layout, финальную раскладку без второго
      site и отсутствие чтения посторонних fixtures.
- [x] Проверить E2E provisioning action-rail после добавления в manifest.
- [x] Расширить catalog regression: nested outputs, mixed layout,
  отсутствие дубликатов; сохранить существующие negative cases.

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

- [x] Старая раскладка работает; новый starter включает ActionRail.
      Чистые CI/E2E builds работают на fixtures без локального runtime.

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

Реализация выполнена; diff и ссылки проверены. Задача архивируется и
фиксируется отдельным локальным коммитом без push.
Исполнитель: Sol, medium; без делегации. Изменены template manifest/action-rail,
общий validator manifest, CI provisioning, Vitest/TypeScript/Astro aliases,
E2E provisioning, content invariants, workflow Node version, synthetic article
fixtures и colocated catalog regression.

Проверки: `test:content-catalog`, `verify:boundaries`, `verify:content` (20),
`test:content-blocks`, `test:publication-policy`, `test:types`, `test:unit`
(53 files, 529 tests), ActionRail component (2), Chromium header-settings E2E
(3), `check` (0 errors; existing deprecation hint), CI provisioning и build
(15 pages) прошли. Prettier check passed. Один первый E2E запуск выявил, что
project starter MDX не является runtime article; starter оставлен неизменным,
добавлены отдельные валидные synthetic article fixtures. Повторный E2E passed.

Full verification не запускался: по workflow его выполняют только по явному
запросу после реализации. `verify:external` пропущен по указанию пользователя
из-за региональной недоступности сторонних источников. Runtime `data/content/`
не изменён; авторский `services.json` не перезаписывался. Отдельный CI root
создаётся в ignored `output/ci-content`; provisioning отказал на непустом
destination в regression test. Rollback: вернуть изменения скриптов/config,
удалить synthetic fixtures и восстановить task/plan handoff; runtime rollback
не нужен, так как runtime не менялся.
