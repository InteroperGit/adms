# Project rules

Keep runtime content in `data/content/` and versioned test fixtures in
`tests/fixtures/content/`. Keep loaders, validators, and typed exports in
`src/`.

Before making a change, read the applicable
[development rules](docs/development/rules/), especially code style, Astro,
development-server, and sound-notification guidance.

## Model and agent routing

Use the least expensive model that can complete the current step reliably.
Model choice is a routing decision for each step, not a permanent assignment
for the whole task. Follow [model routing](docs/development/model-routing.md)
for the default model, reasoning effort, delegation and escalation rules.

- Use **Luna** for scoped edits, focused tests, documentation, triage,
  repository searches and other work with clear inputs and acceptance checks.
- Use **Sol** for cross-file implementation, coordinated refactors,
  architecture decisions, flaky-test diagnosis and work that needs judgment
  across several existing contracts.
- Use **Astra** only for unresolved architectural ambiguity, difficult
  multi-system debugging or a final review after Luna and Sol have produced
  concrete evidence. Do not use it as a default reviewer.

Keep the primary agent responsible for scope, integration, quality gates and the
final report. Delegate only independent, bounded work with explicit files,
inputs, outputs and verification commands. Do not delegate a task merely to
create parallel conversation or duplicate a review.

Never reduce required tests, accessibility checks, boundary checks, formatting,
build checks or content rules to save model budget. Save budget by narrowing
context, reusing existing evidence, choosing a smaller model and escalating
only when a concrete failure requires it.
