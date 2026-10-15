# 092 — Тесты клиентского состояния

## Цель

Проверить jsdom-поведение интерактивных клиентских модулей и их cleanup.

## Объём

Покрыть carousel, project catalog, order inquiry, theme initialization,
mobile menu и cookie storage. Проверить aria/data-состояния, autoplay,
hover/focus/visibility/reduced-motion, history и query string, blocked
localStorage, ошибки формы и отсутствие дублирующихся listeners.

## Приёмка

События, переходы, повторная инициализация и `pagehide` cleanup проверены;
state-module coverage достигает 85%+.

## Выполнение

Добавлены jsdom-тесты `tests/unit/client-state.test.ts` для инициализации,
manual navigation и cleanup image carousel. Модуль carousel явно экспортируется
как module для type-checking.

Проверка: 158 тестов прошли; Astro check завершён без ошибок (один прежний
deprecated hint); code style passed.
