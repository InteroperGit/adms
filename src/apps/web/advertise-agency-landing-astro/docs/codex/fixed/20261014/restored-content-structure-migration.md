# Restored content structure migration — 2026-10-14

The owner restored today's authored content backup and requested structural
migration only. No template data or generated starter values were used.

Before editing, all 54 restored files were archived to
`output/content-recovery/content-before-structure-migration-20261014.zip`.
The archive remains local and ignored. The preservation audit records the
original SHA-256 hashes and confirms no files were added or removed.

## Changes

- Extracted 325 embedded paragraph/list headings and table/chart titles in
  27 project MDX articles into standalone level-2 HeadingBlocks.
- Extracted eight headings in the two visual JSON fixtures the same way.
- Kept existing block IDs on the original content, preserving footnote
  targets and anchors; new headings receive collision-checked derived IDs.
- Copied status/provenance to extracted headings without changing approval.
- Kept Markdown, frontmatter and untouched MDX payload bytes verbatim.
- Updated the private paragraph fixture loader to handle standalone headings.
- Added `scripts/migrate-content-headings.mjs`: validated dry run by default;
  writes only with `--write`, after validating all pending changes.

## Verification

- All 32 authored MDX articles compile and their block streams pass the
  production schema. Each migrated stream equals the old stream with only
  the documented heading extraction. All JSON block streams also validate.
- Original block payloads reconstruct exactly after reinserting their
  extracted fields. Metadata, text, numbers, media, links, IDs and statuses
  remain unchanged. A second migration run reports zero changes.
- Backup comparison: 29 files migrated, 25 files byte-identical; unchanged
  files include every production JSON configuration and all service MDX.
- `pnpm build` passes: 38 pages, all 27 projects and all five services.
- Generated HTML for all projects preserves heading order and block anchors
  and contains one h1 per page.
- Content invariants and code style pass. Homepage and sampled project and
  service routes return HTTP 200 from the existing development server.
- `pnpm check` retains three errors caused by absent restored test fixtures:
  `article-cases.json`, `publication.json` and the resulting implicit type.
  The missing fixture/article directory also produces a loader warning.
  No substitute fixtures were generated. Content regression suites needing
  those historical fixtures remain unavailable.

Evidence: `output/content-recovery/preservation-audit.json`, the backup ZIP,
and `output/content-recovery/verify-built.mjs`.

The content directory remains ignored by Git. No commit or deployment.
