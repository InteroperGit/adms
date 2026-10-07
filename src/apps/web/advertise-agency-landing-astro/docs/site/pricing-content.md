# Pricing content handoff

Task: [032](../codex/fixed/20261007/032-pricing-content-and-examples.md)

## Current demonstration dataset

Edit `data/content/pricing.json`. Array order is presentation order. The
enabled `demoMode` contains three fictional scopes: facade letters, a flat
entrance sign, and an interior neon inscription. Dimensions, materials,
included work, exclusions, and ruble amounts are invented for demonstration.
They are not completed agency projects or verified market/agency prices.

`src/content/pricing.ts` uses the existing shared `parseContent` helper,
strict schema, and generated project IDs. It exports:

- `pricing`: the validated full editorial configuration.
- `visiblePricingExamples`: demo entries when demo mode is enabled;
  otherwise only production-eligible entries.
- `publishedPricingExamples`: production-eligible entries regardless of
  demo mode; currently empty.
- `formatPricingPrice(price)`: Russian ruble formatting for exact amounts
  and ranges, preserving up to two decimal places.

Examples use `price.context: "demo"` and retain all approval flags as false.
Turning demo mode off hides the current dataset without changing approvals.
The dataset can be empty. In production mode, drafts may have `image: null`;
enabled demo entries need a local `/src/assets/` image.

## Task 033 integration

Import `pricing`, `visiblePricingExamples`, and `formatPricingPrice` from
`@/content/pricing`. Render no section when the visible list is empty.
Render `pricing.demoNotice` prominently in demo mode and
`pricing.demoPriceLabel` beside each fictional price. Keep
`price.conditions`, dimensions, materials, included work, and exclusions
visible; a demo notice must not be relegated to alt text or documentation.
Cost factors and estimate guidance are illustrative copy under that notice.

Use `pricing.inquiryLabel` for native links to `/#order-inquiry`. Delivery
is disabled in the existing form; link activation does not prove receipt.
Task 032 adds data and loaders. Completed
[task 033](../codex/fixed/20261007/033-pricing-examples-section.md) renders
`PricingExamples.astro` directly after Projects and before Reviews, using
`PricingExample.astro` for each complete scope. No new menu entry is added.
Genuine current/historical prices display context and their reference date;
optional genuine project links are separate from inquiry actions. Empty
eligible collections omit the section. The section adds no client script.

## Contract and validation

Stable IDs are lowercase slugs. Required text cannot be blank; materials,
included work, exclusions, and cost-factor lists need at least one entry.
Unknown fields are rejected so typos cannot silently change the contract.

Prices use `currency: "RUB"`. An exact price has `type: "exact"` and a
positive numeric `amount`. A range has `type: "range"`, positive numeric
`min`/`max`, and `max > min`. All prices need `conditions`; no starting-price
type is supplied. `context` is `demo`, `current`, or `historical`. Genuine
current/historical prices need a real `asOf` date in YYYY-MM-DD format.
For future genuine content, show the date, price context, scope and relevant
tax/installation conditions beside the amount. Formatting alone does not
convey whether a price is historical or current.

Every item records `source` and `approval` with independent `specifications`,
`copy`, and `price` flags. Any true flag requires a nonblank evidence
`reference` and a real `verifiedAt` date. Section copy approval requires
`approvalSource`. A boolean records an editorial decision, not independent
verification. Demo examples reject true agency flags or a project `href`.

Optional `href` values must exactly match an existing `/projects/id` route,
derived from the project records used by the existing dynamic page. Do not
link fictional examples to unrelated records or add placeholder anchors.

## Local test images

Reuse these original site illustration assets from the Services demo:

- `/src/assets/services/svetovye-bukvy-demo.png`
- `/src/assets/services/vyveski-demo.png`
- `/src/assets/services/neon-demo.png`

Each is 1200×900 with an editable SVG original beside it. These are raster
illustrations, not photographs, and depict the category rather than the
exact fictional dimensions or number of elements. No new photo generation
tool was available. Reusing existing demo media is allowed by task 032.

Each image records source, demonstration context, usage permission, alt,
dimensions, approval, and separate mobile/desktop focal percentages. The
centered focal points preserve the illustrated subject in the existing 4:3
frames. Actual task 033 crops still need layout verification. Use the
existing Astro Image/glob approach from `ServiceCard.astro` for responsive
variants, intrinsic dimensions and lazy loading. `/src/assets/` paths are
build-time lookup keys, not public `<img src>` URLs. Missing originals must
fail clearly during integration.

## Replacing the demonstration

Collect genuine project scopes, real photos and rights, agency-reviewed
prices and copy, and applicable conditions. Replace fictional wording and
media; update their sources, intrinsic dimensions, alt and crop guidance.
Set each price to `current` or `historical` with its reference date. Record
approval evidence and review date before enabling the three item flags and
image approval; also approve section copy with its source. Set `demoMode`
to false and verify the public list and rendered section.

Production visibility requires approved section copy, all three item flags,
an approved image, and a non-demo price context. Missing genuine material
is future production work and does not block this task's demo completion.

## Demo verification

[Task 034](../codex/fixed/20261007/034-pricing-examples-verification.md)
completed on 2026-10-07. Six light/dark responsive cases, enlarged text,
local images, keyboard/inquiry links, both no-JavaScript system themes,
catalog/dated-price fixtures, and 29 surrounding regression checks passed.
Minimum sampled text contrast: 5.55:1 light and 7.02:1 dark. Generated content
matches the source; all genuine agency approval flags remain false.

Evidence is in `output/playwright/task-034/`. Actual photos, agency pricing
and inquiry receipt remain unverified production inputs. Browser checks
isolated local behavior by aborting unrelated remote placeholder requests.
