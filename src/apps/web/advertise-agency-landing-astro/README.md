# Advertising agency landing site

Russian-language website for Рекламастер, built with Astro, TypeScript, Tailwind
CSS, and DaisyUI. The site generates static pages with browser scripts for the
mobile menu and cookie preference banner.

## Documentation

| Guide                                                                    | Contents                                                                           |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| [Setup and development](docs/rules/development/setup.md)                       | Runtime requirements, installation, background server, and commands                |
| [Project structure](docs/rules/development/project-structure.md)               | Application folders and shared configuration                                       |
| [Component reference](docs/rules/development/components.md)                    | All component contracts and future unit/integration/e2e test scenarios             |
| [Verification and CI](docs/rules/development/verification-and-ci.md)           | Type checking, builds, and remaining CI integration                                |
| [Content editing](docs/rules/site/content.md)                                  | JSON sources, validation, and stable project IDs                                   |
| [Order inquiries](docs/rules/site/order-inquiry.md)                            | Form configuration and delivery dependencies                                       |
| [Order inquiry API](docs/rules/development/order-inquiry-api.md)               | Backend service specification for form submissions                                 |
| [Production inputs](docs/rules/site/production-inputs.md)                      | Internal business/legal evidence register and delivery approval handoff            |
| [Hot offers carousel](docs/rules/site/offers-carousel.md)                      | Offer settings, validation, approved assets and implementation handoff             |
| [Shared image carousel](docs/rules/site/image-carousel.md)                     | Reusable features and About configuration                                          |
| [Case studies](docs/rules/site/case-studies.md)                                | Evidence, structured details and publication rules                                 |
| [Project and review media](docs/rules/site/media.md)                           | Missing approved photographs, image metadata, and replacement workflow             |
| [Design system](docs/rules/site/design-system.md)                              | Visual direction, shared tokens, typography, contrast and browser baseline         |
| [Integrated design verification](docs/rules/site/design-verification.md)       | Final route matrix, production interactions, contrast, assets and remaining checks |
| [Color themes](docs/rules/site/themes.md)                                      | Light/dark/system selection, persistence, no-JS fallback and map limitations       |
| [Page metadata](docs/rules/site/metadata.md)                                   | Titles, descriptions, social metadata, and production URL                          |
| [Code style checks](docs/rules/development/code-style.md)                      | Changed-file 80-column and Astro readability checks                                |
| [Content contract checks](docs/rules/development/content-contracts.md)         | Fast JSON invariant checks before the typed build                                  |
| [Performance and accessibility gates](docs/rules/development/quality-gates.md) | Generated HTML semantics and layout-stability checks                               |
| [Cookie preferences](docs/rules/site/cookie-preferences.md)                    | Persistence, storage failures, and resource-loading behavior                       |
| [Deployment and assets](docs/rules/site/deployment-and-assets.md)              | Static hosting, external resources, and pending agency assets                      |
| [External asset verification](docs/rules/development/external-assets.md)       | Pre-deployment remote media and CSS checks                                         |
| [Agent task management](docs/rules/development/task-management.md)             | Task folders, naming rules, and dated completion archives                          |

## Agent references

- [Project instructions](AGENTS.md)
- [Pending tasks](docs/codex/tasks/todo/)
- [Backlog tasks](docs/codex/tasks/backlog/)
- [Completed tasks](docs/codex/tasks/fixed/)
- [Todo tasks](docs/codex/tasks/todo/)

Agents should read the project instructions and task-management guide before
working on tasks.
