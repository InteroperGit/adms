# Verification

Use focused checks while editing; run the required final gates once for the
completed change. Reuse earlier application evidence when later edits affect
only documentation. Any nonzero exit fails its gate: do not weaken assertions,
types, coverage, accessibility or content boundaries to obtain a pass.

## Final gates

Run from the application root, in order:

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

[Test rules](testing.md) define placement, isolation and evidence limits. For
content/compiler changes also run the affected `test:content-catalog`,
`test:content-blocks` and `test:publication-policy` scripts. Build before checks
that consume built output. Do not change runtime content to make tests pass.

For documentation-only changes check formatting, local links/anchors, stale
paths and the final diff. Do not add application tests for prose changes. Keep
existing unrelated failures separate; report them without silently fixing
unrelated files or claiming the whole gate passed.

## Tools and review

Prettier owns formatting (`pnpm format` writes, `format:check` checks); ESLint
owns correctness (`lint:fix` applies safe fixes). `pnpm check` uses installed
Astro diagnostics and the hard changed-source column check. No interactive
dependency installation should be needed. Upgrade tooling together with its
Node/TypeScript compatibility and CI configuration; package engine requirements
remain authoritative even if a CI runner uses an older version.

Before handing off, inspect the complete diff and changed-file list. Check
callers, types, configuration, links, generated output and fixture boundaries as
affected. Remove temporary debugging code and unused changes. Report what
changed, verification commands/results and material unresolved limitations. A
failing full suite remains failing despite a focused pass. Release checks and
rollback requirements are in [release](release.md).
