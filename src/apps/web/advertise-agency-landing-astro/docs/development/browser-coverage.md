# Browser coverage

The repository keeps a repeatable smoke flow for the highest-risk browser
interactions in `browser-coverage.js`. It uses the Playwright CLI skill rather
than adding a second test framework or a browser runtime dependency.

Build and start the local server using the project development rules:

```powershell
pnpm build
pnpm astro dev --background
```

Run the coverage file with Playwright CLI:

```powershell
npx --yes --package @playwright/cli playwright-cli `
  open http://localhost:4321/
npx --yes --package @playwright/cli playwright-cli `
  run-code --filename docs/development/browser-coverage.js
```

The flow covers cookie persistence, theme persistence, mobile-menu dismissal,
reduced-motion carousel behavior, and the disabled inquiry fallback. Extend it
with an intercepted endpoint fixture before enabling inquiry delivery; that
fixture must assert validation, timeout, rejection, duplicate request IDs,
confirmed receipts, and reset only after acceptance.
