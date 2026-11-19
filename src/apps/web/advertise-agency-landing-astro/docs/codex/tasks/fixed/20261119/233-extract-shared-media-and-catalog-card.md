# 233 — Вынести общие медиа и карточку каталога из компонентов статей

- **Executor:** Sol (`gpt-6.1-sol`), reasoning: `medium`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `medium`.

**Статус** — завершена

**Создана** — 2026-11-19

Продолжение [задачи 232](../../todo/232-group-components-by-feature.md).

## Scope

- Оставить в `src/components/content/` рендеринг тела статей проектов и
  услуг. `ContentBlocks` выбирает рендерер из `blocks/` по типу блока.
- Вынести адаптивное изображение, галерею, лайтбокс и разрешение URL
  изображений в `src/components/ui/media/`. Компоненты принимают данные
  отображения без зависимости от типов и метаданных блоков статей.
- Поддержать одиночное изображение с лайтбоксом по явному выбору вызывающего
  компонента. Сохранить сетку плиток для существующих галерей.
- Оставить оформление изображения и галереи в теле статьи за
  `ImageBlock` и `ImageGalleryBlock`.
- Разместить общую карточку проектов и услуг в
  `src/components/features/catalog/` поверх базового `ui/Card`.
  Передавать каталоговые атрибуты ссылки из вызывающих компонентов.

## Execution

Основной агент последовательно выполняет реализацию, тестирование и ревью
по настройкам из заголовка. Делегирование не запланировано.

- [x] Прочитать правила архитектуры, контента, дизайна, тестирования и
      проверки. Применить `ponytail` и `astro-best-practices` к реализации,
      `playwright` к браузерной проверке.
- [x] Переименовать `ContentImage` в `ResponsiveImage`. Принимать
      `src`, `alt`, размеры, подпись и точки кадрирования через нейтральный
      тип изображения. Заменить `thumbnail` и `serviceCrop` на режимы
      `contain`, `cover-3:2` и `cover-4:3`. Сохранить настройки
      `sizes`, приоритет загрузки, оптимизацию и обработку ошибок.
- [x] Передавать в `ImageGallery` массив `images` и необязательные
      `id`, `caption`, `priority` и `layout`. Использовать плитки по
      умолчанию. В режиме `layout="single"` показать одно изображение
      в исходных пропорциях. Переиспользовать разметку лайтбокса и его
      браузерную логику. Использовать общие токены темы в `ui/media/`.
- [x] Обновить адаптеры блоков статьи и перенести `CatalogCard`. Заменить
      `projectLink` на атрибуты ссылки действия. Передавать
      `data-project-link` из `ProjectCard`. Обновить вызов в `ServiceCard`.
- [x] Перенести соседние тесты, обновить импорты и фикстуру контракта
      типов галереи. Запустить целевые тесты медиа, статей и карточек,
      проверки стиля, Astro, типов, границ и размещения тестов.
- [x] Собрать приложение и запустить сценарии Playwright для галереи,
      медиа статьи, работы без JavaScript и возврата в каталог проектов.
- [x] Сверить diff с критериями приёмки и записать команды, результаты
      и ограничения в итог задачи. Архивировать по правилам workflow.

## Acceptance

- [x] В `components/content/` находятся только рендерер тела статьи,
      рендереры блоков и их тесты.
- [x] `ui/media/` работает с данными изображения, переданными напрямую
      из секции сайта, без импорта типов статьи или загрузчиков контента.
- [x] Пустая галерея не выводит виджет. Одиночное изображение открывается
      в лайтбоксе без стрелок и миниатюр. Галерея из нескольких изображений
      сохраняет навигацию и переключение по миниатюрам.
- [x] Лайтбокс работает с клавиатуры, закрывается по Escape и возвращает
      фокус на открывшее его изображение. Без JavaScript ссылки ведут
      на изображения.
- [x] Статьи и карточки сохраняют свои подписи, кадрирование и приоритет
      загрузки. Карточки услуг и проектов ведут по своим ссылкам, а
      каталог проектов восстанавливает своё состояние при возврате.

## Handoff

- `pnpm exec vitest run src/components/ui/media src/components/features/catalog src/components/content/blocks/ImageBlock.test.ts src/components/content/blocks/ImageGalleryBlock.test.ts src/components/features/projects/ProjectCard.test.ts src/components/features/services/ServiceCard.test.ts src/scripts/imageGallery.test.ts tests/integration/articlesContent.test.ts` — 75 passed.
- `pnpm check`, `pnpm test:types`, `pnpm verify:boundaries` and `pnpm verify:component-tests` — passed.
- `pnpm check:style` and `pnpm verify:content` — passed; content invariants covered 20 files.
- `pnpm build` — passed; 39 pages generated.
- `pnpm test:e2e tests/e2e/media/gallery.spec.ts tests/e2e/content/contentMedia.spec.ts tests/e2e/noJavascript.spec.ts tests/e2e/content/catalogPagination.spec.ts --project=chromium` — 26 passed.
- `git diff --check` — passed. Chromium coverage was focused; the full suite and cross-browser matrix were not run.
- Existing diagnostics: Astro reports a deprecation hint for `z.number().finite()` in `src/validation/contentBlocks.ts`; the build reports a chunk above 500 kB. Neither is part of this change.
