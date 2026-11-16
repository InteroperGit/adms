# Workflow

Run commands from this application's root. Use Node >=22.22.0 (`package.json`),
pnpm 10.7.0 and `pnpm install --frozen-lockfile`. TypeScript/tool compatibility
and final gates belong to [verification](verification.md).

## Change lifecycle

Read the applicable instructions and affected code before editing. Identify the
observable outcome, constraints, callers and acceptance checks; find repository
facts yourself. Ask only for missing decisions that cannot be inferred. Respect
explicit exclusions such as task files, deployment or external messages.

During task execution, post a brief commentary update before each action or
tightly related batch of actions, naming what you are doing. After each batch,
report material findings, changes and the next step. Do not leave work
unexplained in the development log.

Prefer the smallest complete change using existing conventions and installed
capabilities. Do not add abstractions, dependencies or configuration without a
current need. Before making changes beyond the task's requirements, describe
them and wait for the user's confirmation. Update all affected callers, tests,
types and documentation; keep unrelated user changes intact. Treat runtime data,
secrets and irreversible operations as explicit boundaries. Finish with
[verification](verification.md); use [release](release.md) only when publishing
or changing deployment behavior.

Run only focused checks directly related to the change while implementing. Run
the full verification gates in `verification.md` only when the user explicitly
asks to run the tests or full verification after implementation.

When exact or version-sensitive information about a library or framework is
needed, use the configured Context7 MCP tools. Resolve the library with
`resolve-library-id`, then query its official documentation with `query-docs`;
prefer the version installed in this repository and record any material API or
compatibility decision in the task handoff. Use repository source and tests for
local behavior; do not use Context7 as a substitute for inspecting this code.

## Working context and models

Read the task and applicable rules; search before loading files. Reuse evidence
until a change invalidates it. Keep handoffs to decisions, changed files,
commands/results and risks. Use the least expensive reliable model per step:

- Luna (`gpt-6-luna`): low for searches, mechanical docs/formatting; medium for
  scoped edits, pure modules, focused checks, browser diagnosis and clear-diff
  review. Extra high is for defined many-file or external-state reconciliation.
- Sol (`gpt-6.1-sol`): medium for cross-file contracts, coordinated refactors,
  architecture/security judgment or failures spanning systems; extra high for
  large defined implementations with interacting behavior.
- Astra (`gpt-6-astra`): only unresolved architecture, difficult multi-system
  debugging or high-risk review after concrete Luna/Sol evidence. Supply the
  distilled problem, attempts, constraints and results; never use as a default
  reviewer or parallel worker.

Start Luna medium for clear local work; use Sol first for architectural
ambiguity. Escalate on a concrete failure/conflicting evidence, not uncertainty
alone; return to Luna once design is settled. Do not duplicate a passing review
or use a larger model for explicit checks. Record actual escalations in the
task: failed step, evidence, chosen model/effort, decision and verification. Do
not present speculative model comparisons/token estimates as facts.

