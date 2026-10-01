# Page metadata and production URL

[Documentation index](../../README.md)

`src/layouts/Layout.astro` adds the shared agency name from `data/content/site.json` to page titles and renders page descriptions, Open Graph metadata, and Twitter summary metadata. The homepage uses the configured site title as its visually hidden main heading. Project descriptions come from project content; legal descriptions come from the `description` field in `data/content/legal/privacy-policy.json` and `data/content/legal/terms-of-use.json`.

The production domain is not recorded in the repository. Email domains are not confirmation of a website address. After the agency confirms its production URL, set Astro's `site` option in `astro.config.mjs` and rebuild. The layout uses `Astro.site` and the generated page pathname for canonical links and `og:url`; both are omitted until that option is configured, so local development URLs are never used as production metadata. See the [Astro site reference](https://docs.astro.build/en/reference/configuration-reference/#site).

Social images are omitted because the repository only contains placeholder project media and no confirmed sharing asset. Add a real agency sharing asset before introducing image metadata.
