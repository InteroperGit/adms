import { test, expect } from '@playwright/test';

// Helper: navigate to home and scroll the contact section into view
async function gotoContact(page: Parameters<Parameters<typeof test>[1]>[0]['page']) {
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  // Scroll the contact section into view so interactive elements are reachable
  await page.locator('section#contact').waitFor({ state: 'attached' });
  await page.locator('section#contact').scrollIntoViewIfNeeded();
}

// Helper: check the consent checkbox reliably across all browsers
async function checkConsent(page: Parameters<Parameters<typeof test>[1]>[0]['page']) {
  const checkbox = page.locator('section#contact input#consent');
  await checkbox.scrollIntoViewIfNeeded();
  await checkbox.check({ force: true });
}

// Helper: locate the contact field input (not the section) unambiguously
function contactInput(page: Parameters<Parameters<typeof test>[1]>[0]['page']) {
  return page.locator('section#contact input#contact');
}

test.describe('contact form', () => {
  test('E5.1 submit button is disabled when form is empty', async ({ page }) => {
    await gotoContact(page);
    const submitBtn = page.locator('section#contact form button[type="submit"]');
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toBeDisabled();
  });

  test('E5.2 filling all fields and checking consent enables the submit button', async ({
    page,
  }) => {
    await gotoContact(page);
    await page.locator('section#contact input#name').fill('Иван Иванов');
    await contactInput(page).fill('ivan@example.com');
    await page.locator('section#contact textarea#message').fill(
      'Тестовое сообщение для проверки формы',
    );
    await checkConsent(page);

    const submitBtn = page.locator('section#contact form button[type="submit"]');
    await expect(submitBtn).toBeEnabled();
  });

  test('E5.3 submitting the form shows a loading state', async ({ page }) => {
    await gotoContact(page);
    await page.locator('section#contact input#name').fill('Иван Иванов');
    await contactInput(page).fill('ivan@example.com');
    await page.locator('section#contact textarea#message').fill(
      'Тестовое сообщение для проверки формы',
    );
    await checkConsent(page);

    const submitBtn = page.locator('section#contact form button[type="submit"]');
    await submitBtn.click();

    // During the 1200ms simulated submission the button must be disabled (isLoading = true)
    await expect(submitBtn).toBeDisabled();
  });

  test('E5.4 after ~1.5s the success message is visible', async ({ page }) => {
    await gotoContact(page);
    await page.locator('section#contact input#name').fill('Иван Иванов');
    await contactInput(page).fill('ivan@example.com');
    await page.locator('section#contact textarea#message').fill(
      'Тестовое сообщение для проверки формы',
    );
    await checkConsent(page);

    await page.locator('section#contact form button[type="submit"]').click();

    // ContactSuccess renders an <h3> with the success title; wait up to 3s
    const successHeading = page.locator('section#contact h3');
    await expect(successHeading).toBeVisible({ timeout: 3000 });
  });

  test('E5.5 clicking reset button after success restores the form', async ({ page }) => {
    await gotoContact(page);
    await page.locator('section#contact input#name').fill('Иван Иванов');
    await contactInput(page).fill('ivan@example.com');
    await page.locator('section#contact textarea#message').fill(
      'Тестовое сообщение для проверки формы',
    );
    await checkConsent(page);

    await page.locator('section#contact form button[type="submit"]').click();

    // Wait for ContactSuccess to appear
    await expect(page.locator('section#contact h3')).toBeVisible({ timeout: 3000 });

    // ContactSuccess renders an outline <button> (not type="submit") — the reset button
    const resetBtn = page.locator('section#contact button:not([type="submit"])');
    await expect(resetBtn).toBeVisible();
    await resetBtn.click();

    // Form should be back — submit button present and disabled (empty form, no consent)
    const submitBtn = page.locator('section#contact form button[type="submit"]');
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toBeDisabled();
  });

  test('E5.6 leaving name field empty after blur shows a validation error', async ({ page }) => {
    await gotoContact(page);
    // Focus and blur the name field without entering anything
    const nameInput = page.locator('section#contact input#name');
    await nameInput.focus();
    await nameInput.blur();

    // FormField renders the error as <p id="name-error" class="...text-destructive...">
    const nameError = page.locator('#name-error');
    await expect(nameError).toBeVisible({ timeout: 2000 });
  });
});