The primary agent owns scope, shared state, integration and acceptance. Delegate
independent bounded work only when it saves time/context; prefer one focused
worker and keep inseparable shared mutations with the primary. Each prompt names
files, objective, constraints, output, smallest useful check and report
(changes, results, risks). Use Luna by default, Sol for cross-file judgment;
never assign two workers the same files. Integrate sequentially before final
gates. Budget never permits reducing tests, a11y, formatting, boundaries,
content validation or build checks. These defaults follow official
[model selection](https://developers.openai.com/api/docs/guides/model-selection)
and [Luna guidance](https://developers.openai.com/api/docs/models/gpt-6-luna).

## Tasks and handoff

After completing and accepting each task, create a separate local Git commit
before starting the next task, including during automatic task series. Include
only that task's changes and its updated task records; preserve unrelated user
changes. Follow the commit format in [code style](code-style.md#commits). Commit
only after required checks and review pass. An explicit user instruction to skip
commits overrides this default; never push without authorization.

Inspect `.codex/`, `harness/` and `docs/codex/tasks/` before creating work;
avoid duplicates. Keep agent files in the project or `~/dev/`, never Documents,
Desktop, OneDrive or another synchronized folder.

- `.codex/{agents,skills,prompts}/`: custom agent TOML basename matches its
  name.
- `docs/codex/tasks/{plan,todo,backlog,learn}/`: plans, active tasks, queued
  tasks and lessons. Create every task in `backlog`; move it to `todo` when
  execution begins. Number task names with leading zeros in execution order
  (`001-feature.md`); structured Plan-Todo-Learn records use
  `YYYYMMDD_HHMMSS_<type>.md` (e.g. `20231027_100000_plan.md`).
- During automatic task execution, move each task from `backlog` to `todo`
  before implementation starts. After all execution and acceptance checklist
  items are resolved, required checks pass and review findings are addressed,
  automatically move it to `docs/codex/tasks/fixed/yyyyMMdd/`. No separate
  confirmation is required for these transitions. Keep unfinished or blocked
  tasks in `todo` with their remaining work recorded.
- Outside automatic execution, move tasks to `fixed` only when the user
  explicitly requests it. On every move, preserve the numbered filename, update
  the task status, relative links, plan references and `.codex/TASKS.md`. Use
  the completion date in Europe/Moscow for the `fixed` directory.
- Optional phases: `harness/build/phase-01-name.md`; context:
  `harness/context/`.
- Auxiliary names: descriptive lowercase hyphenated slugs, `.md` for Markdown;
  no spaces, Cyrillic or special characters. Reserved root instruction/roadmap
  files: `AGENTS.md`, `GOALS.md`, `PLANS.md`, `PROMPTS.md`; do not create root
  task files. Use `docs/codex/tasks/` if uncertain. Restructuring needs user
  authorization; infer facts yourself and ask only non-inferable decisions.

Use `grilling` before task authoring to settle goal, scope, constraints,
dependencies and acceptance, and `ponytail` for the smallest complete outcome.
Use a standalone `## Scope` section followed immediately by a standalone
`## Execution` section. Scope defines the work boundary and constraints.
Execution records applicable skills, primary and worker participants,
model/effort per distinct step or explicitly no delegation, and an actionable
checklist for instructions, implementation, focused checks, acceptance and
handoff/archive. Keep execution details out of Scope and do not merge the two
sections. Do not add inapplicable checks or weaken gates. Follow
[testing](testing.md) for required colocated unit tests. Run full verification
only when the user explicitly requests it after implementation.

### Task checklists

Every task must contain Markdown checkboxes (`- [ ]`) for execution steps and
observable acceptance criteria. Include implementation, applicable checks,
review and handoff so the lists make completion verifiable. Keep distinct
outcomes in separate items; name the affected files, behavior or check.

Update the task file as work progresses: mark an item `- [x]` only after its
work is complete and verified. Record supporting files, commands and results in
the task handoff; for delegated work include the worker and stage. Running a
command alone does not complete a passing-check item. Reopen checked items when
later changes invalidate their evidence or a check fails again.

Leave failed, blocked and unperformed items unchecked and record the reason and
next action. For conditional items, record why they do not apply before marking
them resolved. Never silently delete or weaken a criterion to close a task. A
task is complete only when every execution and acceptance item is resolved,
required checks pass and review findings are addressed. Reconcile both lists
before reporting completion or moving the task to `fixed`.

After verified acceptance record changes/results and update relative links and
plan status. Explicitly deferred tasks keep filename, evidence and outstanding
inputs when moved to backlog; update references on every move. User instructions
can exclude task edits for a session.

`.codex/TASKS.md` is current state, not a journal: active links with short
status/next action, blockers, resume constraints/decisions, optionally a useful
recent-completion summary, and links to todo/backlog/fixed and these rules.
Detailed scopes/history/logs belong to numbered tasks and Git. Update it for
current work; remove old detail on archival/deferral. Aim below 80 lines and
compact if it grows larger.

## Servers and generated files

Keep only maintained, reusable tooling and its required helpers in `scripts/`.
Create one-off migrations, probes and task-specific scripts in ignored
`output/<task>/`; never force-add them to Git. Promote a helper into `scripts/`
only when it has a current reusable purpose, reproducible inputs and a clear
invocation or caller. Permanent tooling must not load source code from output.
Before removing old scripts, trace their callers and preserve any unique
regression checks in maintained tests. Absence from package scripts alone does
not prove that a script is unused or broken.

Start background development with `pnpm dev --background`
(`astro dev --background`); manage with `pnpm astro dev status`, `logs`, `stop`.
Default address is `http://localhost:4321`; use the actual port from output. Use
`pnpm preview` for a built site and `pnpm astro --help` for CLI help. Playwright
owns a separate fixture preview; no dev server is needed for E2E.

Preview cleanup with `pnpm clean:temp`; `pnpm clean:temp:apply` removes only
`.astro/`, `.playwright-cli/`, `coverage/`, `dist/`. The `:output` and
`:output:apply` variants also include all `output/`, including saved evidence.
Inspect the preview before applying. Keep cleanup limited to generated files;
never include runtime data, source, fixtures, dependencies or caches. Preserve
the helper's symlink/path protections. Verify cleanup changes with
`pnpm test:clean-temp`.

## Audible notifications

The primary agent plays synchronous local sounds; workers do not duplicate them.
Before **each** user-action request (approval/confirmation/input/manual step,
user-input tool, sandbox escalation or retry), finish an attention sound in a
separate preceding call. Never put it inside the command awaiting approval; an
earlier alert/completion sound does not cover another request. Immediately
before the final response play one distinct completion sound. On PowerShell:

```powershell
# Attention, before asking.
$attentionPlayer = [System.Media.SoundPlayer]::new(
  'C:\Windows\Media\Alarm01.wav'
)
$attentionPlayer.PlaySync()

# Completion, before the final response.
$completionPlayer = [System.Media.SoundPlayer]::new(
  'C:\Windows\Media\Windows Notify System Generic.wav'
)
$completionPlayer.PlaySync()
```

Playback is authorized subject to execution permissions; no separate sound
confirmation or automatic volume changes. If unavailable, continue and briefly
report it. Successful playback does not prove audibility; system settings apply.
