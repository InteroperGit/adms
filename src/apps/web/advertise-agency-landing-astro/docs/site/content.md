# Content sources and validation

[Documentation index](../../README.md)

Edit content in `data/content/*.json` (legal documents are in `data/content/legal/`). These JSON files remain the source of truth; do not duplicate their text in components or TypeScript objects. The small settings documents keep their typed exports in `src/content/`.

Projects and reviews use direct JSON imports because each dataset is small and their existing synchronous API and array order are sufficient. Astro content collections are unnecessary here; consider them if the site grows to need collection queries or Markdown entries. See the [Astro content collections guide](https://docs.astro.build/en/guides/content-collections/).

`src/content/schemas.ts` validates project and review arrays when their exports are imported, including during `pnpm build`. Their `Project` and `Review` types are inferred from these schemas instead of maintained as separate interfaces. Validation rejects missing, unknown, incorrectly typed, or blank fields, invalid media sources, and non-positive, fractional, or duplicate IDs. Errors name the source JSON file and field path (for example, `0.title`). Media sources can be HTTP(S) URLs or root-relative paths to public assets; validation does not check whether those resources exist.

Keep project IDs stable: each numeric ID defines `/projects/<id>`, including the existing `/projects/1`, `/projects/2`, and `/projects/3` routes. Array order determines card order. After editing JSON, run `pnpm build` to validate the content and generate the pages.
