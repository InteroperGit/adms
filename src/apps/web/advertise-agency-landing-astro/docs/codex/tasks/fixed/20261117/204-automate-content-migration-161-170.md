# 204 — Автоматическое выполнение миграции контента 161–170

- **Coordinator:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Executor:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `medium`.

Дата: 2026-11-17. Статус: complete. Выполнение начато.

План: [миграция контента](../../plan/20261114_site-content-structure-migration-plan.md).

## Scope

- Выполнить весь список 161–170 последовательно, сохраняя рабочий сайт
  после каждой задачи и все ограничения дочерних задач.
- Перенести JSON из config в site/settings, sections, pages и lists.
- Fixtures хранить в `tests/fixtures/content/site/{settings,sections,pages,lists}`
  без вложенного site; итоговая структура не содержит `config/`.
- Имена JSON в `data/` использовать в стиле camelCase `fileName.json`;
  site fixtures именовать синхронно. Project catalog page — `projects.json`.
- Сохранить runtime в `data/content/`, fixtures в `tests/fixtures/content/`,
  loaders, validators и typed exports в `src/`.
- Сохранить JSON payload, MDX, approvals, IDs, ordering, public exports,
  маршруты, publication policy и ограничения отправки форм.
- Не заменять authored runtime шаблонами или fixtures и не включать его в Git.
- Не запускать deployment, push, реальные отправки и включение delivery.
- Не включать задачи 172/173 и другие работы вне миграции.
- Не считать создание этой задачи разрешением на запуск серии.

## Execution

Применять ponytail; ранее согласованный scope миграции сохраняется.
Перед Astro-изменениями читать astro-best-practices, для браузерной
автоматизации — playwright. Начать с AGENTS.md и маршрута rules/index.md:
workflow, code-style, architecture, content, testing, verification;
inquiries/design читать при затрагивании соответствующих границ.

Один основной агент последовательно выполняет роли; делегация не нужна:
задачи меняют общий manifest, aliases и content boundary. Координация,
механические переносы, focused checks и review — Luna medium.
Для реализации 162, 167 и 170 применять Sol (`gpt-6.1-sol`) medium,
как указано в дочерних задачах. Эскалировать только по конкретному сбою;
записывать фактические настройки и основания в Handoff.

- [x] При запуске перенести мастер-задачу backlog → todo и обновить индекс.
- [x] Проверить Git status, существующие изменения, доступность runtime,
      игнорирование output и предусловия 161; не присваивать чужие изменения.
- [x] Выполнить [161 — baseline](161-content-migration-baseline.md).
- [x] Выполнить [162 — tooling](162-content-migration-tooling.md).
- [x] Выполнить [163 — settings](163-content-migration-settings.md).
- [x] Выполнить [164 — primary sections](164-content-migration-primary-sections.md).
- [x] Выполнить [165 — home sections](165-content-migration-home-sections.md).
- [x] Выполнить [166 — commercial sections](166-content-migration-commercial-sections.md).
- [x] Выполнить [167 — primary lists](167-content-migration-primary-lists.md).
- [x] Выполнить [168 — supporting lists](168-content-migration-supporting-lists.md).
- [x] Выполнить [169 — pages](169-content-migration-pages.md).
- [x] Выполнить [170 — cleanup](170-content-migration-remove-config.md).
- [x] Для каждого шага до реализации перенести его backlog → todo;
      после выполнения всех Execution/Acceptance, focused checks и review
      перенести в fixed/yyyyMMdd по Europe/Moscow и исправить входящие ссылки,
      план и `.codex/TASKS.md`.
- [x] После приёмки каждого шага создать отдельный локальный коммит
      с его изменениями и task records; только затем начинать следующий.
- [x] Перед каждым переносом сохранить свежие backup и SHA-256 в ignored
      `output/content-migration/`; проверить пути и отказаться от перезаписи.
- [x] В 162 обеспечить отказ CI provisioning при непустом destination;
      покрыть mixed layout, неизвестные пути, duplicate outputs и отсутствие
      runtime fallback. Проверять provisioning в изолированном checkout.
- [x] Обновлять существующие colocated tests loaders и компонентов,
      type-contract fixtures, mocks и assertions вместе с каждым переносом.
- [x] Использовать актуальные integration suites:
      `shell-home-legal`, `catalog`, `articles-content`, `crawler-routes`,
      `inquiry` в `tests/integration/`; E2E находятся в доменных каталогах
      `tests/e2e/{navigation,content,inquiry,media,preferences}/`.
