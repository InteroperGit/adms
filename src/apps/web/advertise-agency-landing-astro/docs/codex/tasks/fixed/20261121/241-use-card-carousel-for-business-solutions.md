# 241. Перевести секцию «Решения для бизнеса» на CardCarousel

- **Executor:** Sol (`gpt-6.1-sol`), reasoning: `medium`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `medium`.

Статус `fixed`. Создана, начата и завершена 2026-11-21.

## Scope

- Использовать `BusinessSolutionCard` для каждого решения на телефонах,
  планшетах и десктопах. Заменить вертикальный список на `CardCarousel`
  во всех адаптивных режимах.
- Подобрать одинаковую ширину карточек в пределах карусели с учётом ширины
  контейнера и зазоров. На телефонах показывать одну карточку целиком и
  фрагмент следующей. На планшетах использовать ту же формулу ширины, что на
  стандартном десктопе: две карточки целиком и фрагмент следующей. На широком
  десктопе показывать три полные карточки и фрагмент следующей.
- Расположить галерею первой секцией, затем текст, сведения о проекте и кнопку
  заявки вертикально стеком. Выровнять высоту всех карточек, центрировать
  кнопку снизу и использовать основной цвет кнопки «Обсудить задачу».
  Подобрать размер галереи по ширине карточки. На планшетах и десктопах
  карточка целиком должна помещаться в видимую область при масштабе 100%.
- Сохранить порядок решений, содержание, фотогалереи, подписи об источнике
  и правах, сведения о проекте при наличии и ссылки на заявку.
- Сохранить независимую навигацию по решениям и по фотографиям внутри
  решения, а также поведение остальных секций с `CardCarousel`.

## Execution

Роли из заголовка выполняются последовательно, без делегации. При реализации
применить `ponytail`, `astro-best-practices` и `playwright`.

- [x] Прочитать правила и сверить [секцию][section], `BusinessSolutionCard`,
      [галерею][gallery], [CardCarousel][carousel] и [задачу 240][task240].
- [x] Подключить карусель, переиспользовать подходящую настройку ширины и
      адаптировать компоновку карточки и галереи к её доступным размерам.
- [x] Обновить затронутые colocated-тесты. Проверить в браузере размеры,
      прокрутку и независимость навигации на синтетических примерах.
- [x] Запустить целевые тесты, `pnpm check:style`, `pnpm check` и применимые
      проверки по [правилам проекта][verification]. Сверить diff и записать
      результаты в задачу перед обновлением статуса.

## Acceptance

- [x] На телефоне решения отображаются в одной горизонтальной карусели с
      одной полной карточкой и фрагментом следующей. Ширина карточек на
      планшете совпадает со стандартным десктопом: видны две полные карточки
      и фрагмент следующей. На широком десктопе видны три полных карточки и
      фрагмент следующей.
- [x] В карточках галерея идёт первой, далее вертикально выстроены три раздела
      текста, сведения о проекте и кнопка заявки. Высота карточек одинаковая,
      primary-кнопки центрированы по горизонтали у нижнего края.
- [x] В начале и после листания, пока справа остаются решения, хотя бы одна
      карточка видна целиком по ширине, а справа виден фрагмент следующей.
      Последняя карточка полностью доступна в конце прокрутки. Проверены
      промежуточные ширины и границы адаптивных режимов.
- [x] На планшете и десктопе каждая карточка целиком помещается по ширине
      и высоте в видимую область браузера при масштабе 100%. Проверены
      невысокие экраны и карточка с самым объёмным содержимым.
- [x] На узких экранах и при увеличении текста содержимое и ссылки остаются
      доступны целиком. Карусель не создаёт горизонтальной прокрутки страницы.
- [x] Свайп, мышь и клавиатура позволяют листать решения и отдельно управлять
      фотогалереей карточки. Фокус виден, прокрутка решений доступна без
      JavaScript, настройка уменьшенного движения учитывается.
- [x] Содержание, порядок, подписи к медиа и ссылки сохранены. Поведение
      других секций с `CardCarousel` сохранено.

## Handoff

`BusinessSolutions` passes ordered solution data to `CardCarousel`. Each card
starts with its gallery, followed by the heading, three text sections,
attribution and a centered primary/medium inquiry action at the bottom. Its
dimensions and font match the pricing inquiry CTA. The eight gallery, heading,
summary, copy, attribution and action rows use a shared subgrid across cards.
Each of the three copy sections aligns separately, empty attribution rows still
align, and the CTA has visible top spacing. The card gallery reaches the inside
top and side edges like a service card. Galleries use the existing panel mode at
a wide aspect ratio; the longest synthetic fixture fits 768px tablet and 700px
desktop viewports.

Card widths show 1.15 cards below 48rem, 2.2 cards from 48rem, and 3.2 cards
from 75rem. Tablet and standard desktop use the same 2.2-card formula.
Chromium checked 390, 767, 768, 1199, 1200 and 1440px for equal
widths, initial/advanced previews, full-card counts, last-card reachability and
page overflow. Additional scenarios covered four synthetic cards with two
photos each, long copy, vertical order, equal card heights, centered bottom
primary actions, matching pricing CTA dimensions/font, nested photo keyboard
navigation, keyboard End, reduced motion, 200% root text size, native
no-JavaScript scroll, and complete card height at 1024x768 and 1440x700.

Checks passed: 17 focused component tests during implementation, five after the
image-first/button update, and two on final CTA sizing; seven Chromium
scenarios including equal heights, centered bottom actions and computed CTA
font/size comparison with pricing;
`pnpm check:style`; `pnpm check` (457 Astro files, zero errors, warnings or
hints); Prettier on changed files; `git diff --check`. Follow-up alignment
changes passed five focused component tests, eight Chromium scenarios including
each section baseline, gallery edge alignment and CTA spacing, `pnpm check:style`
and `pnpm exec astro check` (457 files, zero errors, warnings or hints).
The gallery provenance caption is visually hidden but remains available to
assistive technology, and the taller image panel uses the caption's freed space.
Five focused component tests and all nine Chromium scenarios passed after this
follow-up; the browser checks include the larger panel, accessible rights
caption, mobile overflow and card height at 1440x700. `pnpm check:style`,
`pnpm exec astro check` (457 files, zero errors, warnings or hints), Prettier
and `git diff --check` passed. Shared mouse/touch drag behavior was previously
verified for the unchanged `CardCarousel` in [task 239][task239-drag]. Full
verification gates and other browser engines were not run.

Implementation, tests and review were completed sequentially by Codex (GPT-6),
reasoning `medium`, without delegation.

Earlier staging and commit attempts were declined by automatic approval because
authorization was not explicit and unrelated changes could have been included.
The user has since explicitly authorized committing all current changes.

[section]:
  ../../../../../src/components/sections/business-solutions/BusinessSolutions.astro
[gallery]:
  ../../../../../src/components/sections/business-solutions/media/
[carousel]:
  ../../../../../src/components/ui/carousel/card-carousel/CardCarousel.astro
[task240]: ../../todo/240-use-card-carousel-for-pricing-examples.md
[task239-drag]: 239-use-card-carousel-for-ordering-process.md
[verification]: ../../../rules/verification.md
