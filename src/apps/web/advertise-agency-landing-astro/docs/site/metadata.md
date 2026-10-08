# Page metadata and production URL

[Documentation index](../../README.md)

`src/layouts/Layout.astro` adds the shared agency name from `data/content/site.json` to page titles and renders page descriptions, Open Graph metadata, and Twitter summary metadata. The homepage uses the configured site title as its visually hidden main heading. Project descriptions come from project content; legal descriptions come from the `description` field in `data/content/legal/privacy-policy.json` and `data/content/legal/terms-of-use.json`.

The production domain is supplied at release time through `PUBLIC_SITE_URL`.
It must be the confirmed HTTPS origin with no path, query, or fragment. Astro
uses it for canonical links, Open Graph URLs, `robots.txt`, and `sitemap.xml`.
Local builds without the variable emit no production canonical URLs and
disallow crawlers, preventing accidental indexing of local or preview hosts.
In PowerShell, set the confirmed origin before both commands:

```powershell
$env:PUBLIC_SITE_URL = 'https://agency.example'
pnpm build
pnpm verify:release
```

Replace the example origin before release.

Social images are omitted because the repository only contains placeholder project media and no confirmed sharing asset. Add a real agency sharing asset before introducing image metadata.
