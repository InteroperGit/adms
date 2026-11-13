# Release and rollback

## Runtime data and environment

Runtime content is supplied outside Git. Initialize a new catalogue only into an
empty destination with
`node scripts/generate-content-catalog.mjs --source data/templates --output <content-directory>`.
Before deliberate replacement/`--force`, retain a verified backup and SHA-256
manifest. Never overwrite deployment data to run tests. The CI-only
`scripts/prepare-ci-content.mjs` requires `CI=true` and refuses an existing
runtime directory.

Use package engine requirements and a lockfile installation; keep CI and hosting
tool versions compatible. Supply credentials through the appropriate runtime
secret configuration, never authored content, fixtures or browser bundles.
Public build variables are public.

## Release acceptance

1. Complete [verification](verification.md). Deploy only the verified output and
   its matching content/configuration. This application builds static `dist/`; a
   static host alone does not provide an inquiry backend.
2. Confirm production business/legal copy, media rights and approvals under
   [content](content.md). Replace test/starter assets before production; passing
   technical checks cannot grant approval.
3. Set confirmed HTTPS `PUBLIC_SITE_URL` to an origin without
   path/query/fragment before build and `pnpm verify:release`. Without it, keep
   production canonicals absent and crawlers blocked. Draft/demo indexing
   restrictions still apply. Do not publish acceptance fixtures, test origins or
   unapproved social assets.
4. Run `pnpm verify:external` after build. Check remote media/map/CSS response
   status/type and redirects, then verify required origins and CSP on the actual
   host. Availability checks do not prove licensing, provider terms or uptime.
   Inline pre-paint code needs narrow CSP authorization, not blanket inline
   access.
5. Confirm directory-index routing and root-relative URLs on the host. A
   base-path deployment requires a separate URL review. Verify deployed links,
   metadata, assets, fallbacks and relevant accessibility states. Local results
   cannot establish host compression, field performance or third-party
   reliability.
6. Activate inquiry delivery only after the separate security, consent and
   actual receipt gates in [inquiries](inquiries.md).

## Rollback

Retain the previous verified build, matching catalogue/configuration and hash
manifest. Restore the build and content together, then repeat applicable checks.
Never recover runtime content by committing it to Git or forcing regeneration
without a verified backup. For submissions also stop backend intake; accepted
queued items follow the approved drain/retention/deletion procedure. Keep direct
contact fallbacks usable. Record release identity, checks and rollback outcome
without secrets or personal payloads.
