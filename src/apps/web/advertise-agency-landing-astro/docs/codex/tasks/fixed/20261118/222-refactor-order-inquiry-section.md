# 222. Разделить секцию заявки, форму и поля в `OrderInquiry`

- **Executor:** Sol (`gpt-6.1-sol`), reasoning: `medium`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Reviewer:** Sol (`gpt-6.1-sol`), reasoning: `medium`.

Статус — fixed. Создана и выполнена 2026-11-18.

- [Исходная секция](../../../../src/components/sections/OrderInquiry.astro)
- [Компонентный тест](../../../../src/components/sections/OrderInquiry.test.ts)
- [Структура компонентов из задачи 215](../todo/215-reorganize-components-by-responsibility.md)

## Scope

- Оставить в `OrderInquiry.astro` заголовок секции и сбор конфигурации. Вынести
  форму в `forms/order-inquiry/OrderInquiryForm.astro`. Форма отвечает за
  `form`, поле статуса, кнопка, `noscript` и вызов `initializeInquiry`.
- Вложить в форму `OrderInquiryFields.astro` рядом с ней для защищённого
  `fieldset` и раскладки. Разместить `InquiryTextField.astro`,
  `InquiryCaptcha.astro` и `InquiryConsent.astro` в
  `forms/order-inquiry/fields/`. Текстовое поле поддерживает текущие `input` и
  `textarea` с общим контрактом подписи, подсказки и ошибки.
- Переиспользовать `forms/orderInquiry.ts` и `forms/smartCaptcha.ts`, сохранив
  клиентский и серверный контракт.
- Пути в плане указаны относительно `src/components/`. Точку входа
  `sections/OrderInquiry.astro` использует `src/pages/index.astro`.
- Сохранить внешние контракты секции и текущие границы контента и фикстур.

## Execution

- При постановке применены `grilling`, `ponytail` и `astro-best-practices`. Для
  реализации применить `ponytail`, `astro-best-practices` и `playwright`.
- Роли и усилие указаны в заголовке. Основной агент выполняет роли и ведёт
  интеграцию.
- [ ] Прочитать правила workflow, code style, architecture, design, testing и
      verification, а также [inquiries](../../rules/inquiries.md). Сверить
      секцию, её потребителей и текущие тесты.
- [ ] Выполнить рефакторинг по Scope. Проверить владельцев scoped CSS.
- [ ] Обновить `OrderInquiry.test.ts` и добавить colocated-тесты для новых
      компонентов согласно testing. Проверить композицию главной через
      `tests/integration/shellHomeLegal.test.ts`.
- [ ] Выполнить целевые тесты, проверку формата затронутых файлов,
      `pnpm check:style`, `pnpm check`, `pnpm verify:boundaries` и
      `pnpm verify:component-tests`.
- [ ] Запустить `tests/integration/inquiry.test.ts` и целевые сценарии
      `tests/e2e/inquiry/` с тестовым транспортом, а также сценарий без JS.
- [ ] Проверить diff и критерии приёмки, записать результаты и решения в
      Handoff, обновить статус и ссылки согласно workflow.

## Acceptance

- [ ] Имена, ID, `data-*`, `maxlength`, `autocomplete` и связи label/hint/error
      сохранены. Клавиатурный фокус и live-статус доступны.
- [ ] Управление заблокировано до инициализации. Сохраняются сценарии без JS, с
      выключенной доставкой, SmartCaptcha, валидацией и повторной отправкой.
- [ ] Целевые проверки проходят. У выделенных компонентов тесты лежат рядом с
      исходниками, а локальные стили следуют за принадлежащей им разметкой.

## Handoff

Accepted 2026-11-18. Extracted the form shell, protected fields, text controls,
SmartCaptcha slot, and consent block into colocated Astro components. Preserved
the input names, IDs, field limits, autocomplete, error relationships, disabled
SSR state, unavailable delivery feedback, no-JS fallback, and retry behavior.
The phone field retains its full-row desktop layout.

Verification: 8 component tests passed; inquiry and homepage integration suites
passed 22/22; inquiry E2E passed 19/19; no-JavaScript E2E passed 7/7. Astro
check completed with 0 errors and 0 warnings (one existing Zod deprecation
hint); style, formatting, content boundaries, and component colocation passed.

Ожидает реализации.
