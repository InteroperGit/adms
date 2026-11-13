# Content authoring and approval

## Data boundaries

Keep authored runtime JSON and MDX in `data/content/`, supplied outside Git.
Keep loaders, validators and typed exports in `src/`; do not duplicate authored
copy in components or TypeScript objects. Regression inputs belong in
`tests/fixtures/content/` and must never become production content. Keep
personal data, credentials and private approval records out of fixtures and
version control.

Initialize sites from [safe templates](../../../data/templates/manifest.json)
into an empty destination. The manifest is the authoritative file list. Keep
templates generic: no live content, customer identities, real destinations or
finished advertising copy. Replace placeholders before publication. JSON stays
plain JSON, without comments or invented annotation fields. Copying starter MDX
does not validate it; validate and compile the generated site separately. Run
`pnpm verify:boundaries` before committing content-related changes.

## Contracts and validation

[Domain types](../../../src/types/) and
[strict schemas](../../../src/validation/) define fields, defaults and
cross-field constraints. Consult them instead of maintaining parallel field
inventories. Change types, schemas, authored inputs and consumers together.
Preserve compile-time checks in both assignability directions, including
optional keys; compare parsed output when defaults apply. Preserve stable record
identities, references and editorial ordering.

Use validated [content loaders](../../../src/content/) and source-aware errors.
Validate all records, including disabled or unpublished inputs. Keep validation
server-side and domain contracts independent of content and schema execution;
follow [architecture](architecture.md). Do not silently discard unknown fields
or relax domain-specific URL rules when sharing validation helpers.

The standalone invariant scan provides early feedback on duplicate identities,
unsafe URLs, credentials, control characters and invalid dimensions. Schemas
remain authoritative for defaults, cross-field rules and publication decisions.
Run both `pnpm verify:content` and `pnpm check` after content edits. Validation
proves structure, not factual accuracy, resource availability, actual
dimensions, permission or delivery. Review those separately.

## Restricted article authoring

Use the [MDX compiler](../../../src/content/mdx-blocks.mjs) and
[block schema](../../../src/validation/content-blocks.ts) as the authoritative
syntax and component allowlist. Treat authored MDX as restricted data: reject
executable expressions, imports/exports, arbitrary HTML/JSX and unsupported
markup. Do not strip unsupported content silently or let authored data choose
executable components. Extend contracts, compiler, renderer, publication policy
and fixtures together before accepting a new block type.

Article references and frontmatter must agree with their owning catalog record.
Missing/mismatched entries fail the build. Normalize MDX and explicit JSON
articles through the same validated block stream and renderer. JSON fallback
requires an explicit format and recorded nonblank editorial reason; malformed or
missing MDX must never select fallback automatically. Do not rerun migrations
over later editorial changes or infer approval from a successful migration.

## Publication and provenance

Approval requires a genuine editorial decision and traceable evidence. Record
the responsible approver, source and date where the contract requires them;
retain private originals securely and expose only appropriate references.
Unknown facts and approvals remain unknown. Neither a boolean, fixture, passing
build, migration nor completed task establishes factual or agency approval.
Distinguish demonstrations and planned outcomes from completed work and measured
results. Do not invent customer attribution, specifications, guarantees or
rights.

Use the existing owner and nested publication policies in
[content helpers](../../../src/content/) rather than independent visibility
checks. Owner approval cannot bypass block, image or other nested approval
requirements. Omitted nested status inherits owner requirements; it does not
mean unrestricted publication. Explicitly published content requires provenance
even on an unapproved owner. Media rights are independent of copy approval, and
gallery approval does not approve each image.

Draft content stays out of public output. Approved owners containing drafts must
fail validation rather than quietly publish an incomplete approved article.
Visible demonstrations require disclosure and must retain existing indexing,
sitemap and production-form restrictions. Compatibility for older unclassified
demo media does not authorize production publication. Changing page status or
disabling demo mode cannot manufacture missing approvals.

Supply positive intrinsic media dimensions and meaningful alternative text
(empty for decorative images). Verify actual media, subject association, rights
and publication permission; metadata validation alone is insufficient. Never
present stock, generated or illustrated material as genuine completed work. Keep
private evidence and personal information out of visitor output. Authored blocks
cannot enable forms: trusted page context owns identity, category and
publication decisions, and registry gates choose permitted forms. Preserve safe
native fallbacks; follow [inquiries](inquiries.md) for submission and consent
rules.
