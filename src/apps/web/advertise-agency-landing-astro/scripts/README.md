# Scripts

Поддерживаемые скрипты проекта и их назначение. Команды запуска из package
scripts см. в `package.json`.

## Проверки и служебные команды

- `check-code-style.mjs` — проверяет ограничение длины изменённых строк.
- `check-component-tests.mjs` — проверяет расположение тестов компонентов.
- `clean-temp.mjs` — показывает временные файлы для очистки; `--apply` применяет
  очистку, `--all` добавляет каталог `output/`.
- `clean-temp.test.mjs` — тесты безопасной очистки временных файлов.
- `verify-built-quality.mjs` — проверяет качество HTML после сборки.
- `verify-content-boundaries.mjs` — проверяет границы runtime-контента, шаблонов
  и исходников.
- `verify-content-invariants.mjs` — проверяет инварианты JSON в `data/content/`.
- `verify-coverage-thresholds.mjs` — проверяет пороги покрытия по отчёту Vitest.
- `verify-external-assets.mjs` — проверяет доступность внешних медиа и стилей.
- `verify-release-metadata.mjs` — проверяет production URL и SEO-метаданные.

## Контент

- `generate-content-catalog.mjs` — генерирует базовый runtime-контент из
  шаблонов.
- `prepare-ci-content.mjs` — помещает синтетический runtime-контент в чистую
  CI-сборку.
- `test-content-block-fixtures.mjs` — проверяет допустимые и отклоняемые
  fixtures блоков контента.
- `test-content-catalog.mjs` — проверяет генерацию каталога контента.
- `test-publication-policy.mjs` — проверяет правила публикации контентных блоков
  и проектов.

## E2E

- `e2e.config.mjs` — конфигурация Astro с отдельными путями сборки и тестовым
  источником контента.
- `e2e-server.mjs` — готовит тестовые данные, собирает сайт и запускает preview
  для Playwright.

## Вспомогательные модули

- `lib/compile-mdx.mjs` — компилирует MDX через production-процессор контента
  для регрессионных проверок.
- `lib/import-typescript.mjs` — загружает TypeScript-контракты в Node-тестах.
