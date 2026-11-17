# 206 — Аудит src/content и исходные замеры

- **Executor:** Luna (`gpt-6-luna`), reasoning: `high`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `high`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `high`.

**Статус:** fixed. Создано и выполнено: 2026-11-17.
**Мастер:** [205](205-content-refactor-master.md).
**Зависимость:** нет; автоматическая реализация авторизована пользователем.

## Scope

- Инвентаризировать модули src/content, их экспорты, потребителей и тесты.
- Проследить связи src/types, src/validation, браузерных модулей,
  Astro config, content.config.ts и standalone-скриптов.
- Зафиксировать фактическую валидацию JSON и повторную обработку статей;
  отделить гипотезы от измеренных проблем.
- Текущая авторизация разрешает автоматическое выполнение серии 205–211;
  работа выполняется последовательно.
- Сохранять runtime в `data/content/`, fixtures в
  `tests/fixtures/content/`, не менять authored данные.

## Execution

Участник: primary координирует; делегирования нет. Исполнение, ревью и
проверки: Luna (`gpt-6-luna`), reasoning high.
Это планируемые роли. Навыки: `ponytail`; `astro-best-practices`
при изменении Astro-файлов; Context7 при решениях о framework API.

- [x] Прочитать [правила](../../../rules/index.md), workflow, code-style,
      architecture, content, testing и verification; сверить diff.
- [x] Проверить разрешение исполнения и завершение зависимости;
      перенести задачу в todo и обновить ссылки.
- [x] Составить карту зависимостей, включая site → services,
      pricing → projects и импорты из src/types/project.ts.
- [x] Записать версии Node/pnpm, команды и входной набор синтетических данных;
      выполнить минимум три сопоставимых замера сборки и загрузки статей.
- [x] Зафиксировать число render/parse-вызовов, длительность и разброс;
      одноразовые инструменты хранить только в output/content-refactor/.
- [x] Проверить исходные контракты: pnpm exec vitest run src/content,
      pnpm test:types и применимые standalone content-тесты.
- [x] Провести ревью diff, проверок и acceptance; устранить замечания.
- [x] Записать фактические модели/effort, файлы, команды, результаты
      и ограничения в Handoff; обновить мастер и индекс задач.
- [x] После принятия оформить отдельный локальный коммит;
      архивировать только по правилам workflow, без push.

## Acceptance

- [x] Карта охватывает каждый production-модуль src/content и его входы.
- [x] Базовые результаты воспроизводимы; исходные сбои и ограничения записаны.
- [x] Для 207 и 210 сформирован список проблем с файлами и доказательствами.
- [x] Проверки завершились успешно; оставшиеся блокеры явно записаны,
      незавершённые критерии не отмечены выполненными.

## Handoff

## Handoff

Выполнено 2026-11-17 основным агентом Luna (`gpt-6-luna`), reasoning high;
делегирования не было. Runtime и fixtures не изменялись. На текущем этапе
`src/content` содержит 29 production TS modules, их colocated tests и один
`mdx-blocks.mjs`; общее число файлов `src/content` с tests/config — 58 TS и
один MJS.

Модульная карта:

- JSON loaders: `about.ts`, `about-carousel.ts`, `action-rail.ts`,
  `business-solutions.ts`, `faq.ts`, `icons.ts`, `introduction.ts`,
  `legal.ts`, `offers.ts`, `order-inquiry.ts`, `ordering-process.ts`,
  `pricing.ts`, `production-and-guarantees.ts`, `project-catalog.ts`,
  `project-categories.ts`, `projects.ts`, `reviews.ts`, `services.ts`,
  `site.ts`. JSON входы находятся в runtime `data/content/site/{settings,
  sections,pages,lists}` и используют зеркальные unit fixtures.
- Article inputs: `services.ts` loads the service list and Astro
  `serviceArticles`; `projects.ts` loads the project list and `projectArticles`.
  `src/content.config.ts` points these collections at `data/content/articles`
  or the configured CI/E2E fixture root. `mdx-blocks.mjs` is registered by
  `astro.config.mjs`; `scripts/lib/compile-mdx.mjs` also imports it.
- Publication/pure helpers: `article-context.ts`, `block-publication.ts`,
  `content-block-labels.ts`, `faq-publication.ts`,
  `introduction-publication.ts`, `order-form-registry.ts`,
  `paragraph-links.ts`, `pricing-publication.ts`,
  `project-publication.ts`, `service-publication.ts`.
- Key composition callers: `site.ts` imports `visibleServices`; `pricing.ts`
  imports `projects`; service/project pages and sections consume their
  exports. Shared renderers consume block/article context and publication
  helpers. `src/types/project.ts` imports category values from content.
- Reverse layer imports confirmed: `src/validation/services.ts` imports
  `getPublicationIssues` and `isServicePublished`; `projects.ts` and
  `content-blocks.ts` import `block-publication`; `content-blocks.ts` imports
  `order-form-registry`. `src/types/project.ts` imports both value and type
  exports from `project-categories.ts`; project publication then imports the
  type module, creating a type/content/policy cycle.

Confirmed design targets for 207/209: move category domain values/types to an
independent domain contract; separate pure validation policies from loaders so
`src/validation` and `src/types` do not depend on `src/content`; remove the
duplicate `projectCatalogSchema` in `src/content/project-catalog.ts`, using
`src/validation/project-catalog.ts` as its owner. `about.ts`, `icons.ts`,
`legal.ts` and `site.ts` apply TypeScript shapes but do not run strict runtime
schemas; 209 must decide and test source-aware validation. Existing parsed
loaders use `parseContent` and retain strict schemas.

Optimization evidence for 210: `site.ts` imports `visibleServices`, causing
the service loader and MDX resolution to be in its static import graph;
`pricing.ts` imports `projects`, resolving that collection as well. The
runtime build corpus contains 20 JSON and 32 MDX files; deleting the prior
tracked `data/content/config/services.json` is a pre-existing user change and
was not modified. The remaining runtime path is
`data/content/site/lists/services.json`.

Environment: Node `26.13.1`, pnpm `10.7.0`. `TEMP` and `TMP` were set to
ignored `output/content-refactor/tmp` because the default user-profile temp
directory is inaccessible in this sandbox. Synthetic input was provisioned
once with `CI=true`, `CI_CONTENT_ROOT=output/content-refactor/ci-content`,
and `node scripts/prepare-ci-content.mjs`: 19 manifest JSON and 2 MDX files.
All three fixture builds reused this unchanged root and emitted 15 pages:
43,481.49 ms, 14,998.32 ms, and 85,876.67 ms. Direct fixture article compile
samples compiled the same 2 MDX inputs (6 calls total): 377.16 ms, 8.68 ms,
and 10.41 ms. Runtime-only supplementary `pnpm build` runs emitted 39 pages
in 108,147.03 ms, 65,203.67 ms, and 23,808.28 ms. Direct runtime compile
samples covered 32 articles (96 calls): 5,135 ms, 4,589.98 ms, and 2,181.56
ms. Large cold/warm variation means these measurements prove no speedup and
do not justify an optimization; use repeated comparable warm runs in 210.

Passing checks: `pnpm exec vitest run src/content` (30 files, 104 tests),
`pnpm test:types`, `pnpm test:content-catalog`, `pnpm test:content-blocks`,
`pnpm test:publication-policy`, `pnpm verify:boundaries`, and
`pnpm verify:content` (20 files). Vitest emitted Node experimental
`localStorage` warnings only. Full verification was not requested and was not
run. The one-off `article-baseline.mjs`, CI fixture build root, and temp data
are ignored under `output/content-refactor/`.

