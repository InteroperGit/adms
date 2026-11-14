# 165 — Перенос остальных секций главной

Дата: 2026-11-14. Статус: backlog. Этап: MIG-004.

План: [миграция контента](../plan/20261114_site-content-structure-migration-plan.md).

## Зависимости и контекст

Начать после [164](164-content-migration-primary-sections.md).
При архивировании предшественника обновить ссылку на его фактический путь.
Один запуск выполняет только эту задачу; весь репозиторий читать не требуется.

Прочитать AGENTS.md и docs/codex/rules/index.md, workflow.md,
code-style.md, architecture.md, content.md, testing.md, verification.md.
Затем прочитать только перечисленные ниже loaders, callers и checks.

## Skills и участники

Grilling уже завершён: структура, scope и поэтапный переход согласованы.
Применять ponytail; перед изменением Astro читать astro-best-practices.
Рекомендованная модель: Luna medium. Один основной агент, без делегации.
В отчёте записать фактическую модель/effort и причины эскалации.

## Файлы и границы

Четыре loader-модуля, manifest, три набора JSON,
asset script, найденные mocks и affected section tests.

Для перечисленных JSON переместить согласованную группу одновременно:

- data/content/config → data/content/site/<группа>;
- data/templates/config → data/templates/site/<группа>;
- tests/fixtures/content/site/config →
  tests/fixtures/content/site/site/<группа>.

Здесь fixtures/content/site — корень пакета; второй site отражает runtime.
Обновить path/output manifest в этой же задаче, не откладывать до финала.
Старые файлы группы удалить, остальные домены оставить на текущих путях.

Runtime не коммитить и не заменять starter/fixture данными.
JSON payload, MDX, approvals, IDs, ordering и public exports сохранять.
Временные скрипты и private evidence хранить только в ignored output.

## Действия

- Перенести business-solutions.json, faq.json, offers.json,
  ordering-process.json в site/sections.
- Обновить одноимённые loaders, diagnostic paths, manifest и asset scan.
- Проверить publication helpers и render tests секций.
- Сохранить enabled/disabled, draft/demo, порядок items и defaults.
- Проверить carousel/navigation/no-JS E2E на synthetic данных.

## Проверки и приёмка

Секции главной работают из site/sections; последовательность,
видимость и интерактивное поведение сохранены.

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

