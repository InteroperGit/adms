# 213 - Mobile bottom navigation

- **Executor:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `medium`.

Статус — `fixed`. Архивирована 2026-11-20 по запросу пользователя.

## Scope

- Match the fixed mobile bottom navigation from `http://localhost:4330/` while using this site's existing theme and component conventions.
- Add four labeled icon links: «Услуги», «Проекты», «Отзывы», «Контакты», targeting the matching homepage sections.
- Show the bar only below the existing 48rem tablet breakpoint and keep the page content and floating actions reachable above it.
- Support both themes, safe-area insets, keyboard focus and reduced-motion preferences.
- Keep the cookie banner choices theme-aware and clear of the fixed navigation.
- Preserve the current unrelated working changes and commit this task separately.

## Execution

- Skills applied: `ponytail`, `astro-best-practices`, `playwright`.
- Participants: primary agent handled implementation, browser checks and review; no delegation.
- [x] Inspect the reference navigation, current route IDs, layout and overlapping fixed controls.
- [x] Add `MobileBottomNav.astro` and integrate it into `Layout.astro`.
- [x] Reserve mobile page space and position the existing chat action and cookie panel clear of the navigation.
- [ ] Add colocated component coverage; not added or run under the session instruction not to add or run tests unless requested.
- [x] Check formatting, project style and responsive browser behavior.
- [ ] Pass `pnpm check`; Astro diagnostics currently fail in `@emnapi` with `this.bridge.setLastError is not a function` under Node 26.13.0.

## Acceptance

- [x] At 390px, four equal navigation items show their label and corresponding icon in a fixed bottom bar.
- [x] Links target the intended sections; the bar is absent at 768px and 1440px.
- [x] Safe-area padding, keyboard focus, both themes and reduced motion are supported by the component styles.
- [x] Main content, cookie choices and chat are not obstructed at mobile widths; no horizontal overflow is introduced.
- [x] Cookie button colors adapt to both themes with at least 4.9:1 contrast.
- [ ] Required focused checks pass and unrelated working changes remain intact.

## Handoff

Reference inspected at 390×844. It shows a full-width fixed navigation row with
four icon-and-label links. The local sections already use IDs `services`,
`projects`, `reviews` and `contacts`; existing `NavLinks.astro` provides
matching icon conventions. Browser checks at 390px, 768px and 1440px confirmed
the expected bar visibility, four destinations and no horizontal overflow.
Cookie button contrast measured 8.21:1/5.62:1 in light theme and 5.44:1/6.21:1
in dark theme. `pnpm check:style`, focused Prettier check and `git diff --check`
passed. `pnpm check` remains unresolved because Astro diagnostics fail inside
`@emnapi` (`this.bridge.setLastError is not a function`) with Node 26.13.0.
Component tests were not added or run under the session instruction; task
remains in todo.
