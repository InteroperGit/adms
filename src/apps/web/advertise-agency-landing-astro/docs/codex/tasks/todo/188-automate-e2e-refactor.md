# 188 - Automatically execute the E2E refactor series

**Status:** todo

**Created:** 2026-11-16

## Goal

Execute tasks 189-194 sequentially to verified acceptance.

## Scope

Optimize, refactor and restructure tests/e2e and affected imports/docs.
Preserve every behavior contract, browser/route/theme/viewport combination,
external network blocking, isolated preview on port 4327,
reuseExistingServer: false and two workers. No reduced assertions,
production changes, runtime content edits, real delivery, deployment,
new dependencies or automatic commits.

## Execution

Read rules and child tasks. Skills: ponytail; playwright for diagnosis.
Primary owns sequencing, integration, review, acceptance and archival.
No delegation by default. Luna medium for inventory, moves, focused checks
and docs; Sol medium for shared fixture contracts and systemic failures.
Record actual models/effort; escalate on concrete evidence only.

- [x] Read rules and record worktree state; preserve unrelated changes.
- [x] Move 188 from backlog to todo and update status, links and TASKS.md.
- [x] Execute [189](../fixed/20261116/189-e2e-baseline-and-contract-map.md)
  and accept its evidence.
- [x] Execute [190](../fixed/20261116/190-e2e-domain-directory-structure.md)
  and accept its evidence.
- [ ] Execute [191](../backlog/191-e2e-navigation-suite-split.md) and accept
  its evidence.
- [ ] Execute [192](../backlog/192-e2e-inquiry-shared-setup.md) and accept
  its evidence.
- [ ] Execute [193](../backlog/193-e2e-measured-runtime-optimization.md) and
  accept its evidence.
- [ ] Execute [194](../backlog/194-e2e-regression-and-handoff.md) and accept
  its evidence.
- [ ] Before each child starts, move backlog -> todo and update references.
- [ ] Implement, run focused checks, review, repair and rerun the same task
  until execution and acceptance criteria are resolved; only then advance.
- [ ] For external blockers, leave the task in todo with evidence, cause and
  next action; stop dependent work without endless retries or false closure.
- [ ] After accepting each child, automatically move it to fixed/yyyyMMdd
  using Europe/Moscow completion date; update status, links and TASKS.md.
- [ ] After 194, reconcile both checklists for all tasks and archive 188
  only when every required outcome has passing evidence.

Checks specified in children are part of this series. Run the full gates
from verification.md only on explicit user request after implementation.
Do not claim full verification from focused checks. Update relative links
in both directions on every move; command execution alone is not a pass.

## Acceptance

- [ ] Tasks 189-194 have resolved execution/acceptance lists and are archived.
- [ ] Baseline and final maps account for all original browser contracts.
- [ ] Checks in 194 pass with no hidden skips or unresolved failures.
- [ ] Comparable measurements and evidence limits are recorded.
- [ ] TASKS.md and task links reflect actual state; 188 is archived last.

## Handoff

Execution started on 2026-11-16. Initial state: branch
`adv-agency-landing-astro`; existing user changes are the newly authored tasks
188-194 and `docs/codex/rules/workflow.md`. Node v25.7.0, pnpm 10.7.0,
Playwright 1.64.1; Chromium, Firefox and WebKit are installed. Git status was
read with a per-command safe.directory override because repository ownership
differs in the sandbox. No files outside the task series were modified.

> Execute task 188 and its complete series 189-194 automatically.
