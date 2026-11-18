# 217. Разделить карточки бизнес-решений и их галереи в `BusinessSolutions`

- **Executor:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `medium`.

Статус — fixed. Создана и выполнена 2026-11-18.

- [Секция](../../../../../src/components/sections/business-solutions/BusinessSolutions.astro)
- [Тест секции](../../../../../src/components/sections/business-solutions/BusinessSolutions.test.ts)
- [Структура компонентов из задачи 215](../../todo/215-reorganize-components-by-responsibility.md)

## Scope

- Вынести статью из цикла в
  `sections/business-solutions/BusinessSolutionCard.astro` с типизированным
  `item`. Секция сохраняет заголовок и редакционный порядок.
- Внутри карточки выделить
  `sections/business-solutions/media/BusinessSolutionGallery.astro`. Галерея
  владеет `figure`, подписью об источнике и правах и параметрами
  `ui/carousel/ImageCarousel.astro`.
- Оставить связку заголовка, текста, атрибуции и действия внутри карточки.
- Пути в плане указаны относительно `src/components/`. Точку входа
  `sections/business-solutions/BusinessSolutions.astro` использует
  `src/pages/index.astro`.
- Сохранить внешние контракты секции и текущие границы контента и фикстур.

## Execution

- При постановке применены `grilling`, `ponytail` и `astro-best-practices`. Для
  реализации применить `ponytail`, `astro-best-practices` и `playwright`.
- Роли и усилие указаны в заголовке. Основной агент выполняет роли и ведёт
  интеграцию.
- [x] Прочитать правила workflow, code style, architecture, design, testing и
      verification. Сверить секцию, её потребителей и текущие тесты.
- [x] Выполнить рефакторинг по Scope. Проверить владельцев scoped CSS.
- [x] Обновить `BusinessSolutions.test.ts` и добавить colocated-тесты для новых
      компонентов согласно testing. Проверить композицию главной через
      `tests/integration/shellHomeLegal.test.ts`.
- [x] Выполнить целевые тесты, проверку формата затронутых файлов,
      `pnpm check:style`, `pnpm check`, `pnpm verify:boundaries` и
      `pnpm verify:component-tests`.
- [x] Проверить подписи, длинный текст и уникальность нескольких каруселей
      на странице.
- [x] Проверить diff и критерии приёмки, записать результаты и решения в
      Handoff, обновить статус и ссылки согласно workflow.

## Acceptance

- [x] У каждой статьи и карусели сохраняются уникальные идентификаторы и
      доступные имена.
- [x] Атрибуция видна только при наличии имени и подтверждения. Подпись медиа и
      ссылка на заявку сохраняются для соответствующего решения.
- [x] Целевые проверки проходят. У выделенных компонентов тесты лежат рядом с
      исходниками, а локальные стили следуют за принадлежащей им разметкой.

## Handoff

Выполнено 2026-11-18 Luna (`gpt-6-luna`), reasoning medium.

`BusinessSolutionCard` владеет article, текстом, клиентской атрибуцией и
действием заявки. Вложенная `BusinessSolutionGallery` владеет figure,
ImageCarousel и подписью источника/прав. Секция сохраняет порядок элементов.

Прошли 22 целевых теста, включая homepage integration. Также прошли
`pnpm check`, `pnpm check:style`, `pnpm verify:boundaries`,
`pnpm verify:component-tests` и Prettier.

Playwright проверил четыре карточки при 390px и 1440px, в светлой и тёмной
темах. Заголовки и доступные области имеют уникальные ID, подписи и ссылки
присутствуют, горизонтального переполнения нет. Runtime-контент содержит по
одному активному слайду на карусель, поэтому стрелки не отображаются.
Скриншоты сохранены в `output/playwright/task-217/`.
