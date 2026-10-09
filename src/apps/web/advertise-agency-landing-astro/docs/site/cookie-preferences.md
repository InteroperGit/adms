# Cookie preference banner

[Documentation index](../../README.md)

`src/components/CookieBanner.astro` uses a small browser script to save either `accepted` or `declined` under the `cookieConsent` localStorage key. Either choice hides the banner and persists across page loads when storage is available. If storage is blocked or a write fails, visitors can still dismiss it for the current page; it may reappear on the next page load.

This preference only controls the banner. It does not gate the external map or other resources. Changing consent wording or resource loading requires a separate product requirement.

## Layout and reachability

The banner is a nonmodal `aside`, with wrapping 44px minimum-height choices and left-aligned text. Its height is limited to half the dynamic viewport; tall text scrolls inside the banner. A ResizeObserver reserves the actual visible border-box height as body bottom padding, allowing the last footer action to scroll above the fixed banner. Dismissal clears the reserved space even when persistence fails. There is no focus trap or automatic focus move.

Existing wording does not establish agency approval. Agency review is needed
for continued-use agreement, actual inquiry fields and processing, and the
Yandex.Metrika references in the legal text. The current site has two inquiry
UIs with delivery disabled and no analytics integration documented here;
the preference does not gate resource loading. Layout changes do not establish
a consent policy. See the internal [production input register](production-inputs.md).
