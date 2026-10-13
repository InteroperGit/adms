# 081. Качество, SEO и публикация блоков

Status: fixed. Created: 2026-10-12. Completed: 2026-10-13.
Plan: [Универсальные блоки](../../plan/20261012_universal-content-blocks-plan.md).
Dependencies: 080.

## Исходное состояние после 078, до выполнения 081

Reviewed: 2026-10-13. Все пункты реализованы и проверены.

- После 080 loader проверяет authored catalog records и MDX напрямую;
  runtime legacy conversion удалена. 27 статей и evidence/media/crop metadata
  сравниваются с архивным source fixture в `test:project-articles`.
- `getVisibleProjects` исключает draft, но включает demo. После code review
  demo получает notice/noindex и исключается из sitemap. Проверить полную
  publication policy и approved published fixtures.
- Provenance проверяет source и пару approvedBy/approvedAt, но не содержит
  block status и не обеспечивает publication/media-rights gating.
- `test-content-block-fixtures.mjs` проверяет структуру примеров без вызова
  Zod; `verify-content-invariants.mjs` обходит только верхние JSON-файлы.
  Эти команды не доказывают валидацию MDX или approval policy.
- После 079 `test:service-articles` компилирует сервисные MDX и проверяет
  production Zod-схемы, сохранность данных и service publication gates.
  Расширить эту проверку на проекты и block-level policy; не дублировать
  уже проверенные сервисные schema cases.
- `test:project-articles` проверяет реальные production schemas, dimensions,
  отсутствие повторов, lead photos, form ownership и built demo/media URLs.
  080 проверила DOM parity, category gates и published form identity/consent
  на test-only routes; расширенная browser acceptance остаётся в 082.
- `PUBLIC_SITE_URL` остаётся условием canonical и непустого sitemap.
  Проверять настроенный и ненастроенный origin отдельными fixtures, не
  задавая вымышленный production URL.

## Работы

- [x] Проверить HTML для всех block types, headings, links, alt и footnotes.
- [x] Проверить canonical, noindex, sitemap и отсутствие draft content.
- [x] Проверить media rights, dimensions, lazy/eager loading и layout shifts.
- [x] Измерить размер HTML/client JS и не добавлять ненужную гидратацию.
- [x] Документировать правила редактирования JSON и добавления новых blocks.
- [x] Документировать основной MDX authoring flow, metadata schema,
  разрешённые компоненты, условия JSON fallback и publication review.
- [x] Добавить реальную schema validation для MDX/JSON и негативные fixtures:
  legacy fields, duplicate ids, footnote targets, form tuples, media rights
  и неполные approvals. Проверять вложенные collections и authored records.
- [x] Проверить build assets: ссылки `/src/assets/...` не должны оставаться
  неразрешёнными URL. Проверить оптимизированные варианты и загрузку только
  первого подходящего lead image eager; остальные galleries/images lazy.
- [x] Проверить русский язык headings, form labels, chart/table fallbacks и
  gallery accessible names на страницах с `lang="ru"`.
- [x] Зафиксировать baseline и результат для HTML/client JS, в том числе
  загрузку ECharts на страницах без chart. Учесть текущий build warning
  о chunk больше 500 kB; записать решение и результат измерений.

## Приёмка

- [x] `astro check`, `astro build`, content validation и style checks проходят.
- [x] Нет новых console/page errors или broken internal links.
- [x] Ограничения и известные исключения явно записаны.
## Block-level publication checks

- [x] Define and validate draft/demo/approval/media-rights rules for each
  applicable content block and its provenance; extend the shared contract
  where status is needed instead of assuming provenance already supplies it.
- [x] Ensure draft blocks are not published, demo status is represented
  accurately, and publication requires applicable approval and media rights.
- [x] Cover these rules with schema fixtures and rendered-page checks,
  including project/service noindex, sitemap membership and demo notices.

## Результат и проверка

Реализована общая block-level publication policy для схем, MDX/JSON,
рендера, noindex/sitemap и форм. Draft-блоки и фотографии скрываются;
demo явно обозначается и исключает индексацию. Approved контент требует
подтверждения, медиа — записи о правах. Существующие неклассифицированные
медиа на demo-страницах оставлены совместимыми без вымышленных approvals.

Проверки: `pnpm check`, `pnpm build`, реальные schema/compiler tests для
контентных блоков, проектов, сервисов и publication policy, recursive content
invariants, проверки HTML/SEO/ресурсов и Playwright на 375/1366 px.
Проверены 38 production и 58 test HTML-страниц, canonical с origin и без,
noindex/sitemap, MDX/JSON DOM parity, все десять blocks, draft exclusion,
gallery/forms, no-JS fallbacks и отложенная загрузка ECharts. Console/page
errors: 0; контролируемый CLS: 0; gallery width: 75%, центрирование точное.

Проведены три самостоятельных круга code review с исправлениями и повторной
проверкой. Исправлены approval/media gates, eager thumbnails, русские названия,
focus handling, production-форма в смешанном demo-потоке, цепочки footnotes,
мутация кеша MDX-фикстур и lifecycle графиков для Back/Forward cache.

Отчёт, baseline/результат HTML/client JS и известные исключения:
[Content block quality](../../../site/content-block-quality.md).
Authoring/publication flow: [Articles](../../../site/articles.md).

Известные ограничения: deferred ECharts chunk 553377 B (186213 B gzip)
по-прежнему вызывает warning >500 kB; warning не скрыт, runtime грузится
только для видимого chart. Сохранился прежний Zod deprecation hint.
Внешние ресурсы подменяются в детерминированном browser test; проверка
фактических legal evidence, полевых метрик, speech/touch/zoom и production
origin остаётся отдельной приёмкой, как описано в отчёте.
