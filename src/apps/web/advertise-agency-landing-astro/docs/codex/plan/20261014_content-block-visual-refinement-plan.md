# План улучшения ContentBlock: визуальная система и адаптивные представления

Дата: 2026-10-14. Статус: in progress (VCB-01–03 completed).

## Цель

Сделать каждый `ContentBlock` визуально понятным внутри единого линейного
потока статьи, с адаптивным представлением и доступными состояниями. Сохранить
MDX/JSON источники, SSR/no-JS fallback и publication policy. Отдельные surface
допускаются только для блоков, которым они нужны по смыслу, например gallery,
form или media group.

## Область работ

В текущий набор входят `paragraph`, `ordered-list`, `unordered-list`, `table`,
`chart`, `image`, `image-gallery`, `order-form`, `quote` и `footnote`. В план
добавлен новый тип `video`, поэтому после реализации будет 11 типов.

Общие требования: единые surface/border/radius/focus токены, светлая и тёмная
темы, viewport 320/768/1440 px, keyboard navigation, 200% text, reduced motion,
локальный overflow для широких данных и стабильная геометрия до загрузки media.

Таблица получает desktop comparison view с шапкой, zebra rows и подсветкой
строки. На mobile строки переходят в вертикальные группы пар «поле — значение»
с явными labels и без потери данных.

`image-gallery` получает отдельную surface-секцию с фоном, active thumbnail,
mobile snap-strip и доступным lightbox. `chart` сохраняет статический data
fallback. `order-form` сохраняет различие production, demo и general fallback.

Новый `video` должен иметь типизированный контракт, poster, transcript,
нативные controls, `preload="metadata"`, no-JS fallback и запрет autoplay по
умолчанию. Для него отдельно проверяются ошибочный источник, печать,
клавиатура, reduced motion и отсутствие layout shift.

## Порядок выполнения

1. VCB-01 — общие токены и каркас секций.
2. VCB-02 — fixture и визуальная матрица.
3. VCB-03—VCB-06 — текстовые и информационные блоки.
4. VCB-07—VCB-09 — image, gallery и chart.
5. VCB-10—VCB-12 — контракт, renderer и acceptance для нового video.
6. VCB-13—VCB-14 — форма и интеграция общего контейнера.
7. VCB-15 — финальные проверки и документация.

Задачи можно выполнять параллельно внутри одного этапа после выполнения их
зависимостей. Полный список требований, зависимостей и критериев находится в
отдельных task-файлах в `docs/codex/todo/`.

## Приёмка

- Все 11 типов проверены в обеих темах на 320/768/1440 px.
- Таблица имеет desktop и mobile key-value представления без потери данных.
- Галерея выделена фоном секции и сохраняет no-JS/lightbox сценарии.
- График имеет доступный data fallback и стабильный lazy enhancement.
- Видео типизировано, не запускается само и содержит transcript/fallback.
- Формы сохраняют publication safety и корректные состояния ошибок.
- Проходят `pnpm check`, `pnpm build`, content/publication tests и browser
  acceptance.

## Task-файлы

- [VCB-01](../fixed/20261014/20261014-vcb-01-tokens-section-shell.md)
- [VCB-02](../fixed/20261014/20261014-vcb-02-visual-fixture-matrix.md)
- [VCB-03](../fixed/20261014/20261014-vcb-03-paragraph-block.md)
- [VCB-04](../todo/20261014-vcb-04-list-block.md)
- [VCB-05](../todo/20261014-vcb-05-table-block.md)
- [VCB-06](../todo/20261014-vcb-06-quote-footnote-blocks.md)
- [VCB-07](../todo/20261014-vcb-07-image-block-content-image.md)
- [VCB-08](../todo/20261014-vcb-08-image-gallery-block.md)
- [VCB-09](../todo/20261014-vcb-09-chart-block.md)
- [VCB-10](../todo/20261014-vcb-10-video-contract-media-policy.md)
- [VCB-11](../todo/20261014-vcb-11-video-renderer-fallback.md)
- [VCB-12](../todo/20261014-vcb-12-video-browser-acceptance.md)
- [VCB-13](../todo/20261014-vcb-13-order-form-block.md)
- [VCB-14](../todo/20261014-vcb-14-content-blocks-integration.md)
- [VCB-15](../todo/20261014-vcb-15-final-checks-documentation.md)
