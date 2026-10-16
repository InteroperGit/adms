# План размещения unit-тестов рядом с компонентами

Дата: 2026-10-15
Статус: planned

## Цель

Разместить unit/component-тест каждого файла из `src/components` рядом с
исходным файлом. Сохранить отдельные integration- и browser-тесты для
проверки композиций, навигации, reload, history и no-JavaScript-сценариев.

Сейчас в проекте 60 Astro-компонентов и четыре TypeScript-модуля в
`src/components`, но только часть из них имеет тесты. Vitest ищет тесты
только в `tests/`, поэтому сначала нужно изменить discovery и команды.

## Целевая структура

```text
src/components/ui/Button.astro
src/components/ui/Button.test.ts

src/components/content/ContentBlocks.astro
src/components/content/ContentBlocks.test.ts

src/components/forms/order-inquiry.ts
src/components/forms/order-inquiry.test.ts
```

Имя теста повторяет имя исходного файла. Тестовые fixtures остаются в
`tests/fixtures/content/`, а общие helpers — в `tests/helpers/`.

## Объём тестирования

Каждый Astro-тест проверяет рендеринг через `AstroContainer`, props и
defaults, семантическую разметку, доступные имена, ссылки, `aria-*`,
пустые данные и fallback-состояния. Snapshot-тесты не вводятся.

Нужно покрыть следующие группы:

- корневые `CookieBanner`, `Footer`, `Header`;
- все четыре карточки в `cards/`;
- все Astro-рендереры в `content/`, включая `ContentBlocks` и
  `mdx-components.ts`;
- `LedLettersForm` и `order-inquiry.ts`;
- все семь компонентов в `projects/`;
- все 14 компонентов в `sections/`;
- все UI-компоненты в `ui/`, включая `image-carousel.ts`;
- `resolve-image.ts` как отдельный unit-тест утилиты.

Content-компоненты должны иметь сценарии для каждого discriminator,
изображений и их размеров, ссылок, таблиц, видео, caption/transcript,
publication/fallback-состояний и безопасных URL.

Интерактивные модули должны проверять события, focus, keyboard, cleanup,
reduced motion, timeout, retry, storage failures и повторную инициализацию.

## Перенос существующих тестов

Переместить соседние тесты из `tests/components` к исходникам:

- UI: `Button`, `Section`, `Breadcrumbs`, `ContactInfo`;
- карточки: `PricingExample`, `ProjectCard`, `ReviewCard`, `ServiceCard`;
- `ContentBlocks`.

Объединить `button.smoke.test.ts` с `Button.test.ts`. Переместить тесты
`resolve-image`, `order-inquiry` и `image-carousel` из `tests/unit` к
соответствующим исходникам. Остальные тесты бизнес-логики, валидаторов,
каталога и payload оставить в `tests/unit`.

`tests/integration/page-compositions.test.ts` оставить на прежнем уровне:
он проверяет связи между страницами и компонентами, а не локальный контракт
одного компонента.

## Перенастройка Vitest и package scripts

В `vitest.config.ts` включить оба дерева:

```text
src/**/*.{test,spec}.{ts,tsx}
tests/**/*.{test,spec}.{ts,tsx}
```

Сохранить `tests/setup.ts`, Astro/Vite pipeline и alias fixtures. Добавить
alias для тестовых helpers, если это уменьшит относительные импорты в
соседних тестах.

Обновить команды:

- `test` — весь набор;
- `test:components` — тесты `src/components`;
- `test:unit` — оставшиеся `tests/unit` и соседние pure/client unit-тесты;
- `test:integration` — `tests/integration`;
- `test:coverage` — весь новый набор.

Coverage include должен охватывать все
`src/components/**/*.{astro,ts}`. Сохранить пороги 90% для логики, 85% для
client state, 80% для компонентов и 80% общего покрытия.

## Integration и browser границы

Integration-тесты должны проверять композицию Header, форм, статей,
ContentBlocks, каталога и CookieBanner без дублирования каждого локального
DOM-контракта.

Playwright остаётся источником проверки реального браузера: reload, history,
focus trap, no-JS, responsive layout, browser storage и внешние fallback.
Эти сценарии не переносятся в unit-тесты.

## Приёмка

- у каждого из 64 файлов в `src/components` есть соседний тест;
- в `tests/components` не осталось component-тестов;
- fixtures не попали в `data/content`;
- полный и focused Vitest-наборы проходят;
- coverage учитывает ранее не импортировавшиеся компоненты;
- проходят `pnpm check`, `pnpm build`, `pnpm verify:coverage` и quality gates;
- integration и Playwright-проверки сохраняют свои границы ответственности.

## Задачи

- [096: Перенастроить Vitest для соседних тестов][task-096]
- [097: Перенести существующие component-тесты][task-097]
- [098: Покрыть content и form-компоненты][task-098]
- [099: Покрыть sections, projects и оставшиеся UI-компоненты][task-099]
- [100: Сохранить integration и browser coverage][task-100]
- [101: Обновить coverage, CI и документацию][task-101]

Отдельная визуальная задача, связанная с компонентными контрактами:

- [102: Добавить волнообразные переходы между секциями][task-102]

[task-096]: ../fixed/20261016/096-colocated-test-infrastructure.md
[task-097]: ../fixed/20261016/097-migrate-existing-component-tests.md
[task-098]: ../fixed/20261016/098-test-content-and-form-components.md
[task-099]: ../fixed/20261016/099-test-sections-projects-and-ui.md
[task-100]: ../fixed/20261016/100-preserve-integration-browser-coverage.md
[task-101]: ../fixed/20261016/101-update-component-test-gates.md
[task-102]: ../todo/102-wavy-section-transitions.md
