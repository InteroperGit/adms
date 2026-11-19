# 234 - Remove validation and bundle warnings

- **Executor:** Sol (`gpt-6.1-sol`), reasoning: `medium`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `medium`.

**Status** - complete

**Created** - 2026-11-19

## Scope

- Remove the Astro deprecation hint for `z.number().finite()` in
  `src/validation/contentBlocks.ts` while preserving rejection of non-finite
  chart values; cover the behavior in `src/validation/contentBlocks.test.ts`.
- Remove the production build warning for the emitted JavaScript chunk above
  500 kB. The current `dist/_astro/chartRuntime...js` is 553,154 bytes; inspect
  the actual build output and preserve the existing warning threshold. Find and
  fix the source of the oversized chunk by reducing its payload or splitting
  its code into smaller chunks.
- Preserve chart types, lazy enhancement, graceful runtime failure, and the
  server-rendered bars and accessible data table when JavaScript is unavailable.
- Do not suppress the warning, raise its size limit, or add a dependency.
- Cleaning `dist` and rebuilding may be used to inspect fresh output, but does
  not count as a fix unless the emitted chunk composition or size is improved.

## Execution

- [x] Read workflow, code style, verification, testing and applicable Astro
      guidance; inspect current validation, chart runtime, callers, tests and
      production output before changing code.
- [x] Use `ponytail`; consult installed-version Zod and Astro/Vite documentation
      through Context7 for version-sensitive API or chunking decisions.
- [x] Replace the deprecated validator API and add focused coverage for finite
      and non-finite values.
- [x] Reduce or split the actual oversized production chunk without increasing
      or suppressing the configured warning threshold; update focused chart
      runtime/component tests as needed. Cleaning generated output is only a
      verification step, not a substitute for correcting the bundle source.
- [x] Run focused validation and chart tests, `pnpm check`, and `pnpm build`;
      verify both warnings are absent and the built artifact remains within the
      existing limit. Run targeted chart E2E coverage if an applicable scenario
      exists.
- [x] Review the diff against acceptance, record commands, results and risks
      here, then leave the accepted task in `todo` unless archival is requested.

## Acceptance

- [x] Astro check no longer reports the deprecated `.finite()` call, and
      validation tests prove non-finite chart values remain rejected.
- [x] Production build has no JavaScript chunk warning above 500 kB; the
      configured threshold is unchanged and the warning is not suppressed. A
      fresh build must show that the oversized chunk was actually reduced or
      split; deleting stale build output alone does not satisfy this criterion.
- [x] Chart runtime behavior and the no-JavaScript server-rendered fallback
      remain intact, with focused chart checks passing.
- [x] Review and handoff record the actual build artifact sizes and verification
      results; task remains in `todo` until explicitly archived.

## Handoff

- Removed `.finite()`; Zod 4.6.7 `z.number()` already rejects `NaN` and both
  infinities. Added focused chart boundary cases for all three values.
- `renderChart` now asynchronously imports only the selected ECharts chart
  module. The component awaits initialization inside its existing fallback
  handler, preserving lazy enhancement and graceful failure.
- Fresh `pnpm build` completed without the chunk warning. Largest emitted
  JavaScript files: `SeriesDataSchema` 327,680 bytes, `chartRuntime` 125,235
  bytes, `line` 27,126 bytes, `bar` 21,784 bytes and `pie` 16,011 bytes. The
  Vite 500 kB warning threshold remains unchanged.
- `pnpm check` passed with zero Astro errors, warnings or hints. Focused Vitest
  passed 55 tests across validation, chart runtime and chart component suites.
  Targeted Chromium E2E passed 10/10 across chart runtime, failure fallback and
  no-JavaScript scenarios. Scoped Prettier check passed.
- Full verification and the cross-browser E2E matrix were not run. No known
  remaining implementation risks.
- Archived at the user's request on 2026-11-19.
