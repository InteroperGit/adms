# Development rules

Read the task, `AGENTS.md`, [workflow](workflow.md) and
[code style](code-style.md). Read additional topics only as affected by the
change; finish with [verification](verification.md). These files define how to
work on the project, not the current implementation of individual site features.

| Topic                           | Scope                                                                      |
| ------------------------------- | -------------------------------------------------------------------------- |
| [Workflow](workflow.md)         | Change lifecycle, agents, task handling, setup, servers, notifications     |
| [Code style](code-style.md)     | Syntax, comments, Astro practices and commits                              |
| [Architecture](architecture.md) | Layer responsibilities, dependencies, rendering, state and style ownership |
| [Content](content.md)           | Runtime/fixture boundaries, schemas, restricted authoring and publication  |
| [Design](design.md)             | Responsive UI, semantics, keyboard/focus, themes, motion and accessibility |
| [Inquiries](inquiries.md)       | Untrusted submissions, acceptance/retries, privacy and activation          |
| [Testing](testing.md)           | Test layers, fixtures, type contracts, coverage and browser evidence       |
| [Verification](verification.md) | Final checks, diff review and handoff                                      |
| [Release](release.md)           | Environment, runtime provisioning, deployment acceptance and rollback      |

Keep a single owner for each rule. Source, schemas and configuration own API,
field, prop and command details. Keep necessary reasoning and constraints here;
implementation explanations belong beside code. Do not add component catalogues,
current feature settings, historical test results or duplicate inventories.
Changes to documented contracts must update their implementation and checks, not
just the prose. Historical evidence remains in Git and existing task records.
