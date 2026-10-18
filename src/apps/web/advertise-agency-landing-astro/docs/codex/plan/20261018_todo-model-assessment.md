# Модели для задач TODO

Дата оценки: 2026-10-18. Область: все 11 файлов в `docs/codex/todo/`,
задачи 103–113. Цель — экономить ресурсы, выбирая Luna для ограниченной
работы с понятными contracts и критериями готовности.

## Выбор модели

Это инженерная оценка по описаниям задач, существующим test suites,
`tests/helpers/render.ts`, catalog script и конфигурации Vitest/TypeScript.
Сравнительные прогоны моделей не проводились; достаточность модели нужно
подтверждать исходными критериями готовности задачи.

Используем точные названия:

- Luna — `gpt-6-luna`; основной выбор.
- Sol — `gpt-6.1-sol`; для общего harness и связанного состояния.
- Astra — `gpt-6-astra`; текущие задачи не требуют её по умолчанию.

Официальная документация описывает Luna как модель для ограниченных задач,
а Sol — для сложной технической работы. Распределение конкретных задач
ниже — оценка проекта, а не опубликованный benchmark OpenAI.

Источники:

- [OpenAI: выбор моделей][selection].
- [OpenAI: GPT-6 Luna][luna].

[selection]: https://developers.openai.com/api/docs/guides/model-selection
[luna]: https://developers.openai.com/api/docs/models/gpt-6-luna

## Сводка

В каждой задаче добавлены модель, обоснование, effort и checklist подзадач
для отдельных запусков. Подзадачи остаются внутри исходных файлов, чтобы
сохранить номера задач, ссылки, зависимости и критерии приёмки.

| Задача | Одна модель на всю задачу | Экономный порядок |
| --- | --- | --- |
| [103 — cards][t103] | Luna medium | 3 шага Luna |
| [104 — basic blocks][t104] | Luna medium | 4 шага Luna |
| [105 — media/form blocks][t105] | Luna high | 4 шага Luna |
| [106 — forms][t106] | Luna medium | 2 шага Luna |
| [107 — home sections][t107] | Luna high | 4 шага Luna |
| [108 — article/contacts][t108] | Sol medium | 3 Luna + article на Sol |
| [109 — catalog components][t109] | Luna high | 4 шага Luna |
| [110 — catalog script][t110] | Sol high | 2 Luna + 2 Sol |
| [111 — global components][t111] | Sol high | 2 Luna + Header на Sol |
| [112 — layouts/pages][t112] | Sol high | Sol harness → 3 Luna → Sol |
| [113 — routes/types][t113] | Sol medium | 3 Luna + 2 Sol |

Итого: 6 задач целиком на Luna, 5 со смешанным исполнением. После разбиения
34 из 42 подзадач назначены Luna, 8 — Sol. Это количество шагов, а не оценка
процента экономии: длительность, контекст и число итераций различаются.

## Как выполнять экономно

1. Соблюдать зависимости исходной задачи; внутренние стрелки задают
   дополнительный порядок. Подзадачи — отдельные запуски, их не требуется
   выполнять одновременно или делегировать агентам.
2. Перед каждой подзадачей сверить существующие assertions с её сценариями.
   Часть suites уже содержательная: сохранять полезные проверки и дополнять
   пробелы, не переписывать тесты ради выполнения checklist.
3. Давать Luna исходную задачу, конкретный шаг, целевые файлы, ближайший
   готовый suite и нужные helpers. Общие правила проекта обязательны;
   полный план и остальные test suites читать по необходимости.
4. Начинать с указанного effort. `medium` достаточно для локального HTML/API;
   `high` нужен для media/publication branches, timers и pagination.
5. Передавать между шагами перечень изменённых файлов, готовые fixtures,
   API helper, результат целевых проверок и оставшиеся проблемы. Fixtures
   хранить в `tests/fixtures/content/`, runtime content — в `data/content/`.
6. При реализации проверять затронутые suites и исходные acceptance criteria.
   Общие пороги покрытия не уменьшать; composition и route checks оставлять
   в `tests/integration`. Этой оценкой выполнение тестовых задач не закрыто.

## Когда переключать модель

Luna остаётся основным исполнителем, пока работа укладывается в описанный
шаг. Переходить к Sol при конкретном усложнении: нужен новый общий harness,
не удаётся изолировать lifecycle/listeners/timers либо обнаружено расхождение
между несколькими publication/route contracts. Передавать воспроизводимую
ошибку и уже проверенные гипотезы; после исправления общей основы возвращать
оставшиеся локальные проверки Luna.

Для шагов Sol не требуется автоматически назначать ещё один review на Sol
или Astra. Astra выбирать только при новом основании: неустранённая сложная
проблема архитектуры или диагностики после предметной работы Sol.

[t103]: ../todo/103-card-components-tests.md
[t104]: ../todo/104-basic-content-block-components.md
[t105]: ../todo/105-media-and-form-block-components.md
[t106]: ../todo/106-form-components.md
[t107]: ../todo/107-home-sections.md
[t108]: ../todo/108-article-and-contact-sections.md
[t109]: ../todo/109-project-catalog-components.md
[t110]: ../todo/110-project-catalog-script.md
[t111]: ../todo/111-global-components.md
[t112]: ../todo/112-layouts-and-pages.md
[t113]: ../todo/113-route-and-type-contracts.md
