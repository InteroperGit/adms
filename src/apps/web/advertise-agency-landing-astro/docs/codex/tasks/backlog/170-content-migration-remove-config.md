# 170 — Удаление config и итоговая приёмка

Дата: 2026-11-14. Статус: backlog. Этап: MIG-009.

План: [миграция контента](../plan/20261114_site-content-structure-migration-plan.md).

## Зависимости и контекст

Начать после [169](169-content-migration-pages.md).
При архивировании предшественника обновить ссылку на его фактический путь.
Один запуск выполняет только эту задачу; весь репозиторий читать не требуется.

Прочитать AGENTS.md и docs/codex/rules/index.md, workflow.md,
code-style.md, architecture.md, content.md, testing.md, verification.md.
Затем прочитать только перечисленные ниже loaders, callers и checks.

## Skills и участники

Grilling уже завершён: структура, scope и поэтапный переход согласованы.
Применять ponytail; перед изменением Astro читать astro-best-practices.
Рекомендованная модель: Sol medium. Один основной агент, без делегации.
В отчёте записать фактическую модель/effort и причины эскалации.

## Файлы и границы

Boundary/tooling aliases, пустые legacy каталоги, maintained docs,
manifest проверки и оставшиеся active path references.
Изменения fields/publication policy в эту задачу не входят.

Runtime не коммитить и не заменять starter/fixture данными.
JSON payload, MDX, approvals, IDs, ordering и public exports сохранять.
Временные скрипты и private evidence хранить только в ignored output.

## Действия

- Подтвердить перенос всех доменов и отсутствие активных старых imports.
- Проверить пути перед удалением только пустых config-каталогов
  в runtime/templates/fixtures. Не удалять неизвестные файлы рекурсивно.
- Удалить переходные aliases и разрешения config в tooling.
- Boundary checker требует site/settings, sections, pages или lists
  для manifest JSON; MDX остаётся articles.
- Проверить manifest parity с tracked templates и fixtures,
  отсутствие старых файлов и двойных копий доменов.
- Обновить README и актуальную документацию, включая source diagnostics
  parse-content.test.ts. Исторические fixed records сохранять.
- Проверить root alias scripts/e2e.config.mjs и collections
  src/content.config.ts; не менять article fixtures collection.
- Сравнить runtime с backup/hash audit, routes и visible records.
- Подтвердить clean CI, normal runtime build и isolated E2E build.

## Проверки и приёмка

Config полностью отсутствует во всех трёх деревьях.
Все loaders, provisioning и test suites используют финальные пути;
полный набор проверок проходит без ослабления assertions.

Выполнить focused checks затронутых модулей, затем полный набор gates
Из docs/codex/rules/verification.md в заданном порядке:

```sh
pnpm format:check
pnpm lint
pnpm verify:boundaries
pnpm verify:content
pnpm check
pnpm test:types
pnpm verify:component-tests
pnpm test
pnpm test:coverage
pnpm verify:coverage
pnpm build
pnpm verify:quality
pnpm test:e2e
```

Также выполнить pnpm test:content-catalog, pnpm test:content-blocks
и pnpm test:publication-policy. Build должен предшествовать quality.
E2E запускает собственный fixture preview; порт 4327 должен быть свободен.
Проверить mixed-layout clean CI provisioning в изолированном checkout;
не запускать prepare-ci-content поверх authored runtime.

После переносов сверить SHA-256 с локальной копией до задачи;
при редакторских изменениях между задачами сохранить новый snapshot,
не восстанавливать старый baseline поверх свежего контента.
Откат: вернуть пути группы и её callers из локальной копии/диффа задачи.
Откат исходников без обратного переноса ignored runtime недостаточен.
Ошибки не скрывать skip/retries или ослаблением schemas и coverage.
При непроходящих gates задача остаётся незавершённой; следующую не начинать.

## Checklist и передача

- [ ] Прочитаны применимые правила, skills и ограниченный набор файлов.
- [ ] Проверены зависимости и зафиксировано состояние до изменений.
- [ ] Выполнены действия и обновлены все потребители путей группы.
- [ ] Сохранены payload и валидность runtime/template/fixture наборов.
- [ ] Проверены diff, formatting, ссылки и требуемые gates.
- [ ] В отчёт внесены файлы, команды/результаты, откат и ограничения.
- [ ] Обновлены план и .codex/TASKS.md; завершённая задача архивирована
      в docs/codex/tasks/fixed/yyyyMMdd с исправлением входящих ссылок.

