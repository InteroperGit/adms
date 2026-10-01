# Deployment and asset assumptions

[Documentation index](../../README.md)

`astro.config.mjs` sets `output: 'static'`. Deploy the contents of `dist/` to a static host after verification; no server adapter or application runtime is configured. The host must serve generated directory index pages such as `/projects/1/`. Root-relative asset and navigation URLs currently assume deployment at the domain root; deployment under a path prefix requires a separate URL/base review. A hosting provider and automated deployment workflow have not been selected in this application.

The map loads from Yandex, icons load from the Font Awesome CDN, and project/review media currently include remote placeholders. Network availability affects those resources. Replace placeholder media with approved agency assets under task 009. The SVG favicon still contains Astro starter branding; no approved agency favicon is available, so the existing favicon files and layout reference are retained until one is supplied. Unreferenced starter illustrations `src/assets/astro.svg` and `src/assets/background.svg` were removed.

See [Astro documentation](https://docs.astro.build), the task-specific guides in [AGENTS.md](../../AGENTS.md), and the [documentation index](../../README.md).
