# 083 — Content and history inventory

Completed 2026-10-14. This is the migration manifest for replacing the
tracked history reference to the authored `data/content/` tree before task
087 removes only its Git history. The ready data remains physically present
and untouched in the working directory. It records the
owner, current source, replacement contract, and verification for every
content or fixture item. Paths in this document are repository-relative.

## Task 83 acceptance

- [x] Inventory all JSON, MDX, fixtures, media, and generated outputs.
- [x] Trace runtime imports, Astro glob loaders, scripts, tests, and docs.
- [x] Record URL, media, rights, ownership, and publication-risk checks.
- [x] Record local and remote branches, commit IDs, tags, and path counts.
- [x] Define replacement keys, verification commands, and migration owners.
- [x] Define the denylist for secrets, personal data, unsafe URLs, and claims.

The acceptance rows are complete for task 83. Tasks 084–087 remain follow-up
work and are intentionally still in `docs/codex/todo/`.

## Scope and ownership

| ID | Owner | Current source | Replacement | Test or verification |
| --- | --- | --- | --- | --- |
| C01 | Content owner | `about.json` | `about` export, schema v1 | `pnpm check` |
| C02 | Content owner | `about-carousel.json` | `about-carousel` export, schema v1 | `pnpm verify:content` |
| C03 | Content owner | `business-solutions.json` | `business-solutions` export, schema v1 | `pnpm check` |
| C04 | Content owner | `faq.json` | `faq` export, schema v1 | `node scripts/verify-faq.mjs` |
| C05 | Content owner | `icons.json` | icon manifest export, schema v1 | `pnpm check` |
| C06 | Content owner | `introduction.json` | `introduction` export, schema v1 | `pnpm check` |
| C07 | Content owner | `offers.json` | offers export, schema v1 | `pnpm verify:content` |
| C08 | Content owner | `ordering-process.json` | ordering export, schema v1 | `pnpm check` |
| C09 | Sales owner | `order-inquiry.json` | inquiry settings export, schema v1 | `pnpm check` |
| C10 | Sales owner | `pricing.json` | pricing export, schema v1 | `pnpm check` |
| C11 | Operations owner | `production-and-guarantees.json` | guarantees export, schema v1 | `pnpm check` |
| C12 | Catalog owner | `project-catalog.json` | catalog export, schema v1 | `pnpm check` |
| C13 | Catalog owner | `project-categories.json` | category export, schema v1 | `pnpm check` |
| C14 | Catalog owner | `projects.json` | project metadata export, schema v1 | `pnpm test:project-articles` |
| C15 | Content owner | `reviews.json` | reviews export, schema v1 | `pnpm verify:content` |
| C16 | Service owner | `services.json` | services export, schema v1 | `pnpm test:service-articles` |
| C17 | Site owner | `site.json` | site settings export, schema v1 | `pnpm check` |
| C18 | Legal owner | `legal/privacy-policy.json` | legal export, schema v1 | `pnpm check` |
| C19 | Legal owner | `legal/terms-of-use.json` | legal export, schema v1 | `pnpm check` |

The JSON rows above are consumed by the same-named modules in `src/content/`
and validated by the matching modules in `src/validation/`. Task 085 must
preserve those module APIs while changing only their input adapter.

## Article sources

| ID | Owner | Current source | Replacement | Test or verification |
| --- | --- | --- | --- | --- |
| A01 | Service owner | `articles/services/montazh.mdx` | service export `montazh` | `pnpm test:service-articles` |
| A02 | Service owner | `articles/services/neon.mdx` | service export `neon` | `pnpm test:service-articles` |
| A03 | Service owner | `articles/services/obyomnye-konstruktsii.mdx` | service export `obyomnye-konstruktsii` | `pnpm test:service-articles` |
| A04 | Service owner | `articles/services/svetovye-bukvy.mdx` | service export `svetovye-bukvy` | `pnpm test:service-articles` |
| A05 | Service owner | `articles/services/vyveski.mdx` | service export `vyveski` | `pnpm test:service-articles` |
| A06 | Catalog owner | `articles/projects/1.mdx` through `9.mdx` | project export IDs 1–9 | `pnpm test:project-articles` |
| A07 | Catalog owner | `articles/projects/10.mdx` through `19.mdx` | project export IDs 10–19 | `pnpm test:project-articles` |
| A08 | Catalog owner | `articles/projects/20.mdx` through `27.mdx` | project export IDs 20–27 | `pnpm test:project-articles` |

