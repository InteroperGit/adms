# Миграция структуры контента сайта

Date: 2026-11-14. Updated: 2026-11-17. Status: in progress; baseline complete.

Мастер автоматической серии:
[204](../todo/204-automate-content-migration-161-170.md).
Создание мастера не запускает миграцию.

## Цель

Разделить плоский `config/` на структуру, отражающую назначение данных, и
перенести runtime-контент, шаблоны, тестовые fixtures, loaders, скрипты,
компоненты и проверки без простоя сайта. Переход выполняется серией небольших
задач. После каждой задачи сборка, валидация и synthetic/E2E-набор должны
оставаться работоспособными с полным валидным набором данных.

Согласованная конечная структура:

```text
data/content/
  articles/                  # MDX; каталог уже существует
  site/
    settings/                # общие настройки и иконки сайта
    sections/                # данные отдельных секций
    pages/                   # данные конкретных страниц и legal
    lists/                   # повторяемые каталоги и списки элементов

data/templates/
  articles/
  site/
    settings/
    sections/
    pages/
    lists/
```

Site fixtures — `tests/fixtures/content/site/`. Новые JSON лежат прямо
в его `settings/`, `sections/`, `pages/` и `lists/`, без вложенного site.
Runtime `site/*` соответствует fixtures `site/*`, а переходный `config/*` —
fixtures `site/config/*` относительно `tests/fixtures/content/`.
Article fixtures остаются в
`tests/fixtures/content/articles/`.

## Распределение файлов

| Конечный каталог | Файлы |
| --- | --- |
| `site/settings/` | `site.json`, `icons.json` |
| `site/sections/` | `about.json`, `about-carousel.json`, `action-rail.json`, `business-solutions.json`, `faq.json`, `introduction.json`, `offers.json`, `ordering-process.json`, `pricing.json`, `production-and-guarantees.json` |
| `site/pages/` | `legal/privacy-policy.json`, `legal/terms-of-use.json`, `project-catalog.json`, `order-inquiry.json` |
| `site/lists/` | `services.json`, `projects.json`, `reviews.json`, `project-categories.json` |
| `articles/` | существующие MDX без переименования и изменения содержимого |

`sections/` означает данные, которые описывают секцию и её presentation/content
configuration, даже если внутри есть `items` (например, offers). `lists/`
зарезервирован для самостоятельных каталогов, на которые ссылаются страницы,
карточки или publication policy. Новые каталоги вроде `media/` не вводятся.

## Границы и инварианты

- Runtime JSON остаётся внешним содержимым в `data/content/`; его нельзя
  коммитить, заменять тестовыми значениями или менять поля в рамках миграции.
  Перед каждой группой переносов сохраняются список файлов и SHA-256; перенос
  должен быть copy/rename с отказом от перезаписи существующего файла.
- `data/templates/` остаётся безопасным versioned starter-каталогом. Manifest
  сохраняет `schemaVersion` и 2 MDX-записи. Задача 162 добавляет недостающий
  безопасный action-rail template: итог — 20 JSON. Далее меняются пути.
- `tests/fixtures/content/site/` остаётся единственным versioned synthetic
  JSON-источником. Runtime и fixtures не смешиваются.
- Публичные exports `src/content/*.ts` и их API для страниц и компонентов
  сохраняются. Изменяются import paths и source-aware diagnostic paths, а не
  доменные поля, схемы или publication policy.
- Компоненты не получают прямой доступ к JSON. Они продолжают импортировать
  `@/content/*`; компонентные изменения ограничиваются обновлением найденных
  прямых путей и проверкой существующих render contracts.
- До финального шага допускается только смешанная переходная раскладка:
  перенесённые записи лежат в `site/`, ещё не перенесённые — в `config/`.
  Дублирование одного файла под обоими путями запрещено.
- Исторические документы в `docs/codex/tasks/fixed/` не переписываются;
  поддерживаемые README, scripts и актуальные планы получают новые пути.

## Последовательность задач

Серия запущена через задачу
[204](../todo/204-automate-content-migration-161-170.md).
Задачи 161–164 приняты; следующая — остальные homepage sections в задаче 165.

