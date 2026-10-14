# VCB-06 — QuoteBlock и FootnoteBlock

Дата: 2026-10-14. Статус: fixed. Завершено: 2026-10-14.

## Задача

Зависимости: VCB-01. Оформить editorial quote с author/source и secondary
footnote с reference, `:target`, возвратом к цели и переносами длинных значений.

## Ограничение общего потока

Статья остаётся единым линейным текстом: этот renderer не оформляется как
отдельная карточка с обязательным фоном, рамкой, скруглением или тенью.
Локальная surface допускается только вокруг смысловой группы, если это прямо
описано в задаче (например gallery, media, chart или form), и не должна
создавать ощущение набора разрозненных карточек.
Готово, когда decorative quote скрыта от assistive tech, note работает без JS.




## Реализация

Добавлены editorial-стили для `QuoteBlock` с семантической атрибуцией
автора и источника, декоративным знаком цитаты, скрытым от assistive tech,
и переносом длинных значений. `FootnoteBlock` получил secondary-оформление,
нативную ссылку возврата к `targetId` без JavaScript и перенос длинного
текста. Для целей footnote добавлена подсветка `:target` в общем потоке
статьи.

## Проверка

`astro check`, `scripts/check-code-style.mjs` и `git diff --check` проходят.
Fixture-тест не запущен: в checkout отсутствует ожидаемый файл
`data/content/fixtures/content-blocks.valid.json`.