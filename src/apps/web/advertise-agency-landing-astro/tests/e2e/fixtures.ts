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

/** Reject external requests that could make E2E tests nondeterministic. */
export async function blockExternalRequests(
  context: BrowserContext,
): Promise<void> {
  await context.route('**/*', (route) => {
    const url = new URL(route.request().url());
    const isHttp = url.protocol === 'http:' || url.protocol === 'https:';

    if (!isHttp || url.origin === localOrigin) {
      return route.continue();
    }

    return route.abort();
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
