# 223. Разделить последовательность и карточку этапа заказа в `OrderingProcess`

- **Executor:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `medium`.

Статус — fixed. Создана и выполнена 2026-11-18.

- [Исходная секция](../../../../src/components/sections/OrderingProcess.astro)
- [Компонентный тест](../../../../src/components/sections/OrderingProcess.test.ts)
- [Структура компонентов из задачи 215](../todo/215-reorganize-components-by-responsibility.md)

## Scope

- Оставить `ol` и сетку этапов в `OrderingProcess.astro`. Вынести `li` с
  карточкой в `sections/ordering-process/OrderingStep.astro`, передав шаг и его
  номер из индекса обхода.
- В карточке собрать повторяющуюся пару заголовка и списка обязанностей в
  `sections/ordering-process/OrderingResponsibilities.astro`. Сохранить классы и
  состояния фокуса там, где отрисованы элементы.
- Пути в плане указаны относительно `src/components/`. Точку входа
  `sections/OrderingProcess.astro` использует `src/pages/index.astro`.
- Сохранить внешние контракты секции и текущие границы контента и фикстур.

## Execution

- При постановке применены `grilling`, `ponytail` и `astro-best-practices`. Для
  реализации применить `ponytail`, `astro-best-practices` и `playwright`.
- Роли и усилие указаны в заголовке. Основной агент выполняет роли и ведёт
  интеграцию.
- [ ] Прочитать правила workflow, code style, architecture, design, testing и
      verification. Сверить секцию, её потребителей и текущие тесты.
- [ ] Выполнить рефакторинг по Scope. Проверить владельцев scoped CSS.
- [ ] Обновить `OrderingProcess.test.ts` и добавить colocated-тесты для новых
      компонентов согласно testing. Проверить композицию главной через
      `tests/integration/shellHomeLegal.test.ts`.
- [ ] Выполнить целевые тесты, проверку формата затронутых файлов,
      `pnpm check:style`, `pnpm check`, `pnpm verify:boundaries` и
      `pnpm verify:component-tests`.
- [ ] Проверить порядок фокуса, сетку на узком и широком экранах и режим reduced
      motion.
- [ ] Проверить diff и критерии приёмки, записать результаты и решения в
      Handoff, обновить статус и ссылки согласно workflow.

## Acceptance

- [ ] Порядок, номера, иконки и обе группы обязанностей совпадают с
      конфигурацией, а `li` остаются прямыми детьми `ol`.
- [ ] Фокус карточек, reduced motion, сетка при существующих брейкпоинтах и
      ссылка `/#order-inquiry` сохраняются.
- [ ] Целевые проверки проходят. У выделенных компонентов тесты лежат рядом с
      исходниками, а локальные стили следуют за принадлежащей им разметкой.

## Handoff

Выполнено 2026-11-18. Компонент секции и его тест перемещены в
`src/components/sections/ordering-process/`. Секция владеет интро, прямыми
детьми `ol`, сеткой и действием; `OrderingStep` владеет номером, карточкой,
фокусом, иконкой и описанием; `OrderingResponsibilities` владеет парой списков.

Проверки: 20 unit/integration-тестов прошли, Astro check завершился без ошибок
и предупреждений (одна существующая подсказка о deprecation в Zod), E2E
Chromium подтвердил прямые `li`, порядок, фокус, 1/2/3-колоночную сетку на
мобильном/десктопном размере, reduced motion и ссылку на форму. Также прошли
style, Prettier, границы контента и colocation компонентных тестов.
