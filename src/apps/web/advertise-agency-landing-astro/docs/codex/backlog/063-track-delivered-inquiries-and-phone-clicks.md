# Track delivered inquiries and phone clicks

**Status:** Backlog — pending

**Moved to backlog:** 2026-10-10, at user request

**Priority:** Measurement

**Created:** 2026-10-09

**Plan:** [Sales and SEO improvement plan](../plan/sales-and-seo-plan.md).

**Depends on:** Tasks 050 and 051; approved analytics provider/configuration.

## Goal

Measure accepted inquiries separately from contact intent.

## Scope

- Agree analytics ownership, provider, event definitions, attribution fields,
  and approved consent/privacy behavior before integrating collection.
- Emit successful-inquiry events only after confirmed delivery acceptance;
  distinguish homepage and service/case forms without duplicate retry events.
- Track phone clicks as separate intent events, never as completed inquiries.
  Capture relevant page/service/source attribution without form text or other
  personal data in analytics URLs, events, or logs.
- Verify success, failure, timeout, retry, duplicate-click, unavailable delivery,
  and consent states with controlled events; document no-JavaScript limits.
- Keep client code small and document configuration, dashboards, and event
  meanings so the agency can interpret results.

## Acceptance

- Real accepted submission produces one correctly attributed success event;
  invalid/failed/unavailable submissions produce no success event.
- Phone clicks remain separate, collection follows the agreed privacy policy,
  and event verification evidence excludes personal inquiry data.

## Execution notes

Read project instructions, task-management guidance, and applicable rules
before implementation. Record missing agency inputs or external access as
dependencies. This task file authorizes no external publication or messages.
Archive only after acceptance, with evidence and updated plan/status links.
