# 143. Исправить устаревшие ошибки тестовых контрактов

Статус: к выполнению. Создано: 2026-10-22. Исполнитель: Luna (`gpt-6-luna`),
effort: medium.

## Цель

Устранить девять старых падений общего Vitest-запуска и шесть связанных
диагностик `pnpm check`. Тесты должны соответствовать текущему контракту
проектов и публикации блоков после удаления полей `Project.notice` и
`blockDemoNotice`.

## Падения и область изменений

1. Пять падений `src/validation/projects.test.ts`: fixture
   `tests/fixtures/content/unit-contracts.json` содержит удалённое поле
   `project.notice`, поэтому spread в проверках схемы даёт `unrecognized_keys` и
   ломает проверки metadata/content/publication/form.
2. Одно падение `src/components/content/ContentBlocks.test.ts`: тест ожидает
   `.block-demo-notice`, которого текущий `ContentBlocks.astro` намеренно не
   рендерит. Сохранить проверки фильтрации draft и наличия demo media; заменить
   только устаревшее ожидание на актуальный контракт.
3. Три падения `tests/integration/page-compositions.test.ts`: удалить `notice`
   из synthetic `Project` overrides, убрать импорт `blockDemoNotice` и обновить
   edge-case assertions. Текущий проект показывает metadata/status и видимые
   блоки; он не должен снова получать notice только ради теста.

Проверить также связанные type-contract fixtures и builders:
`tests/fixtures/content/type-contracts/project.ts`,
`src/components/cards/ProjectCard.test.ts`, `tests/helpers/fixtures.ts`. Runtime
content и схемы в `src/` менять только если найдено реальное расхождение
контракта, а не для возврата удалённых полей.

## Требования к реализации

- Сначала прочитать `AGENTS.md`, `docs/development/rules/` и текущие схемы
  `src/validation/projects.ts`, `src/content/block-publication.ts`.
- Согласовать fixtures с типом `Project`: `id`, `category`, `status`, `title`,
  `client`, `date`, `attribution`, `description`, optional `evidence`,
  `content`. Поле `notice` не добавлять обратно.
- Для demo article tests проверять фактическое поведение: `noindex`, наличие
  видимых demo-блоков, отсутствие draft-копии и корректный порядок блоков. Не
  ослаблять проверки до простого `toBeDefined()` и не удалять сценарии.
- Все изменения ограничить тестами и versioned fixtures. Runtime content хранить
  в `data/content/`, test fixtures — в `tests/fixtures/content/`.
- Соблюдать лимит 80 символов и не менять продуктовый UI без отдельного
  основания.

## Приёмка

- `pnpm exec vitest run src/validation/projects.test.ts` проходит (все 7
  тестов).
- `pnpm exec vitest run src/components/content/ContentBlocks.test.ts` проходит
  (все 3 теста).
- `pnpm exec vitest run tests/integration/page-compositions.test.ts` проходит
  без трёх edge-case ошибок.
- `pnpm test` проходит без старых девяти падений; если появятся новые
  независимые ошибки, перечислить их отдельно с первым failing assertion.
- `pnpm check`, `pnpm lint`, `pnpm build` и `git diff --check` проходят.
- В финале записать изменённые fixtures, фактические результаты и подтвердить,
  что `Project.notice` и `blockDemoNotice` не возвращены в runtime-код.
