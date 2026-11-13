# 136 — Полный прогон и документация покрытия

Дата: 2026-10-19. Статус: completed. Модель: `gpt-6-luna`; effort: medium.
Зависимости: 121–135 завершены. План:
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

- `playwright.config.ts`
- `package.json`
- `.github/workflows/quality.yml`
- `docs/rules/development/browser-coverage.md`
- `docs/rules/development/verification-and-ci.md`

Другие задачи и весь план не нужны для исполнения этого шага.

## Создать

Нет.

## Изменить или удалить

- `docs/rules/development/browser-coverage.md`
- `docs/rules/development/verification-and-ci.md`

Это полный разрешённый список изменений. Статусы плана, TASKS и перенос в fixed
после приёмки оформляет координатор, чтобы не было конфликтов.

## Шаги

1. В browser-coverage перечисли итоговые spec, назначение fixtures.ts, overrides
   JSON, маршруты данных и реальные ограничения покрытия.

2. Укажи команды одного файла в Chromium, всех трёх браузеров, диагностики
   trace/report. Укажи порт 4327, production preview и принадлежность процесса
   Playwright.

3. В verification-and-ci согласуй только описание E2E с итогом. CI уже запускает
   pnpm test:e2e и ставит три браузера: package.json, config и workflow не
   требуют изменения.

4. Запусти весь pnpm test:e2e на Chromium/Firefox/WebKit. Затем повтори только
   E2E с --repeat-each=2, чтобы обнаружить зависимость от порядка/состояния.
   Непрошедшие сценарии не закрывай через skip, timeout inflation или ослабление
   assertions.

5. Запусти pnpm check:style и focused prettier/eslint для изменённых TS/MJS/JSON
   файлов. Если общий gate падает вне diff, сохрани точную ошибку отдельно.

6. В результат запиши число сценариев, browsers, failures/retries, команды и
   ограничения. Не заявляй реальную доставку писем, физические mobile devices,
   воспроизведение видео или числовое покрытие E2E.

7. После проверки координатор обновляет статусы плана, переносит выполненные
   task files в fixed/YYYYMMDD и обновляет ссылки. Это правило относится ко всем
   задачам, а не только к 136.

## Проверка

```sh
pnpm test:e2e
```

Проверка запускается после изменений. Если браузеры ещё не установлены, следуй
`docs/rules/development/browser-coverage.md`; не обходи permissions. Не запускай
параллельно другой e2e процесс на порту 4327.

## Готово, когда

- [ ] Выполнены все шаги.
- [ ] Полный набор проходит в трёх браузерах, повторяемость проверена,
      документация соответствует фактическому набору.
- [ ] Указанная команда завершилась успешно.
- [ ] Изменены только разрешённые файлы.

## Что вернуть координатору

Список изменённых путей, число/результат тестов, выполненную команду, оставшиеся
дефекты и путь к trace при ошибке.

## Результат

Проверены 234 сценария в Chromium, Firefox и WebKit. После исправления
медиа-сценария все 9 тестов `content-media.spec.ts` проходят во всех трёх
браузерах. Также прошли focused cross-browser regressions (12 тестов),
компонентные тесты (28 тестов), `pnpm check:style`, Prettier и ESLint.
