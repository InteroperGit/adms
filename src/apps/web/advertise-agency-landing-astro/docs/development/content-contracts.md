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