- [x] После каждого шага выполнить затронутые focused tests, boundary/content
      checks, content regression scripts и runtime build; не ослаблять
      coverage, a11y, assertions, schemas, isolation или publication gates.
- [x] Полный verification выполнить только при явном запросе пользователя
      после реализации, в порядке verification.md. Без запроса явно записать
      отсутствие полного прогона; запрос не подразумевается запуском серии.
- [x] При сбое проверок, hash mismatch, неизвестном файле или невозможности
      безопасного коммита остановить серию до следующего шага; оставить текущую
      задачу в todo, записать доказательства, блокер и точку возобновления.
- [x] При возобновлении перечитать индекс и фактические пути, проверить
      принятые коммиты и hashes; продолжить с первой незавершённой задачи.
- [x] Выполнить итоговый review, сверить оба checklist каждой задачи,
      обновить план/индекс, архивировать мастер-задачу и создать её коммит.

## Acceptance

- [x] Все десять дочерних задач приняты, архивированы и имеют отдельные коммиты.
- [x] Runtime/template/fixture JSON используют конечную структуру без config
      и двойных копий; manifest содержит 20 JSON и прежние 2 MDX entries.
- [x] Runtime hash audit подтверждает неизменность payload относительно
      свежих snapshots; MDX и редакторские данные сохранены.
- [x] Loaders, aliases, provisioning, mocks и diagnostics используют новые пути;
      чистый CI, runtime build и isolated fixture E2E работают.
- [x] Сохранены проверки задач 175–203, пользовательские сценарии и границы
      publication/consent; внешняя доставка замокана.
- [x] Все применимые проверки проходят; полный verification имеет результаты
      либо явно зафиксирован как не запрошенный и не выполненный.
- [x] План и индекс содержат фактическое состояние и рабочие ссылки;
      нет неразрешённых review findings и незавершённых дочерних checklist.

## Handoff

Завершена 2026-11-17. Дочерние задачи 161–170 приняты, перемещены в
`docs/codex/tasks/fixed/20261117/` и имеют отдельные локальные commits:
`1e28c5eb`, `4683bc19`, `353038d1`, `d4cfb3be`, `ad3152f9`, `b3194ee3`,
`54c6f56a`, `b278812a`, `72e10342`, `22db19d5`. Все десять дочерних
Execution/Acceptance checklists завершены. JSON в runtime/templates/site
fixtures находятся в конечной структуре, используют camelCase; страница
каталога проектов — `site/pages/projects.json`, список —
`site/lists/projects.json`. Manifest содержит 20 JSON и 2 MDX.

Перенесённые authored JSON/MDX и page payload сверялись с локальными
snapshots; task 169 подтвердил 30 SHA-256 совпадений. В task 170 Git blob
прежнего tracked `config/services.json` совпал с runtime `site/lists/services.json`
(`6bc6d2112e7ec5e3d097f26fdff88a0eedd32393`). Runtime файлы не включались в
commits; удаление старого tracked path остаётся в рабочей копии. Изменения
task 172 и 173 остались вне migration commits.

Итоговые проверки: полный Vitest — 139 файлов/881 тест; `test:content-catalog`,
`test:types`, `test:content-blocks`, `test:publication-policy`,
`verify:boundaries`, `verify:content`, `check` (0 errors), `build` (39 страниц),
Chromium E2E (22/22), изолированный CI provisioning без authored runtime,
Prettier для изменённых исходников и `git diff --check`. `verify:external`
пропущен согласно региональному ограничению. Полный verification pipeline из
`verification.md` не запрашивался после реализации и не запускался; эти
результаты не заявляются как полный pipeline. Известны прежние Zod deprecation
hint и Vite chunk warning >500 kB.

Node `26.13.1` и pnpm `10.7.0` доступны; pnpm `TEMP`/`TMP` направлялись в
ignored workspace output. Snapshots и isolated scratch evidence находятся в
ignored `output/task-204/`. Push, deploy и реальные доставки не выполнялись.
Node `26.13.1` и pnpm `10.7.0` доступны; для pnpm `TEMP`/`TMP`
направлялись в ignored workspace output. Baseline содержит 52 runtime
JSON/MDX; исходный audit и per-task snapshots сохранены. Runtime перемещается
только локально и не включается в commits. `data/content/config/services.json`
был tracked до серии и остаётся unstaged deletion после переноса; изменения
173 и ранее существовавшая правка 172 также не входят в migration commits.
`verify:external` пропущен по просьбе пользователя о региональной недоступности.
Полный verification не запрошен. Каждый перенос сверяется со свежим SHA-256;
Git revert без восстановления ignored runtime недостаточен.
