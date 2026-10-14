# VCB-13 — OrderFormBlock

Дата: 2026-10-14. Статус: planned.

## Задача

Зависимости: VCB-01, VCB-02. Оформить локальную action surface формы, responsive field groups,
required/error/success/loading/unavailable states и focus restoration.

## Ограничение общего потока

Статья остаётся единым линейным текстом: этот renderer не оформляется как
отдельная карточка с обязательным фоном, рамкой, скруглением или тенью.
Локальная surface допускается только вокруг смысловой группы, если это прямо
описано в задаче (например gallery, media, chart или form), и не должна
создавать ощущение набора разрозненных карточек.
Готово, когда production, demo и general fallback сохраняют publication safety.




