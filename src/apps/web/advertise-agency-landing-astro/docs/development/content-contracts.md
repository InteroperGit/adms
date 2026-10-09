# Content contract checks

Structured content is parsed by the typed Zod wrappers in `src/content` and
`src/validation`. Shared duplicate-ID handling now lives in
`src/validation/shared.ts`, while the standalone invariant check gives editors
fast feedback before Astro performs the full build.

Run both checks after content edits:

```powershell
pnpm verify:content
pnpm check
```

The invariant check scans JSON content for duplicate IDs, unsafe URL schemes,
protocol-relative URLs, URL credentials, control characters, and non-positive
image dimensions. The Zod schemas remain authoritative for cross-field rules,
publication approval, link destinations, consent, and defaults.

FAQ content lives in `data/content/faq.json`, with parsed types in
`src/types/faq.ts`, strict validation in `src/validation/faq.ts`, and the
loader in `src/content/faq.ts`. Source answer lines become one complete
answer string. Section and answer approvals each require an evidence source
and named approver. Consumers use `getPublishedFaqItems` from
`src/content/faq-publication.ts` and omit empty sections. All current FAQ
copy remains draft. Explicit `demoMode` now displays the supplied answers
with `demoNotice`, using `getVisibleFaqItems`; turning demo mode off restores
approval-only visibility. Approval records remain unchanged.
Run `node scripts/verify-faq.mjs` to exercise the loader,
schema, original copy, and approval boundaries before UI integration.