- [161 — Исходное состояние миграции](../fixed/20261117/161-content-migration-baseline.md)
  — MIG-000.
- [162 — Подготовка tooling и полных шаблонов](../fixed/20261117/162-content-migration-tooling.md) — MIG-001.
- [163 — Перенос общих настроек](../fixed/20261117/163-content-migration-settings.md) — MIG-002.
- [164 — Перенос базовых секций](../fixed/20261117/164-content-migration-primary-sections.md) — MIG-003.
- [165 — Перенос остальных секций главной](../backlog/165-content-migration-home-sections.md) — MIG-004.
- [166 — Перенос цен и гарантий](../backlog/166-content-migration-commercial-sections.md) — MIG-005.
- [167 — Перенос каталогов услуг и проектов](../backlog/167-content-migration-primary-lists.md) — MIG-006.
- [168 — Перенос отзывов и категорий](../backlog/168-content-migration-supporting-lists.md) — MIG-007.
- [169 — Перенос данных страниц и формы](../backlog/169-content-migration-pages.md) — MIG-008.
- [170 — Удаление config и итоговая приёмка](../backlog/170-content-migration-remove-config.md) — MIG-009.

Выполнять строго по порядку. Каждая задача должна заканчиваться отдельным
коммитом/результатом, чтобы при остановке оставалась рабочая смешанная схема.

### MIG-000 — baseline и журнал миграции

**Цель:** зафиксировать исходное состояние до первого перемещения.

**Изменения:**

- составить таблицу старый путь → конечный путь для всех 20 runtime JSON;
- сохранить в ignored `output/content-migration/` inventory и SHA-256 runtime
  файлов;
- подтвердить отсутствие незавершённых изменений в `data/content/` и наличие
  всех текущих template/fixture файлов;
- не менять production source и данные.

**Приёмка:** baseline `pnpm verify:content`, `pnpm check`, `pnpm build`,
`pnpm test:content-catalog`, `pnpm test:publication-policy`; inventory можно
использовать для сравнения после каждой группы.

### MIG-001 — переходные правила каталога и fixtures

**Цель:** сделать tooling готовым к смешанному состоянию `config/` + `site/`.

**Изменения:**

- обновить `scripts/verify-content-boundaries.mjs`, чтобы на переходных шагах
  принимать только `config/**` и `site/**`, но сохранять denylist, уникальность
  outputs, количество записей и требования к starter articles;
- обновить CI/E2E provisioning: manifest output `config/*` читать из
  `tests/fixtures/content/site/config/*`, а `site/*` из
  `tests/fixtures/content/site/*`; записывать по runtime output без изменений;
- не копировать весь fixture root: scenario/type-contract fixtures
  не должны попадать в runtime; отказывать при непустом destination;
- добавить безопасный action-rail template и manifest entry;
- подготовить aliases для обоих путей, используя только synthetic fixtures;
- изменить fixture `scripts/test-content-catalog.mjs` на вложенный пример
  `site/settings/site.json` и добавить проверку сохранения nested output;
- проверить `data/templates/manifest.json`, README и генератор на root-relative
  пути без специальной логики для `config`.

**Состояние после задачи:** production imports ещё используют старые пути,
данные не перемещены; сайт работает как раньше.

**Приёмка:** `pnpm test:content-catalog`, `pnpm verify:boundaries`,
`pnpm check:style`, `pnpm check`, `pnpm build`.

### MIG-002 — settings

**Перенести:** `site.json`, `icons.json` в `site/settings/` одновременно в
`data/content/` и `data/templates/`; в fixtures конечные файлы лежат
в `tests/fixtures/content/site/settings/`.

**Обновить:** `src/content/site.ts`, `src/content/icons.ts`,
`vitest.config.ts`, `tsconfig.type-contracts.json`, прямые mocks/imports в
тестах, `scripts/verify-external-assets.mjs` и все source-aware paths.

**Приёмка:** hashes и parsed JSON совпадают с baseline; `pnpm test:types`,
`pnpm verify:content`, `pnpm verify:boundaries`, affected component/integration
tests, `pnpm check`, `pnpm build`.

### MIG-003 — базовые sections

**Перенести:** `about.json`, `about-carousel.json`, `introduction.json`,
`action-rail.json` в `site/sections/` во всех трёх JSON-источниках.

