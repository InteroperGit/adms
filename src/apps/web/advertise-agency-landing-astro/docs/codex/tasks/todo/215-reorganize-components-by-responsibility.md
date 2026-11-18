# 215. Организовать компоненты по ответственности

- **Executor:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `medium`.

Статус — выполнена; оставлена в `todo` до явного запроса на архивацию.

`src/components/ui/` сейчас объединяет универсальные компоненты вроде `Button`
и `Link` с частями шапки, визуализацией услуг и виджетом отзывов. По расположению
файла трудно понять, где его можно использовать и откуда он берёт данные.

## Scope

- Сгруппировать компоненты `src/components/` по ответственности и компонентам,
  с которыми они меняются вместе.
- Оставить в `ui/` только универсальные компоненты, которые получают данные
  через props и slots и не зависят от контента сайта, предметных типов
  или компонентов конкретной функции. Например, `Button`, `Link` и `Breadcrumbs`.
- Выполнить перемещения из раздела «Карта перемещений». Сохранить отдельную
  реализацию карусели предложений из задачи
  [214](214-offers-carousel-neighbor-previews.md).
- Перенести colocated-тесты и локальные модули вместе с компонентами. Обновить
  импорты в страницах, layouts, MDX-реестре, тестах и других потребителях.
- Сохранить публичные маршруты, props и slots, отображение и доступность.
  Сохранить действующие границы runtime-контента и версионируемых фикстур.

## Execution

- Навыки при постановке — `grilling`, `ponytail`. При реализации —
  `ponytail`, `astro-best-practices` и `playwright` для браузерной проверки.
- План ролей указан под заголовком. Основной агент ведёт задачу и интеграцию.
  Отдельное делегирование не запланировано.
- [x] Прочитать workflow, code style, architecture, design, testing и
  verification, а также применимые навыки Astro и `ponytail`.
- [x] Сверить карту перемещений с актуальным деревом и потребителями. Учесть
  пересечения с задачами 212–214.
- [x] Перенести компоненты, тесты и локальные модули. Обновить прямые и
  динамические импорты, реестры и проверки, привязанные к путям.
- [x] Проверить старые пути, разрешение импортов и зависимости `ui/`.
  Кратко закрепить правило для `ui/` в `docs/codex/rules/architecture.md`.
- [x] Выполнить `pnpm check:style`, `pnpm check`, `pnpm verify:boundaries`,
  `pnpm verify:component-tests`, форматирование изменённых файлов и
  целевые тесты затронутых компонентов и интеграций.
- [x] Запустить затронутые E2E-сценарии на версионируемых фикстурах. Проверить
  шапку, навигацию, контакты, баннер согласия и затронутые страницы контента,
  включая клавиатурное управление и доступность. Полный набор проверок
  выполнить по явному запросу согласно workflow.
- [x] Просмотреть diff, сверить критерии приёмки, записать команды, результаты
  и принятые решения в Handoff. Обновить индекс и статус по workflow.

## Карта перемещений

Все пути указаны относительно `src/components/`. Парный файл `*.test.ts`,
если он есть, переносится в тот же каталог с тем же именем.

- `Header.astro`
  → `site-shell/header/Header.astro`.
- `ui/HeaderAddress.astro`
  → `site-shell/header/HeaderAddress.astro`.
- `ui/HeaderBrand.astro`
  → `site-shell/header/HeaderBrand.astro`.
- `ui/HeaderCall.astro`
  → `site-shell/header/HeaderCall.astro`.
- `ui/HeaderMenuOpener.astro`
  → `site-shell/header/HeaderMenuOpener.astro`.
- `ui/MobileHeaderContacts.astro`
  → `site-shell/header/MobileHeaderContacts.astro`.
- `ui/MobileMenuDialog.astro`
  → `site-shell/header/MobileMenuDialog.astro`.
- `ui/ContactMenu.astro`
  → `site-shell/header/ContactMenu.astro`.
- `Footer.astro`
  → `site-shell/footer/Footer.astro`.
- `ui/Logo.astro`
  → `site-shell/branding/Logo.astro`.
- `ui/DesktopNavigation.astro`
  → `navigation/DesktopNavigation.astro`.
- `ui/MobileBottomNav.astro`
  → `navigation/MobileBottomNav.astro`.
- `ui/NavLinks.astro`
  → `navigation/NavLinks.astro`.
- `ui/ContactInfo.astro`
  → `site-shell/contacts/ContactInfo.astro`.
- `ui/ActionRail.astro`
  → `site-shell/contacts/ActionRail.astro`.
- `ui/MaxLogo.astro`
  → `site-shell/contacts/MaxLogo.astro`.
