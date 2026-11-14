# 162 — Подготовка tooling и полных шаблонов

Дата: 2026-11-14. Статус: backlog. Этап: MIG-001.

План: [миграция контента](../plan/20261114_site-content-structure-migration-plan.md).

## Зависимости и контекст

Начать после [161](161-content-migration-baseline.md).
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

Основные файлы: scripts/verify-content-boundaries.mjs,
scripts/prepare-ci-content.mjs, scripts/test-content-catalog.mjs,
vitest.config.ts, tsconfig.type-contracts.json,
data/templates/manifest.json и новый action-rail template.
Читать generate-content-catalog.mjs, e2e-server.mjs, action-rail schema.
Генератор менять только при подтверждённой необходимости.

Runtime не коммитить и не заменять starter/fixture данными.
JSON payload, MDX, approvals, IDs, ordering и public exports сохранять.
Временные скрипты и private evidence хранить только в ignored output.

## Действия

- Добавить безопасный template `config/action-rail.json` по текущей
  strict schema и synthetic fixture; не копировать authored runtime.
- Включить его в manifest; обеспечить 20 JSON и 2 MDX starter.
- Boundary checker принимает переходный map конкретных допустимых путей
  `config/**` и `site/**`, отклоняет неизвестные пути и дубли домена.
- Сохранить denylist, уникальность outputs и проверки MDX.
- Подготовить CI provisioning полного mixed fixture package.
  Запуск только в чистом CI checkout, не поверх локального runtime.
- Сохранить корень fixtures `tests/fixtures/content/site/`.
  Он зеркалит корень `data/content/`: конечный путь settings будет
  `tests/fixtures/content/site/site/settings/site.json`.
- Vitest/type-contract aliases поддерживают оба корня в fixtures,
  без fallback к реальным данным. CI/E2E читают те же manifest outputs.
- Проверить E2E provisioning action-rail после добавления в manifest.
- Расширить catalog regression: nested outputs, mixed layout,
  отсутствие дубликатов; сохранить существующие negative cases.

## Проверки и приёмка

Старая раскладка работает; новый starter включает ActionRail.
Чистые CI/E2E builds работают на fixtures без локального runtime.

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