**Обновить:** loaders `src/content/about*.ts`,
`src/content/introduction.ts`, `src/content/action-rail.ts`, их diagnostic
paths, asset list в `scripts/verify-external-assets.mjs`, aliases/mocks и
affected section component tests. Публичные exports для `About`, `Introduction`
и `ActionRail` не менять.

**Приёмка:** соответствующие `src/content` и `src/components/sections` suites,
`pnpm verify:content`, `pnpm test:types`, `pnpm check`, `pnpm build`.

### MIG-004 — остальные homepage sections

**Перенести:** `business-solutions.json`, `faq.json`, `offers.json`,
`ordering-process.json` в `site/sections/`.

**Обновить:** соответствующие loaders, publication tests/helpers, E2E override
path matching, asset verification и section component tests. Сохранить
editorial order, defaults и disabled/draft semantics.

**Приёмка:** `pnpm test -- src/content src/components/sections`,
`pnpm test:types`, `pnpm verify:content`, `pnpm check`, `pnpm build` и
`pnpm test:e2e -- --project=chromium` для homepage/section smoke paths.

### MIG-005 — pricing и production sections

**Перенести:** `pricing.json`, `production-and-guarantees.json` в
`site/sections/`.

**Обновить:** `src/content/pricing.ts`,
`src/content/production-and-guarantees.ts`, их validators' diagnostic paths,
pricing/publication tests, `PricingExamples` и
`ProductionAndGuarantees` render tests. Проверить, что pricing по-прежнему
ссылается только на опубликованные project routes и не меняет формат цен.

**Приёмка:** focused validation/publication suites, `pnpm test:types`,
`pnpm verify:content`, `pnpm check`, `pnpm build`.

### MIG-006 — основные lists

**Перенести:** `services.json`, `projects.json` в `site/lists/`.

**Обновить:** `src/content/services.ts`, `src/content/projects.ts`,
`scripts/e2e-server.mjs`, `scripts/test-publication-policy.mjs`,
`scripts/verify-external-assets.mjs`, path aliases/mocks и route/integration
tests. MDX остаётся в `articles/services` и `articles/projects`; проверить
совпадение IDs, `article.entry`, href и publication gates.

**Приёмка:** service/project validation and publication suites,
`pnpm test:publication-policy`, `pnpm test:types`,
`pnpm verify:content`, `pnpm check`, `pnpm build`, crawler and catalog
integration tests, затем focused Chromium E2E для services/projects.

### MIG-007 — supporting lists

**Перенести:** `reviews.json`, `project-categories.json` в `site/lists/`.

**Обновить:** `src/content/reviews.ts`, `src/content/project-categories.ts`,
category mocks/type fixtures, `ProjectCard`/catalog component tests и asset
verification. Сохранить уникальность slugs, цвета, editorial order и fallback
для неизвестной категории.

**Приёмка:** category/review/content-card suites, `pnpm test:types`,
`pnpm verify:content`, `pnpm check`, `pnpm build`.

### MIG-008 — page data

**Перенести:** `legal/privacy-policy.json`, `legal/terms-of-use.json`,
`project-catalog.json`, `order-inquiry.json` в `site/pages/`.

**Обновить:** `src/content/legal.ts`, `src/content/project-catalog.ts`,
`src/content/order-inquiry.ts`, `scripts/e2e-server.mjs` для inquiry override,
все page/form tests, type fixtures и source-aware errors. Маршруты и exports
`privacyPolicy`, `termsOfUse`, `projectCatalogSettings`, `orderInquiry`
сохраняются; legal paths остаются вложенными под `pages/legal/`.

**Приёмка:** legal/catalog/inquiry unit and integration suites,
`pnpm test:types`, `pnpm verify:content`, `pnpm check`, `pnpm build`, focused
E2E for catalog navigation and inquiry validation.

### MIG-009 — удаление legacy `config/` и финальные gates

**Предусловие:** все записи manifest и все три JSON-источника уже находятся под
`site/**`; `rg` не находит рабочих ссылок на старые paths.

**Изменения:**

