# Upgrade the customer guarantees presentation

**Status:** Brief customer presentation implemented;
archived at user request 2026-10-09. Detailed agency terms remain pending.

**Priority:** Priority 2

**Created:** 2026-10-09

**Depends on:**
[Task 041](041-production-and-guarantees-content.md),
[Task 042](042-production-and-guarantees-section.md), and agency-confirmed
warranty and maintenance terms.

## Goal

Make the Production and guarantees section understandable to a customer who
wants to know what is covered, for how long, what is excluded, how to request
help, and what maintenance is available.

## Customer-facing content

Prepare one clear warranty summary for each actual agency promise. Every
summary must answer these questions in plain language:

- What product, installation work, or defect is covered?
- Who provides the coverage: the agency, a component manufacturer, or both?
- How long does coverage last, and when does it begin?
- What conditions must the customer meet?
- What is excluded?
- How does the customer submit a claim, and what evidence is needed?
- What repair, replacement, inspection, or maintenance service is available?
- Is the service included in the quoted price or charged separately?

Do not publish a warranty duration, “lifetime” wording, response time,
coverage statement, exclusion, or maintenance price until the agency has
confirmed it. Manufacturer terms must be labelled as manufacturer terms and
must not be presented as the agency's guarantee.

## Presentation requirements

- Replace the current abstract evidence cards with a customer-first layout:
  a short promise summary, a coverage panel, a conditions and exclusions
  panel, and a claim/maintenance action.
- Use visible labels such as “Покрытие”, “Срок”, “Условия”, “Исключения”,
  and “Как обратиться”. Avoid unexplained internal statuses, evidence IDs,
  or draft terminology in customer copy.
- Show a clear notice when agency terms are not yet approved. The notice must
  explain that the customer can request the applicable terms with a quote;
  it must not imply that a warranty already exists.
- Keep component manufacturer coverage in a separate labelled block.
- Add a clear inquiry action beside the warranty summary, with a specific
  link name such as “Уточнить гарантию по проекту”.
- Keep the section usable on mobile, with readable lists and no collapsed
  information that depends on JavaScript.
- Preserve semantic headings, definition lists for labelled terms, keyboard
  focus, visible contrast, and reduced-motion behavior.
- Do not use stock workshop photos, generated illustrations, fictional
  certificates, or invented customer outcomes as proof of a guarantee.

## Implementation and acceptance

- Extend the Task 041 content contract only where the customer presentation
  needs additional fields. Keep schema validation strict.
- Update the Astro component without hardcoding agency warranty terms.
- Verify that unapproved claims are omitted or clearly marked as awaiting
  confirmation, while approved terms render as complete customer copy.
- Verify agency and manufacturer warranty blocks remain distinguishable.
- Test desktop, mobile, keyboard navigation, both themes, enlarged text,
  JavaScript disabled, and the inquiry link destination.
- Run `pnpm check`, `pnpm build`, and `node scripts/verify-content-invariants.mjs`.

## Agency inputs required before publication

Record the following in Task 041 before marking this task complete:

- Approved warranty wording and responsible party.
- Coverage, duration, start date, conditions, and exclusions.
- Claim contact route and required evidence.
- Maintenance and repair scope, pricing, and customer responsibilities.
- Any separate manufacturer warranties and their exact product models.

## Initial component copy

The homepage now presents six short, friendly cards under “Наши гарантии”:

- “Согласуем детали” — dimensions, materials, and installation are fixed
  before work starts.
- “Проверим результат” — the finished construction is compared with the
  approved layout.
- “Прозрачные условия” — project warranty and maintenance terms are stated in
  the estimate.
- “Поможем после монтажа” — customers can ask about care and support.

The two additional cards cover a contract for agreed work and a minimum
one-year whole-sign warranty, using the user's supplied claims recorded in
the preceding implementation commit. Full conditions and exclusions remain
separate agency inputs.

Cards now have pointer hover and native keyboard/tap focus feedback, including
a distinct keyboard outline and reduced-motion support. The presentation
works without JavaScript and retains all six descriptions in source order.

Archived at user request. This records the brief presentation delivery;
coverage details, exclusions, claim conditions, and maintenance prices remain
production dependencies.
