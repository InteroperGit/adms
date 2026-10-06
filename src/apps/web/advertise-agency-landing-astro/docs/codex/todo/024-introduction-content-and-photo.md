# Introduction content and project photo

**Status:** Pending agency input; content contract implemented

**Priority:** High

**Created:** 2026-10-06

## Goal

Prepare truthful Russian copy and a real completed-project photo for
“Priority 1: Clear introductory section” in the
[sales and SEO plan](../plan/sales-and-seo-plan.md).

Read [project instructions](../../../AGENTS.md) and
[task management](../task-management.md) before implementation.

## Scope

- Prepare the visible heading:
  «Изготовление вывесок и наружной рекламы в Череповце».
- Write a short summary of verified services and the area served. Existing
  content names световые буквы, вывески, неон, design and installation;
  confirm the final wording against the agency's actual offering.
- Use Череповец as the known location; confirm any wider service area
  before including it. Avoid unsupported prices, guarantees, and deadlines.
- Prepare the primary action «Рассчитать стоимость» with the destination
  `/#order-inquiry`. It starts an inquiry, not an automatic calculator.
- Select a real completed-project photograph with permission to publish.
  Record its source, project context, dimensions, alt text, and useful crop.
- Inspect existing project assets before requesting new material. Do not
  present library or generated imagery as the agency's completed work.
- Store editable copy and image metadata using the project's existing
  content, types, and validation conventions.

## Dependencies

Final service wording, wider coverage claims, and a usable project photo
may require agency input. Record missing inputs explicitly. Layout work
can proceed with a clearly identified temporary fixture; publication of
the real photo remains an acceptance requirement.

## Acceptance and verification

- Copy explains what the agency sells and where it works.
- The heading, summary, action, and image metadata are editable together.
- The photo is verified as agency work and has a recorded publication source.
- Crop and alt text suit the photo's role in the introductory section.
- New content follows applicable code-style rules and validation conventions.
- Record decisions and unresolved inputs for task 025.

Archive only after acceptance passes, following the task-management guide.

## Implementation — 2026-10-06

- Added editable `data/content/introduction.json`, plain domain contracts
  in `src/types/introduction.ts`, strict runtime validation in
  `src/validation/introduction.ts`, and the parsed content wrapper in
  `src/content/introduction.ts`. Types are exported through `@/types`.
- Prepared the requested heading and inquiry action, and draft summary:
  «Световые буквы, вывески и неон. Дизайн, изготовление и монтаж.»
  Services come from `site.json` and `about.json`; those existing claims
  are evidence for the draft, not independent agency confirmation.
- Limited the area to Череповец. No wider coverage, prices, deadlines,
  guarantees or invented customer results were added.
- Recorded `copyApproved: false` and `photo: null`. Inspected all current
  project records and local public assets: project photos are Picsum
  fixtures; the local map illustration and butterfly assets are unsuitable
  as completed-project photography. The existing media guide confirms
  that approved project photos have not been supplied.
- Defined required photo source, project context, publication-permission
  record, actual dimensions, descriptive alt text and separate bounded
  desktop/mobile focal points. No fake photo dimensions, permission or
  crop were assigned while the real photo is unavailable.
- Updated [content editing](../../site/content.md#introduction-content)
  and [media handoff](../../site/media.md) with the exact editing workflow.

## Handoff to task 025

- Import `introduction` from `@/content/introduction` for layout work.
  Content/schema preparation does not change the rendered homepage.
- `copyApproved: false` means the service wording still needs agency
  confirmation. Do not treat current JSON as approved marketing copy.
- `photo: null` means there is no publishable completed-project image.
  Layout work may use a clearly identified temporary fixture; do not
  attribute library or generated images to the agency.
- Request a real photo and record its original source/supplier, completed
  installation context and publication approval (who, when and reference).
  Verify the actual file dimensions and choose truthful alt text and
  desktop/mobile focal points after inspecting its crops.
- Metadata validation checks structure, not real-world agency provenance,
  permissions, file existence, dimensions or visual crops. These require
  manual confirmation before final acceptance.
- The inquiry link remains `/#order-inquiry`; delivery stays disabled in
  the separate inquiry configuration until independently connected.

## Verification

- `node output/playwright/task-024/verify.mjs` passed: actual JSON wrapper import,
  draft/missing-photo state, valid synthetic metadata and 25 rejected
  malformed-content cases (blank copy/provenance, wrong CTA, dimensions,
  crop bounds, unsafe source and unknown keys). The ignored local helper
  contains synthetic test metadata only and is not a publishable asset.
- `pnpm check` passed: 157 files, zero errors/warnings; one existing unused
  variable hint in `output/playwright/task-018/matrix.js`.
- `pnpm build` passed: six static pages. The new wrapper was verified
  separately because task 025 has not yet added a page consumer.
- No browser verification was needed for content/schema preparation;
  layout and actual crop checks remain in tasks 025/026.

## Remaining acceptance inputs

1. Agency confirmation of service copy; set `copyApproved` only afterward.
2. A genuine completed-project photo with recorded source and permission.
3. Actual dimensions, alt text and inspected desktop/mobile crops.

Retained in `todo/`: real-photo and final-copy acceptance has not passed.
