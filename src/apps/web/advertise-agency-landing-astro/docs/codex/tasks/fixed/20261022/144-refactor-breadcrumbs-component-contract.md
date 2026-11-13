# 144. Убрать зависимость Breadcrumbs от URL каталога

Статус: запланировано. Создано: 2026-10-22. Приоритет: средний.

## Основание и границы

`src/components/ui/Breadcrumbs.astro` является общим UI-компонентом, но
сравнивает каждый `item.href` с жёстко заданным `/projects/` и сам добавляет
`data-project-catalog-return`. Этот проектный маркер отсутствует в описании
контракта компонента и связывает навигационный примитив с URL каталога. При
изменении маршрута или повторном использовании компонента легко получить тихое
нарушение возврата к фильтрам каталога.

Цель — сделать границу ответственности явной, сохранив native-ссылки, порядок
элементов, `aria-current="page"`, поведение возврата к последнему состоянию
каталога и no-JavaScript fallback.

Рабочие файлы: `src/components/ui/Breadcrumbs.astro`, его тест и страницы
проекта/каталога, а также `src/components/projects/ProjectArticleActions.astro`
и связанные заметки о публичном контракте. Runtime-контент, маршруты и
клиентская логика каталога вне необходимой адаптации не менять.

## Реализация

- Перед началом прочитать `AGENTS.md`, правила разработки и
  `astro-best-practices`.
- Удалить сравнение с конкретным `/projects/` из общего компонента. Передать
  необходимые `data-*` или иной маркер явно из проектной композиции через
  типизированный контракт ссылки, либо оставить маркер только в проектном
  компоненте, если это сохраняет оба сценария возврата.
- Не добавлять в `Breadcrumbs` знания о каталогах, страницах проектов или
  `sessionStorage`. Публичные `items`/`current` должны оставаться понятными и
  документированными; новый необязательный контракт описать рядом с типами и в
  `docs/rules/development/components.md`.
- Сохранить русский accessible name навигации, ordered list, экранирование
  текста, пустой список предков, native href и текущую CSS-разметку, если она не
  требуется для устранения связи.
- Обновить вызовы страниц проекта и компонент возврата так, чтобы маркер
  оставался только там, где нужен для восстановления каталога. Не менять
  сохранение query/hash и прямой fallback `/projects/`.
- Комментариями объяснить границы общего компонента и проектной адаптации;
  соблюдать лимит 80 символов.

## Приёмка и проверки

- В `Breadcrumbs.astro` нет строкового сравнения с `/projects/` и нет скрытой
  проектной логики.
- Рендер-тесты через `tests/helpers/render.ts` проверяют предков, текущий
  элемент, пустой список, отсутствие маркера по умолчанию и явный маркер в
  проектной композиции. Небезопасный HTML в подписях остаётся экранированным.
- Тесты `project-catalog`/`ProjectArticleActions` подтверждают сохранение
  query/hash при возврате из проекта; native links работают без JavaScript.
- Запустить сфокусированные component/script tests, `pnpm check:style`, ESLint и
  `pnpm build`. Существующие несвязанные ошибки фиксировать отдельно.
- После выполнения архивировать задачу в `docs/codex/tasks/fixed/20261022/` и обновить
  `.codex/TASKS.md` по правилам управления задачами.

## Implementation result

Status: completed on 2026-10-22.

- `Breadcrumbs.astro` now forwards optional typed link attributes and has no
  project-route or storage knowledge.
- The project detail page explicitly marks its catalog ancestor link; the
  project action link keeps the native `/projects/` fallback and restoration
  script.
- Updated the colocated Breadcrumbs tests and the public component contract.
- Verified with focused Vitest tests, `pnpm check`, `pnpm lint`, and
  `pnpm build`. Existing Zod deprecation and large-chunk warnings remain.
