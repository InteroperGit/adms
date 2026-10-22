# 152. Развернуть условные блоки ThemeInit

Статус: выполнено. Создано: 2026-10-22. Завершено: 2026-10-23.
Приоритет: низкий.

## Основание и границы

В inline-script `src/components/ui/ThemeInit.astro` ветви чтения storage,
смены системной темы, фильтрации storage events и выбора radio записаны
без фигурных скобок. Это нарушает обязательные правила code style
в сценарии, который выполняется синхронно до отрисовки страницы.

Рабочий файл: компонент; `ThemeInit.test.ts` нужен для проверки.
Изменение ограничено читаемостью и соблюдением правил ветвления.

## Реализация

- Прочитать правила проекта и навык `astro-best-practices`.
- Развернуть каждую условную ветвь в блок со скобками и отдельным телом.
- Сохранить inline-script в head, IIFE, ключ storage, последовательность
  apply и DOMContentLoaded, обработку заблокированного storage.
- Сохранить выбор light/dark/system, межвкладочную синхронизацию,
  checked-состояние radio и момент раскрытия controls.
  Не переносить script в отложенный модуль: это изменит timing темы.

## Приёмка и проверка

- Все условные ветви соответствуют code style; строки до 80 символов.
- `ThemeInit.test.ts` проходит с прежними assertions для применения темы
  до DOM readiness, системной темы, storage events и blocked storage.
- Выполнить соседнюю suite, существующий E2E-сценарий темы,
  `pnpm check` и линтер изменённых файлов. При перезагрузке с сохранённой
  темой не появляется дополнительная задержка применения оформления.
- Записать результаты и архивировать задачу по
  `docs/development/task-management.md`.

## Результат

- Все `if`-ветви inline-script оформлены отдельными блоками. Синхронный
  запуск в head, IIFE, storage key и порядок apply сохранены.
- Сохранены системная тема, cross-tab storage events, checked-состояние
  radio, раскрытие controls после DOMContentLoaded и fallback при blocked
  storage.
- `pnpm test` — полный suite: 757 тестов в 99 файлах пройдены.
- `pnpm check` — 345 файлов, 0 ошибок, 0 предупреждений и 1 hint
  о существующем deprecated API в `src/validation/content-blocks.ts`.
- ESLint и Prettier для `ThemeInit.astro` и `ThemeInit.test.ts` пройдены.
- Theme/popup E2E: 12 тестов в Chromium, Firefox и WebKit пройдены;
  дополнительный Firefox-тест явного выбора темы пройден изолированно.
  Полная preferences suite дала 22/24: два Firefox timeout при нагрузке;
  один затронул несвязанный переход на `/projects/`.
