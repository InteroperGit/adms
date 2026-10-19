# 133 — Диаграмма и fallback видео

Дата: 2026-10-19. Статус: pending.
Модель: `gpt-6-luna`; effort: high.
Зависимости: 131.
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

- `tests/e2e/fixtures.ts`
- `tests/fixtures/content/e2e-overrides.json`
- `src/components/content/ChartBlock.astro`
- `src/components/content/VideoBlock.astro`
- `src/scripts/chart-runtime.ts`

Другие задачи и весь план не нужны для исполнения этого шага.

## Создать

- `tests/e2e/content-media.spec.ts`

## Изменить или удалить

Нет.

Это полный разрешённый список изменений. Статусы плана, TASKS и перенос
в fixed после приёмки оформляет координатор, чтобы не было конфликтов.

## Шаги

1. На /projects/1/ прокрути [data-chart-figure="chart-e2e-chart"] в viewport. Жди canvas ненулевого размера; проверь сохранение canvas после resize 1440→375, без чтения private API ECharts.

2. Открой details диаграммы обычным кликом по summary. Таблица содержит Alpha/Beta и 10/20 units; это независимый читаемый источник данных.

3. Отдельный тест блокирует только chunk chart-runtime: до goto установи route с RegExp /\/chart-runtime[^/]*\.js(?:\?.*)?$/. По requestfailed подтверди, что перехвачен именно скрипт. Сверь имя с emitted output/playwright/site/_astro, если шаблон не совпал. Таблица всё ещё открывается; canvas отсутствует. Весь /_astro/** не блокируй.

4. Для video до goto перехвати **/__fixture/broken.mp4 с 404. Прокрути video в viewport. Проверь фактический data-video-state=error и видимую .video-error ссылку на исходный src.

5. Раскрой .video-transcript, проверь E2E transcript. Размеры video остаются положительными после ошибки, доступен controls.

6. Не вызывай dispatchEvent('error') для прохождения теста. Если реальная ошибка source не доходит до video listener, зафиксируй воспроизведение как дефект приложения, по общему правилу остановки из плана.

## Проверка

```sh
pnpm test:e2e tests/e2e/content-media.spec.ts --project=chromium
```

Проверка запускается после изменений. Если браузеры ещё не установлены,
следуй `docs/development/browser-coverage.md`; не обходи permissions.
Не запускай параллельно другой e2e процесс на порту 4327.

## Готово, когда

- [ ] Выполнены все шаги.
- [ ] Диаграмма работает в браузере и сохраняет таблицу при отказе runtime; видео проверяется настоящим отказом загрузки.
- [ ] Указанная команда завершилась успешно.
- [ ] Изменены только разрешённые файлы.

## Что вернуть координатору

Список изменённых путей, число/результат тестов, выполненную команду,
оставшиеся дефекты и путь к trace при ошибке.

