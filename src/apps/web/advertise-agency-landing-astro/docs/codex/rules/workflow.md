# Workflow

Run commands from this application's root. Use Node >=22.22.0 (`package.json`),
pnpm 10.7.0 and `pnpm install --frozen-lockfile`. TypeScript/tool compatibility
and final gates belong to [verification](verification.md).

## Change lifecycle

Read the applicable instructions and affected code before editing. Identify the
observable outcome, constraints, callers and acceptance checks; find repository
facts yourself. Ask only for missing decisions that cannot be inferred. Respect
explicit exclusions such as task files, deployment or external messages.

Prefer the smallest complete change using existing conventions and installed
capabilities. Do not add abstractions, dependencies or configuration without a
current need. Update all affected callers, tests, types and documentation; keep
unrelated user changes intact. Treat runtime data, secrets and irreversible
operations as explicit boundaries. Finish with [verification](verification.md);
use [release](release.md) only when publishing or changing deployment behavior.

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

Inspect `.codex/`, `harness/` and `docs/codex/tasks/` before creating work;
avoid duplicates. Keep agent files in the project or `~/dev/`, never Documents,
Desktop, OneDrive or another synchronized folder.

- `.codex/{agents,skills,prompts}/`: custom agent TOML basename matches its
  name.
- `docs/codex/tasks/{plan,todo,backlog,learn}/`: plans, active tasks, explicitly
  deferred work and lessons. Number task names with leading zeros in execution
  order (`001-feature.md`); structured Plan-Todo-Learn records use
  `YYYYMMDD_HHMMSS_<type>.md` (e.g. `20231027_100000_plan.md`).
- Completed tasks: `docs/codex/tasks/fixed/yyyyMMdd/`, preserving the numbered
  filename and completion date in Europe/Moscow. Pending tasks remain in todo.
- Optional phases: `harness/build/phase-01-name.md`; context:
  `harness/context/`.
- Auxiliary names: descriptive lowercase hyphenated slugs, `.md` for Markdown;
  no spaces, Cyrillic or special characters. Reserved root instruction/roadmap
  files: `AGENTS.md`, `GOALS.md`, `PLANS.md`, `PROMPTS.md`; do not create root
  task files. Use `docs/codex/tasks/` if uncertain. Restructuring needs user
  authorization; infer facts yourself and ask only non-inferable decisions.

Use `grilling` before task authoring to settle goal, scope, constraints,
dependencies and acceptance, and `ponytail` for the smallest complete outcome.
Record primary and workers, model/effort per distinct step or explicitly no
delegation. Add an actionable checklist: applicable instructions/skills,
implementation, required checks/acceptance and archival/handoff. Do not add
inapplicable checks or weaken gates. Suggested sections: Skills, Model and
participants, Checklist.

After verified acceptance record changes/results, archive and update relative
links and plan status. Explicitly deferred tasks keep filename, evidence and
outstanding inputs when moved to backlog; update references on every move. User
instructions can exclude task edits/archival for a session.

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
