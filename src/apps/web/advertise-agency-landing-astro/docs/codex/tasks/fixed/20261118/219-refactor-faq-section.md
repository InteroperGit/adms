# 219. Вынести повторяемое раскрытие ответа FAQ в `Faq`

- **Executor:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `medium`.

Статус — fixed. Создана и выполнена 2026-11-18.

- [Секция](../../../../../src/components/sections/faq/Faq.astro)
- [Тест секции](../../../../../src/components/sections/faq/Faq.test.ts)
- [Структура компонентов из задачи 215](../../todo/215-reorganize-components-by-responsibility.md)

## Scope

- Поместить `FaqItem.astro` в `sections/faq/`. Компонент владеет
  `details`/`summary`, ответом и стилями открытия и фокуса.
- Оставить `getVisibleFaqItems`, скрытие пустой секции, демо-уведомление и
  ссылку на заявку в `Faq.astro`.
- Пути в плане указаны относительно `src/components/`. Точку входа
  `sections/Faq.astro` использует `src/pages/index.astro`.
- Сохранить внешние контракты секции и текущие границы контента и фикстур.

## Execution

- При постановке применены `grilling`, `ponytail` и `astro-best-practices`. Для
  реализации применить `ponytail`, `astro-best-practices` и `playwright`.
- Роли и усилие указаны в заголовке. Основной агент выполняет роли и ведёт
  интеграцию.
- [x] Прочитать правила workflow, code style, architecture, design, testing и
      verification. Сверить секцию, её потребителей и текущие тесты.
- [x] Выполнить рефакторинг по Scope. Проверить владельцев scoped CSS.
- [x] Обновить `Faq.test.ts` и добавить colocated-тесты для новых компонентов
      согласно testing. Проверить композицию главной через
      `tests/integration/shellHomeLegal.test.ts`.
- [x] Выполнить целевые тесты, проверку формата затронутых файлов,
      `pnpm check:style`, `pnpm check`, `pnpm verify:boundaries` и
      `pnpm verify:component-tests`.
- [x] Проверить публикационные ветки и нативное раскрытие через DOM-тесты.
- [x] Проверить diff и критерии приёмки, записать результаты и решения в
      Handoff, обновить статус и ссылки согласно workflow.

## Acceptance

- [x] FAQ скрывается при пустом наборе опубликованных ответов. В демо-режиме
      сохраняются уведомление и редакционный порядок.
- [x] Пункты с ID `faq-*` остаются нативными disclosure без клиентского JavaScript.
- [x] Целевые проверки проходят. У выделенных компонентов тесты лежат рядом с
      исходниками, а локальные стили следуют за принадлежащей им разметкой.

## Handoff

Выполнено 2026-11-18 Luna (`gpt-6-luna`), reasoning medium.

`FaqItem` владеет нативным `details/summary`, стабильным `faq-*` ID,
ответом и стилями disclosure. Публикационная фильтрация, демо-уведомление и
ссылка на заявку остались в секции.

Прошли 19 целевых тестов, включая homepage integration. Также прошли
`pnpm check`, `pnpm check:style`, `pnpm verify:boundaries`,
`pnpm verify:component-tests` и Prettier. Компонентный тест проверяет
закрытое начальное состояние и нативную структуру без JavaScript.

Runtime содержит только черновики, поэтому браузерный клик по FAQ главной
страницы недоступен без изменения runtime-контента.
