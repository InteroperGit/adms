# Универсальные блоки для статей проектов и услуг

Date: 2026-10-12. Status: fixed. Completed: 2026-10-13.

Task 079 completed on 2026-10-13:
[service MDX migration](../fixed/20261013/079-service-content-migration.md).
Service/project migrations, shared pages, quality/publication and final browser
acceptance are complete in tasks 078–082. Reproduction and controlled-test
limitations are recorded in the linked acceptance report below.

## Цель

Перевести страницы проектов и услуг на единый поток типизированных
контентных блоков. Страница отвечает за маршрут, метаданные и композицию,
а универсальный рендерер выводит блоки в исходном порядке.

Основной формат авторинга — MDX: он позволяет пользователю писать обычный
Markdown и вставлять разрешённые Astro-компоненты блоков. JSON сохраняется
как строгий fallback для данных, которые удобнее валидировать машинно или
которые нельзя безопасно выразить в MDX.

Поддерживаемые блоки первой версии:

- `paragraph` — заголовок, абзацы и необязательный идентификатор;
- `table` — подпись, колонки и типизированные строки;
- `chart` — заголовок, подпись, единицы и статические серии данных;
- `image` — одно изображение с alt, подписью и provenance;
- `image-gallery` — упорядоченный набор изображений с общей подписью и
  открытием полноэкранной галереи;
- `order-form` — форма, выбранная по категории и контексту страницы;
- `quote` — цитата, автор и источник;
- `footnote` — примечание, связанное с блоком или текстовым маркером.
- `ordered-list` — нумерованный список с необязательным заголовком;
- `unordered-list` — маркированный список с необязательным заголовком.

Draft, demo, approval и media-rights правила сохраняются и применяются к
каждому блоку, а не только к верхнему объекту статьи.

## Целевая модель

Проект и услуга получают общую MDX-структуру с разрешёнными компонентами
блоков. Метаданные остаются в frontmatter и проходят Zod-валидацию.
Для JSON fallback используется discriminated union по `type`; `order-form`
содержит стабильный `formId` и контекст (`project` или `service`).
Специфичные поля проекта (категория, клиент, год) и услуги (slug,
publication flags) остаются в метаданных.

Сначала подключается официальная `@astrojs/mdx` и проверяется загрузка MDX
через content collections. Компоненты блоков экспортируются через единый
mapping, а не принимают произвольный JSX. Если сборка, типизация или
валидация MDX создают неприемлемые ограничения, те же блоки используются
через JSON fallback без изменения рендереров.

Для интерактивных графиков используется Apache ECharts через npm и маленький
Astro island только для `chart` блока. Данные остаются в MDX/JSON, а рядом
рендерятся таблица или текстовая сводка для screen reader, no-JS и fallback.
Нужно ограничить импорт ECharts необходимыми модулями и поддержать resize.

Формы выбираются через центральный реестр `formId`/`category`. Общий
контейнер формы отвечает за layout и accessibility, отдельные компоненты
отвечают за поля и payload каждой категории.

## Этапы

1. Зафиксировать block union, ограничения размеров, provenance и правила
   публикации в типах и Zod-схемах.
2. Создать независимые Astro-рендереры блоков и единый `ContentBlocks`.
3. Создать галерею для `image-gallery`: затемнённый lightbox, боковые кнопки,
   появляющиеся при наведении и фокусе, кружки позиции и закрытие по Escape.
4. Создать реестр форм, общий контейнер и адаптеры существующих форм.
5. Переписать страницу проекта на блоковую композицию, сохранив URL,
   breadcrumbs, возврат к каталогу, SEO и fallback без JavaScript.
6. Переписать страницу услуги и её публикационные проверки на тот же поток.
7. Мигрировать сразу все статьи проектов в MDX, сохранив JSON fallback для
   записей, которые не прошли проверку; удалить старые поля после сравнения.
8. Мигрировать сразу все статьи услуг, сохранив demo/noindex и существующие
   маршруты; удалить дублирующий `article.sections` после миграции.
9. Добавить статические проверки контракта, сборки, SEO и browser acceptance.

## Зависимости

`075` → `076` → `076a` → `077` → (`078`, `079`) → `080` → `081`.
Задача `082` зависит от всех предыдущих и закрывает приёмку.

## Dependencies and order

Task 080 completed on 2026-10-13:
[shared article pages](../fixed/20261013/080-universal-article-pages.md).
All 27 projects now use MDX; projects and services share ContentBlocks/media/forms.
The gallery block is named `image-gallery` following the user's instruction.

The sequence is `075` -> `076` -> `076a` -> `077` ->
(`078`, `079`) -> `080` -> `081` -> `082`.
Task `075a` follows `075` and is a prerequisite for `078` and `080`.
Tasks 078 and 079 may proceed independently after their earlier prerequisites.
No task depends on work assigned to a later task.
Task 082 completed on 2026-10-13:
[browser acceptance](../fixed/20261013/082-content-blocks-playwright-acceptance.md).
All browser scenarios pass; controlled test limits and local artifacts are in
[the acceptance report](../../site/content-block-acceptance.md).

## Layout decision: no persistent side information panels

Every project and service article uses one linear reading flow in source order.
Persistent side information panels, sticky asides, side rails, and two-column
information layouts are excluded from the target architecture. Tables, charts,
images, forms, quotes, and footnotes occupy the same block flow; wide screens
may only change content width and spacing. The legacy project specifications
panel is removed during migration. The image gallery lightbox is a temporary
dimmed overlay and is not a persistent side panel.

## Project contract simplification

Task 075a is the required contract boundary after the universal block
foundation. It removes legacy article fields and makes `Project.content`
required. Tasks 078 and 080 must not complete before 075a; all article text,
media, process, result, specifications, and provenance must be represented by
`ContentBlock[]`. The final project schema rejects legacy article fields.
Task 080 retains editorial evidence references in catalog metadata so existing
approval records are not discarded; they are never rendered as visitor copy.
