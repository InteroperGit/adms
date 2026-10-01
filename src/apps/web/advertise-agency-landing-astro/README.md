# Astro Starter Kit: Basics

```sh
pnpm create astro@latest -- --template basics
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`             | Installs dependencies                            |
| `pnpm dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm build`           | Build your production site to `./dist/`          |
| `pnpm check`           | Check Astro and TypeScript files without prompts |
| `pnpm preview`         | Preview your build locally, before deploying     |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Type checking and CI

Run `pnpm check` and `pnpm build` before submitting changes. The check command uses the installed `@astrojs/check` package; no interactive dependency installation is needed. TypeScript is kept on version 6 because `@astrojs/check` 0.9.10 does not support TypeScript 7. See the [Astro TypeScript guide](https://docs.astro.build/en/guides/typescript/#type-checking).

No repository CI configuration was found in the repository root or in its GitHub, GitLab, Buildkite, Jenkins, or Azure Pipelines configuration locations. CI integration remains to be added at repository level. Configure a job for pull requests and pushes that affect `src/apps/web/advertise-agency-landing-astro/**`, provision Node.js 22.12 or newer and pnpm 10.7.0, and run the following commands with `src/apps/web/advertise-agency-landing-astro` as its working directory:

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm build
```

Each command must fail the job on a nonzero exit status. Include workflow-file changes in the trigger paths when a CI configuration is created, so edits to the job itself are verified.

## Content sources and validation

Edit content in `data/content/*.json` (legal documents are in `data/content/legal/`). These JSON files remain the source of truth; do not duplicate their text in components or TypeScript objects. The small settings documents keep their typed exports in `src/content/`.

Projects and reviews use direct JSON imports because each dataset is small and their existing synchronous API and array order are sufficient. Astro content collections are unnecessary here; consider them if the site grows to need collection queries or Markdown entries. See the [Astro content collections guide](https://docs.astro.build/en/guides/content-collections/).

`src/content/schemas.ts` validates project and review arrays when their exports are imported, including during `pnpm build`. Their `Project` and `Review` types are inferred from these schemas instead of maintained as separate interfaces. Validation rejects missing, unknown, incorrectly typed, or blank fields, invalid media sources, and non-positive, fractional, or duplicate IDs. Errors name the source JSON file and field path (for example, `0.title`). Media sources can be HTTP(S) URLs or root-relative paths to public assets; validation does not check whether those resources exist.

Keep project IDs stable: each numeric ID defines `/projects/<id>`, including the existing `/projects/1`, `/projects/2`, and `/projects/3` routes. Array order determines card order. After editing JSON, run `pnpm build` to validate the content and generate the pages.

# Guide for Codex Agent: Task Storage and File Naming

## Purpose

This document describes **where the agent should store task files, plans, and context** in the project, as well as **which naming rules to apply**.  
Follow these rules when creating, searching for, and modifying files.

---

## 1. Project Folder Structure

Use the following structure:

```text
project-root/
├── .codex/                  # Codex service folder
│   ├── agents/              # Custom agents (TOML files)
│   ├── skills/              # Reusable agent skills
│   ├── prompts/             # Custom prompts (slash commands)
│   └── TASKS.md             # Active tasks and current progress
├── harness/                 # Recommended folder for execution phase files
│   ├── build/               # Phase files (e.g., phase-01-*.md)
│   └── context/             # Context for specific phases
├── docs/codex/              # For structured Plan-Todo-Learn protocol
│   ├── plan/                # Plans and goals
│   ├── todo/                # Active tasks
│   ├── fixed/               # Completed tasks grouped by completion date
│   │   └── yyyyMMdd/        # e.g., 20261001/; tasks and verification results
│   └── learn/               # Postmortems and lessons learned
├── AGENTS.md                # Main instruction file for Codex (root)
├── GOALS.md                 # Goals and success criteria
├── PLANS.md                 # Project roadmap
└── PROMPTS.md               # Instructions for launching tasks
```

### Explanations

- **`.codex/`** — standard place for Codex service files.  
  Store custom agents, skills, and user prompts here.  
  For current tasks, use `TASKS.md` so the agent can restore state after context compression.

- **`harness/build/`** — recommended for files describing individual development phases.  
  This helps break large tasks into manageable parts.

- **`docs/codex/`** — suitable for the strict "Plan-Todo-Learn" protocol, where each file type has its own purpose and naming rules.

- **Avoid synchronized folders.** Do not store agent working files in `Documents`, `Desktop`, OneDrive, or other synchronized folders.  
  This can cause sync and performance issues.  
  Prefer a local folder inside the project or `~/dev/`.

---

## 2. File Naming Rules

### Task and plan files

Use **numeric prefixes with leading zeros** for execution order:

- `001-feature.md`
- `002-bugfix.md`
- `003-refactor-auth.md`

### Meta files and auxiliary folders

Use **descriptive slugs** without numbers:

- `research-auth-flow/`
- `create-prompt.md`
- `database-migration-notes.md`

### Structured Plan-Todo-Learn protocol

Use the format:

```text
YYYYMMDD_HHMMSS_<type>.md
```

Examples:

- `20231027_100000_plan.md`
- `20231027_103000_todo.md`
- `20231027_110000_learn.md`

### Development phase files

Use the format:

```text
phase-<number>-<name>.md
```

Examples:

- `phase-01-create-list.md`
- `phase-02-add-filter.md`

### Custom agents

The file name must match the agent name in the TOML file:

- `scaffolder.toml`
- `architect.toml`

### General recommendations

- Lowercase only.
- Separate words with hyphens.
- Use the `.md` extension for all Markdown files.
- Avoid spaces, Cyrillic characters, and special characters in file names.

---

## 3. Agent Instructions

1. Before starting work, check for files in `.codex/`, `harness/`, and `docs/codex/`.
2. If creating a new task, place it in `docs/codex/todo/` or `harness/build/` depending on the task type.
3. If the task belongs to the current active session, update `.codex/TASKS.md`.
4. When naming files, strictly follow the rules in Section 2.
5. Do not create task files in the project root, except for `AGENTS.md`, `GOALS.md`, `PLANS.md`, and `PROMPTS.md`.
6. If unsure where a file belongs, ask the user or use `docs/codex/` as a safe default.
7. After completing and verifying a task, mark it completed, record its changes and verification results, and move it from `docs/codex/todo/` to `docs/codex/fixed/yyyyMMdd/`. Use the completion date in the project's local timezone (for example, `20261001`), creating the date folder if needed. Preserve its numbered filename and update relative links in the moved task and links and status in the corresponding plan. Pending tasks remain in `todo/`.

---

## 4. Prohibited

- Storing agent working files in `Documents`, `Desktop`, OneDrive, or other synchronized folders.
- Using spaces or uppercase letters in file names.
- Creating duplicate tasks in different folders unnecessarily.
- Changing the folder structure without user approval.

---

## 5. Quick Reference

| File Type              | Folder                 | Example Name                     |
|------------------------|------------------------|----------------------------------|
| Active tasks           | `.codex/`              | `TASKS.md`                       |
| Development phase      | `harness/build/`       | `phase-01-create-list.md`        |
| Plan                   | `docs/codex/plan/`     | `20231027_100000_plan.md`        |
| Current task           | `docs/codex/todo/`     | `001-feature.md`                 |
| Completed task         | `docs/codex/fixed/yyyyMMdd/` | `20261001/001-feature.md` (relative to `fixed/`) |
| Postmortem             | `docs/codex/learn/`    | `20231027_110000_learn.md`       |
| Custom agent           | `.codex/agents/`       | `scaffolder.toml`                |
| Skill                  | `.codex/skills/`       | `database-migration.md`          |
| User prompt            | `.codex/prompts/`      | `create-prompt.md`               |

---

_Following these rules ensures predictability, order, and efficient Codex agent operation in the project._
