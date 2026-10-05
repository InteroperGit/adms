# Separate domain types and runtime content validation

**Status:** Pending

**Priority:** Medium

**Dependency:** 017 complete. Implement before 018, which will consume offers. No carousel UI work here.

Read the [carousel plan](../plan/20261005_044149_plan.md), [task guide](../task-management.md), [content guide](../../site/content.md) and [project instructions](../../../AGENTS.md). Apply astro-best-practices; inspect current imports before editing.

## Decision

Keep `src/types/` for plain TypeScript domain contracts and `src/validation/` for executable Zod validation. Moving the current schema file into `types/` would mix runtime behavior with type declarations and leave the monolith intact. Remove schema inference/imports from domain type files while retaining compile-time checks that validation outputs match those contracts. This introduces two representations deliberately; explicit type compatibility must prevent drift.

## Scope

- Define plain `Project`, `Review`, `Offer` and `Offers` interfaces/types in their existing `src/types/*.ts` files. No imports from content wrappers, validation or `astro/zod` there. Preserve public `@/types` exports and existing field shapes. `Offers.intervalMs` is required in the validated domain object; raw JSON may omit it because validation supplies 7000.
- Split `src/content/schemas.ts` into `src/validation/projects.ts`, `reviews.ts` and `offers.ts`. Put shared text/ID/media/unique-ID helpers in `shared.ts`, and the source-aware generic parser in `parse-content.ts`. Keep offer-specific safe-link rules in offers validation; do not silently tighten existing project/review URL rules.
- Validation may import domain contracts with `import type`; domain types never import validation. Content wrappers import raw JSON and the appropriate validator/parser, producing typed validated exports. Components continue consuming wrappers and domain types. Keep runtime validation outside client scripts.
- Enforce compatibility between each schema's output and its domain type in both directions, including optional/required fields. Use appropriate typed schemas or compile-time assertions compatible with the installed Zod version; a one-way assignability check alone may miss extra fields. Check item and aggregate schemas. Do not use `as Project`, `as Offers`, `any` or unchecked assertions to conceal mismatches. Keep Zod input/output differences valid for defaults.
- Preserve all behavior: strict unknown-field rejection, ordered enabled offers, duplicate IDs, positive integer dimensions, text/alt policies, safe offer URLs, interval default/minimum and error source/field paths. Preserve JSON content, routes and publication flags. Remove the old monolith after all imports migrate; avoid a permanent legacy re-export unless a real consumer needs it.
- Update content/project-structure/offers documentation to explain ownership, import direction and how to change a domain field together with its validation. Update local verification helpers that reference the old schema path; ignored helper files are evidence, not application APIs.

## Acceptance

Run meaningful schema/parser/wrapper regressions for projects, reviews and offers: valid records, duplicate IDs, invalid fields/dimensions/URLs, strictness and source/field errors. Include omitted interval -> 7000, empty/one/multiple offers and enabled-item order. Confirm type checks fail for a temporary schema/type mismatch (missing/extra/optional field), then remove the fixture. Verify domain type files have no schema/Zod/content imports and no runtime circular dependencies.

Run `pnpm check`, `pnpm build` and diff checks. Offers are not yet imported by a page, so exercise their actual wrapper in the targeted checks; do not infer runtime validation coverage from page build alone. Record changed files, test results and limitations in this task, then archive by actual completion date and update the plan. No browser/server, UI, dependency upgrade, commit or deployment is required.
