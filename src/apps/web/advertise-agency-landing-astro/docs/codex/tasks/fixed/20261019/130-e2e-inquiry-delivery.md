# 130 — Доставка, повтор и подтверждение приёма

Дата: 2026-10-19. Статус: completed. Модель: `gpt-6-luna`; effort: medium.
Зависимости: 129. План:
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
- `tests/fixtures/content/site/config/order-inquiry.json`

Другие задачи и весь план не нужны для исполнения этого шага.

## Создать

Нет.

## Изменить или удалить

- `tests/e2e/inquiry-delivery.spec.ts`

Это полный разрешённый список изменений. Статусы плана, TASKS и перенос в fixed
после приёмки оформляет координатор, чтобы не было конфликтов.

## Шаги

1. Сохрани исходные unavailable и 503→200 сценарии. Для unavailable меняй только
   атрибут #order-inquiry form в перехваченном HTML, без глобальной replace
   первой подстроки.

2. Удержи первый route через Promise с явным release. Пока запрос висит,
   fieldset и submit disabled, aria-busy=true, TEST_SENDING. Повторный submit
   через requestSubmit не увеличивает счётчик. После release с receipt форма
   сбрасывается и блокировки сняты.

3. Параметризуй ответы 200: accepted=false; accepted=true без receiptId;
   accepted=true с пустым receiptId; невалидный JSON. Каждый даёт TEST_FAILURE,
   сохраняет введённое и позволяет повтор.

4. После ошибки повтор без изменения полей сохраняет requestId; после изменения
   message следующий запрос получает другой requestId.

5. После подтверждённого успеха новая заполненная заявка получает новый
   requestId. Фокус после успеха/ошибки находится на [role=status].

6. Смоделируй route.abort и отдельно timeout: маршрут ожидает явного
   освобождения, тест ждёт TEST_FAILURE в пределах timeoutMs плюс запас, затем
   освобождает маршрут в finally. Не используй waitForTimeout.

## Проверка

```sh
pnpm test:e2e tests/e2e/inquiry-delivery.spec.ts --project=chromium
```

Проверка запускается после изменений. Если браузеры ещё не установлены, следуй
`docs/rules/development/browser-coverage.md`; не обходи permissions. Не запускай
параллельно другой e2e процесс на порту 4327.

## Готово, когда

- [x] Выполнены все шаги.
- [x] Нет ложного успеха, повторной отправки во время pending и потери данных
      при ошибке.
- [x] Указанная команда завершилась успешно.
- [x] Изменены только разрешённые файлы.

## Что вернуть координатору

Список изменённых путей, число/результат тестов, выполненную команду, оставшиеся
дефекты и путь к trace при ошибке.

## Результат

- Расширен `tests/e2e/inquiry-delivery.spec.ts`.
- Chromium: 10 тестов пройдены командой из раздела «Проверка».
- Prettier, ESLint и `git diff --check` прошли.
- Дефектов не обнаружено; неудачная диагностика первого варианта
  pending-сценария была устранена в тестовом коде.