The five service files and 27 project files are loaded by the three Astro
content collections in `src/content.config.ts`. The replacement must retain
the slug/ID, frontmatter shape, ordered block IDs, image references, and
publication status. A generated build catalog is the delivery format; MDX is
not copied into `data/templates/`.

## Fixtures and historical migration inputs

| ID | Owner | Current source | Replacement | Test or verification |
| --- | --- | --- | --- | --- |
| F01 | QA owner | `fixtures/article-cases.json` | synthetic cases in test package | `node scripts/lib/article-acceptance-integration.mjs` |
| F02 | QA owner | `fixtures/articles/minimal.mdx` | minimal generated article fixture | `pnpm test:content-blocks` |
| F03 | QA owner | `fixtures/articles/project.mdx` | project generated fixture | `pnpm test:content-blocks` |
| F04 | QA owner | `fixtures/articles/service.mdx` | service generated fixture | `pnpm test:content-blocks` |
| F05 | QA owner | `fixtures/content-blocks.valid.json` | valid generated block fixture | `pnpm test:content-blocks` |
| F06 | QA owner | `fixtures/content-blocks.invalid.json` | invalid generated block fixture | `pnpm test:content-blocks` |
| F07 | Migration owner | `fixtures/projects-before-blocks.json` | archived migration evidence only | `pnpm test:project-articles` |
| F08 | Migration owner | `fixtures/services-before-blocks.json` | archived migration evidence only | `pnpm test:service-articles` |
| F09 | QA owner | `fixtures/publication.json` | publication-policy test input | `pnpm test:publication-policy` |

Fixtures are not publishable content. They must move to an isolated test
input package or be generated during tests. F07 and F08 are historical
snapshots and must remain available in the migration archive until task 087's
audit is accepted.

## Media and path references

