# 098 — Image и chart utilities

Дата: 2026-10-16. Статус: completed.

## Задача

Покрыть `src/components/content/resolve-image.ts` и
`src/scripts/chart-runtime.ts`.

## Сценарии

Local asset metadata, public/remote image URLs, width cap, focal metadata,
missing bundled asset, valid ECharts runtime, malformed chart data, unavailable
runtime, resize и cleanup.

## Готово, когда

Astro virtual modules замоканы минимально, assertions проверяют observable
output, а browser runtime tests не требуют настоящего network/media.

Зависимость: 091.

## Implementation — 2026-10-16

Implemented without subagents. Expanded the colocated image resolver suite to
cover real bundled metadata, public/remote identity, missing assets,
requested/source width limits, the 1440px cap, focal/crop metadata, input
immutability and optimization failure propagation. Only Astro getImage and one
oversized asset's metadata are mocked; normal asset discovery uses Vite.

Added a colocated chart runtime suite with synthetic versioned chart data.
Mocked ECharts modules and browser observers verify supported registration,
bar/line label alignment, zero/missing points, pie mapping, empty series,
legend/grid branches, reduced motion, detached/already-initialized skips, resize
breakpoints, persisted pagehide and final cleanup. Malformed data and
unavailable canvas errors propagate to the existing caller fallback without
network calls. Production code and runtime content were not changed.

Added chart-runtime.ts to the regular coverage include.

## Focused verification

- Two suites: 22 tests pass (20 additional tests).
- Chart runtime: 100% statements, branches, functions and lines.
- Image resolver: 100% lines/functions, 91.66% statements, 87.5% branches. The
  remaining branch is the redundant missing-original guard after the lookup
  function has already thrown for a missing bundled asset.
- Full regression suite: 100 files and 604 tests pass.
- Component colocation, content invariants and content boundaries pass.
- Production build: 39 pages; existing large-chunk warning remains.
- Changed-file 80-column check and diff whitespace check pass.
- Astro type checking passes; existing Zod finite() hint remains.

[Corresponding plan](../../plan/20261016_031828_unit-test-suite-plan.md).
