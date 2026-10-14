# 085 — Initialize base content for a new site

## Goal

Keep the existing runtime architecture unchanged: Astro and `src/content/*`
continue reading `data/content/` directly. Task 85 defines how a new site
starts when that directory is empty. The task does not select or connect an
external content provider and does not migrate the existing ready data.

## Decisions

- `data/content/` is the canonical build-time content directory.
- Existing files in `data/content/` are ready data and must remain physically
  present and unedited unless the owner explicitly replaces them.
- There is no external copy or automatic synchronization in this task.
- `data/templates/` contains base JSON placeholders for a new site.
- The task 84 generator creates JSON starter data from those templates.
- The generator copies one project starter MDX and one service starter MDX,
  but deliberately does not validate their article content.
- Runtime imports, Astro collections, publication gates, and routes remain
  unchanged.

## Implementation

1. Keep `src/content/*` and `src/content.config.ts` pointed at
   `data/content/`.
2. Treat `data/templates/manifest.json` as the base-data manifest. It lists
   the complete JSON structure plus exactly one project and one service
   starter article.
3. Keep `scripts/generate-content-catalog.mjs` as a deterministic starter
   generator. It reads placeholder JSON, normalizes media paths, rejects
   secrets and unsafe values, and atomically writes the requested output.
4. Allow the generator to write `data/content/` only for explicit new-site
   initialization. It must never delete or overwrite a non-empty existing
   content directory implicitly.
5. Add a clear empty-directory guard and a `--force` option for deliberate
   initialization. Without `--force`, an existing output containing files is
   rejected with an actionable error.
6. Keep article authoring separate from initialization. The two copied MDX
   files are starter placeholders only; additional articles are added manually
   under `data/content/articles/` and checked by the existing article tests.

## Acceptance

- [x] A new empty `data/content/` can receive the generated base JSON set.
- [x] A non-empty `data/content/` is never overwritten without `--force`.
- [x] Running the generator twice with the same templates is deterministic.
- [x] The manifest contains the complete JSON set and one starter file per
      article kind (project and service).
- [x] Generator copies starter MDX verbatim and does not validate its article
      content.
- [x] Existing runtime pages and `src/content/*` exports remain unchanged.
- [x] Existing ready `data/content/` files remain byte-for-byte unchanged in
      the working directory during implementation and verification.

## Verification

Run the generator fixture tests, content invariants, `astro check`, build, and
the existing service, project, content-block, and publication tests. Before
and after all checks, compare the file list, sizes, and hashes of the existing
`data/content/` directory. A changed or missing ready-data file is a failure.

## Out of scope

Selecting a CMS, private repository, object store, API, scheduled sync, or
runtime external loader belongs to a future task after the content ownership
and storage model are explicitly agreed.
