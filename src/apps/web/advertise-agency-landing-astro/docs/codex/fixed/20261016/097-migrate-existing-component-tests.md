# 097 — Перенести существующие component-тесты

## Цель

Перенести текущие тесты UI, карточек и `ContentBlocks` к исходным файлам.

## Изменения

- Переместить восемь UI/card-тестов из `tests/components`.
- Переместить `content-blocks.test.ts` к `ContentBlocks.astro`.
- Объединить `button.smoke.test.ts` с `Button.test.ts`.
- Переместить `resolve-image`, `order-inquiry` и `image-carousel`.
- Удалить старые дубли после проверки импортов.

## Приёмка

Каждый перенесённый тест запускается из нового пути. В `tests/components`
не остаётся component-тестов. Поведение и количество проверок не ухудшаются.

## Зависимости

096.

## Completion

Status: completed on 2026-10-16.

Moved component, content, form, image resolver, and carousel tests beside their source files; merged Button smoke coverage and removed the old test locations. Validation: pnpm test (19 files, 164 tests passed) and pnpm check passed with one existing Zod deprecation hint.
