# Deployment and asset assumptions

[Documentation index](../../README.md)

`astro.config.mjs` sets `output: 'static'`. Deploy the contents of `dist/` to a static host after verification; no server adapter or application runtime is configured. The host must serve generated directory index pages such as `/projects/1/`. Root-relative asset and navigation URLs currently assume deployment at the domain root; deployment under a path prefix requires a separate URL/base review. A hosting provider and automated deployment workflow have not been selected in this application.

The map loads from Yandex, icons load from the Font Awesome CDN, and review media currently include remote placeholders; projects use text-only demos. Network availability affects those resources. Replace placeholder media with approved agency assets under task 009. The SVG favicon still contains Astro starter branding; no approved agency favicon is available, so the existing favicon files and layout reference are retained until one is supplied. Unreferenced starter illustrations `src/assets/astro.svg` and `src/assets/background.svg` were removed.

The [project and review media guide](media.md) lists the six missing approved photographs/portraits and documents replacement and image verification. Remote placeholders remain until the agency supplies these assets.

Run `pnpm build` followed by `pnpm verify:external` before deployment. The
verifier checks every remote URL found in configured content and generated
output for HTTPS response health and an expected image, HTML, or CSS content
type. It cannot verify publication rights, provider terms, or long-term
availability. Current demonstration Picsum URLs return HTTP 403 in the
deployment check and must be replaced or approved before release.

See [Astro documentation](https://docs.astro.build), the task-specific guides in [AGENTS.md](../../AGENTS.md), and the [documentation index](../../README.md).