- `ui/Settings.astro`
  → `site-shell/preferences/Settings.astro`.
- `ui/ThemeInit.astro`
  → `site-shell/preferences/ThemeInit.astro`.
- `ui/ThemeToggle.astro`
  → `site-shell/preferences/ThemeToggle.astro`.
- `CookieBanner.astro`
  → `features/cookies/CookieBanner.astro`.
- `features/offersCarousel/Carousel.astro`
  → `sections/offers-carousel/Carousel.astro`.
- `features/offersCarousel/CarouselCard.astro`
  → `sections/offers-carousel/CarouselCard.astro`.
- `features/offersCarousel/CarouselControls.astro`
  → `sections/offers-carousel/CarouselControls.astro`.
- `features/offersCarousel/CarouselDot.astro`
  → `sections/offers-carousel/CarouselDot.astro`.
- `features/offersCarousel/CarouselTrack.astro`
  → `sections/offers-carousel/CarouselTrack.astro`.
- `features/offersCarousel/offersImageCarouselRuntime.ts`
  → `sections/offers-carousel/offersImageCarouselRuntime.ts`.
- `ui/ServiceVisual.astro`
  → `services/ServiceVisual.astro`.
- `cards/ServiceCard.astro`
  → `services/ServiceCard.astro`.
- `sections/ServiceArticle.astro`
  → `services/ServiceArticle.astro`.
- `ui/YandexReviews.astro`
  → `reviews/YandexReviews.astro`.
- `cards/ReviewCard.astro`
  → `reviews/ReviewCard.astro`.
- `cards/ProjectCard.astro`
  → `projects/ProjectCard.astro`.
- `cards/PricingExample.astro`
  → `pricing/PricingExample.astro`.
- `sections/PricingExamples.astro`
  → `pricing/PricingExamples.astro`.
- `content/OrderFormContainer.astro`
  → `forms/OrderFormContainer.astro`.

В корне `ui/` остаются `Breadcrumbs`, `Button`, `Link` и `Section`. Общие
компоненты карусели (`ImageCarousel`, `ImageCarouselSlide`, `CarouselControl`,
`CarouselDot`, `CarouselDots` и `imageCarouselRuntime.ts`) расположены в
`ui/carousel/`. `cards/Card.astro` сохраняет свою роль общей карточки с
поддержкой изображений из `content/`. MDX-адаптер `content/OrderFormBlock.astro`
использует контейнер из `forms/`.

## Acceptance

- [x] Все исходные файлы из карты находятся по указанным целевым путям.
- [x] Компоненты `ui/` работают на переданных данных и не импортируют данные
  сайта, предметные типы или модули прикладных компонентов.
- [x] Компоненты шапки, навигации, контактов, услуг и отзывов находятся в
  каталогах, соответствующих их использованию.
- [x] Исходники и их тесты расположены рядом. Все ссылки на перемещённые
  модули разрешаются по новым путям.
- [x] Целевые тесты подтверждают прежнюю работу маршрутов и взаимодействий,
  включая клавиатурную навигацию. Проверки границ и размещения тестов проходят.

## Handoff

Перемещены 35 компонентов и локальных модулей с 35 colocated-тестами. Обновлены
импорты в страницах, layouts, MDX-адаптере, integration tests и конфигурации
coverage. В `ui/` остались только абстрактные компоненты; правило закреплено в
`docs/codex/rules/architecture.md`. Для `MobileBottomNav` добавлен отсутствующий
компонентный тест.

Проверки:

- `node node_modules/vitest/vitest.mjs run src/components tests/integration` —
  91 файла, 369 тестов пройдены.
- `node node_modules/astro/bin/astro.mjs check` — 0 ошибок, 0 предупреждений,
  1 существующая подсказка о `zod.finite()`.
- `node scripts/checkCodeStyle.mjs`, `node scripts/verifyContentBoundaries.mjs`,
  `node scripts/checkComponentTests.mjs` и Prettier для изменённых файлов —
  пройдены.
- Затронутые E2E-наборы навигации, preferences, responsive, no-JS, carousel и
  страниц контента: 194 пройдены; один WebKit-сценарий выявил устаревшее чтение
  `media.matches` при смене темы. Обработчик исправлен на `event.matches`,
  регрессионный WebKit-сценарий после исправления пройден. Повторный запуск
  Preferences после освобождения порта завершился: 24/24 в Chromium, Firefox
  и WebKit.

Решение: задача выполнена, но оставлена в `todo`, поскольку ручное выполнение
не разрешает перемещать её в `fixed` без отдельного явного запроса. Коммит не
создавался.
