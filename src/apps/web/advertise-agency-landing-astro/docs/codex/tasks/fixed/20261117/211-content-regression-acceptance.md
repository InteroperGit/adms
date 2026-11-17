# 211 — Регрессионная приёмка src/content

- **Executor:** Luna (`gpt-6-luna`), reasoning: `high`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `high`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `high`.

**Статус:** fixed. Создано и выполнено: 2026-11-17.
**Мастер:** [205](../../todo/205-content-refactor-master.md).
**Зависимость:** [210](210-content-loading-optimization.md), принятая до начала
этой задачи.

## Scope

- Проверить результат 206–210 по исходным контрактам и целевой карте.
- Проверить страницы каталога, услуг, проектов, legal и главной,
  SEO/noindex, формы и вложенные политики публикации на synthetic fixtures.
- Не запускать полный verification без явного запроса пользователя
  после реализации; его отсутствие явно отразить в handoff.
- Текущая авторизация разрешает автоматическое выполнение серии 205–211;
  задача начинается после принятия 210.
- Сохранять runtime в `data/content/`, fixtures в
  `tests/fixtures/content/`, не менять authored данные.

## Execution

Участник: primary координирует; делегирования нет. Исполнение, ревью и
проверки: Luna (`gpt-6-luna`), reasoning high.
Это планируемые роли. Навыки: `ponytail`; `astro-best-practices`
при изменении Astro-файлов; Context7 при решениях о framework API.

- [x] Прочитать [правила](../../rules/index.md), workflow, code-style,
      architecture, content, testing и verification; сверить diff.
- [x] Проверить разрешение исполнения и завершение зависимости;
      только затем перенести задачу в todo и обновить ссылки.
- [x] Сверить итоговую структуру, все импорты и colocated suites с картой 207;
      проверить отсутствие циклов и обратных зависимостей.
- [x] Запустить затронутые unit/integration suites, pnpm test:types,
      pnpm check:style, pnpm check и проверки изменённых файлов Prettier.
- [x] Запустить pnpm verify:boundaries, pnpm verify:content,
      pnpm test:content-catalog, pnpm test:content-blocks,
      pnpm test:publication-policy.
- [x] Выполнить fixture build, затем применимые проверки построенного output
      и изолированные E2E по каталогам, статьям и публикации.
- [x] По явному запросу после реализации выполнить все final gates
      из verification.md в заданном порядке; иначе записать ограничение.
- [x] Сопоставить итоговые замеры с 206, проверить полный diff и ссылки;
      передать результаты мастеру 205.
- [x] Провести ревью diff, проверок и acceptance; устранить замечания.
- [x] Записать фактические модели/effort, файлы, команды, результаты
      и ограничения в Handoff; обновить мастер и индекс задач.
- [x] После принятия оформить отдельный локальный коммит;
      архивировать только по правилам workflow, без push.

## Acceptance

- [x] Изменённые публичные контракты и отрицательные сценарии покрыты
      проверками.
- [x] Нет утечки draft/private evidence и изменения demo/noindex/form gates.
- [x] Итоговое поведение и порядок данных соответствуют baseline.
- [x] Все применимые проверки пройдены; непроведённые и исходные сбои
      перечислены отдельно, полнота проверки не преувеличена.
- [x] Проверки завершились успешно; оставшиеся блокеры явно записаны,
      незавершённые критерии не отмечены выполненными.

## Handoff

Выполнено 2026-11-17 Luna (`gpt-6-luna`), reasoning high; делегирования не
было для implementation (read-only routing audit: primary, Luna high).
Проверена структура 206–210: policy modules принадлежат
`src/validation/policies`, JSON loaders — `src/content`, доменные типы
независимы от content value loaders; действующие старые policy paths не
найдены. `pnpm verify:boundaries` подтверждает границы; HTTP/browser code
не зависит от runtime content. Никакие source changes не требовались.

Проверки: `pnpm exec vitest run src/content src/validation src/components
tests/integration src/pages/_sitemap.xml.test.ts` — 137 файлов / 646 тестов;
`pnpm test:types`; `pnpm check` после последнего source change (385 файлов,
0 errors/0 warnings, 1 deprecation hint в неизменённом
`src/validation/content-blocks.ts`); `pnpm check:style`; `pnpm exec prettier
--check` по изменённым source, task records и `.codex/TASKS.md`;
`pnpm verify:boundaries`; `pnpm verify:content` (20 runtime JSON);
`pnpm test:content-catalog`, `pnpm test:content-blocks`,
`pnpm test:publication-policy` — все прошли.

Synthetic `pnpm build` создал 15 страниц; `pnpm verify:quality` passed для
15 routes, включая sitemap/canonical/noindex и draft leakage checks.
Chromium isolated E2E: `catalog.spec.ts`, `catalog-pagination.spec.ts`,
`content-table.spec.ts`, `no-javascript.spec.ts`, `responsive.spec.ts` —
48/48 прошли. Проверены catalog routes, rendered articles, form submission
guard, legal pages and responsive output. 206 vs post-refactor measurement
variance и отсутствие причинно контролируемого warm/cold comparison
зафиксированы в 210; optimization не производилась.

Полный final verification sequence из `verification.md` не запускался:
пользователь не запрашивал post-implementation full run. Playwright запускался
только в Chromium и только по пяти изолированным spec files; Firefox/WebKit и
остальные E2E suites не запускались. Runtime/fixture authored content не
изменялись.
