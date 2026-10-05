# Integrated design verification

[Documentation index](../../README.md)

Task 016 reviewed production static output on 2026-10-05 using Chrome 154.0.8037.95 on Windows. The completed design and Russian content are preserved; no deployment, framework, analytics or new media was introduced.

## Route and layout matrix

Each cell covers 320/375/768/1440 CSS pixels. Normal checks use 16px root text and 900px viewport height; separate enlarged checks use 32px root text and 500px height. All 96 combinations passed document overflow, relevant visible header/main/section/article/footer/banner bounds, one h1, description metadata and loaded decorative butterfly checks.

| Route | Light normal | Dark normal | Light 200% text | Dark 200% text |
| --- | --- | --- | --- | --- |
| `/` | Pass | Pass | Pass | Pass |
| `/projects/1` | Pass | Pass | Pass | Pass |
| `/projects/2` | Pass | Pass | Pass | Pass |
| `/projects/3` | Pass | Pass | Pass | Pass |
| `/privacy-policy` | Pass | Pass | Pass | Pass |
| `/terms-of-use` | Pass | Pass | Pass | Pass |

Root-text enlargement is not native browser zoom. Actual 200% zoom remains unverified: manually set Chrome zoom to 200% on all routes, open settings/navigation and scroll the last footer action above the cookie banner. Check short landscape too; DPR or a narrow viewport does not prove native zoom.

Screenshots cover homepage/project 1/privacy at 320/1440 in both themes, open settings, enlarged text and blocked icons. Representative mobile Dark homepage and desktop Light legal screenshots were visually inspected for wrapping, frames, contact/footer alignment and the butterfly. Deliberately failed photos display truthful demonstration alt text. Full-page capture does not force every lazy image to load.

## Shared behavior and fix

The production theme regression passed 65 assertions: keyboard opening/checked-radio focus, native arrows, visible focus, Escape return, Tab/Shift+Tab boundaries, outside dismissal, modal/settings exclusivity, preserved scroll, all-route/reload persistence, System/OS changes, explicit overrides, invalid preference, cross-tab change/removal/clear, throwing reads, successful reads with failing writes, in-memory selection, no-JS Dark fallback and sampled initial frames for saved Light/Dark against opposite OS appearances. Panel/44px targets fit all four widths, resizing, 568×200 short viewport and enlarged text. Reduced motion removes header animation; auto-hide resumes after closing and stays visible for settings without keyboard focus.

Seventeen cookie assertions passed for accepted/declined reload persistence, read/write failures, dismissal/body-space cleanup, settings hit-testing above an enlarged banner, contact/legal destinations, keyboard footer-to-legal navigation and no cookie focus trap. Nine supplemental checks cover the menu icon with blocked external icon CSS, both modal Tab boundaries, Escape return, same-page destination focus, direct project hash clearance and long unbroken homepage/project/legal fixtures at 320px with doubled text. Twelve final assertions verify the last footer contact action scrolls above the banner at 320/1440px in both themes with normal/doubled text, all three Russian accessible radio names and the hidden homepage h1. Fixtures were discarded by navigation; JSON text was unchanged.

The initial fixed 30ms focus-boundary wait flaked; waiting for the actual panel hidden state passed without source changes. Checks use DOM readiness and bounded feature waits rather than external network-idle.

The menu opener depended solely on Font Awesome. Its essential hamburger is now a local 24px SVG; blocked stylesheet verification passed. Gear/theme SVGs, butterfly, textual close button and link names remain available. Decorative contact icons may disappear without hiding addresses/actions; the icon system was not replaced.

## Actual contrast

Hover measurements sample final computed colors after transitions. Canvas converts CSS `oklab()` values to sRGB for luminance. Text targets are 4.5:1; essential icon/selection/focus targets are 3:1.

| State | Light | Dark |
| --- | ---: | ---: |
| Selected theme icon/inset border on selected surface | 5.55 | 7.02 |
| Unselected theme and gear hover icons | 21.00 | 7.96 |
| Contact hover text on panel | 6.06 | 8.04 |
| Footer legal hover text | 5.55 | 7.02 |
| Primary opening/cookie hover text | 7.06 | 6.56 |
| Secondary opening hover text | 6.06 | 7.96 |
| Contact focus outline on panel | 6.06 | 8.04 |
| Radio outer focus outline against settings panel | 6.06 | 8.04 |

Selected inset borders and outer keyboard outlines have distinct shapes. Contact/footer hover thickens underlines while retaining semantic primary; decorative brand orange is not substituted. Quiet dividers/decorative media are not essential-control assertions. Default/body/muted measurements remain in [design system](design-system.md) and [themes](themes.md); every arbitrary CSS state was not exhaustively audited.

## Map variants and production assets

Original `mapEnabled: false` built a decorative placeholder, no iframe and zero Yandex requests after scrolling contacts. A temporary true build produced one titled lazy iframe and a widget request, no fallback; the request was intentionally aborted to avoid dependence on service availability. Original false configuration was restored and production rebuilt. Third-party availability/colors are outside these assertions.

Production homepage JavaScript is 6,411 UTF-8 bytes inline, with no external JS or framework runtime. Shared generated CSS is 96,193 bytes uncompressed; butterfly SVG is 658 bytes. Local server compression is disabled, so these are body sizes, not deployed compressed guarantees. In one run external Font Awesome CSS decoded to 73,890 bytes and transferred 18,483 bytes. Its timing/fonts vary externally. Project/review images have intrinsic dimensions/lazy loading; detail images are eager; map artwork has dimensions/lazy loading.

A fresh 375×900 production context held four remote image requests then aborted them. Reserved project/review dimensions were unchanged; sampled layout-shift sum was 0. This short controlled run is not field CLS or successful-photo crop assessment. No CPU/network throttling was imposed. Lighthouse CLI was not installed and was not run; no score is claimed. Repeat with approved media and deployment compression/CSP/network conditions.

## Reproduction and limits

Run `pnpm check` and `pnpm build`, serve `dist/` on loopback port 4322, then use Playwright CLI/Chrome. Ignored local evidence lives in `output/playwright/task-016/`: `matrix.js`, `theme.js`, `cookie.js`, `extra.js`, `performance.js`, `final.js`, `server.mjs` and screenshots. The enabled-map check reuses `output/playwright/task-015/map-enabled.js`. Example: `npx --yes --package @playwright/cli playwright-cli -s=task016 run-code --filename output/playwright/task-016/theme.js`. These helpers are local evidence, not CI; the durable matrix/methods remain versioned here.

Native zoom, physical touch, screen-reader speech, Safari/Firefox, deployment CSP and complete third-party availability remain unverified. First-animation-frame theme samples support initializer timing without a universal filmstrip guarantee. No restrictive CSP is configured locally. Approved project/review media, production domain and agency favicon remain pending; the orange/blue butterfly is implemented. Agency review of consent wording remains as described in [cookie preferences](cookie-preferences.md).

No known critical reading/navigation/theme/overlay regression remains in tested scope. This conclusion is limited to the stated environment and does not replace unavailable assistive-technology/browser checks.

Final checks: Astro check passed for 73 files with zero errors/warnings/hints; the restored-config build generated six routes; Git diff whitespace check passed. Owned Chrome/static-server helpers were closed; existing development preview was not stopped.