- физически удалить пустые runtime/template/fixture каталоги `config/`;
- сделать `verify-content-boundaries.mjs` строгим: любой JSON template вне
  `site/` (кроме articles/MDX) становится ошибкой;
- удалить переходную ветку в checker и устаревшие aliases/path cases;
- обновить `data/templates/manifest.json`, `data/templates/README.md`,
  maintained docs и scripts с финальными путями;
- проверить, что `scripts/e2e.config.mjs` по-прежнему подменяет корень
  `@/data/content`, а `content.config.ts` продолжает загружать только
  `articles/**`;
- повторить inventory/hash audit и убедиться, что содержимое JSON не изменено.

**Приёмка:** focused checks, boundary/content audit и runtime build.
Полный verification только по явному запросу пользователя после реализации;
без него записать ограничение. При таком запросе выполнить набор из `docs/codex/rules/verification.md` в указанном
порядке, включая `pnpm format:check`, `pnpm lint`, `pnpm verify:boundaries`,
`pnpm verify:content`, `pnpm check`, `pnpm test:types`,
`pnpm verify:component-tests`, `pnpm test`, coverage gates, `pnpm build`,
`pnpm verify:quality` и `pnpm test:e2e`. Дополнительно выполнить
`rg -n "data/content/config|data/templates/config|site/config|config/"`
с исключением исторических task records и убедиться, что остаются только
обоснованные исторические ссылки.

## Матрица затрагиваемых слоёв

- **Данные:** `data/content/site/**`, `data/templates/site/**`,
  `tests/fixtures/content/site/**`; только перемещение и manifest paths.
- **Loaders/exports:** все `src/content/*.ts`; имена экспортов и схемы не
  меняются.
- **Types/validation:** `src/types/` и `src/validation/` не редизайнить;
  менять только embedded source paths в diagnostics, если они участвуют в
  проверках.
- **Компоненты/pages:** сохраняют импорты `@/content/*`; проверить и менять
  только найденные прямые JSON imports, а затем прогнать colocated tests,
  integration и affected E2E.
- **Tooling:** `vitest.config.ts`, `tsconfig.type-contracts.json`,
  `scripts/prepare-ci-content.mjs`, `scripts/e2e-server.mjs`,
  `scripts/verify-content-boundaries.mjs`, `scripts/verify-external-assets.mjs`,
  `scripts/test-content-catalog.mjs`, `scripts/test-publication-policy.mjs`.
- **Документация:** `data/templates/README.md` и поддерживаемые ссылки;
  завершённые task records не переписывать.

## Правила выполнения задач

- Исполнитель: основной агент проекта; делегация не нужна, потому что все шаги
  меняют общий manifest, aliases и один content boundary.
- Модель: Luna medium для механических переносов и focused checks; Sol medium
  для MIG-001, MIG-006 и MIG-009, где одновременно меняются cross-file
  contracts, publication tooling и финальные gates.
- Перед каждым переносом: проверить зависимости, сделать dry-run inventory,
  затем выполнить write-операцию только после успешной проверки источников.
- После каждой принятой задачи: отдельный локальный коммит до следующей.
- После каждой задачи: `git diff --check`, просмотр полного diff, `rg` старых
  путей в изменённых файлах, focused checks из задачи и как минимум `pnpm
  build`. Не считать E2E или build заменой `verify:content`/`verify:boundaries`.
- Не добавлять production compatibility aliases, которые скрывают ошибку
  классификации. В переходный период совместимость достигается смешанной
  раскладкой разных файлов, а не дублированием одного файла.
- Не менять runtime copy, approval, IDs, ordering, media URLs, article format
  или publication status. Любое расхождение hash/parsed output останавливает
  текущую задачу.

## Готовность плана

- [x] Для каждой MIG-задачи создан отдельный файл в
  `docs/codex/tasks/backlog/` с scope, зависимостями и acceptance commands.
- [ ] После выполнения задачи её task file архивирован в
  `docs/codex/tasks/fixed/yyyyMMdd/`, а `.codex/TASKS.md` обновлён.
- [ ] После MIG-009 в рабочем runtime/template/fixture дереве нет `config/`;
  manifest, CI provisioning, E2E, loaders, tests и документация используют
  одну конечную структуру.
