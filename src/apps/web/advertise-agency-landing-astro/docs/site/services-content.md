# Services content handoff

Task: [027](../codex/fixed/20261007/027-services-content-and-images.md)

## Editing and publication

Edit `data/content/services.json`. Array order is card order. IDs are stable
lowercase slugs; changing a name does not require changing its ID.

`src/content/services.ts` parses the file using the shared `parseContent`
helper and `src/validation/services.ts`. Import `services` for editorial
inspection, `publishedServices` for approved cards, and `visibleServices`
for the currently rendered catalog (including the explicit demo).

With `demoMode: false`, the section's `copyApproved` must be true before
any card is published.
Each published card also requires `confirmed`, `copyApproved`, and an image
with `approved: true`. Only set these after obtaining agency confirmation
and reviewing the wording and image. A boolean records an editorial
decision; it does not verify the underlying evidence automatically.

The catalog now uses `demoMode: true` at the user's request. All five draft
entries render with distinct local illustrations and dedicated test articles.
The visible `demoNotice` identifies these as test materials, not agency work.
All agency confirmation, copy, image and article approval flags remain false.
Turning demo mode off hides the current homepage section/menu entry.
Task 053 refreshed the five draft card descriptions to explain customer
benefits and the next project discussion. No prices, deadlines or delivery
guarantees were added; the copy still needs agency review.

Task 028 implemented this behavior: `Services.astro` follows About, and the
shared site loader filters the configured `/#services` menu entry when the
visible list is empty. `ServiceCard.astro` supports supplied images and
Astro Image for imported originals under `/src/assets/`. Public/remote
assets keep their supplied dimensions and require prior optimization.

## Current inputs

| Candidate | Existing claim source | Agency confirmation | Photo |
| --- | --- | --- | --- |
| Световые буквы | site description; About description1 | Pending | Missing |
| Вывески | site description; introduction summary | Pending | Missing |
| Неон | site description; About description2 | Pending | Missing |
| Объёмные конструкции | About description1 | Pending | Missing |
| Монтаж | About description1; introduction summary | Pending | Missing |

Draft descriptions explain categories without promising prices, materials,
timelines, warranties, or results. Confirm the catalog and descriptions,
withhold unsupported entries as described below, and replace `claimSource`
with the actual confirmation reference (for example, an agency-approved brief
and date).

## Images

Each image now points to a local 1200×900 PNG in `src/assets/services/`,
with its editable SVG original beside it. These original site illustrations
show a fictional illuminated sign, storefront sign, neon word, dimensional
mark, and sign installation. They contain no third-party photographs or
real client projects. `source` identifies the original; `projectContext`
and `publicationPermission` record demonstration usage. No agency approval
is implied. Astro Image and Sharp generate responsive WebP variants.

For each service, supply a relevant completed-work photo and populate:

- `src`: HTTP(S) URL or root-relative asset path, following the existing
  supplied-image pipeline. Resize/compress supplied assets before publishing.
- `alt`: specific description of the pictured work, avoiding invented claims.
- `width`, `height`: positive integer intrinsic dimensions.
- `source`: photographer, asset identifier, or agency delivery reference.
- `projectContext`: the actual project and how it illustrates this service.
- `publicationPermission`: permission reference and approved usage.
- `approved`: true only after relevance and publication rights are reviewed.
- `desktopFocalPoint`, `mobileFocalPoint`: `{ x, y }` percentages from 0–100,
  reviewed against actual crops. Preserve letters, sign edges, and relevant
  installation details. Do not guess acceptance from a missing image.

Demo image requests and centered crops passed task 028a checks. Real agency
photo relevance, publication rights, and recognizable project crops remain
open inputs for production acceptance.

## Optional service links

Omit `href` while a page is unavailable; do not use null, empty text, `#`,
an external URL, or a planned route. All five demo service pages now exist.

When a static Astro page exists, use `/services/slug/`. The loader discovers
static `.astro` files under `src/pages/services/`, including `slug/index.astro`,
and rejects references to absent routes. Dynamic route files are excluded;
if later page work introduces dynamic or Markdown routes, extend route
discovery and its verification as part of that work. Route existence does
not confirm page content approval; review the destination before linking.

## Article content and transition to production

Each item's `article` contains its title, meta description, lead, ordered
sections with headings/paragraphs, inquiry-input list, and `approved` flag.
Five thin static route files render the shared `ServiceArticle.astro`.
The article reuses the card's local illustration, shows a demo notice, and
offers native links to `/#services` and `/#order-inquiry`.

Article robots metadata stays `noindex, follow` while demo mode is enabled
or section/article/service/image approvals are missing. The same publication
predicate filters service routes from the sitemap, preventing demo articles
from being advertised as indexable pages. Other routes retain their
existing indexing behavior. No delivery endpoint was added.
If the catalog is withheld, article return links lead to the homepage instead
of its absent services anchor. Dedicated draft routes remain accessible and
labelled as demonstrations; a service approval does not approve its article.

To replace the demo, confirm the catalog and card copy, supply genuine
approved project photos, and approve the distinct article copy. Update
claim/image source references, dimensions, alt, focal points, and approval
flags based on actual review. Set `demoMode` to false. Verify the resulting
cards, menu, article metadata, images and routes before production acceptance.
Do not turn approvals on merely to keep demonstration content visible.

Demo validation requires a configured image and existing article route for
every item. Approval-mode validation continues to support missing images
and omitted links, with visibility determined by the publication gate.

## Verification and remaining acceptance

Content/schema verification is recorded in task 027. Agency confirmation,
approved section/card wording, real photos, rights, and crop guidance remain
open. Tasks 027–029 were archived at the user's request on 2026-10-07;
archiving does not establish agency approval or production readiness.

## Task 053 acceptance handoff

Agency evidence is still missing for all five services and the introduction.
Supply the approved heading, summary and actual service area; confirm each
catalog category. To withhold an unavailable category, retain its stable
record with `confirmed: false` and switch `demoMode` off when the accepted
catalog is ready. This removes its card/menu visibility without breaking the
existing static article route. If deleting a record, also remove its matching
`src/pages/services/*.astro` route; otherwise `ServiceArticle.astro` fails the
build for the missing service ID. For each accepted photo,
provide the real installation context, original supplier/file, publication
permission reference and reviewed crops. Record the approver, role, date,
approved version and any usage restrictions in the relevant source fields
and the [production input register](production-inputs.md).

The hero requires `photo.approved` and introduction `copyApproved`. Catalog
visibility, article indexing and sitemap service paths share the helpers in
`src/content/service-publication.ts`. Do not set approval flags just to make
draft material visible. Leave `demoMode` enabled until the accepted catalog
is ready; only then switch it off and review the resulting navigation.

Run `node scripts/test-service-publication.mjs`, `pnpm check`, and `pnpm build`.
The synthetic tests cover independent approvals, demo mode, missing media,
missing article links and text-only hero behavior without editing live JSON.
For sitemap acceptance, build with a confirmed `PUBLIC_SITE_URL` and check
that only approved service article paths appear. For each real supplied
photo, verify decoding, dimensions, mobile/desktop crops, enlarged text,
light/dark presentation, keyboard links and no-JavaScript navigation.
Current local demonstration media checks cannot accept absent agency photos.