The repository media inventory contains 26 bundled files: the three content
images (`src/assets/introduction/storefront-sign.webp`,
`src/assets/offers/neon-sign.webp`, `src/assets/offers/storefront.webp`, the
five `src/assets/services/*-demo.png` files, and the five matching SVG files.
It also references `public/images/map-placeholder.png`, the butterfly logo,
five guarantee SVGs, five ordering-process SVGs, and the offers information
stand SVG. The media owner must provide source, licence/rights, dimensions,
alt text, and a stable replacement key for each file before task 084.

`scripts/verify-external-assets.mjs` checks remote image fields in
`about-carousel.json`, `introduction.json`, `projects.json`, `reviews.json`,
`site.json`, and `offers.json`. Root-relative paths must become generated
asset keys; unresolved HTTP(S) URLs and protocol-relative URLs are denylisted
unless the external source and rights are recorded.

## Runtime readers, scripts, tests, and documentation

The direct runtime readers are `about.ts`, `about-carousel.ts`,
`business-solutions.ts`, `faq.ts`, `icons.ts`, `introduction.ts`, `legal.ts`,
`offers.ts`, `order-inquiry.ts`, `ordering-process.ts`, `pricing.ts`,
`production-and-guarantees.ts`, `project-catalog.ts`, `project-categories.ts`,
`projects.ts`, `reviews.ts`, `services.ts`, and `site.ts` in `src/content/`.
The related publication adapters (`*-publication.ts`),
`src/content.config.ts` (the three MDX glob loaders), and
`src/components/content/mdx-components.ts` are also migration touchpoints.
The migration must update these readers without changing their public
exports. The direct scripts are:

- `scripts/verify-content-invariants.mjs`;
- `scripts/verify-external-assets.mjs` and `scripts/verify-faq.mjs`;
- `scripts/test-content-block-fixtures.mjs`;
- `scripts/test-project-articles.mjs` and `scripts/test-service-articles.mjs`;
- `scripts/test-publication-policy.mjs`;
- `scripts/migrate-project-articles.mjs`;
- `scripts/verify-task-073-fixture.mjs`; and
- `scripts/fixtures/article-acceptance.astro` plus its integration helper.

The repository-wide search finds 50 Markdown files containing a
`data/content` path. The primary handoff documents are
`docs/site/content.md`,
`docs/site/articles.md`, `docs/site/service-articles.md`,
`docs/site/case-studies.md`, `docs/site/media.md`,
`docs/site/production-inputs.md`, `docs/site/metadata.md`,
`docs/development/content-contracts.md`, and
`docs/development/project-structure.md`. Other historical, planning,
backlog, and verification files are identified by:

```powershell
rg -l 'data/content' docs --glob '*.md'
```

Tasks 084–086 must rewrite active links to the generated catalog or the
external content handoff guide. Historical task records may retain the old
path as an audit fact, but must be labelled historical.

## Generated and local outputs

`.astro/` is Astro's local cache, `dist/` is the static build, and
`output/` contains verification artifacts. They are derived outputs and must
not be treated as content sources or copied to a replacement store. The
replacement pipeline must prove that a clean checkout with only generated
content can run `pnpm check`, `pnpm build`, `pnpm verify:content`, and the
article/publication tests. Existing ignored browser evidence under
`output/playwright/` is disposable after acceptance.

## Git reference inventory

The repository has no tags. The refs checked on 2026-10-14 are:

| Ref | Commit | `data/content/` paths |
| --- | --- | ---: |
| `adv-agency-landing-astro` | `c35c62c` | 60 |
| `adv-agency-site` | `51e2be6` | 0 |
| `adv-landing-core` | `987eec1` | 0 |
| `main` | `987eec1` | 0 |
| `origin/adv-agency-landing-astro` | `c74346f` | 17 |
| `origin/adv-agency-site` | `f2912eac` | 0 |
| `origin/adv-landing-core` | `6b3c9c9` | 0 |
| `origin/main` | `980395e` | 0 |

The local work branch has 60 current paths; the remote branch has an older
17-path snapshot. The history search identifies 30 commits containing the
path, from the initial content centralisation through the 2026-10-13 article
and content-block migrations. Before task 087, record the complete commit
list and object IDs in the audit report, then scan every ref with:

```powershell
git -c safe.directory=D:/Projects/adms log --all \
  --format='%H %ad %s' --date=iso -- data/content
git -c safe.directory=D:/Projects/adms for-each-ref --format='%(refname)' |
  ForEach-Object { git -c safe.directory=D:/Projects/adms ls-tree -r \
  --name-only $_ -- data/content }
```

No branch or tag may be rewritten until the repository owner approves the
affected refs and a mirror has been made. The inventory itself contains no
content values, credentials, personal data, or unresolved external URLs.

## Denylist and migration gates

The following values must never enter templates, generated fixtures, or the
external handoff package: credentials, API keys, access tokens, private
contact details, unpublished personal data, absolute workstation paths,
`data/content/` paths after cutover, protocol-relative URLs, URLs with user
info, unsupported URL schemes, and unapproved claims or image sources.

Task 084 is ready to start only after every row above has an owner and a
replacement key. Task 085 must make the clean generated build pass all listed
tests. Task 086 must add a denylist scan and update all documentation links.
Task 087 may then remove `data/content/` from the index and rewrite only the
explicitly approved refs. It must preserve the 60 working-tree files byte for
byte, add an ignore rule for the local data, and retain the original and final
ref audit hashes.
