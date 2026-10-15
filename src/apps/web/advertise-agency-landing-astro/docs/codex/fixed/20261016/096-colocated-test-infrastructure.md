# 096 — Перенастроить Vitest для соседних тестов

## Цель

Поддержать тесты рядом с исходниками в `src/components` и сохранить текущие
тесты из `tests/`.

## Изменения

- Обновить `vitest.config.ts` и include-пути для `src` и `tests`.
- Сохранить общий setup и Astro Container pipeline.
- Добавить alias для `tests/helpers`, если он нужен соседним тестам.
- Обновить `package.json` scripts для component/unit/integration scopes.
- Расширить coverage include на все файлы `src/components`.

## Приёмка

`pnpm test`, `pnpm test:unit`, `pnpm test:components` и
`pnpm test:integration` находят тесты в обоих деревьях и завершаются без
ошибок.

## Зависимости

Нет. Эта задача выполняется первой.

## Completion

Status: completed on 2026-10-16.

Implemented colocated Vitest discovery, component coverage inclusion, and focused test scripts. Validation: pnpm test (20 files, 164 tests passed) and pnpm check passed with one existing Zod deprecation hint.
