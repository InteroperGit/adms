# Prepare services content and images

**Status:** Archived at user request; content layer implemented

**Archived:** 2026-10-07

**Priority:** High

**Created:** 2026-10-06

**Depends on:** Existing introduction content and site content conventions.

## Goal

Prepare editable, validated content for “Priority 1: Services” in the
[sales and SEO plan](../../plan/sales-and-seo-plan.md).

Read [project instructions](../../../../AGENTS.md),
[task management](../../task-management.md), and applicable code-style and
Astro rules. Apply astro-best-practices when implementing the content layer.

## Scope

- Review `data/content/site.json`, `about.json`, and `introduction.json`
  for existing service claims. Treat these as candidate copy, not proof
  that the agency provides every service.
- Confirm the actual catalog with the agency. Candidates are световые
  буквы, вывески, неон, объёмные конструкции, and монтаж. Include only
  confirmed services; record unavailable confirmations as open inputs.
- Create `data/content/services.json` with a section heading, short
  introduction, and ordered service entries. Give each service a stable
  unique ID, name, concise explanation, relevant image, and optional
  dedicated-page link. Track draft/approved content explicitly.
- Follow existing `src/types/`, `src/content/`, and `src/validation/`
  conventions and shared content parsing; avoid a parallel loading system.
- Validate required text, unique IDs, image metadata, and optional URLs.
  An absent page link must be supported without an empty or fake anchor.
- Collect relevant agency photos with publication rights, descriptive alt
  text, dimensions, and crop guidance. Use existing image conventions;
  preserve original project details in mobile and desktop crops.
- Keep missing images explicit. Any temporary demonstration media must be
  clearly identified and must not imply completed agency work.
- Record the source and approval state of service claims and images.
  Do not invent prices, materials, timelines, guarantees, or capabilities.
- Reserve dedicated-page links only for existing published routes.
  Creating service pages belongs to the plan's later SEO phase.

## Acceptance and verification

- The validated catalog supports confirmed services and missing page links.
- Draft copy and missing agency inputs are identifiable; publication
  readiness is not claimed until service claims and images are approved.
- Invalid content produces useful errors through existing validation.
- Image sources, dimensions, alt text, rights, and crop requirements are
  recorded for task 028. Missing real photos remain open acceptance items.
- Run `pnpm check`, `pnpm build`, and diff checks after implementation.
  Verify meaningful valid/invalid content cases using existing tooling.
- Hand off the content contract and unresolved inputs to
  [task 028](028-services-section.md).

Archive after acceptance passes and update the plan's task links/status
according to the task-management guide.

## Implementation and verification — 2026-10-06

- Added ordered editable `services.json`, service types, strict Zod
  validation, and a loader using the existing shared `parseContent` helper.
- Recorded five candidates from existing site/About/introduction copy.
  Each has a stable slug, draft description, claim source, explicit
  `confirmed: false`, `copyApproved: false`, and `image: null`.
- Added validated image metadata with rights/source/context, approval,
  positive integer dimensions, and mobile/desktop focal percentages.
- Optional links must point to discovered static Astro service pages.
  No pages exist currently, so all links are omitted. Dynamic routes are
  intentionally excluded until dedicated page work supports them.
- `services` retains drafts for editorial review; `publishedServices`
  requires approved section copy, confirmed service/copy, and an approved
  image. The current public list is empty. No homepage changes were made.
- [Content handoff](../../../site/services-content.md) documents editing,
  publication conditions, image inputs, links, and task 028 integration.
- `pnpm check`: zero errors/warnings, one existing unused-variable hint
  in ignored `output/playwright/task-018/matrix.js`.
- `pnpm build`: passed, six static pages. Services is not yet imported by
  a homepage component; the loader was verified separately.
- Local ignored `output/task-027/verify.mjs` checks actual transpiled
  schemas and shared error formatting. Draft, empty, approved/photo/link
  fixtures passed; 18 invalid cases rejected with source/field errors.
  Cases cover blank text, duplicate/malformed IDs, approval types, unsafe
  or nonexistent page links, unknown fields, dimensions, alt, source URL,
  rights metadata, and focal bounds.
- A Vite middleware loader check imported actual `src/content/services.ts`
  without starting a listening development server: five drafts loaded,
  zero published cards. No dependency installation was needed.

Agency confirmation, approved wording, relevant real photos, publication
rights, and actual crop guidance remain unresolved. No supplied assets
establish these inputs; none were invented. Archived at the user's request;
production acceptance remains open. Task 028 can use this contract,
using temporary fixtures for layout and omitting empty public navigation.
