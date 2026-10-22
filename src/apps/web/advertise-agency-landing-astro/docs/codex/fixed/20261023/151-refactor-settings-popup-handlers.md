# 151. Упростить чтение сценария Settings

Статус: завершено. Создано: 2026-10-22. Завершено: 2026-10-23.
Приоритет: средний.

## Основание и границы

В `src/components/ui/Settings.astro` script совмещает расчёт координат,
изменение открытого состояния, управление фокусом и подписки на события.
Ветви `if` без скобок встречаются в позиционировании, закрытии и
обработчиках фокуса/указателя. Они нарушают обязательный code style.

Рабочие файлы: компонент и `Settings.test.ts`. Сохранить интеграцию
с ThemeInit, ThemeToggle и opener мобильного меню.

## Реализация

- Прочитать правила проекта и навык `astro-best-practices`.
- Развернуть все условные блоки со скобками.
- Выделить именованные локальные действия открытия/закрытия и
  обработчики событий; не дублировать запись hidden/aria-expanded.
- Разнести расчёт viewport/anchor и применение координат в читаемые
  логические блоки. Объяснить поправку на содержащий блок header.
- Сохранить visualViewport offsets, ограничения размеров, ResizeObserver,
  различия keyboard/pointer, Escape и отложенную проверку focusout.
  Не добавлять поддержку нескольких экземпляров без реальной потребности.

## Приёмка и проверка

- `Settings.test.ts` сохраняет проверки координат, resize, Escape,
  внешнего pointerdown, границы фокуса и открытия мобильного меню.
- Дополнить проверки visualViewport offsets и смещения header,
  поскольку эти ветви затрагиваются при упорядочении позиционирования.
- Выполнить соседнюю suite, `pnpm check` и линтер изменённых файлов.
  В браузере проверить popup на узком экране, при увеличении масштаба
  и клавиатурном открытии; панель должна оставаться в пределах viewport.
- Записать результаты и архивировать задачу по
  `docs/development/task-management.md`.


## Результаты проверки

- Popup positioning now reads viewport and anchor values, calculates a placement, then applies coordinates; header containing-block offsets are documented.
- Opening and closing actions and event handlers are named; state attributes are written in one place per action.
- VisualViewport offsets and header origin are covered in unit tests; pointer/keyboard, Escape, focusout, mobile-menu close and resize behavior remain covered.
- Unit suite: 4 tests passed.
- Preferences E2E: 24 tests passed across Chromium, Firefox, and WebKit; mobile width, 125% page zoom, keyboard open, focus and viewport bounds verified.
- pnpm check passed: 345 files, 0 errors, 0 warnings, 1 existing deprecation hint at src/validation/content-blocks.ts:110.
- ESLint and targeted Prettier checks passed for the component and tests.
- Repository-wide pnpm format:check reports existing formatting issues in 439 files.
