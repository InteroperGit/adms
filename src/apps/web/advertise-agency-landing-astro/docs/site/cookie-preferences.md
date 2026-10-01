# Cookie preference banner

[Documentation index](../../README.md)

`src/components/CookieBanner.astro` uses a small browser script to save either `accepted` or `declined` under the `cookieConsent` localStorage key. Either choice hides the banner and persists across page loads when storage is available. If storage is blocked or a write fails, visitors can still dismiss it for the current page; it may reappear on the next page load.

This preference only controls the banner. It does not gate the external map or other resources. Changing consent wording or resource loading requires a separate product requirement.
