# Hot offers carousel content

[Documentation index](../../README.md)

## Publication and source

Edit `data/content/offers.json`. The checked-in document has `enabled: false` and an empty `items` array because approved promotional copy and artwork have not been supplied. No offer, discount, deadline or stock artwork is invented. Task 017 provides configuration only; homepage rendering, controls and autoplay are implemented in tasks 018–020.

`src/content/offers.ts` validates the entire document through `offersSchema` and exports `offers` and `enabledOffers`. The latter preserves array order and filters per-item `enabled` exactly once. Consumers must also respect the separate global `offers.enabled` flag; an enabled item alone does not publish the section. `Offer` and `Offers` are plain domain interfaces in `src/types/offer.ts`, exported through `@/types`. Runtime schemas belong to `src/validation/offers.ts` and parsing to `src/validation/parse-content.ts`. Validators import contracts only as types and check item/aggregate output compatibility in both directions, including keys and requiredness. Change a domain field and its validation together; see [content ownership](content.md#changing-a-domain-field).

Validation runs whenever this wrapper is imported. Until task 018 connects it to a page, a successful page build alone does not exercise the offers JSON at runtime; use the targeted schema/import verification described below. Do not duplicate JSON copy, sorting or filtering in components. Disabled items are validated too, so unfinished drafts should stay outside this configuration.

## Settings and fields

| Field | Editing rule |
| --- | --- |
| `enabled` | Required boolean. Publish only after the agency approves copy, artwork and destinations. |
| `autoplay` | Required boolean; configures later rotation behavior, not a timer by itself. |
| `intervalMs` | Integer of at least 5000 milliseconds; defaults to 7000 when omitted. Checked-in value is 7000. |
| `title` | Required nonblank section heading; currently «Горячие предложения». |
| `items` | Required array; zero, one and multiple items are valid. Array order is display order. |
| Item `id` | Unique positive integer, including disabled items. Keep stable when reordering or editing; do not reuse IDs for different offers. |
| Item `enabled` | Required boolean; enables an individual approved item. |
| Item `title`, `description`, `linkLabel` | Required nonblank strings. Use concise factual Russian copy and a CTA that names its destination/action. |
| Item `image` | Root-relative public asset path or absolute HTTP(S) URL. Prefer `/images/offers/<approved-file>`. |
| Item `imageAlt` | Meaningful alternative text for informative artwork; exactly `""` for purely decorative artwork whose information is already in visible copy. Whitespace-only text is invalid. |
| Item `imageWidth`, `imageHeight` | Positive integer intrinsic pixel dimensions of the real image, not its rendered size. |
| Item `href` | Root-relative path (including `/#contacts`), nonempty local `#fragment`, or absolute HTTP(S) URL. |

Unknown/missing fields, wrong types, duplicate IDs, blank text, invalid dimensions and short intervals produce actionable errors naming `data/content/offers.json` and the field path, such as `items.1.id`. `intervalMs` is the only optional raw JSON field, with its documented default; it is required in the validated `Offers` object. Links and image sources reject protocol-relative URLs, unsafe schemes such as `javascript:` and `data:`, spaces/control characters, backslashes and HTTP(S) credentials. Use URL-encoded spaces where needed. Schema validation verifies syntax, not local file existence, remote availability, route/fragment existence or approval of a destination.

## Approved content handoff

For every offer, obtain approved title, description, link label, actual destination, artwork and alternative-text intent. Obtain prices, discounts, eligibility and dates only if supplied and approved; never infer them. Put optimized local artwork under `public/images/offers/`, record actual dimensions, and confirm rights to publish it. This folder need not exist until artwork is supplied. Check that each destination and image resolves before publishing.

Add complete items with stable IDs; leave global publication disabled while reviewing. Existing service text may be used in temporary preview fixtures only if clearly identified as preview content, with approved/demo artwork identified accurately. Restore `enabled: false` and remove temporary fixtures after checks. Once agency approval and tasks 018–021 verification are complete, enable selected items and the global flag, rebuild and deploy the static output. This flag is a build setting, not a cookie or visitor preference.

The component handoff is: omit disabled or empty sections; render a single enabled item statically; enhance multiple items progressively while retaining readable offers and real CTA links without JavaScript. Later tasks implement arrow/dot navigation, pauses, visibility rules and reduced-motion behavior using these exports. This task makes no browser, image-loading or autoplay claims.

## Task 017 verification

Targeted Node verification exercises the actual schema and wrapper: valid empty/one/multiple items, disabled publication, stable filtering/order, defaults, duplicate enabled/disabled IDs, unsafe links/media, blank text, invalid/fractional dimensions, short/fractional intervals, wrong flags, unknown fields, and source/field paths in errors. Local evidence is saved under ignored `output/playwright/task-017/`; it is schema verification, not browser evidence. `pnpm check` and `pnpm build` remain required for integration/type checking. Task 021 owns integrated browser verification and approved-asset review.

Task 017 results: `node output/playwright/task-017/verify.mjs` passed 66 assertions on Node 25.7.0. The harness resolves the JSON alias and schema import for native Node while running the wrapper's parse/export/filter body unchanged. `pnpm check` passed with 77 files and zero errors, warnings or hints; `pnpm build` generated all six existing pages. Native Node TypeScript loading is used by this local harness; no test-runner dependency or production script was added. No browser/server was started, and no artwork availability or publication approval was verified.

## Task 017a verification

The modular validation refactor preserves publication, JSON and field policies. `node output/playwright/task-017a/verify.mjs` passed 143 schema/parser/actual-wrapper assertions across projects, reviews and offers, including empty/one/multiple offers, interval defaults and enabled-item order. `verify-contracts.mjs` rejects missing, extra optional and optional schema fields, optional interval output, and extra optional domain fields before restoring originals. The task-017 local helper was migrated to the new module paths. These ignored native Node helpers are verification evidence, not application APIs; no browser/server coverage is claimed.
