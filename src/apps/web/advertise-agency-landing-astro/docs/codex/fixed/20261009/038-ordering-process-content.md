# Prepare ordering process content

**Status:** Completed draft preparation; agency approval pending

**Priority:** Priority 2

**Created:** 2026-10-08

**Depends on:**
Approved service, inquiry, production, and installation information from the
agency.

## Goal

Prepare truthful content for the ordering process section described in the
[sales and SEO plan](../../plan/sales-and-seo-plan.md). Explain the customer
journey in five steps: inquiry, measurements, design approval, production,
and installation.

## Scope and acceptance

- Confirm the wording and order of all five steps with the agency.
- State what the customer supplies at each relevant step.
- State what the agency handles, including any site visit or measurement
  responsibilities.
- Identify required customer inputs such as address, dimensions, brand
  materials, files, approvals, and access arrangements.
- Record realistic handoff conditions between the steps without inventing
  turnaround times, prices, guarantees, or capabilities.
- Provide short headings and descriptions suitable for a scannable homepage
  section and a longer accessible reading order.
- Mark unknown details as open agency inputs instead of filling them with
  generic claims.

## Evidence and handoff

Record approved wording, open questions, and any source material in this task.
Link the final content contract from the implementation task. Do not close
this task until the agency has approved the claims required for publication.

## Implementation — 2026-10-08

- Added `data/content/ordering-process.json` with five ordered draft steps:
  inquiry, measurements, design approval, production, and installation.
- Recorded customer inputs, agency responsibilities, and unresolved agency
  questions for every step. No turnaround, warranty, price, or capability
  claim is presented as approved.
- Added typed content definitions, a strict Zod schema, and the shared parser
  loader in `src/types`, `src/validation`, and `src/content`.
- Kept `copyApproved` false and added a draft notice and `pendingInputs` so
  Task 039 can render the content without implying production acceptance.

## Verification

- `pnpm check`: passed with one pre-existing hint in the ignored
  `output/playwright/task-018/matrix.js` helper.
- `pnpm check:style`: passed for five changed files.
- `node scripts/verify-content-invariants.mjs`: passed for 12 content files.

The draft is ready for Task 039 implementation. Agency confirmation of the
responsibilities and wording remains a production dependency.
