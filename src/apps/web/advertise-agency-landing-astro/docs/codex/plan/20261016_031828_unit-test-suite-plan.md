# План полноценного набора unit-тестов

## Основания и текущее состояние

План составлен по `AGENTS.md`, правилам `docs/development/rules/`,
`docs/development/components.md`, `docs/development/verification-and-ci.md`,
документации форм, тем, cookie banner и content contracts, а также по
`astro-best-practices/SKILL.md`.

В `src/components` уже есть 64 colocated test-файла, но 34 из них проверяют
только импорт компонента. Полного покрытия для `src/content`, `src/validation`,
`src/scripts`, `src/server`, layouts и pages нет. Компонентные тесты должны
оставаться рядом с исходными `.astro`/`.ts`, а композиционные сценарии — в
`tests/integration`. Fixtures хранятся в `tests/fixtures/content/`.

## Этап 1. Тестовая база

- Добавить builders для валидных `Service`, `Project`, `Review`,
  `PricingExample`, `ContentBlock`, `Offer`, `Faq`, `OrderInquiry`.
- Вынести минимальные versioned fixtures в `tests/fixtures/content/`.
- Расширить helpers для `localStorage`, `matchMedia`, `ResizeObserver`,
  `IntersectionObserver`, `MutationObserver`, timers и `fetch`.
- Сбрасывать DOM, storage, timers и mocks между тестами.
- Добавить mock-фабрики для Astro assets и `getCollection`.

## Этап 2. Validation и pure logic

Цель группы — не менее 90% строк.

Создать или расширить colocated tests для:

- `src/validation/shared.ts`, `parse-content.ts`;
- `business-solutions.ts`, `content-blocks.ts`, `faq.ts`;
- `image-carousel.ts`, `introduction.ts`, `offers.ts`;
- `order-inquiry.ts`, `ordering-process.ts`, `pricing.ts`;
- `production-and-guarantees.ts`, `project-catalog.ts`, `projects.ts`;
- `reviews.ts`, `service-articles.ts`, `services.ts`.

Для каждой схемы нужны успешные fixtures, граничные значения, malformed values,
unknown keys, безопасные URL, уникальность ID и проверка диагностик. Особенно
подробно покрыть discriminated unions content blocks, media, provenance, forms,
approval и published-path constraints.

## Этап 3. Content и publication logic

Покрыть:

- `about-carousel.ts`, `about.ts`, `business-solutions.ts`;
- `article-context.ts`, `block-publication.ts`, `content-block-labels.ts`;
- `faq-publication.ts`, `faq.ts`, `legal.ts`, `icons.ts`;
- `introduction-publication.ts`, `introduction.ts`;
- `offers.ts`, `order-form-registry.ts`, `order-inquiry.ts`;
- `ordering-process.ts`, `paragraph-links.ts`;
- `pricing-publication.ts`, `pricing.ts`;
- `production-and-guarantees.ts`, `project-catalog.ts`;
- `project-categories.ts`, `project-publication.ts`, `projects.ts`;
- `reviews.ts`, `service-publication.ts`, `services.ts`, `site.ts`.

Проверять экспортированные контракты и invariants: draft/demo/published
filtering, notices, publication issues, registered/general forms, category
lookup, price formatting, approved content и корректность JSON-данных.

## Этап 4. Server и browser modules

### `src/server/inquiry-payload.ts`

Проверить homepage и lettering payloads, required/optional fields, length и type
limits, email/phone/date/numeric values, consent, UUID, allow-lists, unexpected
fields, unsafe URLs, credentials и normalized output. Убедиться, что модуль не
выполняет сетевые запросы.

### `src/components/content/resolve-image.ts`

Проверить local asset metadata, public/remote URLs, width cap, focal metadata и
ошибку отсутствующего bundled asset.

### `src/components/forms/order-inquiry.ts`

Проверить validation required/type/length, conditional email, `aria-invalid`,
inline errors, first-error focus, disabled delivery, duplicate submit,
`FormData`, retry UUID, success, HTTP/network error, timeout, abort, сохранение
message и reset после подтверждённого результата.

### `src/components/ui/image-carousel.ts`

Проверить state каждой carousel, arrows/dots, `aria-hidden`, `aria-current`,
autoplay, pause на hover/focus/visibility/reduced-motion, отсутствие observer и
cleanup на `pagehide`.

### `src/scripts/project-catalog.ts`

Проверить normalization/matching, фильтры и категории, count/empty state,
debounce, URL serialization, сохранение server pagination и back/forward через
`popstate`.

