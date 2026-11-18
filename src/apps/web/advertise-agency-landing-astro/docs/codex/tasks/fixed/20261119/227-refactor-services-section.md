# 227. Упростить композицию списка услуг в `Services`

- **Executor:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `medium`.

Статус — fixed. Создана 2026-11-18, выполнена 2026-11-19.

- [Исходная секция](../../../../src/components/sections/Services.astro)
- [Компонентный тест](../../../../src/components/sections/Services.test.ts)
- [Структура компонентов из задачи 215](../todo/215-reorganize-components-by-responsibility.md)

## Scope

- Упростить заголовок, заметку демо-режима и сетку в `Services.astro`. Сверить
  возможность повторно использовать `ui/Section.astro` с сохранением
  `aria-labelledby`, разметки и отступов.
- Сохранить `services/ServiceCard.astro` границей карточки. Выбор `items` и
  условие скрытия относятся к секции.
- Пути в плане указаны относительно `src/components/`. Точку входа
  `sections/Services.astro` использует `src/pages/index.astro`.
- Сохранить внешние контракты секции и текущие границы контента и фикстур.

## Execution

- При постановке применены `grilling`, `ponytail` и `astro-best-practices`. Для
  реализации применить `ponytail`, `astro-best-practices` и `playwright`.
- Роли и усилие указаны в заголовке. Основной агент выполняет роли и ведёт
  интеграцию.
- [ ] Прочитать правила workflow, code style, architecture, design, testing и
      verification. Сверить секцию, её потребителей и текущие тесты.
- [ ] Выполнить рефакторинг по Scope. Проверить владельцев scoped CSS.
- [ ] Обновить `Services.test.ts` и добавить colocated-тесты для новых
      компонентов согласно testing. Проверить композицию главной через
      `tests/integration/shellHomeLegal.test.ts`.
- [ ] Выполнить целевые тесты, проверку формата затронутых файлов,
      `pnpm check:style`, `pnpm check`, `pnpm verify:boundaries` и
      `pnpm verify:component-tests`.
- [ ] Проверить явный и стандартный набор услуг, пустую ветку и сетку в
      браузере.
- [ ] Проверить diff и критерии приёмки, записать результаты и решения в
      Handoff, обновить статус и ссылки согласно workflow.

## Acceptance

- [ ] Сохраняются явно переданный `items`, порядок `visibleServices` по
      умолчанию и отсутствие секции для пустого списка.
- [ ] Демо-уведомление отображается только в демо-режиме. Сохраняются заголовок,
      `#services`, ссылки карточек и адаптивная сетка.
- [ ] Целевые проверки проходят. У выделенных компонентов тесты лежат рядом с
      исходниками, а локальные стили следуют за принадлежащей им разметкой.

## Handoff

Выполнено 2026-11-19. `Services.astro` остаётся в корне секций, так как новые
компоненты секции не создавались. Сохранил ручную секцию и
`aria-labelledby="services-heading"`: общий `Section` не задаёт ID заголовка.
Markup заметки demo-mode и сетки упрощён; `ServiceCard` и владельцы
публикационной фильтрации не менялись.

Проверки: 25 component/integration тестов прошли. Chromium E2E проверил
именованную ссылку, порядок секции и сетку на мобильной и широкой ширине.
Astro check: 0 errors, 0 warnings, 1 существующая Zod deprecation hint. Style,
Prettier, content boundaries и component test colocation прошли.
