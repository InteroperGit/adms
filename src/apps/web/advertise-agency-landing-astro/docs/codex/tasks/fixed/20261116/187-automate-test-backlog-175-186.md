# 187 - Orchestrate test backlog 175-186

**Status:** fixed

**Priority:** high

**Created:** 2026-11-16

**Scope:** tasks 175-186 and their implementation, test, review and commit
handoffs

## Goal

Define a repeatable sequential run for tasks 175-186. The primary agent is an
orchestrator only. Each numbered task is completed before the next task starts,
and a failed stage is repaired and rerun until the task has no known errors and
all of its acceptance criteria are satisfied.

## Scope

- Process tasks in this exact order: 175, 176, 177, 178, 179, 180, 181, 182,
  183, 184, 185, 186.
- For every numbered task, start separate Luna high subagents for
  implementation, focused testing, review and commit.
- Keep the primary agent limited to orchestration, state checks, handoffs,
  acceptance decisions and sequencing.
- After implementation, run the test subagent; after tests pass, run the review
  subagent; after review is clean, run the commit subagent.
- If implementation, testing or review reports an error, start a new
  implementation subagent with the evidence and repeat the cycle for the same
  numbered task.
- The commit subagent commits only the verified changes for its numbered task,
  using the repository commit format. Do not combine numbered tasks in one
  commit.
- Move each task to `todo` when its execution starts and to
  `fixed/YYYYMMDD/` only after its commit and acceptance evidence are complete.
- Preserve existing user changes and keep generated evidence under ignored
  `output/<task>/` paths.

## Execution

- Skills: `grilling`, `ponytail`; apply `astro-best-practices` when an Astro
  component is changed and `playwright` only when browser diagnosis is needed.
- Primary agent: orchestrator only; no implementation, test, review or commit
  edits by the primary agent.
- Worker model: Luna (`gpt-6-luna`), high reasoning effort, one worker per
  stage. Workers must report changed files, commands, results and risks.
- Delegation: sequential per numbered task. Do not run workers that share the
  active task's files concurrently.

### Checklist