### Остальные browser modules

- `src/scripts/chart-runtime.ts` — ECharts runtime, malformed data, fallback,
  resize и cleanup.
- `src/scripts/homepage-reveal.ts` — section selection, observer fallback,
  reduced motion и cleanup.

## Этап 5. UI Astro-компоненты

Заменить import-only проверки на assertions по HTML, props, ARIA и branch output
для следующих файлов:

- `ui/Button.astro`, `Section.astro`, `Logo.astro`, `MaxLogo.astro`;
- `ui/ContactInfo.astro`, `Breadcrumbs.astro`, `NavLinks.astro`;
- `ui/MobileMenuDialog.astro`, `Settings.astro`, `ThemeToggle.astro`;
- `ui/ThemeInit.astro`, `CarouselControl.astro`;
- `ui/ImageCarousel.astro`, `ImageCarouselSlide.astro`;
- `ui/ServiceVisual.astro`, `YandexReviews.astro`.

Проверить native links/buttons, slot output, optional props, decorative SVG,
focus semantics, dialog behavior, theme storage failures, three radio modes,
unique IDs, disabled carousel items, fallback output, image loading policy и
iframe/placeholder branches.

## Этап 6. Cards и content blocks

### Cards

Покрыть normal/minimal props, missing media, escaping, native links, image
metadata, category/project URLs, price formatting, historical date и demo
disclosure для:

- `cards/ServiceCard.astro`;
- `cards/ProjectCard.astro`;
- `cards/ReviewCard.astro`;
- `cards/PricingExample.astro`.

### Content blocks

Полное branch-покрытие для:

- `content/HeadingBlock.astro`, `ParagraphBlock.astro`, `ListBlock.astro`;
- `content/TableBlock.astro`, `ChartBlock.astro`, `ContentImage.astro`;
- `content/ImageBlock.astro`, `ImageGalleryBlock.astro`, `ImageGallery.astro`;
- `content/VideoBlock.astro`, `QuoteBlock.astro`, `FootnoteBlock.astro`;
- `content/OrderFormContainer.astro`, `OrderFormBlock.astro`;
- `content/mdx-components.ts`.

Проверять semantic HTML, escaping, captions, links, empty data, responsive
metadata, fallback/error states, transcript, lightbox progressive enhancement и
publication context.

## Этап 7. Forms

Для `forms/LedLettersForm.astro` проверить default `serviceId`, hidden
project/service context, required name/phone/consent, conditional email,
disabled initial submit, endpoint и status attributes.

Для `sections/OrderInquiry.astro` проверить general form shell, context,
disabled/unavailable delivery, status region и client-script wiring.

Для `content/OrderFormContainer.astro` проверить heading, description,
`aria-describedby`, default slot, custom ID и class.

## Этап 8. Sections

Расширить тесты для:

- `sections/About.astro`, `Introduction.astro`, `OffersCarousel.astro`;
- `Services.astro`, `ServiceArticle.astro`, `Projects.astro`;
- `Reviews.astro`, `PricingExamples.astro`, `OrderingProcess.astro`;
- `ProductionAndGuarantees.astro`, `BusinessSolutions.astro`;
- `Faq.astro`, `Contacts.astro`, `OrderInquiry.astro`.

Проверить published/demo/empty collections, порядок, CTA, optional media,
landmarks, noindex demo articles, карту/Yandex/video fallbacks и контекст форм.

## Этап 9. Project catalog components

Покрыть:

- `projects/ProjectCatalogControls.astro`;
- `ProjectCatalogCount.astro`, `ProjectCatalogEmpty.astro`;
- `ProjectCatalogGrid.astro`, `ProjectCatalogPagination.astro`;
- `ProjectDetailHeader.astro`, `ProjectArticleActions.astro`.

Проверить data markers, normalized search text, category values, empty catalog и
search, pagination boundaries, ellipsis, disabled previous/next, `aria-current`,
detail metadata и сохранение catalog URL.

## Этап 10. Global components

### `Header.astro`

Проверить desktop/mobile navigation, composition с Settings и dialog, scroll
hide/show, focus, hashchange, pageshow и взаимное исключение settings/dialog.

### `Footer.astro`

Проверить legal links, contacts, logo и build year из site config.

### `CookieBanner.astro`

Проверить accepted/declined, localStorage persistence и blocked storage,
dismissal, ResizeObserver body padding, cleanup, отсутствие focus trap и то, что
banner не управляет загрузкой внешних ресурсов.

## Этап 11. Layouts и pages

В `tests/integration` добавить render/invariant tests для:

