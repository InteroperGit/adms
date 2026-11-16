import { type Page } from "@playwright/test";

interface FillInquiryOptions {
  email?: string;
  message?: string;
}

export async function fillInquiry(
  page: Page,
  {
    email = "visitor@example.test",
    message = "Synthetic inquiry",
  }: FillInquiryOptions = {},
): Promise<void> {
  const form = page.locator("#order-inquiry form");
  await form.locator('[name="name"]').fill("Synthetic visitor");
  await form.locator('[name="email"]').fill(email);
  await form.locator('[name="message"]').fill(message);
  await form.locator('[name="consent"]').check();
}

export async function setMainInquiryEnabled(
  page: Page,
  enabled: boolean,
): Promise<void> {
  await page.route("**/", async (route) => {
    const response = await route.fetch();
    const html = await response.text();
    const marker =
      /(<form\b[^>]*\bdata-inquiry\b[^>]*\bdata-enabled=")(?:true|false)(")/;
    const replacement = enabled ? "$1true$2" : "$1false$2";
    await route.fulfill({
      response,
      body: html.replace(marker, replacement),
    });
  });
}
