# 122 — Разделить исходные сценарии по файлам

Дата: 2026-10-19. Статус: completed.
Модель: `gpt-6-luna`; effort: medium.
Зависимости: 121.
План: [e2e test suite](../../plan/20261019_e2e-test-suite-plan.md).

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
- `tests/e2e/fixtures.ts`

Другие задачи и весь план не нужны для исполнения этого шага.

## Создать

- `tests/e2e/preferences.spec.ts`
- `tests/e2e/navigation.spec.ts`
- `tests/e2e/carousel.spec.ts`
- `tests/e2e/catalog.spec.ts`
- `tests/e2e/gallery.spec.ts`
- `tests/e2e/responsive.spec.ts`
- `tests/e2e/no-javascript.spec.ts`
- `tests/e2e/inquiry-delivery.spec.ts`
- `tests/e2e/network.spec.ts`

## Изменить или удалить

- `tests/e2e/site.spec.ts`

Это полный разрешённый список изменений. Статусы плана, TASKS и перенос
в fixed после приёмки оформляет координатор, чтобы не было конфликтов.

## Шаги

1. Перенеси cookie/theme часть первого теста в preferences.spec.ts, mobile menu часть — в navigation.spec.ts. Оба теста начинают с новой страницы; навигация сама закрывает cookie banner.

2. Остальные исходные тесты перенеси по темам: reduced motion → carousel; catalog → catalog; gallery → gallery; service/media → responsive; no-JS → no-javascript; retry и unavailable → inquiry-delivery. Тест изоляции задачи 121 → network.

3. Во всех spec используй test/expect из ./fixtures. Ручной no-JS контекст сохраняет явную blockExternalRequests.

4. Исходные assertions сохрани. Раскрой искусственно склеенные названия тестов в читаемые строки длиной до 80 символов.

5. После переноса удали site.spec.ts. В итоговом наборе минимум 10 тестов: 8 исходных, разделение первого на два и тест изоляции. Если 121 разделила изоляцию на два теста, итог на один больше.

6. Новые сценарии из последующих задач пока не добавляй.

## Проверка

```sh
pnpm test:e2e --project=chromium
```

Проверка запускается после изменений. Если браузеры ещё не установлены,
следуй `docs/development/browser-coverage.md`; не обходи permissions.
Не запускай параллельно другой e2e процесс на порту 4327.

## Готово, когда

- [ ] Выполнены все шаги.
- [ ] Исходные проверки находятся в тематических файлах, site.spec.ts удалён.
- [ ] Указанная команда завершилась успешно.
- [ ] Изменены только разрешённые файлы.

## Что вернуть координатору

Список изменённых путей, число/результат тестов, выполненную команду,
оставшиеся дефекты и путь к trace при ошибке.

