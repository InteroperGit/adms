# 105 — Media и form block components

Дата: 2026-10-16. Статус: planned.

## Модель и оценка

Рекомендуемая модель: `gpt-6-luna`; reasoning effort: `high`.
Оценка: 2026-10-18, с приоритетом экономии ресурсов.

Веток много, но image resolver, chart runtime и publication helpers уже
выделены. Luna достаточно при работе по одной группе блоков.

## Подзадачи для отдельных запусков

- [ ] 105.a — `gpt-6-luna`, medium: ContentImage и ImageBlock.
  Проверить metadata, crop/caption, отсутствие asset и error output.
- [ ] 105.b — `gpt-6-luna`, medium: ImageGalleryBlock и ImageGallery.
  Проверить links, optional captions и fallback без lightbox JavaScript.
- [ ] 105.c — `gpt-6-luna`, high: ChartBlock и VideoBlock.
  Проверить data-table fallback, poster/MIME/transcript и error branches;
  использовать контролируемые данные без network и повторения runtime tests.
- [ ] 105.d — `gpt-6-luna`, high: OrderFormContainer и OrderFormBlock.
  Проверить heading/description/slot, registered/general fallback и матрицу
  production/demo/general на готовых publication fixtures.

Шаги a–c независимы. Шаг d опирается на готовые contracts 096/099/104;
результат — assertions по каждому разрешённому и запрещённому form output.

Общий порядок работы и условия перехода на более сильную модель:
[оценка моделей][model-assessment].

[model-assessment]: ../plan/20261018_todo-model-assessment.md

## Задача

Покрыть `ChartBlock.astro`, `ContentImage.astro`, `ImageBlock.astro`,
`ImageGalleryBlock.astro`, `ImageGallery.astro`, `VideoBlock.astro`,
`OrderFormContainer.astro` и `OrderFormBlock.astro`.

## Сценарии

Chart fallback/data table, image metadata/crop/caption/error, gallery links и
lightbox fallback, video poster/MIME/transcript/error, form heading/description,
registered production form и safe general fallback.

## Готово, когда

Все media/error/fallback branches покрыты без network; production/demo/general
publication safety проверена.

Зависимость: 098, 099, 104.

## Completion — 2026-10-18

Expanded the colocated suites for media and form blocks. Assertions cover
responsive image metadata, focal points, captions and missing-media status;
gallery links, empty galleries and captions; chart fallback tables and
unitless values; video MIME selection, posters, transcripts and native error
links; and registered, demo and general order-form output.

Validation: 19 focused Vitest tests pass, with all eight scoped components
executed successfully. Changed-file code style and component colocation pass.
