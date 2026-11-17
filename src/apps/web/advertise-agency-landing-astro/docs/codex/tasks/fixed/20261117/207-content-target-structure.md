# 207 — Целевая структура и границы content

- **Executor:** Luna (`gpt-6-luna`), reasoning: `high`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `high`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `high`.

**Статус:** fixed. Создано и выполнено: 2026-11-17.
**Мастер:** [205](205-content-refactor-master.md).
**Зависимость:** [206](206-content-audit-baseline.md),
принята до начала этой задачи.

## Scope

- Спроектировать минимальное разделение загрузчиков, чистых политик,
  MDX-компиляции и доменных контрактов без изменения runtime-поведения.
- Определить размещение каждой существующей пары исходник/тест;
  использовать src/types и src/validation по их назначению.
- Не закреплять новую иерархию каталогов без карты зависимостей из 206;
  не вводить общий barrel, который загружает все статьи.
- Текущая авторизация разрешает автоматическое выполнение серии 205–211;
  задача начинается после принятия 206.
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
- [x] По карте 206 записать таблицу старый путь → новый путь для всех модулей.
- [x] Установить владельцев политик block-publication, service-publication,
      order-form-registry и типов категорий без обратных импортов загрузчиков.
- [x] Описать обновления alias/relative imports, mocks, fixture imports,
      scripts, Astro config и проверок покрытия.
- [x] Проверить план на циклы и на зависимость браузера от серверных модулей;
      проверить Markdown-ссылки и форматирование.
- [x] Провести ревью diff, проверок и acceptance; устранить замечания.
- [x] Записать фактические модели/effort, файлы, команды, результаты
      и ограничения в Handoff; обновить мастер и индекс задач.
- [x] После принятия оформить отдельный локальный коммит;
      архивировать только по правилам workflow, без push.

## Acceptance

- [x] Для каждого модуля определён путь либо обосновано сохранение текущего.
- [x] План устраняет обратные зависимости слоёв и сохраняет публичные контракты.
- [x] Задачи 208–210 получили однозначную карту реализации и проверок.
- [x] Проверки завершились успешно; оставшиеся блокеры явно записаны,
      незавершённые критерии не отмечены выполненными.

## Handoff

## Handoff

Выполнено 2026-11-17 основным агентом Luna (`gpt-6-luna`), reasoning high;
делегирования нет. Задача задаёт структуру, но не меняет код или runtime.

Целевая карта (каждый colocated test остаётся рядом с исходником):

| Текущий модуль | Целевой путь |
| --- | --- |
| `src/content/about-carousel.ts` | без изменений |
| `src/content/about.ts` | без изменений |
| `src/content/action-rail.ts` | без изменений |
| `src/content/business-solutions.ts` | без изменений |
| `src/content/faq.ts` | без изменений |
| `src/content/icons.ts` | без изменений |
| `src/content/introduction.ts` | без изменений |
| `src/content/legal.ts` | без изменений |
| `src/content/offers.ts` | без изменений |
| `src/content/order-inquiry.ts` | без изменений |
| `src/content/ordering-process.ts` | без изменений |
| `src/content/pricing.ts` | без изменений |
| `src/content/production-and-guarantees.ts` | без изменений |
| `src/content/project-catalog.ts` | без изменений |
| `src/content/project-categories.ts` | без изменений |
| `src/content/projects.ts` | без изменений |
| `src/content/reviews.ts` | без изменений |
| `src/content/services.ts` | без изменений |
| `src/content/site.ts` | без изменений |
| `src/content/content-block-labels.ts` | без изменений |
| `src/content/paragraph-links.ts` | без изменений |
| `src/content/mdx-blocks.mjs` | без изменений |
| `src/content/article-context.ts` | `src/validation/policies/article-context.ts` |
| `src/content/block-publication.ts` | `src/validation/policies/block-publication.ts` |
| `src/content/faq-publication.ts` | `src/validation/policies/faq-publication.ts` |
| `src/content/introduction-publication.ts` | `src/validation/policies/introduction-publication.ts` |
| `src/content/order-form-registry.ts` | `src/validation/policies/order-form-registry.ts` |
| `src/content/pricing-publication.ts` | `src/validation/policies/pricing-publication.ts` |
| `src/content/project-publication.ts` | `src/validation/policies/project-publication.ts` |
| `src/content/service-publication.ts` | `src/validation/policies/service-publication.ts` |

Move each policy test with its source. Keep `ProjectCategory` and
`ProjectCategoryConfig` in `src/types/project.ts`; the type-contract fixture
proves `ProjectCategory` is `string`, so this preserves its current type.
The JSON-backed category loader remains in `src/content/project-categories.ts`
and owns `projectCategories`/`getProjectCategory` runtime exports. Remove their
runtime reexports from `src/types/project.ts` and `src/types/index.ts`; update
callers and the `@/types/project` type fixture to import values from the loader.
Runtime export names and values on the content loader remain unchanged.

Update moved-policy imports in `src/validation/content-blocks.ts`,
`src/validation/projects.ts`, `src/validation/services.ts`, content loaders,
Astro renderers, tests and dynamic imports in
`scripts/test-publication-policy.mjs`. Keep `@` aliases unchanged. Keep
`astro.config.mjs`, `src/content.config.ts`, `scripts/lib/compile-mdx.mjs` and
the `mdx-blocks.mjs` import path unchanged; both Astro and standalone compiler
use that module. Do not add a barrel or loader compatibility reexports. Run
affected colocated suites, `test:types`, `verify:boundaries`, `check`, all three
standalone content checks and a fixture build.

For 209, the duplicate schema is `src/content/project-catalog.ts` versus
`src/validation/project-catalog.ts`. `about.ts`, `icons.ts`, `legal.ts` and
`site.ts` type their JSON without runtime schema parsing. Validators currently
import publication helpers from content. For 210, `site.ts` imports
`visibleServices` and `pricing.ts` imports `projects`; 206 timing samples show
high cold/warm variation, with no evidence yet that an optimization is useful.

Correction to wording in 206: the imports were reverse layer dependencies,
not a closed module cycle. Static graph review found no current import cycle;
moving policies removes those back-edges. `pnpm exec prettier --check` passed
for the task record and related task files; relative Markdown links and
`git diff --check` were reviewed. No application tests apply to this
documentation-only plan. Full verification was not requested.

