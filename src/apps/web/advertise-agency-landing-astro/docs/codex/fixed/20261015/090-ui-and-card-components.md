# 090 — Component-тесты UI и карточек

## Цель

Проверить наблюдаемые контракты базовых UI-компонентов и карточек.

## Объём

Создать тесты для `Button`, `Section`, `Breadcrumbs`, `ContactInfo`,
`ServiceCard`, `ProjectCard`, `ReviewCard` и `PricingExample` в
`tests/components/ui/` и `tests/components/cards/`. Проверить props/defaults,
semantic HTML, ссылки, slots, `aria-*`, `data-*`, hidden/open/alt, пустые
коллекции и обязательные fallback-сценарии из плана.

## Приёмка

Каждый перечисленный контракт имеет тест; HTML проверяется DOM-запросами,
а не snapshots; component coverage достигает 80%+.

## Completion — 2026-10-15

Completed without subagents. Added 38 tests across eight UI/card suites
with a shared Astro Container/JSDOM helper. Assertions use DOM queries,
accessible roles and names, native links, slots, optional copy and media,
draft filtering, first visible image/gallery, dated exact/range prices,
bundled responsive assets, and contextual missing-asset failures.
Button attribute passthrough covers hidden, aria and data attributes;
none of these components owns an open/dialog state.

Fixtures reuse versioned synthetic JSON and a typed project builder.
Review portraits are required by the current type/schema, despite older
optional-portrait wording in the component reference.

PricingExample now imports its formatter from pricing-publication directly,
avoiding runtime pricing/project loaders when rendering an isolated card.
Vitest inlines Astro to resolve asset virtual modules through Vite.

Verification:

- `pnpm test --coverage`: 153 tests pass, including 39 component tests
  (38 new plus the existing smoke test).
- All eight scoped Astro components report 100% mapped render-code coverage
  for statements, branches, functions and lines. CSS and browser event
  behavior are outside this measurement; project thresholds remain task 095.
- `pnpm check`: passes with one existing Zod deprecation hint.
- `pnpm build`, content boundaries and content invariants pass.
- Built HTML quality audit still reports the unchanged duplicate project
  IDs and homepage image loading-policy omission already tracked in
  [task 095](../../todo/095-coverage-ci-and-quality-gates.md).

Next: [091 content block tests](../../todo/091-content-block-components.md).
No commit or deployment performed.
