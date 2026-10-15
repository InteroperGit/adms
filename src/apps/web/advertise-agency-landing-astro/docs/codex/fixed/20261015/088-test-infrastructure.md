# 088 — Базовая тестовая инфраструктура

## Статус

Выполнено 2026-10-15.

## Реализация

- Добавлены Vitest 4.0.18, jsdom 30.1.3, Testing Library DOM,
  jest-dom, coverage-v8 и типы jsdom.
- Созданы `vitest.config.ts`, `tests/setup.ts`, `tests/helpers/`,
  `tests/unit/`, `tests/components/`, `tests/integration/` и
  `tests/fixtures/content/`.
- Добавлены scripts `test`, `test:watch`, `test:unit`, `test:components`,
  `test:integration` и `test:coverage`; пустые unit/integration-каталоги
  завершаются успешно через `--passWithNoTests`.
- Добавлен smoke-тест `Button.astro` через Astro Container API и DOM-проверки.
- Coverage и тестовые артефакты добавлены в `.gitignore`.

## Приёмка

- `pnpm test` — 1 тест прошёл.
- `pnpm test:components` — 1 тест прошёл.
- `pnpm test:unit` и `pnpm test:integration` — успешно с пустыми каталогами.
- `pnpm test:coverage` — отчёт v8 сформирован.
- `pnpm check` — прошёл; остаётся существующая подсказка deprecation в
  `src/validation/content-blocks.ts`.
- Конфигурация не использует `data/content/`; Astro Container-тест выполняется
  в Node, клиентские тесты по умолчанию используют jsdom.

