# 098 — Покрыть content и form-компоненты

## Цель

Добавить соседние тесты для всех рендереров content-блоков и форм.

## Объём

Покрыть `ChartBlock`, `ContentImage`, `FootnoteBlock`, `HeadingBlock`,
`ImageBlock`, `ImageGallery`, `ImageGalleryBlock`, `ListBlock`,
`OrderFormBlock`, `OrderFormContainer`, `ParagraphBlock`, `QuoteBlock`,
`TableBlock`, `VideoBlock`, `mdx-components.ts`, `LedLettersForm` и
`order-inquiry.ts`.

Проверить `ContentBlocks` для каждого discriminator, пустые и draft/demo
данные, safe links, media metadata, accessibility и fallback.

## Приёмка

У каждого перечисленного исходника есть соседний тест. Все content fixtures
остаются в `tests/fixtures/content/`. Coverage content/form-групп достигает
проектного порога.

## Зависимости

096, 097.

## Completion

Status: completed on 2026-10-16.

Added colocated coverage for all listed content renderers, MDX mapping, and LedLettersForm, including accessibility, fallback, media, link, and metadata assertions. Validation: pnpm test (35 files, 180 tests passed) and pnpm check passed with one existing Zod deprecation hint.
