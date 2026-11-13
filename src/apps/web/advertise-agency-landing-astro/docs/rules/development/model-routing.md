# Model routing for development agents

This project uses model routing to control cost while keeping implementation
quality and verification standards unchanged. The primary agent owns the task
contract, shared state, integration and final acceptance. A subagent is a
temporary worker for one bounded step.

## Default routing

Start with `gpt-6-luna` at medium reasoning effort for a clear, local step.
Use low effort for mechanical inspection, narrow documentation edits and
simple formatting. Use extra high effort only when a Luna step must reconcile
many files or external application state and the acceptance criteria remain
clear.

Use `gpt-6.1-sol` at medium effort when the work crosses component boundaries,
changes several contracts, requires a coordinated refactor or needs diagnosis
after a focused attempt has produced evidence. Use extra high effort for a
large but well-defined implementation with several interacting behaviors.

Use `gpt-6-astra` only when the problem remains ambiguous after repository
inspection and a concrete Luna/Sol attempt, or when a high-risk architectural
decision needs an independent resolution. Astra must receive the distilled
problem, attempted fixes, evidence and constraints; do not send the full
repository history by default.

These defaults follow the official OpenAI model guidance: Luna is intended for
focused, efficient work, Sol for complex technical work, and Astra for the
most demanding reasoning. See the [model selection guide][selection] and the
[GPT-6 Luna reference][luna].

## Routing by step

| Step | Default | Escalate when |
| --- | --- | --- |
| Locate files, inspect rules, read tests | Luna low | Repository state is contradictory |
| Small docs, content or style edit | Luna low/medium | The change affects several contracts |
| One component or pure module | Luna medium | Lifecycle or responsive behavior is involved |
| Several components or shared API | Sol medium | The architecture is still unclear |
| Focused test and formatter run | Luna low/medium | Failures span unrelated systems |
| Browser or integration diagnosis | Luna medium | Reproduction is intermittent or cross-browser |
| Final review of a clear diff | Luna medium | Evidence conflicts or risk remains high |
| Architecture or security ambiguity | Sol first | Escalate to Astra only with evidence |

Do not use a larger model for a step whose inputs and pass/fail checks are
already explicit. Do not ask a second model to repeat a review that produced no
new evidence.

## Subagent policy

Delegate only when the work is independent and the delegation saves time or
context. Good delegation units include a focused code search, a component test
audit, a browser scenario, a documentation update or an isolated implementation
with a named file boundary.

Every delegation prompt must state:

1. the exact objective and files in scope;
2. relevant constraints and the expected output;
3. the smallest useful verification command or inspection;
4. what the worker must report, including changed files and unresolved risks.

Use Luna for independent bounded workers by default. Use Sol for a worker that
must make a cross-file design decision. Do not assign Astra to parallel workers
or use multiple agents for the same files. The primary agent integrates shared
changes sequentially and resolves conflicts before running the final gates.

Prefer one well-scoped worker over several partial workers. If a task cannot be
split without shared mutable state, keep it with the primary agent.

## Context and budget discipline

- Read the task file and applicable rules first; do not load unrelated history.
- Search before reading large files and pass only relevant excerpts to workers.
- Reuse test output and browser evidence until a new change invalidates it.
- Keep handoffs short: changed files, decisions, commands, results and risks.
- Run focused checks after a small change; run the full gate once at the end.
- Escalate after a reproducible failure, not after uncertainty alone.
- Return from Sol or Astra to Luna for follow-up edits once the design issue is
  settled.

Budget discipline never permits skipping a required quality gate. It permits
choosing the smallest relevant check during iteration and the smallest model
that can interpret its result.

## Escalation record

When escalating, record in the task file:

- the failed or ambiguous step;
- the evidence that made the current model insufficient;
- the selected model and reasoning effort;
- the resulting decision and verification.

Do not record speculative model comparisons or token estimates as facts.

[selection]: https://developers.openai.com/api/docs/guides/model-selection
[luna]: https://developers.openai.com/api/docs/models/gpt-6-luna