- `layouts/Layout.astro`, `layouts/LegalLayout.astro`;
- `pages/index.astro`, `404.astro`, `privacy-policy.astro`,
  `terms-of-use.astro`;
- `pages/projects/index.astro`, `projects/[id].astro`,
  `projects/page/[page].astro`;
- `pages/services/montazh.astro`, `neon.astro`, `obyomnye-konstruktsii.astro`,
  `svetovye-bukvy.astro`, `vyveski.astro`.

Проверить metadata, canonical/robots, heading hierarchy, layout composition,
empty/demo content, no-JS reading order и generated links.

Для `pages/robots.txt.ts` и `pages/sitemap.xml.ts` добавить unit-тесты `GET`:
content type, absolute URLs, XML escaping, expected routes и site config.

## Этап 12. TypeScript type modules

Для `src/types/*.ts` не нужны runtime-тесты. Использовать compile-time fixtures
через `satisfies`, `tsc --noEmit`, проверки совместимости schema output с domain
types и, где допустимо, negative fixtures с `@ts-expect-error`.

## Этап 13. Integration-набор

Оставить в `tests/integration` композиционные сценарии:

- homepage с валидным и пустым content;
- service/project article с MDX и block stream;
- published/demo order forms с project/service context;
- `Header + MobileMenuDialog + Settings + ThemeInit`;
- catalog controls + grid + count + empty + pagination;
- CookieBanner с map/Yandex/video/image fallbacks.

## Порядок приёмки

После каждой группы запускать:

```powershell
pnpm test
pnpm check
pnpm verify:component-tests
```

После завершения запускать:

```powershell
pnpm test:coverage
pnpm verify:coverage-thresholds
pnpm build
pnpm verify:quality
pnpm verify:content
pnpm verify:boundaries
pnpm test:integration
```

Целевые пороги из `scripts/verify-coverage-thresholds.mjs`:

- logic (`validation`, `content`, `server`) — минимум 90%;
- client state (`scripts`, `components/forms`) — минимум 85%;
- components — минимум 70%;
- overall — минимум 80%.

Приоритет реализации: schemas/content/server, затем browser state и forms, после
этого Astro branches, затем layouts/pages и integration. Такой порядок сначала
стабилизирует contracts и fixtures, от которых зависят все render tests.

## Разбиение на задачи

Задачи созданы в `docs/codex/todo/` с ограниченным объёмом контекста:

- `091-unit-test-infrastructure.md` — общие helpers и fixtures;
- `092-validation-shared-and-parser.md` — shared validation и parser;
- `093-validation-content-blocks.md` — schemas content blocks;
- `094-validation-basic-domains.md` — FAQ, intro, reviews и basic domains;
- [095 — commerce, projects и services][task-095] — completed 2026-10-16;
- [096 — publication helpers и registries][task-096] — completed 2026-10-16;
- [097 — server payload validator][task-097] — completed 2026-10-16;
- [098 — image resolver и chart runtime][task-098] — completed 2026-10-16;
- [099 — client inquiry state][task-099] — completed 2026-10-16;
- `100-carousel-and-reveal-scripts.md` — carousel/reveal scripts;
- `101-ui-primitives-tests.md` — базовые UI-компоненты;
- `102-theme-and-navigation-components.md` — theme, navigation и media UI;
- `103-card-components-tests.md` — карточки;
- `104-basic-content-block-components.md` — простые content blocks;
- `105-media-and-form-block-components.md` — media/form blocks;
- `106-form-components.md` — Astro forms;
- `107-home-sections.md` — homepage sections;
- `108-article-and-contact-sections.md` — article/contact sections;
- `109-project-catalog-components.md` — catalog components;
- `110-project-catalog-script.md` — catalog browser script;
- `111-global-components.md` — Header, Footer и CookieBanner;
- `112-layouts-and-pages.md` — layouts и route pages;
- `113-route-and-type-contracts.md` — route handlers и type contracts;
- `114-integration-matrix-and-gates.md` — composition и финальные gates.

Каждая задача ограничена одной ответственностью и содержит зависимости, границы
работы и критерии готовности, чтобы реализация не требовала чтения всего плана в
одном контексте.

[task-095]: ../fixed/20261016/095-validation-commerce-and-catalog.md
[task-096]: ../fixed/20261016/096-content-publication-logic.md
[task-097]: ../fixed/20261016/097-inquiry-payload-tests.md
[task-098]: ../fixed/20261016/098-image-and-chart-utils.md
[task-099]: ../fixed/20261016/099-inquiry-browser-module.md
