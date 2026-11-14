# 161 — Исходное состояние миграции

Дата: 2026-11-14. Статус: backlog. Этап: MIG-000.

План: [миграция контента](../plan/20261114_site-content-structure-migration-plan.md).

## Зависимости и контекст

Первая задача серии; реализация миграции ещё не начата.
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

Изменять только ignored evidence и task/plan handoff.
Исходники, runtime, шаблоны и fixtures на этом этапе не менять.

Runtime не коммитить и не заменять starter/fixture данными.
JSON payload, MDX, approvals, IDs, ordering и public exports сохранять.
Временные скрипты и private evidence хранить только в ignored output.

## Действия

- Прочитать loaders группы, manifest и scripts provisioning.
- Сохранить локальную резервную копию JSON/MDX и SHA-256 под
  ignored `output/content-migration/baseline/`.
- Составить inventory runtime, templates и fixtures с map старый → новый.
- Учесть 20 runtime/fixture JSON против 19 template JSON:
  отсутствующий template action-rail устраняется задачей 162.
- Зафиксировать исходные маршруты, видимые записи, IDs и порядок секций.
- Выполнить полный набор проверок. Известные ошибки оформить с командами
  и воспроизведением; ошибки, мешающие доказать рабочее состояние сайта,
  устранить отдельной задачей до переноса данных.
- Git не показывает изменения ignored runtime: использовать backup/hash audit.

## Проверки и приёмка

Есть восстанавливаемая копия, полная карта файлов и достоверный baseline.
Следующая задача начинается только с подтверждённого рабочего состояния.

Зафиксировать исходные результаты следующих gates.
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

