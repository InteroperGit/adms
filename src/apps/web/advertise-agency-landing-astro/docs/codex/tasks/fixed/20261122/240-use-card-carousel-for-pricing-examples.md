# 240. Перевести секцию «Примеры стоимости» на карточки и CardCarousel

- **Executor:** Sol (`gpt-6.1-sol`), reasoning: `medium`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `medium`.

Статус `fixed`. Создана 2026-11-21; завершена 2026-11-22.

## Scope

- Оформить каждый `PricingExample` как самостоятельную карточку. Сохранить
  изображение при наличии, описание, параметры, цену с контекстом и условиями,
  списки работ, ссылку на заявку и ссылку на проект при наличии.
- Подключить существующий `CardCarousel` в `PricingExamples.astro` для всех
  ширин экрана. Переиспользовать настройку ширины из [задачи 239][task239],
  если она подходит для карточек стоимости.
- Подобрать одинаковую ширину карточек по ширине карусели и зазорам. Справа
  после полностью видимых карточек должен быть виден фрагмент следующей,
  пока справа остаются примеры.
- Сохранить порядок и правила публикации примеров, отметки демонстрационных
  цен и скрытие секции при пустой выборке.
- Оставить факторы стоимости и пояснение по расчёту сметы под каруселью.
- Сохранить поведение остальных секций с `CardCarousel`.

## Execution

Роли из заголовка выполняются последовательно, без делегации. При реализации
применить `ponytail`, `astro-best-practices` и `playwright`.

- [x] Прочитать правила и сверить [PricingExamples][section],
      [PricingExample][card], [CardCarousel][carousel] и [задачу 239][task239].
- [x] Оформить карточку, подключить карусель и подобрать ширину по доступному
      месту. Проверить внутреннюю компоновку и размеры изображений с учётом
      фактической ширины карточек.
- [x] Обновить `PricingExample.test.ts` и `PricingExamples.test.ts`, а при
      изменении общего компонента обновить его colocated-тесты.
- [x] Проверить критерии в браузере с несколькими синтетическими примерами
      стоимости. Запустить целевые тесты, `pnpm check:style`, `pnpm check` и
      применимые проверки по [правилам проекта][verification].
- [x] Сверить diff с критериями, записать результаты и обновить статус по
      workflow.

## Acceptance

- [x] На телефоне, планшете и десктопе примеры отображаются в одной
      горизонтальной карусели с карточками одинаковой ширины.
- [x] В начале и после листания, пока справа остаются примеры, хотя бы одна
      карточка видна целиком, а после полностью видимых карточек справа виден
      фрагмент следующей. Проверены промежуточные ширины и границы режимов.
- [x] Последняя карточка целиком доступна в конце прокрутки. При одном
      примере карточка занимает доступную ширину. Лента не создаёт
      горизонтальной прокрутки всей страницы.
- [x] Содержимое карточек читаемо на узком экране и при увеличении текста.
      Цена, её контекст и условия остаются рядом, ссылки доступны с клавиатуры
      и имеют видимый фокус.
- [x] Свайп, мышь и клавиатура позволяют дойти до последней карточки.
      Нативная прокрутка доступна без JavaScript, настройка уменьшенного
      движения учитывается.
- [x] Сохранились порядок, фильтрация и демонстрационные отметки, при пустой
      выборке секция скрыта. Общие пояснения остаются под каруселью,
      поведение остальных потребителей `CardCarousel` сохранено.

## Handoff

`PricingExamples` passes visible examples to `CardCarousel`; each example is a
self-contained bordered card with responsive image sizes. The isolated E2E
fixture enables five synthetic demo examples and uses a local asset. Focused
component tests passed (2 files, 7 tests). The Chromium pricing scenario passed
at 390, 767, 768, 1199, 1200 and 1440px, checking equal widths, previews, no
page overflow, last-card reachability and keyboard End navigation.
Follow-up layout changes leave tablet widths unchanged, widen desktop cards so
the third card peeks into view, equalize card heights, and align spacing above
and below the estimate divider. Card images now reach the inner top and side
edges. CardCarousel cancels native image dragstart so mouse dragging from an
image continues to scroll; its runtime unit test and pricing Chromium drag
scenario pass. The updated layout scenario and focused component tests passed.
Pricing cards now equalize heights with varied fixture content and center
their inquiry buttons on a shared bottom line. The section projects CTA now
uses the same primary large button style as the ordering-process CTA.
Projects, Yandex reviews and FAQ actions now share that centered large primary
button style. Ordering-step masks align at the top edge and ignore pointer
input; Chromium mouse/touch navigation passes.
Acceptance checks on 2026-11-22 passed. The focused Vitest run passed 30 tests
in 6 files. Pricing E2E passed 12/12 across Chromium, Firefox and WebKit,
including six viewport widths, mouse and touch navigation to the last card,
keyboard navigation, enlarged text, one-card layout, reduced motion and native
scrolling to the last card without JavaScript. The pricing component test also
confirms source order and omission of an empty section. The content-loader tests
cover publication filtering and demo status.

`pnpm.cmd check:style` passed for 7 changed files. `pnpm.cmd check` passed for
457 Astro files with 0 errors, warnings or hints. Changed-file Prettier and
`git diff --check` passed. The related CardCarousel consumer E2E run passed
16/16 Chromium scenarios. Full verification gates were not run.

[section]:
  ../../../../../src/components/sections/pricing/PricingExamples.astro
[card]: ../../../../../src/components/sections/pricing/PricingExample.astro
[carousel]:
  ../../../../../src/components/ui/carousel/card-carousel/CardCarousel.astro
[task239]: ../20261121/239-use-card-carousel-for-ordering-process.md
[verification]: ../../../rules/verification.md
