# 221. Уточнить границу секции и карусели предложений в `OffersCarousel`

- **Executor:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `medium`.

Статус — fixed. Создана и выполнена 2026-11-18.

- [Секция](../../../../../src/components/sections/OffersCarousel.astro)
- [Тест секции](../../../../../src/components/sections/OffersCarousel.test.ts)
- [Структура компонентов из задачи 215](../../todo/215-reorganize-components-by-responsibility.md)
- [Задача 214](../../backlog/214-offers-carousel-neighbor-previews.md)

## Scope

- Сохранить `OffersCarousel.astro` точкой композиции и привести импорт feature к
  принятому пути через `@/components/`. Секция владеет `offers.enabled` и
  `enabledOffers`, feature — отображением и взаимодействием.
- Согласовать результат с задачей 214. Компоненты трека, управления и карточек
  принадлежат `features/offers-carousel/`. Текущий адаптер достаточно оставить
  одним файлом.
- Пути в плане указаны относительно `src/components/`. Точку входа
  `sections/OffersCarousel.astro` использует `src/pages/index.astro`.
- Сохранить внешние контракты секции и текущие границы контента и фикстур.

## Execution

- При постановке применены `grilling`, `ponytail` и `astro-best-practices`. Для
  реализации применить `ponytail`, `astro-best-practices` и `playwright`.
- Роли и усилие указаны в заголовке. Основной агент выполняет роли и ведёт
  интеграцию.
- [x] Прочитать правила workflow, code style, architecture, design, testing и
      verification. Сверить секцию, её потребителей и текущие тесты.
- [x] Выполнить рефакторинг по Scope. Проверить владельцев scoped CSS.
- [x] Обновить `OffersCarousel.test.ts` и добавить colocated-тесты для новых
      компонентов согласно testing. Проверить композицию главной через
      `tests/integration/shellHomeLegal.test.ts`.
- [x] Выполнить целевые тесты, проверку формата затронутых файлов,
      `pnpm check:style`, `pnpm check`, `pnpm verify:boundaries` и
      `pnpm verify:component-tests`.
- [x] Запустить `tests/e2e/media/carousel.spec.ts` и сверить границу с 214.
- [x] Проверить diff и критерии приёмки, записать результаты и решения в
      Handoff, обновить статус и ссылки согласно workflow.

## Acceptance

- [x] Секция скрыта при выключенных предложениях или пустом наборе, а при показе
      сохраняются `#offers`, доступное название, порядок и настройки
      автопрокрутки.
- [x] Существующие проверки соседних слайдов, ручного управления и первого
      слайда без JS проходят.
- [x] Целевые проверки проходят. У выделенных компонентов тесты лежат рядом с
      исходниками, а локальные стили следуют за принадлежащей им разметкой.

## Handoff

Выполнено 2026-11-18 Luna (`gpt-6-luna`), reasoning medium.

Секция импортирует `features/offers-carousel/Carousel.astro` через
`@/components/`. Она продолжает владеть `offers.enabled` и
`enabledOffers`; feature управляет отображением и взаимодействием. Код
карусели не дублирован в секции.

Прошли 18 целевых тестов, включая homepage integration. Также прошли
Astro check, `check:style`, content boundaries, component-test placement и
Prettier. E2E `tests/e2e/media/carousel.spec.ts` прошёл 8/8 в Chromium.
Ранее принятые responsive, keyboard, reduced-motion и no-JS контракты задачи
214 подтверждены этим прогоном.
