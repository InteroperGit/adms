# 218. Выделить карту и статическую замену контактов в `Contacts`

- **Executor:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `medium`.

Статус — fixed. Создана и выполнена 2026-11-18.

- [Секция](../../../../../src/components/sections/Contacts.astro)
- [Тест секции](../../../../../src/components/sections/Contacts.test.ts)
- [Структура компонентов из задачи 215](../../todo/215-reorganize-components-by-responsibility.md)

## Scope

- Вынести `ContactsMap.astro` в `sections/contacts/`. Компонент принимает
  параметры карты и изображения, владеет выбором `iframe` или `img` и задаёт
  размеры области.
- Оставить сетку и заголовок в `Contacts.astro`, контактные данные показать
  существующим `site-shell/contacts/ContactInfo.astro`.
- Пути в плане указаны относительно `src/components/`. Точку входа
  `sections/Contacts.astro` использует `src/pages/index.astro`.
- Сохранить внешние контракты секции и текущие границы контента и фикстур.

## Execution

- При постановке применены `grilling`, `ponytail` и `astro-best-practices`. Для
  реализации применить `ponytail`, `astro-best-practices` и `playwright`.
- Роли и усилие указаны в заголовке. Основной агент выполняет роли и ведёт
  интеграцию.
- [x] Прочитать правила workflow, code style, architecture, design, testing и
      verification. Сверить секцию, её потребителей и текущие тесты.
- [x] Выполнить рефакторинг по Scope. Проверить владельцев scoped CSS.
- [x] Обновить `Contacts.test.ts` и добавить colocated-тесты для новых
      компонентов согласно testing. Проверить композицию главной через
      `tests/integration/shellHomeLegal.test.ts`.
- [x] Выполнить целевые тесты, проверку формата затронутых файлов,
      `pnpm check:style`, `pnpm check`, `pnpm verify:boundaries` и
      `pnpm verify:component-tests`.
- [x] Проверить обе ветки, узкую сетку и доступность контактов при блокировке
      карты.
- [x] Проверить diff и критерии приёмки, записать результаты и решения в
      Handoff, обновить статус и ссылки согласно workflow.

## Acceptance

- [x] При включённой карте виден отложенно загружаемый `iframe` с доступным
      названием. При выключенной карте виден `img` с заданными размерами и
      `alt`.
- [x] На узком экране контактные ссылки остаются доступны перед картой, ширина
      секции соответствует контейнеру.
- [x] Целевые проверки проходят. У выделенных компонентов тесты лежат рядом с
      исходниками, а локальные стили следуют за принадлежащей им разметкой.

## Handoff

Выполнено 2026-11-18 Luna (`gpt-6-luna`), reasoning medium.

`ContactsMap` владеет iframe/fallback выбором и геометрией карты. Секция
сохраняет заголовок, сетку и существующий `ContactInfo`.

Прошли 20 целевых тестов, включая homepage integration. Также прошли
`pnpm check`, `pnpm check:style`, `pnpm verify:boundaries`,
`pnpm verify:component-tests` и Prettier.

DOM-тесты подтвердили lazy iframe с доступным названием и fallback `img`
с `alt` и размерами fixture. Playwright проверил ширины 375px и 1440px,
порядок телефонной и почтовой ссылок перед картой, границы секции и отсутствие
горизонтального overflow. В текущем runtime карта отключена, поэтому браузер
показывал локальное fallback-изображение. Скриншоты сохранены в
`output/playwright/task-218/`.
