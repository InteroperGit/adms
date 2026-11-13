# 142. Убрать дублирование в NavLinks

Статус: выполнено. Создано: 2026-10-22. Завершено: 2026-10-22. Исполнитель: Luna
(`gpt-6-luna`), effort: medium.

## Основание и границы

В `src/components/ui/NavLinks.astro` desktop/mobile ветки повторяют обход
`items`, телефонную кнопку и ссылку Макс. Изменение контактов требует правок в
двух местах. `NavLinks.test.ts` проверяет только наличие экспорта.

Цель — один шаблон ссылок с вариантами оформления. Рабочие файлы:
`src/components/ui/NavLinks.astro` и соседний `NavLinks.test.ts`. Контент,
публичные props и поведение Header/MobileMenuDialog не менять. Новые компоненты,
зависимости и клиентский JavaScript не нужны.

## Реализация

- Прочитать `AGENTS.md`, правила `docs/rules/development/rules/` и навык
  `astro-best-practices`. Для контекста открыть `Header.astro`,
  `MobileMenuDialog.astro`, `Button.astro` и `tests/helpers/render.ts`.
- Сохранить props `items`, `variant: 'desktop' | 'mobile'`, `phone`. В
  frontmatter вычислить `isDesktop` и `phoneHref`; оставить удаление пробелов из
  номера без дополнительной нормализации.
- Сделать один `nav`, один список `ul/li`, один обход `items`, одну телефонную
  кнопку и одну ссылку Макс. Различия выразить через `class:list`, props Button
  и подпись телефонной кнопки.
- Сохранить доступное имя навигации, порядок меню → телефон → Макс, исходные
  href, `target="_blank"`, `rel="noopener noreferrer"` и MaxLogo. Desktop
  показывает номер (`outline/sm`), mobile — «Позвонить» (`primary/md`). Адрес
  Макс остаётся `https://max.ru/`.
- Адаптировать scoped CSS к общему списку: desktop скрыт до `64rem`, затем
  ссылки располагаются с переносом; mobile остаётся вертикальным меню с кнопками
  на всю ширину. Сохранить класс `desktop-nav` на nav, размеры целей, отступы,
  перенос длинного текста и видимый фокус.
- Комментариями объяснить различия вариантов; соблюдать лимит 80 символов.

## Приёмка и проверки

- В шаблоне нет двух копий меню и контактных действий. Оба варианта сохраняют
  внешний вид, порядок Tab и нативную навигацию без JavaScript.
- Заменить smoke-тест реальным рендерингом через существующий helper. Для обоих
  вариантов проверить порядок и адреса ссылок, подпись и классы телефона,
  удаление пробелов из номера, единственную ссылку Макс и её атрибуты. Пустой
  `items` сохраняет контакты; текст с HTML экранируется.
- Запустить `pnpm test -- src/components/ui/NavLinks.test.ts` и
  `pnpm test -- src/components/Header.test.ts`, затем `pnpm check`, `pnpm lint`,
  `pnpm build`. Прежние несвязанные ошибки записать отдельно.
- Выполнить существующий `tests/e2e/navigation.spec.ts` в Chromium; проверить
  desktop/mobile на 1280 и 390 px, длинные подписи, светлую и тёмную темы.
  Результаты записать в задаче. Не ослаблять assertions.
- После выполнения архивировать задачу по правилам
  `docs/rules/development/task-management.md` и обновить `.codex/TASKS.md`.

## Результат

- Объединены desktop/mobile шаблоны в один `nav`, `ul`, обход пунктов меню,
  телефонная кнопка и ссылка Макс. Публичные props и порядок действий сохранены;
  телефонный href вычисляется один раз.
- `NavLinks.test.ts` расширен до трёх render-проверок для двух вариантов,
  пустого меню и HTML-экранирования.
- `pnpm exec vitest run src/components/ui/NavLinks.test.ts`: 3 passed.
- `pnpm exec vitest run src/components/Header.test.ts`: 5 passed.
- `pnpm check:style` и ESLint для изменённых файлов прошли.
- `pnpm build`: прошёл, 39 страниц.
- Chromium navigation scenarios in the full E2E run passed (5 scenarios). The
  pnpm argument forwarding started the full matrix; it was stopped after the
  relevant Chromium navigation scenarios completed.
- `pnpm check`: не прошёл из-за шести существующих ошибок в fixtures/tests,
  связанных с удалёнными `notice` и `blockDemoNotice`; NavLinks ошибок нет.
