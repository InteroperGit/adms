# 224. Разделить подтверждения производства и гарантийные условия в `ProductionAndGuarantees`

- **Executor:** Sol (`gpt-6.1-sol`), reasoning: `medium`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Reviewer:** Sol (`gpt-6.1-sol`), reasoning: `medium`.

Статус — fixed. Создана 2026-11-18, выполнена 2026-11-19.

- [Исходная секция](../../../../src/components/sections/ProductionAndGuarantees.astro)
- [Компонентный тест](../../../../src/components/sections/ProductionAndGuarantees.test.ts)
- [Структура компонентов из задачи 215](../todo/215-reorganize-components-by-responsibility.md)

## Scope

- Оставить правила публикации в `ProductionAndGuarantees.astro`. Передавать
  дочерним блокам разрешённые данные и оставлять общие рекомендации видимыми в
  текущих режимах.
- В `sections/production-and-guarantees/` выделить `ProductionGuidance.astro`,
  `ProductionPhotos.astro` и `MaintenanceDetails.astro` для рекомендаций, фото и
  обслуживания.
- На втором уровне сгруппировать `ProductionEvidenceGroup.astro` и
  `ProductionEvidenceCard.astro` под
  `sections/production-and-guarantees/evidence/`, `WarrantyTerms.astro` и
  `WarrantyCard.astro` под `sections/production-and-guarantees/warranty/`.
  Группа владеет заголовком и сеткой, карточка — полями и состояниями фокуса.
- Пути в плане указаны относительно `src/components/`. Точку входа
  `sections/ProductionAndGuarantees.astro` использует `src/pages/index.astro`.
- Сохранить внешние контракты секции и текущие границы контента и фикстур.

## Execution

- При постановке применены `grilling`, `ponytail` и `astro-best-practices`. Для
  реализации применить `ponytail`, `astro-best-practices` и `playwright`.
- Роли и усилие указаны в заголовке. Основной агент выполняет роли и ведёт
  интеграцию.
- [ ] Прочитать правила workflow, code style, architecture, design, testing и
      verification. Сверить секцию, её потребителей и текущие тесты.
- [ ] Выполнить рефакторинг по Scope. Проверить владельцев scoped CSS.
- [ ] Обновить `ProductionAndGuarantees.test.ts` и добавить colocated-тесты для
      новых компонентов согласно testing. Проверить композицию главной через
      `tests/integration/shellHomeLegal.test.ts`.
- [ ] Выполнить целевые тесты, проверку формата затронутых файлов,
      `pnpm check:style`, `pnpm check`, `pnpm verify:boundaries` и
      `pnpm verify:component-tests`.
- [ ] Проверить demo/unapproved/approved на синтетических фикстурах, сетки,
      фокус и reduced motion.
- [ ] Проверить diff и критерии приёмки, записать результаты и решения в
      Handoff, обновить статус и ссылки согласно workflow.

## Acceptance

- [ ] Демо-режим и отсутствие одобрения скрывают подтверждения, фото, гарантии и
      обслуживание. Одобренные элементы видны без пустых групп.
- [ ] Сохраняются подписи и альтернативные тексты фото, семантика сроков,
      условий и исключений, порядок заголовков и CTA.
- [ ] Целевые проверки проходят. У выделенных компонентов тесты лежат рядом с
      исходниками, а локальные стили следуют за принадлежащей им разметкой.

## Handoff

Выполнено 2026-11-19. Компонент секции и тест перемещены в
`sections/production-and-guarantees/`. Секция сохраняет фильтрацию публикации
и общую композицию; рекомендации, фото, evidence-группы и карточки, гарантия и
обслуживание вынесены к своим владельцам. Дочерние тесты проверяют отображение
полей, альтернативного текста и пустых состояний. Synthetic approval test
покрывает approved ветки без изменения runtime content.

Проверки: 9 компонентных и 17 homepage integration тестов прошли. Astro check
завершился без ошибок и предупреждений (одна существующая подсказка Zod).
Chromium E2E проверил скрытие неутверждённых данных, клавиатурный фокус,
адаптивную сетку и reduced motion. Style, Prettier, границы контента и
component colocation прошли.
