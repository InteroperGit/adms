# 131 — Изолированные данные для формы и медиаблоков

Дата: 2026-10-19. Статус: completed. Модель: `gpt-6-luna`; effort: high.
Зависимости: 122; выполнить до 132–135. План:
[e2e test suite](../../plan/20261019_e2e-test-suite-plan.md).

## Обязательные правила

Сначала прочитай `AGENTS.md` и `docs/development/rules/*.md`. Для чтения Astro
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

- `scripts/e2e-server.mjs`
- `scripts/e2e.config.mjs`
- `src/content/service-publication.ts`
- `src/content/block-publication.ts`
- `src/content/article-context.ts`
- `src/validation/content-blocks.ts`
- `tests/fixtures/content/site/config/services.json`
- `tests/fixtures/content/site/config/projects.json`

Другие задачи и весь план не нужны для исполнения этого шага.

## Создать

- `tests/fixtures/content/e2e-overrides.json`

## Изменить или удалить

- `scripts/e2e-server.mjs`

Это полный разрешённый список изменений. Статусы плана, TASKS и перенос в fixed
после приёмки оформляет координатор, чтобы не было конфликтов.

## Шаги

1. Создай декларативный JSON с ключами services и projectBlocks. services
   содержит top-level overrides demoMode=false, copyApproved=true и overrides
   одного service id=svetovye-bukvy; projectBlocks содержит массив блоков для
   проекта id=1.

2. Для svetovye-bukvy задай confirmed=true, copyApproved=true,
   image.approved=true и article.approved=true. Сохрани остальные поля исходной
   записи. Его article.content замени paragraph и order-form:
   formId=led-letters, context=service, category=svetovye-bukvy,
   id=e2e-led-form.

3. У обоих опубликованных блоков добавь provenance: source='Synthetic E2E
   fixture', approvedBy='Synthetic E2E reviewer', approvedAt='2026-10-19'. Это
   фиктивное разрешение существует только в тестовых данных. Исходные
   fixtures/site/config не редактируй.

4. В projectBlocks добавь chart id=e2e-chart: bar, серия E2E series, точки
   Alpha=10 и Beta=20, unit=units; и video id=e2e-video,
   src=/__fixture/broken.mp4, poster=/favicon.svg, alt=E2E video, width=640,
   height=360, transcript=E2E transcript.

5. В e2e-server читай overrides JSON перед циклом копирования. Для
   config/services.json применяй только перечисленные overrides, проверяя
   наличие нужного id; для config/projects.json добавляй projectBlocks к
   article.content проекта 1. Никакого универсального deep merge.

6. Сохрани 3 проекта, их id/категории, галереи, pageSize=1 и neon. Выходные
   файлы остаются в output/playwright/content. Для demo проекта provenance
   rights у видео добавь явно, если требует schema; источник намеренно
   возвращает 404.

7. Очистка старого output и рефакторинг server lifecycle не входят в шаг.
   Фикстура не добавляет runtime URL или страницу в src/pages.

## Точный формат нового JSON

Используй следующую структуру целиком. `services.item` — патч одной записи, не
новый формат runtime content. В сервере явно перенеси флаги, объедини старый
image с item.image и старый article с item.article. Все остальные записи оставь
как есть. projectBlocks добавляй только в проект 1. У chart/video статус
наследуется от demo проекта.

```json
{
  "services": {
    "demoMode": false,
    "copyApproved": true,
    "item": {
      "id": "svetovye-bukvy",
      "confirmed": true,
      "copyApproved": true,
      "image": { "approved": true },
      "article": {
        "approved": true,
        "content": [
          {
            "type": "paragraph",
            "id": "e2e-service-copy",
            "paragraphs": ["Synthetic E2E service"],
            "provenance": {
              "source": "Synthetic E2E fixture",
              "approvedBy": "Synthetic E2E reviewer",
              "approvedAt": "2026-10-19"
            }
          },
          {
            "type": "order-form",
            "id": "e2e-led-form",
            "formId": "led-letters",
            "context": "service",
            "category": "svetovye-bukvy",
            "provenance": {
              "source": "Synthetic E2E fixture",
              "approvedBy": "Synthetic E2E reviewer",
              "approvedAt": "2026-10-19"
            }
          }
        ]
      }
    }
  },
  "projectBlocks": [
    {
      "type": "chart",
      "id": "e2e-chart",
      "chartType": "bar",
      "unit": "units",
      "series": [
        {
          "name": "E2E series",
          "points": [
            { "label": "Alpha", "value": 10 },
            { "label": "Beta", "value": 20 }
          ]
        }
      ]
    },
    {
      "type": "video",
      "id": "e2e-video",
      "src": "/__fixture/broken.mp4",
      "poster": "/favicon.svg",
      "alt": "E2E video",
      "width": 640,
      "height": 360,
      "transcript": "E2E transcript",
      "provenance": {
        "source": "Synthetic E2E fixture",
        "rights": "Synthetic test source; no external media"
      }
    }
  ]
}
```

## Проверка

```sh
pnpm test:e2e --project=chromium
```

Проверка запускается после изменений. Если браузеры ещё не установлены, следуй
`docs/development/browser-coverage.md`; не обходи permissions. Не запускай
параллельно другой e2e процесс на порту 4327.

## Готово, когда

- [x] Выполнены все шаги.
- [x] E2E сборка содержит реальную форму на /services/svetovye-bukvy/ и
      chart/video на /projects/1/; старые сценарии сохранены.
- [x] Указанная команда завершилась успешно.
- [x] Изменены только разрешённые файлы.

## Что вернуть координатору

Список изменённых путей, число/результат тестов, выполненную команду, оставшиеся
дефекты и путь к trace при ошибке.

## Результат

- Создан `tests/fixtures/content/e2e-overrides.json` и обновлён
  `scripts/e2e-server.mjs`.
- Проверена E2E сборка: форма на странице услуги, chart/video на проекте 1;
  сохранены три проекта и исходная галерея.
- Chromium: все 43 теста прошли. Runner зависал при завершении после вывода
  результатов и был остановлен вручную.
- `pnpm check`, ESLint, Prettier и `git diff --check` прошли.
