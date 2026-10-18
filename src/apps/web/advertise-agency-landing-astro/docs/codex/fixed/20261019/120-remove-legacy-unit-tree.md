# 120 — Remove legacy unit tree and update gates

Дата: 2026-10-18. Статус: completed 2026-10-19.

## Цель

Удалить устаревшее дерево `tests/unit` после завершения задач 118 и 119 и
согласовать команды, CI и документацию с colocated-размещением.

## Объём

- Удалить оставшиеся `tests/unit/*.test.ts` после сверки diff и test count.
- Удалить пустой каталог из репозитория (если он не содержит других файлов).
- Обновить `test:unit` в `package.json` так, чтобы команда запускала
  colocated pure logic suites и не дублировала `test:components`.
- Проверить workflow `.github/workflows/quality.yml`, документацию
  `docs/development/verification-and-ci.md` и связанные ссылки на
  `tests/unit`.
- Оставить Vitest include для `tests/**` ради integration/e2e discovery и
  fixture-independent test helpers.

## Зависимости

После задач 118 и 119.

## Готово, когда

- [x] Нет unit suite-файлов и каталога `tests/unit`.
- [x] `pnpm test:unit` запускает colocated pure logic suites.
- [x] Full, component и integration suites проходят.
- [x] Astro check, code style, ESLint и coverage threshold проходят.
- [x] Component colocation gate подтверждает отсутствие legacy component
  tests в `tests/components`.

## Выполнение — 2026-10-19

- `test:unit` теперь запускает suites из `src/validation`, `src/content`,
  `src/scripts` и `src/server`, не дублируя `test:components`.
- Удалена пустая директория `tests/unit`; Vitest include для `tests/**`
  сохранён ради integration и E2E discovery.
- Обновлена документация verification/CI. Workflow уже запускал
  `test:unit`, `test:components`, полный набор и coverage; изменений workflow
  не потребовалось.
- Результаты: unit — 32 файла/451 тест; components — 64/234;
  integration — 2/58; full — 98/743.
- Astro check: 0 ошибок, 0 warnings, 1 existing deprecation hint;
  code style, ESLint, coverage и component colocation gates прошли.
- Repository-wide `prettier --check .` reports 420 existing formatting
  violations across the project; the changed code/config files pass the
  focused Prettier check.

## Модель и оценка

Рекомендуемая модель: `gpt-6-luna`; reasoning effort: `medium`.

После задач 118 и 119 это локальная cleanup-задача: удалить старые suite-файлы,
согласовать `test:unit`, CI и документацию и проверить discovery. Luna
достаточно; Sol нужен только если изменение команды выявит конфликт между
unit, component и integration наборами или потребует пересмотра Vitest config.
