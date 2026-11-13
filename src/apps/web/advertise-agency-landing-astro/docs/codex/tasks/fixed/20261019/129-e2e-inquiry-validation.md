# 129 — Валидация общей формы

Дата: 2026-10-19. Статус: completed. Модель: `gpt-6-luna`; effort: medium.
Зависимости: 122. План:
[e2e test suite](../../plan/20261019_e2e-test-suite-plan.md).

## Обязательные правила

Сначала прочитай `AGENTS.md` и `docs/rules/development/rules/*.md`. Для чтения Astro
используй обязательный `astro-best-practices`. Один запуск выполняет только эту
задачу. Production-код не менять. Если новый сценарий выявляет дефект, верни
воспроизведение координатору; не ослабляй проверку. При незавершённой проверке
статус не completed.

Все spec импортируют test/expect из `./fixtures`. Только origin
http://127.0.0.1:4327; отправки только route.fulfill. Runtime `data/content/` не
трогать; данные только versioned fixtures. Строки кода до 80 символов. Без
waitForTimeout, force:true и skip. Playwright сам собирает и запускает preview;
dev server не нужен. Команды выполняются из корня приложения и последовательно
из-за порта 4327.

## Прочитать

- `tests/e2e/fixtures.ts`
- `tests/e2e/inquiry-delivery.spec.ts`
- `src/components/forms/order-inquiry.ts`
- `src/components/sections/OrderInquiry.astro`
- `tests/fixtures/content/site/config/order-inquiry.json`

Другие задачи и весь план не нужны для исполнения этого шага.

## Создать

- `tests/e2e/inquiry-validation.spec.ts`

## Изменить или удалить

Нет.

Это полный разрешённый список изменений. Статусы плана, TASKS и перенос в fixed
после приёмки оформляет координатор, чтобы не было конфликтов.

## Шаги

1. Все тесты работают с #order-inquiry form. До goto установи route endpoint;
   считай запросы, отвечай только синтетическим receipt.

2. Отправь пустую форму: TEST_INVALID, фокус на первом ошибочном поле,
   aria-invalid=true и связанный через aria-describedby видимый текст ошибки.
   Запросов нет.

3. Заполни name/message, email=wrong, consent=true: email невалиден, фокус на
   email, запросов нет.

4. При валидных полях и consent=false запросов нет, checkbox обозначен
   ошибочным.

5. Исправь ошибочный email обычным fill: aria-invalid=false, прежнее сообщение
   скрыто. Заполни остальные поля и consent, отправь: ровно один запрос и
   TEST_SUCCESS.

6. В каждом тесте проверяй самостоятельный результат. Не тестируй maxlength
   через fill строки больше лимита: браузер может обрезать её до клиентской
   проверки.

## Проверка

```sh
pnpm test:e2e tests/e2e/inquiry-validation.spec.ts --project=chromium
```

Проверка запускается после изменений. Если браузеры ещё не установлены, следуй
`docs/rules/development/browser-coverage.md`; не обходи permissions. Не запускай
параллельно другой e2e процесс на порту 4327.

## Готово, когда

- [x] Выполнены все шаги.
- [x] Ошибки доступны пользователю, исправляются вводом и предотвращают fetch.
- [x] Указанная команда завершилась успешно.
- [x] Изменены только разрешённые файлы.

## Что вернуть координатору

Список изменённых путей, число/результат тестов, выполненную команду, оставшиеся
дефекты и путь к trace при ошибке.

## Результат

- Создан `tests/e2e/inquiry-validation.spec.ts`.
- Chromium: 4 теста пройдены командой из раздела «Проверка».
- Дефекты не обнаружены; trace не создавался.
