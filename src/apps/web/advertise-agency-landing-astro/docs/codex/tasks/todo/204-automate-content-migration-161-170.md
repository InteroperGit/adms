# 204 — Автоматическое выполнение миграции контента 161–170

- **Coordinator:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Executor:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `medium`.

Дата: 2026-11-16. Статус: todo. Выполнение начато.

План: [миграция контента](../plan/20261114_site-content-structure-migration-plan.md).

## Scope

- Выполнить весь список 161–170 последовательно, сохраняя рабочий сайт
  после каждой задачи и все ограничения дочерних задач.
- Перенести JSON из config в site/settings, sections, pages и lists.
- Fixtures хранить в `tests/fixtures/content/site/{settings,sections,pages,lists}`
  без вложенного site; legacy fixtures временно остаются в site/config.
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
- [x] Выполнить [161 — baseline](../fixed/20261117/161-content-migration-baseline.md).
- [x] Выполнить [162 — tooling](../fixed/20261117/162-content-migration-tooling.md).
- [x] Выполнить [163 — settings](../fixed/20261117/163-content-migration-settings.md).
- [ ] Выполнить [164 — primary sections](../backlog/164-content-migration-primary-sections.md).
- [ ] Выполнить [165 — home sections](../backlog/165-content-migration-home-sections.md).
- [ ] Выполнить [166 — commercial sections](../backlog/166-content-migration-commercial-sections.md).
- [ ] Выполнить [167 — primary lists](../backlog/167-content-migration-primary-lists.md).
- [ ] Выполнить [168 — supporting lists](../backlog/168-content-migration-supporting-lists.md).
- [ ] Выполнить [169 — pages](../backlog/169-content-migration-pages.md).
- [ ] Выполнить [170 — cleanup](../backlog/170-content-migration-remove-config.md).
- [ ] Для каждого шага до реализации перенести его backlog → todo;
      после выполнения всех Execution/Acceptance, focused checks и review
      перенести в fixed/yyyyMMdd по Europe/Moscow и исправить входящие ссылки,
      план и `.codex/TASKS.md`.
- [ ] После приёмки каждого шага создать отдельный локальный коммит
      с его изменениями и task records; только затем начинать следующий.
- [ ] Перед каждым переносом сохранить свежие backup и SHA-256 в ignored
      `output/content-migration/`; проверить пути и отказаться от перезаписи.
- [x] В 162 обеспечить отказ CI provisioning при непустом destination;
      покрыть mixed layout, неизвестные пути, duplicate outputs и отсутствие
      runtime fallback. Проверять provisioning в изолированном checkout.
- [ ] Обновлять существующие colocated tests loaders и компонентов,
      type-contract fixtures, mocks и assertions вместе с каждым переносом.
- [ ] Использовать актуальные integration suites:
      `shell-home-legal`, `catalog`, `articles-content`, `crawler-routes`,
      `inquiry` в `tests/integration/`; E2E находятся в доменных каталогах
      `tests/e2e/{navigation,content,inquiry,media,preferences}/`.
- [ ] После каждого шага выполнить затронутые focused tests, boundary/content
      checks, content regression scripts и runtime build; не ослаблять
      coverage, a11y, assertions, schemas, isolation или publication gates.
- [ ] Полный verification выполнить только при явном запросе пользователя
      после реализации, в порядке verification.md. Без запроса явно записать
      отсутствие полного прогона; запрос не подразумевается запуском серии.
- [ ] При сбое проверок, hash mismatch, неизвестном файле или невозможности
      безопасного коммита остановить серию до следующего шага; оставить текущую
      задачу в todo, записать доказательства, блокер и точку возобновления.
- [ ] При возобновлении перечитать индекс и фактические пути, проверить
      принятые коммиты и hashes; продолжить с первой незавершённой задачи.
- [ ] Выполнить итоговый review, сверить оба checklist каждой задачи,
      обновить план/индекс, архивировать мастер-задачу и создать её коммит.

## Acceptance

- [ ] Все десять дочерних задач приняты, архивированы и имеют отдельные коммиты.
- [ ] Runtime/template/fixture JSON используют конечную структуру без config
      и двойных копий; manifest содержит 20 JSON и прежние 2 MDX entries.
- [ ] Runtime hash audit подтверждает неизменность payload относительно
      свежих snapshots; MDX и редакторские данные сохранены.
- [ ] Loaders, aliases, provisioning, mocks и diagnostics используют новые пути;
      чистый CI, runtime build и isolated fixture E2E работают.
- [ ] Сохранены проверки задач 175–203, пользовательские сценарии и границы
      publication/consent; внешняя доставка замокана.
- [ ] Все применимые проверки проходят; полный verification имеет результаты
      либо явно зафиксирован как не запрошенный и не выполненный.
- [ ] План и индекс содержат фактическое состояние и рабочие ссылки;
      нет неразрешённых review findings и незавершённых дочерних checklist.

## Handoff

Создана 2026-11-16. Серия активна; 161–163 приняты и архивированы в отдельных
локальных commits. 162 выполнила tooling для смешанных content paths; CI/E2E
работают на isolated fixtures без перезаписи authored runtime. Full verification
остаётся до явного запроса после серии.
Node `26.13.1` и pnpm `10.7.0` доступны; для pnpm `TEMP`/`TMP`
направлялись в ignored workspace output. Baseline содержит 52 runtime
JSON/MDX; все SHA-256 совпадают со snapshot. Content/boundary, loader,
integration, build и focused Chromium E2E gates прошли. Один запуск
`verify:external` дал 403 для части `picsum.photos` и timeout для `t.me`;
по указанию пользователя внешнюю доступность из РФ далее не проверять.
Runtime не менялся; task 162 добавила synthetic fixtures и templates. Полный
verification не запрошен. Перед каждым переносом сохранять свежие hashes.
Откат требует согласованного возврата исходников и ignored runtime из свежей
копии; одного Git revert недостаточно.
