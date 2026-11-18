# 225. Упростить композицию избранных проектов в `Projects`

- **Executor:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `medium`.

Статус — fixed. Создана 2026-11-18, выполнена 2026-11-19.

- [Исходная секция](../../../../src/components/sections/Projects.astro)
- [Компонентный тест](../../../../src/components/sections/Projects.test.ts)
- [Структура компонентов из задачи 215](../todo/215-reorganize-components-by-responsibility.md)

## Scope

- Упростить ветвление списка и пустого состояния в `Projects.astro`, оставив
  отбор первых трёх и ссылку на каталог в секции.
- Переиспользовать `projects/ProjectCard.astro`. Сетка из трёх карточек остаётся
  локальной для главной, каталог сохраняет свою композицию с фильтрами и
  пагинацией.
- Пути в плане указаны относительно `src/components/`. Точку входа
  `sections/Projects.astro` использует `src/pages/index.astro`.
- Сохранить внешние контракты секции и текущие границы контента и фикстур.

## Execution

- При постановке применены `grilling`, `ponytail` и `astro-best-practices`. Для
  реализации применить `ponytail`, `astro-best-practices` и `playwright`.
- Роли и усилие указаны в заголовке. Основной агент выполняет роли и ведёт
  интеграцию.
- [ ] Прочитать правила workflow, code style, architecture, design, testing и
      verification. Сверить секцию, её потребителей и текущие тесты.
- [ ] Выполнить рефакторинг по Scope. Проверить владельцев scoped CSS.
- [ ] Обновить `Projects.test.ts` и добавить colocated-тесты для новых
      компонентов согласно testing. Проверить композицию главной через
      `tests/integration/shellHomeLegal.test.ts`.
- [ ] Выполнить целевые тесты, проверку формата затронутых файлов,
      `pnpm check:style`, `pnpm check`, `pnpm verify:boundaries` и
      `pnpm verify:component-tests`.
- [ ] Проверить секцию для пустой и непустой коллекций и переход к каталогу.
- [ ] Проверить diff и критерии приёмки, записать результаты и решения в
      Handoff, обновить статус и ссылки согласно workflow.

## Acceptance

- [ ] Проекты показаны в исходном порядке и ограничены тремя. Имена ссылок ведут
      на соответствующие карточки.
- [ ] При пустой коллекции сохраняются якорь `#projects`, сообщение и действие
      `/projects/`.
- [ ] Целевые проверки проходят. У выделенных компонентов тесты лежат рядом с
      исходниками, а локальные стили следуют за принадлежащей им разметкой.

## Handoff

Выполнено 2026-11-19. Секция остаётся в `src/components/sections/`, поскольку
её внутренняя структура не декомпозировалась. Она ограничивает список первыми
тремя проектами и выбирает карточную сетку либо короткое пустое состояние;
карточка переиспользует `projects/ProjectCard.astro`. Каталог и его фильтры не
менялись.

Проверки: 2 компонентных и 17 homepage integration тестов прошли; каталог
Chromium E2E прошёл 3/3; Astro check, style, Prettier, content boundaries и
component test colocation прошли. Тесты покрывают пустую коллекцию, три
проекта, именованные ссылки и переход на `/projects/`.
