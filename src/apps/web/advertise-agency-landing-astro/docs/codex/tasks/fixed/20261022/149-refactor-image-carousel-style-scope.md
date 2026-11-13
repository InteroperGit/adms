# 149. Ограничить CSS и развернуть ветвления ImageCarousel

Статус: завершено. Создано: 2026-10-22. Приоритет: средний.

## Основание и границы

В `src/components/ui/ImageCarousel.astro` несколько правил используют отдельный
`:global(.carousel-arrow)` без родительского селектора карусели. В результате
размеры, позиционирование и hover-видимость зависят только от общего имени
класса, а не от принадлежности этому компоненту. В связанном `image-carousel.ts`
есть ветви `if` без фигурных скобок, запрещённые
`docs/rules/development/rules/code-style.md`.

Рабочие файлы: эти два файла и их соседние тесты. Контракты CarouselControl и
ImageCarouselSlide сохраняются.

## Реализация

- Прочитать правила проекта и навык `astro-best-practices`.
- Привязать глобальные селекторы стрелок к локальному корню карусели, включая
  media queries и селекторы направления. Сохранить применение CSS к дочернему
  CarouselControl.
- Обернуть все ветви `if` клиентского модуля в скобки; развернуть тело каждой
  ветви на отдельные строки с сохранением порядка действий.
- Сохранить data-атрибуты, доступные имена, статический fallback, autoplay,
  reduced motion и очистку observers/listeners/timer.

## Приёмка и проверка

- Стрелки внутри карусели сохраняют оформление и состояния; элемент с классом
  `carousel-arrow` за её пределами не получает эти правила.
- Несколько экземпляров работают независимо; навигация с клавиатуры, hover,
  touch и fallback без JavaScript сохраняются.
- Выполнить соседние suites `ImageCarousel.test.ts` и `image-carousel.test.ts`,
  существующий E2E-сценарий карусели, `pnpm check` и линтер изменённых файлов.
  Проверить full/panel, светлую и тёмную темы, desktop/mobile и reduced motion.
- Записать результаты и архивировать задачу по
  `docs/rules/development/task-management.md`.

## Результаты проверки

- Правила стрелок ограничены корнем .image-carousel во всех вариантах и media
  queries.
- Ветвления клиента развернуты; тест подтверждает независимость экземпляров.
- Unit: 2 suites, 12 tests passed.
- Carousel E2E: 12 tests passed in Chromium, Firefox, and WebKit; full/panel
  layout, light/dark themes, desktop/mobile sizes, and reduced motion checked.
- pnpm check: passed; 345 files, 0 errors, 0 warnings, 1 existing deprecation
  hint for z.number().finite() in src/validation/content-blocks.ts:110.
- ESLint and Prettier checks passed for all four changed source and test files.
- Repository-wide pnpm format:check remains failing on pre-existing formatting
  debt in 441 files.
