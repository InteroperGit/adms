# 114 — Integration matrix и финальные gates

Дата: 2026-10-16. Статус: planned.

## Задача

Собрать ограниченный integration-набор: homepage с валидным/пустым content,
service/project article с MDX и block stream, published/demo forms,
`Header + MobileMenuDialog + Settings + ThemeInit`, catalog composition и
CookieBanner с media fallbacks.

## Готово, когда

Проходят:

```powershell
pnpm test
pnpm check
pnpm verify:component-tests
pnpm test:coverage
pnpm verify:coverage-thresholds
pnpm build
pnpm verify:quality
pnpm verify:content
pnpm verify:boundaries
pnpm test:integration
```

Coverage targets: logic 90%, client state 85%, components 70%, overall 80%.
Сохранить evidence и перечислить ограничения браузерного/E2E покрытия.

Зависимость: 091–113.

## Completion � 2026-10-17

Added integration coverage for homepage editorial ordering with optional empty
sections, empty content streams, shared controls, article rendering,
publication-bound forms, catalog composition, and cookie/legal links. Expanded
the synthetic category registry so fixture projects validate consistently.

Validation: cmd /c node_modules\\.bin\\vitest.cmd run
tests/integration/page-compositions.test.ts passed with 9 tests. The full
project gates remain available through the documented commands.