Update checkboxes as each stage completes using the
[task checklist rules](../../../rules/workflow.md#task-checklists).
Mark a stage only after its worker report and evidence are checked. Reopen
invalidated stages after a repair; repeat implement, test and review until
clean. Record worker IDs, model/effort, results and commit hashes in the
numbered task's handoff. Do not mark a task complete while errors remain.

- [x] Read applicable rules, tasks 175-186 and the current worktree status;
  preserve existing user changes and record the initial handoff.
- [x] Move task 187 from `backlog` to `todo` before starting the series and
  update its status, links and `.codex/TASKS.md`.
- [x] Run the per-task checklist below in numeric order with separate Luna
  high implementation, test, review and commit workers for each task.
- [x] For every failed cycle, record findings, assign repairs and repeat
  implement, test and review; record why no repair was needed for clean runs.
- [x] After task 186, delegate applicable final verification to a separate
  Luna high test worker and record commands/results and pre-existing failures.
- [x] Record the separate Luna high repair verification and review reports;
  resolve any remaining findings before closing the series.
- [x] Reconcile all task checklists, evidence, commits and links; move task
  187 to `fixed/YYYYMMDD/` and update its status and `.codex/TASKS.md`.

### Per-task progress

For each task, complete every stage before beginning the next task. Moves
follow `backlog -> todo -> fixed/YYYYMMDD/` automatically. Use the completion
date in Europe/Moscow. The commit worker handles task-scoped changes;
record archival evidence and update references after the commit is verified.

#### Task 175

- [x] Move 175 to `todo` before implementation; update status and references.
- [x] Implement: separate Luna high worker completes the task's scope.
- [x] Test: separate Luna high worker confirms required checks pass.
- [x] Review: separate Luna high worker confirms acceptance and no findings.
- [x] Commit: separate Luna high worker creates one task-scoped commit;
  verify and record its hash.
- [x] Reconcile 175's checklists and evidence; move it to `fixed/YYYYMMDD/`,
  update status, links and `.codex/TASKS.md` before starting the next task.

#### Task 176

- [x] Move 176 to `todo` before implementation; update status and references.
- [x] Implement: separate Luna high worker completes the task's scope.
- [x] Test: separate Luna high worker confirms required checks pass.
- [x] Review: separate Luna high worker confirms acceptance and no findings.
- [x] Commit: separate Luna high worker creates one task-scoped commit;
  verify and record its hash.
- [x] Reconcile 176's checklists and evidence; move it to `fixed/YYYYMMDD/`,
  update status, links and `.codex/TASKS.md` before starting the next task.

#### Task 177

- [x] Move 177 to `todo` before implementation; update status and references.
- [x] Implement: separate Luna high worker completes the task's scope.
- [x] Test: separate Luna high worker confirms required checks pass.
- [x] Review: separate Luna high worker confirms acceptance and no findings.
- [x] Commit: separate Luna high worker creates one task-scoped commit;
  verify and record its hash.
- [x] Reconcile 177's checklists and evidence; move it to `fixed/YYYYMMDD/`,
  update status, links and `.codex/TASKS.md` before starting the next task.

#### Task 178

- [x] Move 178 to `todo` before implementation; update status and references.
- [x] Implement: separate Luna high worker completes the task's scope.
- [x] Test: separate Luna high worker confirms required checks pass.
- [x] Review: separate Luna high worker confirms acceptance and no findings.
- [x] Commit: separate Luna high worker creates one task-scoped commit;
  verify and record its hash.
- [x] Reconcile 178's checklists and evidence; move it to `fixed/YYYYMMDD/`,
  update status, links and `.codex/TASKS.md` before starting the next task.

#### Task 179

- [x] Move 179 to `todo` before implementation; update status and references.
- [x] Implement: separate Luna high worker completes the task's scope.
- [x] Test: separate Luna high worker confirms required checks pass.
- [x] Review: separate Luna high worker confirms acceptance and no findings.
- [x] Commit: separate Luna high worker creates one task-scoped commit;
  verify and record its hash.
- [x] Reconcile 179's checklists and evidence; move it to `fixed/YYYYMMDD/`,
  update status, links and `.codex/TASKS.md` before starting the next task.

#### Task 180

- [x] Move 180 to `todo` before implementation; update status and references.
- [x] Implement: separate Luna high worker completes the task's scope.
- [x] Test: separate Luna high worker confirms required checks pass.
- [x] Review: separate Luna high worker confirms acceptance and no findings.
- [x] Commit: separate Luna high worker creates one task-scoped commit;
  verify and record its hash.
- [x] Reconcile 180's checklists and evidence; move it to `fixed/YYYYMMDD/`,
  update status, links and `.codex/TASKS.md` before starting the next task.

#### Task 181

- [x] Move 181 to `todo` before implementation; update status and references.
- [x] Implement: separate Luna high worker completes the task's scope.
- [x] Test: separate Luna high worker confirms required checks pass.
- [x] Review: separate Luna high worker confirms acceptance and no findings.
- [x] Commit: separate Luna high worker creates one task-scoped commit;
  verify and record its hash.
- [x] Reconcile 181's checklists and evidence; move it to `fixed/YYYYMMDD/`,
  update status, links and `.codex/TASKS.md` before starting the next task.

#### Task 182

- [x] Move 182 to `todo` before implementation; update status and references.
- [x] Implement: separate Luna high worker completes the task's scope.
- [x] Test: separate Luna high worker confirms required checks pass.
- [x] Review: separate Luna high worker confirms acceptance and no findings.
- [x] Commit: separate Luna high worker creates one task-scoped commit;
  verify and record its hash.
- [x] Reconcile 182's checklists and evidence; move it to `fixed/YYYYMMDD/`,
  update status, links and `.codex/TASKS.md` before starting the next task.

#### Task 183

- [x] Move 183 to `todo` before implementation; update status and references.
- [x] Implement: separate Luna high worker completes the task's scope.
- [x] Test: separate Luna high worker confirms required checks pass.
- [x] Review: separate Luna high worker confirms acceptance and no findings.
- [x] Commit: separate Luna high worker creates one task-scoped commit;
  verify and record its hash.
- [x] Reconcile 183's checklists and evidence; move it to `fixed/YYYYMMDD/`,
  update status, links and `.codex/TASKS.md` before starting the next task.

#### Task 184

- [x] Move 184 to `todo` before implementation; update status and references.
- [x] Implement: separate Luna high worker completes the task's scope.
- [x] Test: separate Luna high worker confirms required checks pass.
- [x] Review: separate Luna high worker confirms acceptance and no findings.
- [x] Commit: separate Luna high worker creates one task-scoped commit;
  verify and record its hash.
- [x] Reconcile 184's checklists and evidence; move it to `fixed/YYYYMMDD/`,
  update status, links and `.codex/TASKS.md` before starting the next task.

#### Task 185

- [x] Move 185 to `todo` before implementation; update status and references.
- [x] Implement: separate Luna high worker completes the task's scope.
- [x] Test: separate Luna high worker confirms required checks pass.
- [x] Review: separate Luna high worker confirms acceptance and no findings.
- [x] Commit: separate Luna high worker creates one task-scoped commit;
  verify and record its hash.
- [x] Reconcile 185's checklists and evidence; move it to `fixed/YYYYMMDD/`,
  update status, links and `.codex/TASKS.md` before starting the next task.

#### Task 186

- [x] Move 186 to `todo` before implementation; update status and references.
- [x] Implement: separate Luna high worker completes the task's scope.
- [x] Test: separate Luna high worker confirms required checks pass.
- [x] Review: separate Luna high worker confirms acceptance and no findings.
- [x] Commit: separate Luna high worker creates one task-scoped commit;
  verify and record its hash.
- [x] Reconcile 186's checklists and evidence; move it to `fixed/YYYYMMDD/`,
  update status, links and `.codex/TASKS.md` before starting the next task.

## Acceptance

- [x] All twelve tasks, 175 through 186, have resolved execution and acceptance
  checklists, with task-scoped evidence supporting every completed stage.
- [x] Every numbered task has separate implementation, test, review and commit
  worker records using Luna high.
- [x] Failed stages have concrete repairs and clean reruns; no known error or
  unresolved review finding remains.
- [x] Each numbered task has its own verified commit and recorded hash.
- [x] All twelve tasks are in `fixed` under their completion dates, with
  matching statuses and working relative links.
- [x] Applicable final verification passes and its evidence is recorded.
- [x] The primary agent performed orchestration only; implementation, testing,
  review and commits were performed by the designated workers.
- [x] Task 187 is archived and `.codex/TASKS.md` reflects the completed series.

## Dependencies

Tasks 175-186 already exist in `docs/codex/tasks/backlog/`. Respect their
individual dependencies and run them in numeric order. This orchestration task
does not change runtime behavior and must not be executed as part of its own
worker cycle.

## Handoff

- Tasks 175 and 176 completed with separate Luna high implementation, test,
  review and commit workers; details and worker IDs are in their fixed task
  records.
- Task 175 commits: `a219531114b9d30740cf415d94dc5e39c3af970b` for tests and
  `437fa9b5b5d8e4f098ca2150619c7b4265cc5600` for the fixed task record.
- Task 176 commits: `478cabec` for tests and
  `41b190ba` for the fixed task record.
- Task 177 commits: `187a33bd` for tests and
  `73ba5781` for the fixed task record.
- Task 178 commits: `cf5ee52bd194b4ad19874b7fa3f0a216718e5010` for tests and
  `aaf95f5d` for the fixed task record.
- Task 179 commits: `09065577bc9d4384e73fcb347b51f49c3438e458` for tests and
  `b417ebe3` for the fixed task record.
- Task 180 commits: `1eb42924` for tests and `3e74ce54` for the fixed record.
- Task 181 commits: `a374dfc4` for tests and `57e77e65` for the fixed record.
- Task 182 commit: `96bb566efc1fcf61d806d3dcf39fe72cfb2e0696` includes tests
  and the final fixed task record.
- Task 183 commit: `d93ef112` includes all four suites and final fixed record.
- Task 184 commit: `1c3e5433` includes three suites and final fixed record.
- Task 185 commit: `4e3b8501` includes the Button cases, type fixture, and
  final fixed record.
- Task 186 commit: `cf892295` includes both logo suites and the final fixed
  record.
- Formatting follow-up commits: task 177 `dabb146e`, 178 `6193a41e`, 179
  `ed56a82d`, 181 `395e9761`, 182 `2d0dcc2f`, 183 `4911372d`, and 184
  `9b3f5c1f`.
- Task 184 repair follow-up: `90c80667` renames both page test files with the
  Astro route-exclusion prefix and updates the fixed task record.
- Task 175-181 have task-scoped test commits and separate fixed-record commits;
  hashes are recorded above and in each numbered task handoff.

## Handoff

- Initial state: tasks 175-186 were present in backlog; tasks 175-186 and
  `.codex/TASKS.md` had pre-existing user edits. No implementation changes
  had started.
- Read: workflow, code style, testing, verification and all twelve task
  descriptions.
- Final verification first pass: lint, boundaries, content, `pnpm check`,
  type contracts, component colocation, unit tests (136 files/867 tests),
  coverage (136 files/867 tests; line 95.2%, branch 93.1%, statements 95.12%,
  functions 91.62%) and coverage thresholds passed.
- First final build exposed task 184 page tests being treated as routes.
  Renamed them to underscore-prefixed names; independent route tests, build
  (39 pages, no `.test` routes) and quality verification passed. Repair commit:
  `90c80667`.
- Initial full E2E after route repair: 304 passed and 2 WebKit failures. The
  video failure was caused by WebKit reporting no usable MP4 source and never
  requesting the mocked URL. The contact-focus case passed in isolation but
  timed out under the four-worker run.
- Prettier repair first formatted the 12 task-suite files. The global check also
  found five baseline files; formatting-only diffs were applied to
  `data/templates/README.md`, `docs/codex/rules/code-style.md`,
  `docs/codex/rules/testing.md`, and `src/components/ui/Link.test.ts`.
  `src/components/sections/Introduction.astro` was already formatted in `HEAD`
  and required no committed diff.
- The media E2E now verifies a mocked 404 in Chromium and Firefox, and verifies
  the unavailable-source fallback in WebKit. Contact focus and both carousel
  cases passed with one worker. The local Playwright default now uses two
  workers, matching CI, to avoid WebKit timeouts under four-worker load.
- A full run with four workers then passed 302/306; its four WebKit failures
  were the transient outgoing-slide assertion, carousel style timeout, desktop
  contacts timeout, and two-page theme synchronization timeout. All four
  focused scenarios passed with one worker, and the complete matrix passed
  306/306 after the default was aligned with CI at two workers.
- The first coverage run timed out in the service aggregate suite after 5
  seconds under V8 instrumentation; the following test observed stale module
  state. Its assertions are unchanged; a 15-second timeout for that slow case
  let the full coverage run pass.
- Final gates passed: `format:check`, `lint`, `verify:boundaries`,
  `verify:content`, `check`, `test:types`, `verify:component-tests`, `test`
  (136 files/867 tests), `test:coverage` (136/867; lines 95.2%, branches
  93.1%, statements 95.12%, functions 91.62%), `verify:coverage`, `build`
  (39 pages), and `verify:quality` (39 routes). Final `test:e2e` passed all
  306 tests across Chromium, Firefox and WebKit with two workers.
- Focused repair verification passed: media E2E across all browsers (9/9),
  the affected WebKit contacts/carousel/theme scenarios (4/4 with one worker),
  and the service aggregate coverage suite (4/4). Independent Luna high review
  found no issues in the repair diff.
- Repair verification worker: `/root/task187_repair_verification` (Luna high),
  no edits; the three focused commands passed.
- Repair review worker: `/root/task187_repair_review` (Luna high), no findings.
- Non-fatal environment notices remain: Vitest reports an invalid
  `--localstorage-file` path; `pnpm check` reports one deprecated Zod API hint;
  `pnpm build` reports an existing chunk larger than 500 kB.
- Independent post-format retest passed the 12 affected suites (12 files,
  43 tests), the full `pnpm test` suite (136 files, 867 tests), and
  `pnpm check:style` for 12 files. The six shortened imports still resolve
  through Vitest alias `@/data/content/config` to the versioned fixture tree.
- Vitest emitted non-fatal warnings for an invalid `--localstorage-file`
  path during test runs.
