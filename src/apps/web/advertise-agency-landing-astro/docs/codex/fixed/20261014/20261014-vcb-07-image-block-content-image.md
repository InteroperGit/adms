# VCB-07 — ImageBlock и общий ContentImage

Дата: 2026-10-14. Статус: fixed. Завершено: 2026-10-15.

## Задача

Зависимости: VCB-01, VCB-02. Унифицировать локальную media surface внутри figure, caption, intrinsic
ratio, loading/error state, focal point и mobile width.

## Ограничение общего потока

Статья остаётся единым линейным текстом: этот renderer не оформляется как
отдельная карточка с обязательным фоном, рамкой, скруглением или тенью.
Локальная surface допускается только вокруг смысловой группы, если это прямо
описано в задаче (например gallery, media, chart или form), и не должна
создавать ощущение набора разрозненных карточек.
Готово, когда нет layout shift, растяжения или потери subject при crop.





## Реализация

Унифицирован standalone `ImageBlock` с общим `ContentImage`: добавлены
responsive figure/caption стили, резервирование intrinsic ratio, loading и
error state с доступным fallback-текстом, а также сохранены desktop/mobile
focal points и crop-поведение для service и thumbnail вариантов.

## Проверка

Проходят `astro check`, `astro build`, `scripts/check-code-style.mjs` и
`git diff --check`.