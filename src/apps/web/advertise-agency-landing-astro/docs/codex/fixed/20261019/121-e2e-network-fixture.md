# 121 — Общая блокировка внешних запросов

Дата: 2026-10-19. Статус: completed 2026-10-19.
Модель: `gpt-6-luna`; effort: medium.
Зависимости: Нет.
План: [e2e test suite](../plan/20261019_e2e-test-suite-plan.md).

## Обязательные правила

Сначала прочитай `AGENTS.md` и `docs/development/rules/*.md`.
Для чтения Astro используй обязательный `astro-best-practices`.
Один запуск выполняет только эту задачу. Production-код не менять.
Если новый сценарий выявляет дефект, верни воспроизведение координатору;
не ослабляй проверку. При незавершённой проверке статус не completed.

Все spec импортируют test/expect из `./fixtures`.
Только origin http://127.0.0.1:4327; отправки только route.fulfill.
Runtime `data/content/` не трогать; данные только versioned fixtures.
Строки кода до 80 символов. Без waitForTimeout, force:true и skip.
Playwright сам собирает и запускает preview; dev server не нужен.
Команды выполняются из корня приложения и последовательно из-за порта 4327.

## Прочитать

- `tests/e2e/site.spec.ts`
- `playwright.config.ts`

Другие задачи и весь план не нужны для исполнения этого шага.

## Создать

- `tests/e2e/fixtures.ts`

## Изменить или удалить

- `tests/e2e/site.spec.ts`

Это полный разрешённый список изменений. Статусы плана, TASKS и перенос
в fixed после приёмки оформляет координатор, чтобы не было конфликтов.

## Шаги

1. Создай fixtures.ts: импортируй base test и expect из @playwright/test; экспортируй test, расширенный через base.extend, и expect.

2. В auto fixture установи context.route('**/*') до use(). Разрешай только origin http://127.0.0.1:4327. Остальные HTTP(S) запросы прерывай. URL сравнивай через URL.origin, а не hostname.

3. Экспортируй функцию blockExternalRequests(context: BrowserContext): Promise<void>. Auto fixture вызывает её; вручную созданные контексты обязаны вызывать её до создания страницы.

4. В site.spec.ts импортируй test/expect из ./fixtures. Удали прежний beforeEach с блокировкой. В no-JavaScript сценарии сразу после browser.newContext вызови blockExternalRequests(context).

5. Не перехватывай /__fixture/inquiry отдельно в helper: обработчики конкретного теста сохраняют приоритет. Каждый сценарий отправки сам задаёт route.fulfill.

6. Добавь в site.spec.ts отдельный тест изоляции: fetch на https://example.test/blocked завершается ошибкой, а локальный document загружается. Повтори проверку для вручную созданного контекста без JS через context.request не проверяй: APIRequestContext не наследует page routing. Для него используй page.goto внешнего URL и проверку отказа, затем локального URL.

## Проверка

```sh
pnpm test:e2e tests/e2e/site.spec.ts --project=chromium
```

Проверка запускается после изменений. Если браузеры ещё не установлены,
следуй `docs/development/browser-coverage.md`; не обходи permissions.
Не запускай параллельно другой e2e процесс на порту 4327.

## Готово, когда

- [x] Выполнены все шаги.
- [x] Все исходные 8 сценариев сохранены; блокировка работает для обоих типов контекста.
- [x] Указанная команда завершилась успешно.
- [x] Изменены только разрешённые файлы.

## Что вернуть координатору

Список изменённых путей, число/результат тестов, выполненную команду,
оставшиеся дефекты и путь к trace при ошибке.

