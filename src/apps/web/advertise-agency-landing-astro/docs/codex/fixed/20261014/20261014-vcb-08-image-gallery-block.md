# VCB-08 — ImageGalleryBlock

Дата: 2026-10-14. Статус: fixed. Завершено: 2026-10-15.

## Задача

Зависимости: VCB-07. Добавить выделенный фоном section surface, active
thumbnail, desktop strip, mobile snap strip и улучшить native dialog/lightbox:
focus trap, Escape, return focus, live announcement и reduced motion.

## Ограничение общего потока

Статья остаётся единым линейным текстом: этот renderer не оформляется как
отдельная карточка с обязательным фоном, рамкой, скруглением или тенью.
Локальная surface допускается только вокруг смысловой группы, если это прямо
описано в задаче (например gallery, media, chart или form), и не должна
создавать ощущение набора разрозненных карточек.
Готово, когда no-JS links, touch и keyboard сценарии проходят без page overflow.




## Реализация

Галерея получила выделенную локальную surface, responsive thumbnail strip
для desktop и mobile snap-поведение, явное состояние active thumbnail и
улучшенный native dialog/lightbox с циклическим Tab-фокусом, Escape,
возвратом фокуса, live announcement и полной поддержкой reduced motion.
Native no-JS ссылки и touch-сценарии сохранены. Галерея отделена от соседних
блоков статьи двумя центрированными `<hr>` шириной 90%; основное изображение
получило отдельную заливку и отступы.

## Проверка

Проходят `astro check`, `astro build`, `scripts/check-code-style.mjs` и
`git diff --check`.