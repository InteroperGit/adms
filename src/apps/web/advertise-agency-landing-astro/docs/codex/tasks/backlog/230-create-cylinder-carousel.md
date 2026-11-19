# 230. Создать переиспользуемую карусель с циклическими превью

- **Executor:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `medium`.

Статус — backlog. Создана 2026-11-19.

- [Контракт текущей карусели](214-offers-carousel-neighbor-previews.md)
- [Секция предложений](../../../../src/components/sections/offers-carousel/OffersCarousel.astro)
- [Стандартная карусель](../../../../src/components/ui/carousel/ImageCarousel.astro)

## Scope

- Разработать новый `CylinderCarousel.astro` в `src/components/ui/cylinder-carousel/`.
  Локальные стили, браузерную логику и тесты держать рядом с компонентом.
- Принимать произвольное содержимое слайдов через слот. UI-компонент отвечает
  за прокрутку и управление. Секция подготавливает предложения, разметку
  карточек, подписи и ссылки.
- Сохранить бесшовный цикл с активным слайдом в центре. В режиме показа
  превью при трёх и более слайдах частично видны оба соседа, при двух слайдах
  сосед виден только справа, при одном превью отсутствует.
- Рендерить каждый слайд ровно один раз. Переходы сохраняют DOM-узлы и
  состояние элементов слайда.
- Дать потребителю настройки процента видимой ширины соседнего слайда,
  адаптивного скрытия превью, зазора между слайдами, автопрокрутки и её
  интервала, ручной навигации, стрелок, точек и анимации. Доступные названия
  карусели и управления задаёт потребитель. Документировать единицы, допустимые
  значения и значения по умолчанию рядом с компонентом.
- Сохранить стрелки, точки и выбор слайда, свайп и перетаскивание мышью,
  реакцию на клавиатурный фокус, объявления ручных переходов и паузы
  автопрокрутки при фокусе, наведении, жесте и скрытии вкладки.
- Учитывать `prefers-reduced-motion` и сохранить первый слайд доступным без JS.
- Перевести `OffersCarousel` на новый компонент с текущими настройками
  публикации, геометрией и управлением. Сохранить якорь `#offers`, оформление
  в обеих темах, полноширинную карточку и отсутствие превью ниже 48rem.
- Удалить заменённые секционные трек, управление и рантайм вместе с устаревшими
  тестами после переноса регрессионных сценариев.
- Сохранить API и поведение стандартной карусели из `src/components/ui/carousel/`.

## Execution

- При постановке сверены открытые вопросы с `grilling` и `ponytail`.
  При реализации применять `ponytail`, `astro-best-practices` и `playwright`.
  Основной агент выполняет роли по заголовку последовательно. Отдельное
  делегирование не запланировано.
- [ ] Прочитать правила workflow, code style, architecture, design, testing и
  verification. Сверить реализацию, тесты, настройки и поведение из задачи 214.
- [ ] Определить API слота и настроек. Проверить циклические переходы и
  правое превью при двух слайдах с полем ввода и ссылкой.
- [ ] Реализовать компонент, подключить его в секции, удалить заменённые
  файлы и обновить затронутые тесты, импорты и селекторы.
- [ ] Запустить colocated-тесты, интеграцию главной и целевые E2E карусели
  на версионированных фикстурах в Chromium, Firefox и WebKit. Проверить
  форматирование изменённых файлов, `pnpm check:style`, `pnpm check`,
  `pnpm verify:boundaries` и `pnpm verify:component-tests`.
- [ ] Сверить diff с критериями и записать команды, результаты и ограничения
  в Handoff. Обновить статус и ссылки по workflow.

## Handoff

- Implementation and focused acceptance checks are complete. This manually run
  task remains in `backlog` until explicitly archived.
- Follow-up requirements: autoplay, dots, and controls are independently
  configurable; autoplay pauses outside the viewport; drag movement follows
  the pointer delta; text selection is suppressed from pointer down; cursor
  states reflect dragging; slides retain vertical insets and inter-slide gaps.
- Mobile OffersCarousel height can grow to `40.5rem` and remains capped by
  the available viewport height after measured header and bottom navigation
  clearances.
- E2E: carousel scenarios passed in Chromium, Firefox, and WebKit (15/15).
  Focused Vitest passed (17/17); `pnpm check` passed with one existing Zod
  deprecation hint; boundary and component-test policy checks passed.
- ESLint magic-number rule is an error scoped to
  `cylinderCarouselRuntime.ts`; enabling it repository-wide found existing
  violations outside this task.

## Acceptance

- [ ] Компонент работает с произвольной разметкой и двумя независимыми
  экземплярами на странице. Состояние, события и таймеры принадлежат экземпляру
  и очищаются при его удалении.
- [ ] Для 0, 1, 2, 3 и 10 элементов число экземпляров слайдов в DOM равно
  числу переданных элементов. В режиме показа превью один слайд отображается
  без соседей, два слайда дают превью только справа, три и десять слайдов
  дают превью с обеих сторон.
- [ ] В обоих направлениях проверен переход между первым и последним слайдом
  без визуального скачка. Ссылки, фокус и введённые значения сохраняются.
- [ ] Разные проценты видимой ширины и интервалы автопрокрутки дают ожидаемый
  результат. Стрелки, точки, свайп, перетаскивание, паузы, клавиатурная
  навигация, reduced motion и fallback без JS покрыты проверками.
- [ ] Секция сохраняет публикацию, порядок, ссылки, размеры и положение
  управления на мобильном, планшете и десктопе в обеих темах.
- [ ] У секции осталась композиция предложений, а заменённая реализация
  удалена. Регрессионные проверки стандартной карусели проходят.
