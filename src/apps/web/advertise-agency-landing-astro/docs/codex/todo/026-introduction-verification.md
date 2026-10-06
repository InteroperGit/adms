# Verify the introductory section

**Status:** Pending

**Priority:** High

**Created:** 2026-10-06

**Depends on:** [Task 025](025-introduction-section.md)

## Goal

Verify the completed introduction against the
[sales and SEO plan](../plan/sales-and-seo-plan.md), focusing on readability,
the real project photo, semantic structure, and the inquiry action.

Read [project instructions](../../../AGENTS.md),
[task management](../task-management.md), and applicable development rules.
Use the Playwright skill for real browser checks; follow development-server
rules for starting, reusing, or stopping a server.

## Scope and acceptance

- Verify light and dark themes at 320px, 768px, and desktop widths.
- Check enlarged text and long-copy fixtures for overlap, clipping, and
  horizontal overflow. Remove temporary fixtures after verification.
- Confirm the heading, summary, primary action, and important photo details
  remain readable and recognizable across viewport sizes.
- Verify contrast, keyboard focus, and primary action activation. Confirm
  the inquiry destination is visible and accessible after anchor navigation.
- Verify the section and anchor work without JavaScript; the form must
  accurately show delivery availability and the direct contact fallback.
- Check generated HTML for exactly one visible homepage H1, descriptive
  copy, image dimensions, and appropriate alt text.
- Verify image requests succeed and the main introductory photo is not
  lazy-loaded. Record observed image loading or layout-shift problems.
- Check offers navigation/autoplay, header navigation, theme settings,
  cookie UI, and a project page for regressions caused by the new section.
- Fix findings within the introductory section's scope. Repeat checks only
  where changes or unresolved concerns justify them.
- Run `pnpm check`, `pnpm build`, and diff checks after any fixes.
- Record browser evidence, viewport coverage, check results, and limitations.
  Distinguish inquiry-anchor verification from actual delivery verification.

## Completion

Archive this task after acceptance passes. Update the introductory section's
task links and status in the plan as tasks are archived. Report missing real
photography or content as unresolved rather than declaring the section ready.
