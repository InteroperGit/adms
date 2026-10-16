# 096 — Content publication и registries

Дата: 2026-10-16. Статус: completed.

## Задача

Покрыть `block-publication.ts`, `faq-publication.ts`,
`introduction-publication.ts`, `pricing-publication.ts`,
`project-publication.ts`, `service-publication.ts`, `article-context.ts`,
`order-form-registry.ts`, `paragraph-links.ts`, `project-categories.ts` и
`content-block-labels.ts`.

## Сценарии

Draft/demo/published filtering, publication issues, notices, visible/available
collections, form fallback, category lookup, price formatting, safe paragraph
links и полное соответствие block labels.

## Готово, когда

Pure logic тестируется без Astro render, unknown IDs и empty collections покрыты,
coverage content group не ниже 90%.

Зависимость: 094, 095.

## Implementation — 2026-10-16

Completed without subagents. Added eleven colocated pure-logic suites using
versioned fixtures. Cases cover nested draft filtering, cascading footnotes,
demo media, approvals and rights, source-labelled policy failures, FAQ and
photo gates, service/project visibility and indexable paths, price formatting,
form ownership and registry fallback, safe paragraph links, category validation
and complete Russian block labels. No Astro rendering or network is needed.

Extended the normal coverage include to all eleven scoped content modules.
Production logic and runtime content were not changed.

## Verification

- Focused suites: 52 tests pass.
- All eleven scoped modules: 100% statements, branches, functions and lines.
- Full regression suite: 98 files and 415 tests pass.
- Astro type checking: no errors; existing Zod finite() hint remains.
- Code style, component colocation and content checks pass.
- Production build: 39 pages; existing large-chunk warning remains.

[Corresponding plan](../../plan/20261016_031828_unit-test-suite-plan.md).
