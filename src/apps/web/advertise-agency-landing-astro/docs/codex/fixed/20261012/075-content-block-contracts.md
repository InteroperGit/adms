# 075. Контракт универсальных контентных блоков

Status: fixed. Created: 2026-10-12.
Plan: [Универсальные блоки](../../plan/20261012_universal-content-blocks-plan.md).

## Выполнено

- [x] Описан discriminated union `ContentBlock` для paragraph, table, chart, image, image-stack, order-form, quote и footnote.
- [x] Подключена официальная Astro-интеграция `@astrojs/mdx`.
- [x] Описаны общие поля provenance, alt, caption, id, ссылки на footnote и ограничения значений.
- [x] Расширены `Project`, `Service` и JSON-схемы строгой валидацией.
- [x] Добавлены valid/invalid fixtures без изменения production-данных.
- [x] TypeScript-типы и Zod-contracts согласованы; fixtures проверяются на невалидные данные.

## Перенесено в активные задачи

- MDX content collections и mapping MDX-компонентов: **076, 078, 080**.
- JSON fallback через те же renderer-ы с эквивалентным результатом: **076, 080**.
- Draft/demo/approval/media-rights правила на уровне блоков: **081**.
- Упрощение `Project` до metadata и required `content: ContentBlock[]`: **075a**, затем миграция в **078/080**.
