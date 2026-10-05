# Project photographs and review portraits

[Documentation index](../../README.md)

No approved project photographs or review portraits are present in this application or the repository's tracked image inventory. Project images remain Picsum placeholders; review portraits remain Pravatar placeholders. These images do not establish what the agency produced or who wrote a review. Their alternative text explicitly identifies them as demonstration media.

## Assets the agency must supply

| Content record | Required approved asset |
| --- | --- |
| Project 1 — Световой короб для торгового центра / ООО «Гранд Плаза» | Photograph of the actual installed lightbox, suitable for a wide card crop and a project detail page |
| Project 2 — Объёмные световые буквы для фасада / Сеть кофеен «Бинго» | Photograph of the actual installed facade lettering, suitable for a wide card crop and a project detail page |
| Project 3 — Неоновая вывеска для барбершопа / Barba Bros | Photograph of the actual installed neon sign, suitable for a wide card crop and a project detail page |
| Review 1 — Игорь Морозов / ООО «Гранд Плаза» | Approved portrait of the actual review author, suitable for a square/circular crop |
| Review 2 — Алексей Кузнецов / Сеть кофеен «Бинго» | Approved portrait of the actual review author, suitable for a square/circular crop |
| Review 3 — Дмитрий Соколов / Barba Bros | Approved portrait of the actual review author, suitable for a square/circular crop |

The names above identify existing JSON records, not verified customer identities. Confirm each project's client, descriptions, result claims, and each review's identity and quoted text before publication. For each image, provide permission to publish, its correct record association, actual pixel dimensions, and a short description of the visible subject. If a reviewer does not provide a portrait, agree on an anonymous decorative avatar rather than attaching an unrelated person's photograph.

## Replacing the placeholders

Keep record IDs stable. Update `image`, `imageAlt`, `imageWidth`, and `imageHeight` in `data/content/projects.json`; update `avatar`, `avatarAlt`, `avatarWidth`, and `avatarHeight` in `data/content/reviews.json`. Dimensions must be positive integers matching the supplied file. Replace demonstration alternative text with a concise, accurate description of the photograph; do not repeat marketing claims. Root-relative public paths and HTTP(S) URLs are supported.

For a simple local handoff, place approved files under `public/images/projects/` and `public/images/reviews/` and reference them as `/images/...`. Public files are served as supplied: compress and resize them before publishing. Prefer project originals at least 1200 pixels wide and square portrait crops at least 150 pixels wide; these are delivery recommendations, not validation requirements. Check framing on desktop and mobile: project cards reserve a 3:2 frame and crop with `object-fit: cover`; detail images use `object-fit: contain` inside a 3:2 frame up to 56rem wide so the full photograph remains visible. Portraits retain a nonshrinking 48 × 48 pixel circle. Review future image ratios before replacing the current 600 × 400 placeholders.

The current remote placeholders use plain `<img>` elements with explicit intrinsic dimensions, responsive CSS, lazy loading on cards, and eager loading on project detail pages. Astro optimization and responsive `srcset` variants are deferred until approved source media is available, avoiding build-time downloads of disposable placeholders. For durable local originals, consider `src/assets/` and Astro `<Image>`/`<Picture>` with an explicit mapping from JSON records to imported assets. See the [Astro images guide](https://docs.astro.build/en/guides/images/).

Run `pnpm check` and `pnpm build` after replacing images. Verify the local files or remote URLs load, confirm alternative text and dimensions, and review card/detail crops at mobile and desktop widths. Builds validate metadata but do not confirm image existence or publication approval. The agency favicon is tracked separately in [deployment and assets](deployment-and-assets.md).

Task 014 held remote image requests and then aborted them in Chrome: project card frames, detail frame and portrait dimensions remained unchanged. This verifies reserved layout space, not service availability or approval of the demonstration content. Pravatar had an unrelated connection reset during baseline capture; remaining image failures during the controlled failure check were intentional. Current client identities, result claims and testimonial copy were preserved without adding validation badges, ratings or success indicators.
