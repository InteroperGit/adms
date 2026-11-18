# 220. Отделить фото первого экрана от композиции в `Introduction`

- **Executor:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `medium`.

Статус — fixed. Создана и выполнена 2026-11-18.

- [Секция](../../../../../src/components/sections/introduction/Introduction.astro)
- [Тест секции](../../../../../src/components/sections/introduction/Introduction.test.ts)
- [Структура компонентов из задачи 215](../../todo/215-reorganize-components-by-responsibility.md)

## Scope

- Выделить `sections/introduction/IntroductionPhoto.astro` для поиска локального
  ресурса, веток `Image`/`img`, размеров и фокальных точек.
- Оставить выбор фото через `getVisibleIntroductionPhoto`, условие
  двухколоночной сетки, `h1` и действие в `Introduction.astro`.
- Пути в плане указаны относительно `src/components/`. Точку входа
  `sections/introduction/Introduction.astro` использует `src/pages/index.astro`.
- Сохранить внешние контракты секции и текущие границы контента и фикстур.

## Execution

- При постановке применены `grilling`, `ponytail` и `astro-best-practices`. Для
  реализации применить `ponytail`, `astro-best-practices` и `playwright`.
- Роли и усилие указаны в заголовке. Основной агент выполняет роли и ведёт
  интеграцию.
- [x] Прочитать правила workflow, code style, architecture, design, testing и
      verification. Сверить секцию, её потребителей и текущие тесты.
- [x] Выполнить рефакторинг по Scope. Проверить владельцев scoped CSS.
- [x] Обновить `Introduction.test.ts` и добавить colocated-тесты для новых
      компонентов согласно testing. Проверить композицию главной через
      `tests/integration/shellHomeLegal.test.ts`.
- [x] Выполнить целевые тесты, проверку формата затронутых файлов,
      `pnpm check:style`, `pnpm check`, `pnpm verify:boundaries` и
      `pnpm verify:component-tests`.
- [x] Проверить локальное и публичное фото, отсутствие фото и смену
      кадрирования.
- [x] Проверить diff и критерии приёмки, записать результаты и решения в
      Handoff, обновить статус и ссылки согласно workflow.

## Acceptance

- [x] Сохраняются ошибка для отсутствующего файла под `/src/assets/`, адаптивные
      размеры оптимизированного изображения и ветка публичного URL.
- [x] Приоритет и размеры фото, мобильная и десктопная фокальные точки
      сохранены. При скрытом фото свободная колонка отсутствует.
- [x] Целевые проверки проходят. У выделенных компонентов тесты лежат рядом с
      исходниками, а локальные стили следуют за принадлежащей им разметкой.

## Handoff

Выполнено 2026-11-18 Luna (`gpt-6-luna`), reasoning medium.

`IntroductionPhoto` владеет локальным поиском изображения, Astro Image и
публичным URL fallback, размерами, eager loading и фокальными точками.
Секция сохраняет publication policy, h1, действие и выбор колонок.

Прошли 20 целевых тестов, включая homepage integration. Также прошли
`pnpm check`, `pnpm check:style` через `node scripts/checkCodeStyle.mjs`,
`pnpm verify:boundaries`, `pnpm verify:component-tests` и Prettier.

Component tests проверили публичный URL и локальный `Astro Image` с
адаптивными размерами. Playwright проверил runtime demo-фото, сетки 375px и
1440px и отсутствие overflow. Обычный скрытый-photo вариант проверен тестом
секции. Скриншоты сохранены в `output/playwright/task-220/`.
