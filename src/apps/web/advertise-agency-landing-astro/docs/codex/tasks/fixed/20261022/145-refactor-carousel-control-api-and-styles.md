# 145. Разделить контракт и стили CarouselControl

Статус: запланировано. Создано: 2026-10-22. Приоритет: средний.

## Основание и границы

`src/components/ui/CarouselControl.astro` обслуживает сразу стрелки
`ImageCarousel` и кнопки lightbox. Один набор props смешивает `direction`,
`variant`, `dataDirection`, `dataGallery` и произвольный `className`; часть
комбинаций бессмысленна, а `data-gallery-*`, селекторы стрелок и визуальные
правила распределены между компонентом и двумя потребителями. Из-за этого
изменение размера SVG, hover или focus требует искать правила в нескольких
файлах. Сейчас colocated-тест проверяет только наличие экспорта.

Цель — оставить один доступный статический control-компонент с ясной
типизированной конфигурацией и предсказуемой CSS-границей, не меняя селекторы
runtime, размеры целей, иконки, клавиатуру или reduced-motion.

Рабочие файлы: `CarouselControl.astro`, `CarouselControl.test.ts`,
`ImageCarousel.astro`, `ImageGalleryLightbox.astro` и связанные стили.
Клиентские модули карусели и галереи менять только при необходимости для
сохранения существующего DOM-контракта.

## Реализация

- Перед началом прочитать `AGENTS.md`, правила разработки и
  `astro-best-practices`.
- Сделать конфигурацию контроля явной: вычислять класс и SVG-иконку в
  frontmatter, не оставлять вложенную цепочку условных выражений в markup.
  Сохранить `variant`, направление, пользовательский класс и все нужные
  `data-direction`/`data-gallery-*` атрибуты либо заменить их только на
  совместимый типизированный способ вывода.
- Разделить общие стили контроля и стили размещения потребителей. Убрать
  дублирование базовых размеров SVG, hover и focus между `CarouselControl` и
  `ImageCarousel`/lightbox; сохранить минимум 44 px для интерактивной цели,
  видимый focus, контраст, touch-поведение и prefers-reduced-motion.
- Добавить пояснения к props, кнопке, SVG и правилам состояний. Сохранить
  `type="button"`, `aria-label`, `aria-hidden` и `focusable="false"`.
- Не добавлять client hydration или новый runtime state.

## Приёмка и проверки

- Semantic render-тесты проверяют arrow previous/next и close variant, классы,
  пользовательский класс, accessible name, `type`, SVG и каждый data-marker;
  невалидные/неиспользуемые комбинации не создают ложных маркеров.
- `ImageCarousel` и lightbox сохраняют прежние query selectors и проходят
  существующие component/E2E сценарии управления, focus и reduced motion.
- В CSS нет дублирующихся базовых правил, а каждая scoped/global граница
  объяснена комментарием; все строки исходников не длиннее 80 символов.
- Запустить сфокусированные component tests, `pnpm check:style`, ESLint и
  `pnpm build`. Прежние несвязанные ошибки записать отдельно.
- После выполнения архивировать задачу в `docs/codex/tasks/fixed/20261022/` и обновить
  `.codex/TASKS.md` по правилам управления задачами.

## Implementation result

Status: completed on 2026-10-22.

- CarouselControl now uses a discriminated arrow/close contract, computes its
  class, marker values, and SVG path in frontmatter, and preserves the runtime
  selectors and accessibility attributes.
- Shared control sizing, SVG, hover, focus, and reduced-motion rules now live in
  CarouselControl; carousel and lightbox files retain placement and
  consumer-specific behavior.
- Added semantic render coverage for arrow markers, close markers, custom
  classes, icons, and invalid marker combinations.
- Verified focused Vitest component tests, code style, ESLint, Astro check, and
  Astro build. Existing Zod deprecation and large-chunk warnings remain.
