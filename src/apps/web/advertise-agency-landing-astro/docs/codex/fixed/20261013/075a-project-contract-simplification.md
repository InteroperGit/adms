# 075a. Project contract simplification

Status: fixed. Depends on: 075. Follow-up: 078, 080.
Plan: [Universal content blocks](../../plan/20261012_universal-content-blocks-plan.md).

## Goal

Reduce `Project` to catalog and SEO metadata plus one required
`content: ContentBlock[]` article stream. Article content must not be duplicated
in model fields.

## Completed

- [x] Removed `ProjectPhoto`, `ProjectProcess`, and `ProjectDetails` types.
- [x] Removed legacy article fields: `manufacturing`, `installation`, `photos`,
  `resultPhotos`, `fullDescription`, `story`, `expectedBenefits`, `result`, and
  `details`.
- [x] Kept catalog metadata and required `content: ContentBlock[]` in `Project`.
- [x] Added an explicit legacy JSON conversion to ordered content blocks before
  strict public-schema validation.
- [x] Updated the Zod project schema and TypeScript contract assertions.
- [x] Preserved `installation` in inquiry forms and inquiry payloads; it is an
  order parameter, not article content.
- [x] Moved image provenance, usage rights, and approval metadata into block
  provenance during conversion.

## Follow-up

The remaining page and content migration work is tracked in tasks 078 and 080.

## Acceptance

- [x] The public `Project` contract contains only metadata and required content.
- [x] Legacy JSON is converted before it reaches the strict public schema.
- [x] The public contract is ready for page migration in tasks 078 and 080.

