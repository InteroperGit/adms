# 126 — Поиск, категории и восстановление каталога

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
- `tests/e2e/catalog.spec.ts`
- `src/scripts/project-catalog.ts`
- `tests/fixtures/content/site/config/projects.json`
- `tests/fixtures/content/site/config/project-categories.json`

Другие задачи и весь план не нужны для исполнения этого шага.

## Создать

Нет.

## Изменить или удалить

- `tests/e2e/catalog.spec.ts`

Это полный разрешённый список изменений. Статусы плана, TASKS и перенос в fixed
после приёмки оформляет координатор, чтобы не было конфликтов.

## Шаги

1. Сохрани исходный сценарий каталога. Добавь независимые сценарии поиска и
   истории в этот же файл.

2. Фикстуры: id 1/2 имеют category=sample, id 3 — other; pageSize=1. Для поиска
   Synthetic project 2 ожидай ровно видимую ссылку /projects/2/ и count=1.

3. После q=zzzz-no-match виден [data-catalog-search-empty], нет видимых
   карточек, нет доступной пагинации.

4. Выбор category=other оставляет /projects/3/ и count=1. Выбор sample даёт
   count=2; на первой странице видима одна карточка из-за pageSize.

5. Проверь пересечение запроса Synthetic project 2 с category=sample и reset
   через [data-catalog-reset]: query/category очищены, URL возвращается к
   /projects/, count=3.

6. Прямой goto('/projects/?q=Synthetic%20project%202&category=sample'), reload,
   Back и Forward должны восстанавливать поля, видимые карточки и count.

7. Порядок query-параметров не фиксируй; проверяй new
   URL(page.url()).searchParams. На debounce жди expect UI/URL.

## Проверка

```sh
pnpm test:e2e tests/e2e/catalog.spec.ts --project=chromium
```

Проверка запускается после изменений. Если браузеры ещё не установлены, следуй
`docs/rules/development/browser-coverage.md`; не обходи permissions. Не запускай
параллельно другой e2e процесс на порту 4327.

## Готово, когда

- [x] Выполнены все шаги.
- [x] Проверки подтверждают содержимое выдачи и формы, а не только URL.
- [x] Указанная команда завершилась успешно.
- [x] Изменены только разрешённые файлы.

## Что вернуть координатору

Список изменённых путей, число/результат тестов, выполненную команду, оставшиеся
дефекты и путь к trace при ошибке.

## Результат

- Изменён `tests/e2e/catalog.spec.ts`.
- Chromium: 3 теста пройдены командой из раздела «Проверка».
- Дефекты не обнаружены; trace не создавался.
