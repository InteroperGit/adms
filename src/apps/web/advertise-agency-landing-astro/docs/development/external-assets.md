# External asset verification

The static build references remote demonstration images, a Yandex map widget,
and Font Awesome CSS. Run the verifier after every production build and before
deployment:

```powershell
pnpm build
pnpm verify:external
```

`scripts/verify-external-assets.mjs` collects HTTPS URLs from configured source
content and generated `dist/` files. It follows redirects, applies a timeout,
checks the HTTP status, and checks the response content type for known media,
map, and stylesheet hosts. A failed check exits nonzero so deployment can stop
before publishing broken references.

The check cannot establish image licensing, permission to publish a portrait,
provider terms, uptime guarantees, cache policy, or whether demonstration media
is acceptable as production evidence. Review those items with the agency and
replace remote placeholders with approved local assets before launch. Keep
third-party origins documented when they remain necessary.
