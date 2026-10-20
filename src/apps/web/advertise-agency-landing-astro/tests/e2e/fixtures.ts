// Shared browser fixtures keep end-to-end runs isolated from external hosts.
import {
  type BrowserContext,
  expect as baseExpect,
  test as base,
} from '@playwright/test';

const localOrigin = 'http://127.0.0.1:4327';

type E2eFixtures = {
  blockExternalRequests: void;
};

/** Stub Yandex's widget locally and reject other external requests. */
export async function blockExternalRequests(
  context: BrowserContext,
): Promise<void> {
  await context.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    const isHttp = url.protocol === 'http:' || url.protocol === 'https:';

    if (!isHttp || url.origin === localOrigin) {
      await route.continue();
      return;
    }

    if (
      url.origin === 'https://smartcaptcha.cloud.yandex.ru' &&
      url.pathname === '/captcha.js'
    ) {
      await route.fulfill({
        contentType: 'application/javascript',
        body: `(() => {
          let sequence = 0;
          let callback;
          window.smartCaptcha = {
            render(_container, options) {
              callback = options.callback;
              callback('synthetic-yandex-token-' + ++sequence);
              return 'e2e-widget';
            },
            reset() {
              callback('synthetic-yandex-token-' + ++sequence);
            },
            subscribe() {
              return () => {};
            }
          };
          const ready = new URL(document.currentScript.src)
            .searchParams.get('onload');
          window[ready]();
        })();`,
      });
      return;
    }

    await route.abort();
  });
}

export const test = base.extend<E2eFixtures>({
  blockExternalRequests: [
    async ({ context }, use) => {
      await blockExternalRequests(context);
      await use();
    },
    { auto: true },
  ],
});

export const expect = baseExpect;
