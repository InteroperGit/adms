// Exercise the published fixture's lettering form on its service route.
import { type Locator, type Page } from "@playwright/test";
import { expect, test } from "./fixtures";

type InquiryPayload = Record<string, unknown>;

async function captureInquiry(
  page: Page,
  status = 200,
): Promise<InquiryPayload[]> {
  const requests: InquiryPayload[] = [];
  await page.route("http://127.0.0.1:4327/__fixture/inquiry", async (route) => {
    requests.push(route.request().postDataJSON() as InquiryPayload);
    await route.fulfill({
      status,
      json:
        status === 200
          ? { accepted: true, receiptId: "led-letters-receipt" }
          : { accepted: false },
    });
  });
  return requests;
}

async function openForm(page: Page) {
  await page.goto("/services/svetovye-bukvy/");
  const form = page.locator("form[data-led-letters]");
  await expect(form).toBeVisible();
  return form;
}

async function fillContact(form: Locator) {
  await form.locator('[name="name"]').fill("Synthetic visitor");
  await form.locator('[name="phone"]').fill("+79990000000");
  await form.locator('[name="consent"]').check();
}

test("phone contact needs only name, phone and consent", async ({ page }) => {
  const requests = await captureInquiry(page);
  const form = await openForm(page);
  await fillContact(form);
  await form.locator('[type="submit"]').click();

  await expect(form.locator('[role="status"]')).toHaveText("TEST_SUCCESS");
  expect(requests).toHaveLength(1);
  expect(requests[0]).toMatchObject({
    captchaToken: "synthetic-yandex-token-1",
    name: "Synthetic visitor",
    phone: "+79990000000",
    consent: "on",
    contactMethod: "phone",
    email: "",
    serviceId: "svetovye-bukvy",
  });
  expect(requests[0]).not.toHaveProperty("projectId");
});

test("phone request resets after receipt", async ({ page }) => {
  const requests = await captureInquiry(page);
  const form = await openForm(page);
  await fillContact(form);
  await form.locator('[name="signText"]').fill("Синтетическая вывеска");
  await form.locator('[name="widthCm"]').fill("120");
  await form.locator('[name="lighting"]').selectOption("halo");

  const email = form.locator('[name="email"]');
  const contactMethod = form.locator('[name="contactMethod"]');
  await expect(contactMethod).toHaveValue("phone");
  await expect(email).toHaveJSProperty("required", false);
  await expect(form.locator('[name="projectId"]')).toHaveCount(0);
  await form.locator('[type="submit"]').click();

  await expect(form.locator('[role="status"]')).toHaveText("TEST_SUCCESS");
  expect(requests).toHaveLength(1);
  expect(requests[0]).toMatchObject({
    serviceId: "svetovye-bukvy",
    contactMethod: "phone",
    name: "Synthetic visitor",
    phone: "+79990000000",
    signText: "Синтетическая вывеска",
    widthCm: "120",
    lighting: "halo",
  });
  expect(requests[0]).not.toHaveProperty("projectId");
  await expect(form.locator('[name="name"]')).toHaveValue("");
  await expect(form.locator('[name="phone"]')).toHaveValue("");
  await expect(form.locator('[name="signText"]')).toHaveValue("");
  await expect(form.locator('[name="widthCm"]')).toHaveValue("");
  await expect(form.locator('[name="lighting"]')).toHaveValue("advice");
  await expect(form.locator('[name="consent"]')).not.toBeChecked();
  await expect(contactMethod).toHaveValue("phone");
  await expect(email).toHaveJSProperty("required", false);
});

