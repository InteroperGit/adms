# 210 — Оптимизация загрузки статей по замерам

- **Executor:** Luna (`gpt-6-luna`), reasoning: `high`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `high`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `high`.

**Статус:** fixed. Создано и выполнено: 2026-11-17.
**Мастер:** [205](../todo/205-content-refactor-master.md).
**Зависимость:** [209](209-content-validation-refactor.md), принять до начала
этой задачи.

## Scope

- Оптимизировать только подтверждённые baseline узкие места services/projects
  и их потребителей; повторить baseline после структурных изменений.
- Рассмотреть стоимость site → services и pricing → projects;
  не заменять полную валидацию проверкой только видимых записей.
- Не добавлять глобальный кеш без доказанной необходимости и корректной
  инвалидации; не скрывать ошибки MDX автоматическим JSON fallback.
- Текущая авторизация разрешает автоматическое выполнение серии 205–211;
  задача начинается после принятия 209.
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
- [x] Сравнить текущие затраты с 206 и выбрать минимальную оптимизацию;
      при отсутствии доказанного выигрыша обосновать отказ от изменения.
- [x] Реализовать выбранное решение с сохранением порядка, ID и export API;
      избежать двойного render без пропуска обязательной валидации.
- [x] Обновить тесты JSON/MDX, missing/mismatched entries, malformed blocks,
      отключённых записей, ошибок зависимостей и правил публикации.
- [x] Запустить затронутые suites, standalone content-тесты,
      pnpm verify:boundaries, pnpm verify:content и pnpm check.
- [x] Повторить минимум три замера на тех же fixtures и окружении;
      сравнить медиану, разброс и число render/parse-вызовов.
- [x] Провести ревью diff, проверок и acceptance; устранить замечания.
- [x] Записать фактические модели/effort, файлы, команды, результаты
      и ограничения в Handoff; обновить мастер и индекс задач.
- [x] После принятия оформить отдельный локальный коммит;
      архивировать только по правилам workflow, без push.

## Acceptance

- [x] Записаны до/после, команды, входы и ограничения доказательств.
- [x] Выбранное изменение даёт воспроизводимый выигрыш без регрессии;
      иначе сохранено прежнее решение с обоснованием.
- [x] Все записи валидируются; ошибки, порядок и видимость сохранены.
- [x] Не появился доступ браузера к runtime-контенту и серверным зависимостям.
- [x] Проверки завершились успешно; оставшиеся блокеры явно записаны,
      незавершённые критерии не отмечены выполненными.

## Handoff

Выполнено 2026-11-17 Luna (`gpt-6-luna`), reasoning high; делегирования нет.
Из-за отсутствия контролируемого до/после замера production loading code не
изменялся; кеш, fallback и render/parse порядок сохранены. 206 измерял те же
синтетические inputs в `output/content-refactor/ci-content` и выдал 15 страниц:
43,481.49 / 14,998.32 / 85,876.67 ms (median 43,481.49; spread 70,878.35).
После 208–209 тот же `pnpm build` с `CI=true` и тем же root выдал 15 страниц:
8,575.89 / 8,666.31 / 8,691.21 ms (median 8,666.31; spread 115.32).
Первый build показал duplicate slug из-за старого `.astro` content cache;
следующие два были без этой диагностики. Это свидетельствует о разном
состоянии cache, поэтому быстрый warm median нельзя приписывать migration.

Одинаковый `node output/content-refactor/article-baseline.mjs` обрабатывает
те же два fixture article за 3 пробы / 6 `compileMdx` calls. Baseline 206:
377.16 / 8.68 / 10.41 ms (median 10.41); после 208–209: 233.11 / 6.45 /
6.65 ms (median 6.65). Холодный первый sample в обоих наборах делает
сравнение по median ненадёжным; instrumentation parse/render counts не
добавлялась, так как задача закрылась без source change.

Проверки после замеров: `pnpm check` (385 файлов, 0 errors, 0 warnings,
1 прежняя Zod deprecation hint), `pnpm verify:boundaries`,
`pnpm verify:content` (20 JSON), `pnpm test:content-catalog`,
`pnpm test:content-blocks`, `pnpm test:publication-policy`; все прошли.
Тесты 209: 52 файла / 297 тестов и types также прошли при неизменённом source.
Runtime/fixture данные не менялись; полный verification suite не запускался,
post-implementation full run не запрашивался отдельно.

