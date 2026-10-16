# 115 — Добавить Prettier, ESLint и Playwright

Дата: 2026-10-16. Статус: completed.

## Цель

Настроить единые команды форматирования, статического анализа и браузерных
E2E-тестов для локальной разработки и CI.

## Текущее состояние

- Prettier и ESLint отсутствуют в `package.json`.
- `pnpm check` запускает Astro check и собственную проверку стиля.
- Unit/component/integration-тесты работают на Vitest.
- Browser smoke реализован через Playwright CLI в
  `docs/development/browser-coverage.js`; локального test runner нет.
- Предыдущая браузерная приёмка ограничена Chromium. См.
  [задачу 094](../fixed/20261015/094-playwright-smoke-and-e2e.md).

## Объём работ

1. Проверить совместимость зависимостей с фактическими версиями Node.js, pnpm,
   Astro и TypeScript. Добавить инструменты как devDependencies, обновить
   lockfile и обеспечить установку с `--frozen-lockfile`.
2. Настроить Prettier с поддержкой Astro и используемых форматов проекта:
   TypeScript, JavaScript, CSS, JSON, Markdown и MDX. Задать ширину 80 символов
   и согласовать форматирование с правилами проекта. Учесть, что `printWidth` не
   гарантирует жёсткий предел длины строки: сохранить необходимую собственную
   проверку. Исключить сборку, отчёты, зависимости, генерируемые файлы и внешний
   runtime-контент `data/content/`.
3. Добавить flat config ESLint с поддержкой Astro, TypeScript и браузерного
   кода. Настроить окружения для серверных модулей, скриптов и тестов. Разделить
   ответственность ESLint, Prettier, Astro check и существующих проверок;
   исключить конфликтующие правила форматирования.
4. Исправить выявленные нарушения без изменения поведения приложения.
   Механическое форматирование отделить от содержательных исправлений. Не
   скрывать ошибки глобальными отключениями правил.
5. Добавить `@playwright/test`, конфигурацию и версионируемые E2E-тесты.
   Перенести существующий smoke-flow в test runner с сохранением сценариев.
   Обновить ссылки и удалить дублирующий путь запуска после миграции. Сохранить
   Vitest для существующих unit/component/integration-тестов.
6. Выполнять E2E против production build с управляемым preview-сервером,
   предсказуемыми портом/baseURL и завершением процесса после тестов. При
   использовании dev server соблюдать режим `--background` и правила управления
   сервером проекта.
7. Покрыть cookie/theme persistence, mobile menu и клавиатурный фокус, reduced
   motion, carousel, gallery, поиск/фильтр/пагинацию и back/forward. Проверить
   inquiry success/error/unavailable через перехват запросов, без отправки
   реальных заявок. Добавить responsive и no-JS smoke. Использовать
   синтетические данные из `tests/fixtures/content/`, исключить зависимость от
   внешних ресурсов и deployment-контента.
8. Настроить Chromium, Firefox и WebKit; явно описать матрицу запусков.
   Сохранять trace и screenshot при падении, отчёты и результаты исключить из
   Git. Не использовать произвольные задержки для синхронизации тестов.
9. Добавить команды `format`, `format:check`, `lint`, `lint:fix`, `test:e2e`,
   `test:e2e:ui`. Команды проверки не должны менять файлы. В CI подключить
   format/lint/E2E, установку браузеров и системных зависимостей, загрузку
   диагностических артефактов при ошибках.
10. Обновить документацию разработки и browser coverage: установка, команды,
    матрица браузеров, работа с фикстурами, отчёты и отладка.

## Готово, когда

- Чистая установка по lockfile воспроизводима локально и в CI.
- `pnpm format:check` и `pnpm lint` проходят; повторное форматирование не меняет
  файлы. Проверки обнаруживают нарушения в Astro и TypeScript.
- Проходят существующие `pnpm check`, `pnpm test`,
  `pnpm verify:component-tests`, `pnpm test:coverage`, `pnpm verify:coverage`,
  `pnpm verify:content`, `pnpm verify:boundaries`, `pnpm build` и
  `pnpm verify:quality`.
- `pnpm test:e2e` проходит на заявленной матрице браузеров; сохранены прежние
  smoke-проверки, новые сценарии и диагностика падений.
- CI блокирует изменения при ошибках форматирования, линтинга и E2E.
- Runtime-контент не изменён, браузерные сценарии воспроизводятся на
  версионируемых фикстурах, реальные заявки не отправляются.
- В задаче записаны результаты команд, матрица и известные ограничения.

## Связанные документы

- [Правила разработки](../../development/rules/)
- [Browser coverage](../../development/browser-coverage.md)
- [Проверки и CI](../../development/verification-and-ci.md)
- [Integration matrix и gates](114-integration-matrix-and-gates.md)

При реализации согласовать изменения инфраструктуры с задачей 114, не
дублировать её работу по покрытию компонентов и интеграций.

## Выполнение — 2026-10-16

- Added Prettier 3 with `prettier-plugin-astro`, 80-column target and ignores.
- Added ESLint 9 flat config for Astro, TypeScript, browser and Node code.
- Added Playwright Test 1.64 with Chromium, Firefox and WebKit projects.
- Migrated CLI smoke coverage to eight E2E specs (24 browser runs).
- Added isolated synthetic fixture build and inquiry request interception.
- Added format/lint/E2E scripts, CI browser installation and diagnostics.
- Updated setup, verification/CI and browser coverage documentation.

## Проверка

- `pnpm install --frozen-lockfile` passed.
- `pnpm format:check`, `pnpm lint`, `pnpm check` passed.
- `pnpm test:coverage`: 100 files, 628 tests; thresholds passed.
- `pnpm test:e2e --workers=2`: 24 passed across three browsers.
- `pnpm build` and `pnpm verify:quality`: 39 routes passed.
- Content invariants and boundary checks passed.
- Tool probes confirmed ESLint and Prettier reject invalid input.
- Existing build chunk-size hint remains unrelated to this task.