test("email contact requires a valid email before sending", async ({
  page,
}) => {
  const requests = await captureInquiry(page);
  const form = await openForm(page);
  await fillContact(form);
  const email = form.locator('[name="email"]');
  await form.locator('[name="contactMethod"]').selectOption("email");
  await expect(email).toHaveJSProperty("required", true);
  await form.locator('[type="submit"]').click();

  await expect(email).toBeFocused();
  await expect(email).toHaveAttribute("aria-invalid", "true");
  await expect(form.locator("#led-letters-email-error")).toBeVisible();
  expect(requests).toHaveLength(0);

  await email.fill("visitor@example.test");
  await expect(email).toHaveAttribute("aria-invalid", "false");
  await expect(form.locator("#led-letters-email-error")).toBeHidden();
  await form.locator('[type="submit"]').click();
  await expect(form.locator('[role="status"]')).toHaveText("TEST_SUCCESS");
  expect(requests).toHaveLength(1);
  expect(requests[0]).toMatchObject({
    serviceId: "svetovye-bukvy",
    contactMethod: "email",
    email: "visitor@example.test",
  });
  expect(requests[0]).not.toHaveProperty("projectId");
  await expect(form.locator('[name="contactMethod"]')).toHaveValue("phone");
  await expect(email).toHaveValue("");
  await expect(email).toHaveJSProperty("required", false);
  await expect(form.locator('[name="name"]')).toHaveValue("");
  await expect(form.locator('[name="phone"]')).toHaveValue("");
  await expect(form.locator('[name="consent"]')).not.toBeChecked();
});

test("invalid phone and zero width are shown and can be corrected", async ({
  page,
}) => {
  const requests = await captureInquiry(page);
  const form = await openForm(page);
  await form.locator('[name="name"]').fill("Synthetic visitor");
  await form.locator('[name="phone"]').fill("not a phone");
  await form.locator('[name="widthCm"]').fill("0");
  await form.locator('[name="consent"]').check();
  await form.locator('[type="submit"]').click();

  const phoneError = form.locator("#led-letters-phone-error");
  const widthError = form.locator("#led-letters-widthCm-error");
  await expect(phoneError).toBeVisible();
  await expect(widthError).toBeVisible();
  await expect(form.locator('[name="phone"]')).toBeFocused();
  expect(requests).toHaveLength(0);

  await form.locator('[name="phone"]').fill("+79990000000");
  await form.locator('[name="widthCm"]').fill("85");
  await expect(phoneError).toBeHidden();
  await expect(widthError).toBeHidden();
  await form.locator('[type="submit"]').click();

  await expect(form.locator('[role="status"]')).toHaveText("TEST_SUCCESS");
  expect(requests).toHaveLength(1);
  expect(requests[0]).toMatchObject({
    phone: "+79990000000",
    widthCm: "85",
  });
});

test("a rejected request keeps the entered lettering details", async ({
  page,
}) => {
  const requests = await captureInquiry(page, 503);
  const form = await openForm(page);
  await fillContact(form);
  await form.locator('[name="contactMethod"]').selectOption("email");
  await form.locator('[name="email"]').fill("visitor@example.test");
  await form.locator('[name="signText"]').fill("Synthetic sign");
  await form.locator('[name="widthCm"]').fill("90");
  await form.locator('[name="lighting"]').selectOption("halo");
  await form.locator('[type="submit"]').click();

  await expect(form.locator('[role="status"]')).toHaveText("TEST_FAILURE");
  expect(requests).toHaveLength(1);
  await expect(form.locator('[name="name"]')).toHaveValue("Synthetic visitor");
  await expect(form.locator('[name="phone"]')).toHaveValue("+79990000000");
  await expect(form.locator('[name="signText"]')).toHaveValue("Synthetic sign");
  await expect(form.locator('[name="widthCm"]')).toHaveValue("90");
  await expect(form.locator('[name="lighting"]')).toHaveValue("halo");
  await expect(form.locator('[name="contactMethod"]')).toHaveValue("email");
  await expect(form.locator('[name="email"]')).toHaveValue(
    "visitor@example.test",
  );
  await expect(form.locator('[name="email"]')).toHaveJSProperty(
    "required",
    true,
  );
  await expect(form.locator('[name="consent"]')).toBeChecked();
  await expect(form.locator('[type="submit"]')).toBeEnabled();
});
