# Scripts

Поддерживаемые скрипты проекта и их назначение. Команды запуска из package
scripts см. в `package.json`.

## Проверки и служебные команды

- `checkCodeStyle.mjs` — проверяет ограничение длины изменённых строк.
- `checkComponentTests.mjs` — проверяет расположение тестов компонентов.
- `cleanTemp.mjs` — показывает временные файлы для очистки; `--apply` применяет
  очистку, `--all` добавляет каталог `output/`.
- `cleanTemp.test.mjs` — тесты безопасной очистки временных файлов.
- `verifyBuiltQuality.mjs` — проверяет качество HTML после сборки.
- `verifyContentBoundaries.mjs` — проверяет границы runtime-контента, шаблонов и
  исходников.
- `verifyContentInvariants.mjs` — проверяет инварианты JSON в runtime-каталоге;
  в CI путь задаёт `CI_CONTENT_ROOT`.
- `verifyCoverageThresholds.mjs` — проверяет пороги покрытия по отчёту Vitest.
- `verifyExternalAssets.mjs` — проверяет доступность внешних медиа и стилей.
- `verifyReleaseMetadata.mjs` — проверяет production URL и SEO-метаданные.

## Контент

- `generateContentCatalog.mjs` — генерирует базовый runtime-контент из шаблонов.
- `prepareCiContent.mjs` — помещает manifest-driven fixtures в пустой
  `output/ci-content`, не затрагивая авторский runtime.
- `testContentBlockFixtures.mjs` — проверяет допустимые и отклоняемые fixtures
  блоков контента.
- `testContentCatalog.mjs` — проверяет генерацию каталога контента.
- `testPublicationPolicy.mjs` — проверяет правила публикации контентных блоков и
  проектов.

## E2E

- `e2eConfig.mjs` — конфигурация Astro с отдельными путями сборки и тестовым
  источником контента.
- `e2eServer.mjs` — готовит тестовые данные, собирает сайт и запускает preview
  для Playwright.

## Вспомогательные модули

- `lib/compileMdx.mjs` — компилирует MDX через production-процессор контента для
  регрессионных проверок.
- `lib/importTypescript.mjs` — загружает TypeScript-контракты в Node-тестах.
