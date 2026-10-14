# Service article authoring

Service catalog settings stay in `data/content/services.json`. Each `article`
reference is `{ "format": "mdx", "entry": "<service-id>" }`; the entry must
match its service id and `data/content/articles/services/<service-id>.mdx`.
Keep existing service ids and hrefs stable. Catalog images retain their full
source, publication permission, approval and desktop/mobile focal metadata.

The `serviceArticles` Astro collection validates strict frontmatter: `title`,
`description` and boolean `approved`. Unknown fields fail validation. Copy and
media approval must never be inferred from migration. All five migrated
articles remain unapproved demos with their original noindex and sitemap gates.

Write ordinary plain-text paragraphs, standalone headings at the required
HTML level, and flat ordered or unordered lists. A heading is its own ordered
content block and labels the blocks that follow it;
consecutive paragraphs belong to the same section. Nested/task lists, inline
formatting, links, imports, exports, expressions and arbitrary HTML/JSX are
currently rejected rather than silently stripped. Extend the typed contract
and compiler deliberately when adding richer text; a heading alone is invalid.

For other block types use a self-closing allowlisted component with one
JSON-valued string attribute. For example:

```mdx
<OrderFormBlock block='{
  "type": "order-form",
  "id": "service-order",
  "formId": "general-inquiry",
  "context": "service",
  "category": "neon"
}' />
```

The allowlist in `src/content/mdx-blocks.mjs` covers `ParagraphBlock`,
`OrderedListBlock`, `UnorderedListBlock`, `TableBlock`, `ChartBlock`,
`ImageBlock`, `ImageGalleryBlock`, `OrderFormBlock`, `QuoteBlock` and
`FootnoteBlock`. Component name and JSON `type` must match. Use `&apos;`
inside a single-quoted attribute when a JSON string includes an apostrophe.
Never pass JavaScript expressions or spread props.

The compiler normalizes body nodes into one ordered stream exposed by
`render(entry).remarkPluginFrontmatter.content`. The loader validates that
stream using the same production Zod schema as JSON articles. Normalized MDX
renders with `mdxContentComponents`, mapping `ContentBlocks` to the shared
renderer. Service and project pages consume the validated stream directly
through `ContentBlocks`, with shared responsive media and page-owned form gates.
Task 080 verified rendered MDX/JSON parity. See [article authoring](articles.md).

An image block preserves `src`, `alt`, dimensions and caption; `provenance.source`
records the original supplier and `provenance.rights` records publication
permission. Approver/date are recorded only when supplied and must be a pair.
Migration does not manufacture them. Catalog image approval and article/copy
approval still control publication; full block-level status/rights policy
remains in 081. Current demo captions must be reviewed when replacing visuals
with approved agency work.

Only `service/svetovye-bukvy/led-letters` selects the specialized service form.
Its page must pass existing publication checks; demos use general inquiry.
Other categories use `general-inquiry`. Context/category must match the
containing service. Keep form ids, anchors and inquiry payload APIs stable.

JSON fallback is explicit: set `format: "json"`, a nonblank `reason`, and
`title`, `description`, `approved`, `content`. Record the failed MDX check and
editorial decision in `reason`. An invalid/missing MDX file fails the build;
the loader never silently falls back. No current service needs JSON fallback.
Legacy `lead`, `sections`, `inquiry` and unknown fields are rejected in both
frontmatter and public article records.

Run `pnpm check`, `pnpm build`, `pnpm verify:content` and
`pnpm test:service-articles`. The last command requires the current build and
compiles all MDX, compares against the historical fixture, tests real schemas,
publication gates and built routes/assets. The historical fixture is regression
evidence, not an authoring source. Browser acceptance remains in task 082.
