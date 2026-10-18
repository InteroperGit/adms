# 101 — UI primitives

Дата: 2026-10-16. Статус: planned.

## Задача

Полностью протестировать `Button.astro`, `Section.astro`, `Logo.astro`,
`MaxLogo.astro`, `ContactInfo.astro`, `Breadcrumbs.astro`, `NavLinks.astro` и
`CarouselControl.astro`.

## Сценарии

Props/defaults, button/link branches, slots, forwarded attributes, optional
fields, native `tel:`/`mailto:`, breadcrumb current state, desktop/mobile links,
phone action, decorative SVG accessibility и carousel data markers.

## Готово, когда

Import-only tests заменены semantic DOM assertions; каждое documented prop имеет
positive и negative/empty case.

Зависимость: 091.
