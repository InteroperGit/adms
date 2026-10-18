# 100 — Carousel и homepage reveal scripts

Дата: 2026-10-16. Статус: planned.

## Задача

Покрыть `src/components/ui/image-carousel.ts` и
`src/scripts/homepage-reveal.ts`.

## Сценарии

Carousel state, arrows/dots, `aria-hidden`, `aria-current`, autoplay,
hover/focus/visibility pause, reduced motion, missing observers и pagehide
cleanup. Для reveal — section selection, observer fallback, visibility и
cleanup.

## Готово, когда

Каждый timer/observer cleanup проверен, no-op fallback покрыт, flaky real-time
ожидания заменены fake timers.

Зависимость: 091.

## Completion � 2026-10-17

Added deterministic carousel lifecycle coverage for arrows, dots, autoplay, hover/visibility pauses, reduced motion, unsupported observers, and disconnect cleanup. Added homepage reveal coverage for observer fallback, pending-section reveal, reduced motion, pagehide teardown, and fixed the missing-observer guard plus visibility cleanup hooks.

Validation: focused Vitest suites passed with 8 tests; Prettier, ESLint, and Astro check passed with no errors. Astro check retains one existing deprecation hint in validation content blocks.
