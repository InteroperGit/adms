# Task 10 - Improve the Contacts section

**Status:** Completed

**Priority:** Medium

Read [AGENTS.md](../../../../AGENTS.md), the [task-management guide](../../task-management.md), and the [shared implementation plan](../../plan/20261001_222426_plan.md) before starting. Consult the relevant Astro component, styling, and image guides.

**Files:** `src/components/sections/Contacts.astro`, `src/components/ui/ContactInfo.astro`, `data/content/site.json`, `src/types/site.ts`, fallback image asset, and relevant `docs/site/` guides.

## Requested changes

1. Vertically center the address icon against the complete address text block, including when it wraps onto multiple lines. Give contact icons a consistent non-shrinking width. Since ContactInfo is shared, verify the footer as well as Contacts.
2. Add a boolean `mapEnabled` setting to `data/content/site.json` and its TypeScript type. Keep the existing `mapSrc`; default `mapEnabled` to `true` to preserve current behavior. This is a build-time setting: changing JSON requires rebuilding the static site.
3. When enabled, render the existing lazily loaded Yandex iframe with its descriptive title. When disabled, render a default picture in the same space. Do not render an iframe or initiate Yandex map requests in the disabled state; CSS hiding alone is insufficient.
4. Configure fallback image source, alternative text, and intrinsic dimensions in JSON, for example `mapFallback: { src, alt, width, height }`. Use a bundled local raster image so disabling the map does not depend on another external service. Prefer an approved office/location photograph if available. Otherwise use a clearly generic default image that does not imply it depicts the agency office, address, or an accurate map. Document any missing approved location photo. Do not fabricate a geographic map, office photograph, or business identity.
5. Keep stable responsive dimensions for the map/image area. The fallback must fit the same region without distorting, overflowing, or shifting surrounding content. Provide meaningful alternative text, or empty alternative text when the image is purely decorative and the adjacent address supplies its context.

## Recommended improvements

These recommendations are based on the current implementation. Include them in this task unless a concrete conflict emerges; record any deferred item.

- Replace the contact panel's rigid `h-64 lg:h-80` with content-driven height and appropriate minimum sizing. The address and two working-hours lines should fit at narrow widths and increased text size without clipping.
- Allow long email/address text to wrap (`min-width: 0` on text regions and suitable overflow wrapping); keep icons from shrinking. Apply the same alignment treatment to the multi-line working-hours row.
- Provide a clear phone and email action using the existing contact data and `tel:`/`mailto:` links, with visible keyboard focus and comfortable touch targets. Avoid duplicating the same actions unnecessarily.
- Consider an "Open in Yandex Maps" link for directions in either map state. Include it only if a verified place/directions URL is available; do not treat the embed URL as a directions URL or infer coordinates. Store any confirmed link in JSON. Loading an external site after an explicit click is distinct from loading an embedded map automatically.
- Move the existing contact-panel heading into site JSON instead of retaining another hardcoded content string. Preserve its current wording and the existing contact information.
- Keep this section consistent with the current site styling. Avoid unrelated redesigns, invented opening hours, new contact channels, or new consent rules.

## Documentation

Document the map toggle, fallback asset fields, and rebuild requirement in `docs/site/content.md` or a focused contact-settings guide linked from README. Update the external-resource notes in `docs/site/deployment-and-assets.md` and cookie-preference documentation to explain that map loading follows this configuration flag, not the saved cookie-banner choice.

## Acceptance criteria

- Address and working-hours icons are vertically aligned with wrapped text and remain consistent in Contacts and footer.
- `mapEnabled: true` renders the titled Yandex iframe; `false` renders the local fallback picture and emits no map iframe or Yandex map request.
- The fallback exists, has appropriate text/dimensions, and makes no unsupported claim about the business location.
- Contacts and footer have no clipping, overlapping content, or horizontal overflow at 320px, 375px, and desktop widths, including increased text size.
- Phone/email links and any verified directions link work with keyboard navigation and have visible focus states.
- `pnpm check` and `pnpm build` pass for both flag values. Restore the intended default after verification.
- Browser checks cover both states, fallback loading, responsive layout, icon alignment, and network behavior. Report any unavailable verification explicitly.
- JSON files retain valid UTF-8 Russian text without replacement characters or corrupted question-mark sequences.
- Document changes and verification, then move the completed task to `docs/codex/fixed/yyyyMMdd/` and update the plan link following the task-management guide.

## Implementation and verification

- Implemented by subagent task_010 and reviewed by the primary agent.
- Centered shared contact icons, prevented shrinking, enabled text wrapping, and added 44px action targets and visible keyboard focus. Contacts uses content-driven height; a small footer wrapping improvement supports enlarged text.
- Added typed `mapEnabled`, `mapFallback`, and contact-panel heading settings. The static conditional renders only the enabled iframe or disabled local image. Restored default `mapEnabled: true` after tests.
- Per the user's follow-up, replaced the envelope with `public/images/map-placeholder.png`: locally painted 1200 x 600 raster map diagram with imaginary streets, blocks, parks, and orange pin. Visually inspected; no real location or geographic labels implied. No image-generation API used.
- Updated content, deployment, and cookie-preference documentation. Approved location photo and verified directions URL remain unavailable; no directions link was invented.
- Check and build passed for both flag states and restored default; final check covered 36 files with zero diagnostics.
- Chrome checks passed both states at 320px, 375px, and 1440px with 100% and 200% root font size. Contacts/footer had no regional overflow; icons were centered and touch targets met the minimum height.
- Disabled state loaded the replacement PNG and made zero Yandex/Yastatic requests; enabled state rendered the titled iframe and made Yandex requests. Real Tab interaction reached email with a visible 2px focus outline.
- Site/project/review JSON passed strict UTF-8 and JSON checks. Primary-agent diff review and whitespace checks passed.
- No test servers remained listening on the verification ports. External map contents and screen-reader announcements were not tested. Unrelated header, reviews, and cookie-banner overflow at narrow widths with 200% text size remains outside this task.
