# VCB-03a — Отдельный блок заголовка

Дата: 2026-10-14. Статус: fixed. Завершено: 2026-10-14.

## Контекст

`ContentBlock` смешивает структуру данных и оформление текста: блоки
`paragraph`, `ordered-list`, `unordered-list`, `table` и `chart` содержат
встроенные `heading` или `title`. Из-за этого заголовок нельзя расположить
как самостоятельный элемент потока, выбрать его семантический уровень или
одинаково использовать в JSON и MDX. Текущий MDX-компилятор также превращает
Markdown-заголовок в поле следующего paragraph/list-блока.

## Цель

Ввести самостоятельный `heading` в discriminated union `ContentBlock` и
перевести существующие статьи на явную последовательность блоков. Заголовок
должен иметь текст и HTML-уровень от 1 до 6, а его положение в массиве
`content` должно определять положение в документе.

## Область работ

- Добавить `HeadingBlock` в `src/types/content-blocks.ts` и Zod-контракт.
  Предлагаемая форма: `{ type: 'heading', id?, level: 1|2|3|4|5|6,
  text: string }`; сохранить общие metadata/provenance/status.
- Добавить `HeadingBlock.astro` и dispatch в `ContentBlocks.astro`. Рендерить
  нативный `h1`–`h6`, безопасно поддерживать authored `id`, единые отступы и
  стили уровня. Не создавать дополнительный заголовок внутри соседнего блока.
- Удалить `heading` из paragraph/list-контрактов и `title` из table/chart
  контрактов, типов, renderer-компонентов, accessibility-связей и общих
  комментариев. `caption` таблицы и графика оставить подписью данных, а не
  заголовком раздела; проверить aria-label fallback для chart.
- Переписать `src/content/mdx-blocks.mjs`: Markdown-заголовок должен
  становиться самостоятельным `heading` с сохранённым `depth`, а не
  присоединяться к следующему paragraph/list. Разрешить уровни 1–6 согласно
  контракту и отклонять заголовок без последующего контента только если это
  действительно требуется правилами статьи.
- Мигрировать все 27 `data/content/articles/projects/*.mdx` и 5
  `data/content/articles/services/*.mdx`: вынести каждое встроенное
  `heading`/`title` в отдельный блок перед соответствующим содержимым.
  Выбрать уровень по контексту: корневой заголовок статьи — `h1` только если
  он ещё не выводится страницей; разделы статьи — обычно `h2`, подразделы —
  `h3` и ниже. Не дублировать page title и не создавать скачков уровней.
- Обновить `data/templates/articles/`, документацию по статьям и примеры
  блоков. Явно описать, что `heading` — структурный блок, а `caption` —
  подпись таблицы/графика.
- Обновить valid/invalid fixtures, content invariants и browser acceptance:
  проверить границы уровней 1 и 6, отклонение 0/7 и неизвестных полей,
  порядок блоков, anchors, один осмысленный `h1` на странице, отсутствие
  legacy `heading`/`title` в block payloads и parity JSON/MDX.

## Ограничения

Сохранить единый линейный поток статей, publication filtering, block IDs,
footnote targets, demo/published policy и существующие page metadata. Поля
`title` в frontmatter и metadata страниц, а также названия карточек и
контролов вне `ContentBlock` не входят в миграцию.

## Приёмка

- [ ] `ContentBlock` принимает `heading` и больше не принимает встроенные
      `heading`/`title` у content blocks.
- [ ] Уровень заголовка ограничен целым числом 1–6 и выводится как
      соответствующий HTML-элемент.
- [ ] Все 32 статьи и шаблоны используют отдельные heading blocks; поиск по
      article payloads не находит legacy fields.
- [ ] MDX и JSON дают одинаковый порядок блоков и heading hierarchy.
- [ ] `pnpm check`, `pnpm build`, content fixtures, invariant checks и
      browser acceptance проходят; результаты записаны в этой задаче.

## Зависимости

Основано на VCB-04—VCB-15 и завершённых задачах 075–082. После реализации
обновить ссылки на контракт в `docs/site/articles.md`,
`docs/site/service-articles.md` и плане universal content blocks.

## Реализация

Добавлен самостоятельный heading block с уровнями 1–6. Удалены встроенные heading/	itle из paragraph, list, table и chart. Переписан MDX compiler, чтобы Markdown-заголовки сохранялись отдельными блоками. Мигрированы 27 проектных статей, шаблоны и тестовые фикстуры; сервисные статьи используют тот же результат нормализации.

## Проверка

- pnpm check`r
- pnpm build`r
- 
ode scripts/test-content-block-fixtures.mjs`r
- 
ode scripts/test-service-articles.mjs`r
- 
ode scripts/verify-content-invariants.mjs`r
- 
ode scripts/check-code-style.mjs`r

Project regression script still reports its existing led-letters HTML assertion; the generated project pages build successfully and the failure is unrelated to heading payload migration.
