# 113 — Route handlers и type contracts

Дата: 2026-10-16. Статус: completed on 2026-10-18.

## Модель и оценка

Рекомендуемая модель: `gpt-6.1-sol`; reasoning effort: `medium`. Оценка:
2026-10-18, с приоритетом экономии ресурсов.

Route handlers и отдельные type fixtures достаточно локальны для Luna. Sol нужен
для общей compile-time схемы и CI: важно согласовать aliases, fixture content,
schema/domain compatibility и negative diagnostics.

## Подзадачи для отдельных запусков

- [x] 113.a — `gpt-6-luna`, medium: robots.txt handler. Проверить content type,
      site config, абсолютные URLs и observable output.
- [x] 113.b — `gpt-6-luna`, medium: sitemap.xml handler. Проверить route set,
      absolute URLs, XML escaping и response headers.
- [x] 113.c — `gpt-6.1-sol`, medium: определить compile-time harness, список
      src/types/*.ts, aliases и CI command; дать пример positive/negative
      fixture и schema/domain compatibility assertion.
- [x] 113.d — `gpt-6-luna`, medium: по образцу c заполнить fixtures для всех
      type modules, включая index exports; использовать satisfies и адресные
      @ts-expect-error, без runtime tests типов.
- [x] 113.e — `gpt-6.1-sol`, medium: проверить полноту type matrix и подключить
      type checks к CI без ослабления strict/negative diagnostics.

Порядок: a/b независимо; c → d → e. Результат c включает точный перечень модулей
и способ запуска tsc --noEmit; d передаёт таблицу module → fixture.

Общий порядок работы и условия перехода на более сильную модель: [оценка
моделей][model-assessment].

[model-assessment]: ../../plan/20261018_todo-model-assessment.md

## Задача

Добавить tests для `pages/robots.txt.ts` и `pages/sitemap.xml.ts`, а для всех
`src/types/*.ts` — compile-time fixtures.

## Сценарии

Проверить content type, absolute URLs, XML escaping, expected routes и site
config. Для типов использовать `satisfies`, `tsc --noEmit`, schema/domain
compatibility и допустимые `@ts-expect-error` negative fixtures.

## Готово, когда

Runtime tests не дублируют type system, route handlers имеют полный observable
output, а type checks проходят в CI.

Зависимость: 096, 112.

## Completion — 2026-10-18

Added complete observable-response integration checks for robots.txt and
sitemap.xml: configured/missing origins, base paths and ports, response headers,
static and approved dynamic route sets, draft/demo exclusions, and XML escaping
with parsed absolute-URL round trips.

All 18 src/types modules have compile-time fixtures with positive satisfies
examples and addressed negative cases. The barrel export matrix and schema
output/domain compatibility assertions compile with a dedicated strict,
fixture-backed tsc --noEmit harness. Added pnpm test:types to CI and documented
the command, aliases, module matrix and negative-diagnostic conventions.

Validation: 58 integration tests pass, including eight new crawler cases. The
strict type harness, focused ESLint/Prettier, code style, content, boundaries
and component test colocation checks pass.

Astro validation: `pnpm check` passed with zero errors/warnings and one
pre-existing Zod deprecation hint. `pnpm build` generated 39 pages; the
existing large-bundle warning remains.