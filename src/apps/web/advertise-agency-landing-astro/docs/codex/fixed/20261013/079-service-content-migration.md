# 079. Миграция данных услуг на блоки

Status: fixed. Created: 2026-10-12. Completed: 2026-10-13.
Plan: [Универсальные блоки](../../plan/20261012_universal-content-blocks-plan.md).
Dependencies: 075, 076, 077.

## Выполнено

- [x] Все пять статей перенесены в MDX collection `serviceArticles`.
- [x] Созданы strict frontmatter schema, Markdown/block compiler, allowlist
  компонентов и mapping к `ContentBlocks` без произвольного JSX/imports.
- [x] Общий контракт MDX/JSON требует SEO metadata, approval и непустой
  `content`. JSON fallback требует явную причину; текущим услугам он не нужен.
- [x] Удалены `article.lead`, `article.sections`, `article.inquiry` из данных,
  типов, схем и потребителей. Legacy fields отвергаются строгой схемой.
- [x] Сохранены slug, href, demoNotice, approvals, catalogue media/focal data,
  article text/headings/list items, image source/rights и dimensions.
- [x] Image provenance не получает вымышленные approval records.
- [x] Order-form выбирается по service tuple; проверяется соответствие
  category/context статье. Demo остаётся на general inquiry fallback.
- [x] `ServiceArticle` обновлён до validated stream через compatibility
  adapter для существующих image/form API, без legacy article reads.
- [x] Добавлены historical fixture и реальные MDX/Zod/publication/build tests
  для всех статей, минимальной статьи, fallback, отсутствующего image,
  demo/withheld/published и неверных component/form/provenance inputs.
- [x] Обновлены content docs и оставшиеся задачи 080–082.

## Проверки

- `astro check`: нет ошибок; две существующие hints не относятся к миграции.
- `astro build`: все 38 маршрутов, включая пять исходных service URLs.
- `node scripts/test-service-articles.mjs`: компиляция и импорт MDX modules,
  сохранность данных, strict schemas, publication gates и built HTML/assets.
- Content invariants, content-block fixtures и 80-column style checks.

## Граница завершения

Данные и контракт завершены. Compatibility adapter сохраняет `ServiceVisual`
и `LedLettersForm`, включая прямой anchor и serviceId. Унификация adapters
для проектов и услуг и полная rendered MDX/JSON parity принадлежат
[080](080-universal-article-pages.md). Block-level publication policy
принадлежит [081](../../todo/081-content-block-quality-seo.md), browser/visual
acceptance — [082](../../todo/082-content-blocks-playwright-acceptance.md).

Основной MDX формат поддерживает plain paragraphs, H2, flat lists и
allowlisted JSON-valued components. Rich inline markup, nested/task lists и
произвольный JSX не поддерживаются и вызывают ошибку. См.
[service authoring](../../../site/service-articles.md).

Существующий warning о client chunk больше 500 kB остаётся для измерения в 081.
