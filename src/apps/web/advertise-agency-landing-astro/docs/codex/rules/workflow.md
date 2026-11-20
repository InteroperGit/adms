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

Escalate on concrete failures or conflicting evidence, not uncertainty alone;
return to Luna once the design is settled. Do not repeat a passing review or use
a larger model for explicit checks. Record escalations in the task with the
failure, evidence, model/effort, decision and verification. Do not present
speculative model comparisons or token estimates as facts.

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

In automatic task execution, create a separate local Git commit after each task
is accepted, unless the user asks to skip commits. Otherwise, commit only on the
user's explicit request. Before any commit, required checks and review must pass
and the task lifecycle below must be complete. Include only that task's changes
and record; preserve unrelated changes. Follow the
[commit format](code-style.md#commits); never push without authorization.

Inspect `.codex/`, `harness/` and `docs/codex/tasks/` before creating work;
avoid duplicates. Keep agent files in the project or `~/dev/`, never Documents,
Desktop, OneDrive or another synchronized folder.

- `.codex/{agents,skills,prompts}/`: custom agent TOML basename matches its
  name.
- `docs/codex/tasks/{plan,todo,backlog,learn}/`: plans, active tasks, queued
  tasks and lessons. Number task names with leading zeros in execution order
  (`001-feature.md`); structured Plan-Todo-Learn records use
  `YYYYMMDD_HHMMSS_<type>.md` (e.g. `20231027_100000_plan.md`).
- Create tasks in `backlog`; at execution start, move them to `todo` before
  implementation in both manual and automatic execution.
- Once all execution and acceptance items are resolved, required checks pass and
  review findings are addressed, move the task to `fixed` without separate
  confirmation. Keep unfinished or blocked tasks in `todo` with remaining work
  recorded. Use the completion date in Europe/Moscow for the `fixed` directory.
- On every move, preserve the numbered filename and update status, relative
  links, plan references and `.codex/TASKS.md`.
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
`## Execution` section. Scope defines the work boundary and constraints. Write
every Scope requirement as a Markdown bullet (`- `), with one distinct
requirement or constraint per item. Do not bury requirements in prose
paragraphs; wrap continuation lines under their bullet. Keep execution and
acceptance checklists in their respective sections. Execution records applicable
skills, participants, model/effort per step or explicitly no delegation, and
checklists for instructions, implementation, focused checks, acceptance and
handoff. Keep execution details out of Scope and do not merge the sections. Do
not add inapplicable checks or weaken gates. Follow [testing](testing.md) for
colocated unit tests.

### Task header and role routing

Immediately below every task title, before status, dates and body sections, list
planned role assignments as Markdown bullets. Always include executor, tester
and reviewer; add coordinator, security, accessibility or other roles only when
the task needs them. Every role must state the model name, exact model ID and
reasoning effort (`low`, `medium`, `high` or `xhigh`). Example:

- **Executor:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `medium`.

Choose each assignment using Working context and models above, according to that
role's actual work. Do not assign a larger model solely for review. These are
planned settings, not evidence of models already used or a mandate to spawn
separate agents. One agent may perform several roles sequentially. Keep routing
in Execution consistent with the header; explain conditional escalations there.
Record actual models, effort, checks and any justified routing changes in
Handoff. Update header assignments when the plan changes. Apply this header when
creating or revising tasks, including backlog tasks.

### Task checklists

Every task must have Markdown checkbox lists for execution and observable
acceptance criteria. Cover implementation, applicable checks, review and
handoff; keep distinct outcomes separate and name affected files, behavior or
checks.

Update the task as work progresses. Check items only after outcomes are verified
and record supporting files, commands and results in the handoff. Include the
worker and stage for delegated work. Reopen items when later changes invalidate
their evidence or a check fails again.

Leave failed, blocked and unperformed items unchecked and record the reason and
next action. For conditional items, record why they do not apply before marking
them resolved. Never silently delete or weaken a criterion to close a task. A
task is complete only when every execution and acceptance item is resolved,
required checks pass and review findings are addressed. Reconcile both lists
before reporting completion.

Preserve the filename, evidence and outstanding inputs when deferring a task to
`backlog`. User instructions can exclude task edits for a session.

`.codex/TASKS.md` is current state, not a journal: active links with short
status/next action, blockers, resume constraints/decisions, optionally a useful
recent-completion summary, and links to todo/backlog/fixed and these rules.
Detailed scope and history belong to numbered tasks and Git. Keep the index
below 80 lines and compact it if it grows larger.

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
