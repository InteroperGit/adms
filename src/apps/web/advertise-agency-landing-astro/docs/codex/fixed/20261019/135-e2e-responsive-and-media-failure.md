# 135 — Адаптивность и геометрия при отказе изображения

Дата: 2026-10-19. Статус: pending.
Модель: `gpt-6-luna`; effort: medium.
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
- `tests/e2e/responsive.spec.ts`
- `src/components/sections/ServiceArticle.astro`
- `src/components/content/ContentImage.astro`
- `tests/fixtures/content/site/config/services.json`

Другие задачи и весь план не нужны для исполнения этого шага.

## Создать

Нет.

## Изменить или удалить

- `tests/e2e/responsive.spec.ts`

Это полный разрешённый список изменений. Статусы плана, TASKS и перенос
в fixed после приёмки оформляет координатор, чтобы не было конфликтов.

## Шаги

1. Сохрани исходный сценарий service route. Добавь параметризованную матрицу routes '/', '/projects/', '/projects/1/', '/services/neon/' × widths 320, 375, 1440 × light/dark.

2. Перед goto задай colorScheme, viewport, reducedMotion=reduce. Проверяй видимый main, единственный h1, documentElement.scrollWidth <= clientWidth+1.

3. На каждом маршруте проверяй доступность футера после scrollIntoViewIfNeeded; cookie banner на главной закрой, чтобы не смешивать измерения.

4. Для отказа изображения выбери конкретный img main на neon, до навигации abort **/favicon.svg. Дождись complete=true и naturalWidth=0, затем измерь boundingBox: ширина/высота положительны, рамка не выходит за viewport.

5. Сравни геометрию выбранного изображения с успешной загрузкой в отдельной чистой странице при тех же размерах; небольшое округление допустимо. Сам факт width/height атрибутов не доказывает стабильный layout.

6. Не добавляй screenshot snapshots и эталонные пиксели; задача проверяет читаемость и размеры через DOM.

## Проверка

```sh
pnpm test:e2e tests/e2e/responsive.spec.ts --project=chromium
```

Проверка запускается после изменений. Если браузеры ещё не установлены,
следуй `docs/development/browser-coverage.md`; не обходи permissions.
Не запускай параллельно другой e2e процесс на порту 4327.

## Готово, когда

- [ ] Выполнены все шаги.
- [ ] 24 комбинации маршрута/ширины/темы и реальный отказ изображения имеют проверяемые ожидания.
- [ ] Указанная команда завершилась успешно.
- [ ] Изменены только разрешённые файлы.

## Что вернуть координатору

Список изменённых путей, число/результат тестов, выполненную команду,
оставшиеся дефекты и путь к trace при ошибке.

