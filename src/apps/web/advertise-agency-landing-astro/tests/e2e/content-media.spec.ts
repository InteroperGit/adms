// Browser contracts for chart enhancement and failed video media.
import { expect, test } from './fixtures';

const chartRuntimePattern = /\/chart-runtime[^/]*\.js(?:\?.*)?$/;

test('chart canvas survives resize and its data table opens', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/projects/1/');

  const chart = page.locator('[data-chart-figure="chart-e2e-chart"]');
  await chart.scrollIntoViewIfNeeded();
  const canvas = chart.locator('canvas');
  await expect(canvas).toBeVisible();

  const canvasWidth = async (): Promise<number> =>
    (await canvas.boundingBox())?.width ?? 0;
  await expect.poll(canvasWidth).toBeGreaterThan(0);

  await page.setViewportSize({ width: 375, height: 800 });
  await expect(canvas).toBeVisible();
  await expect.poll(canvasWidth).toBeGreaterThan(0);

  await chart.locator('summary').click();
  const table = chart.locator('table');
  await expect(table).toBeVisible();
  await expect(table).toContainText('Alpha');
  await expect(table).toContainText('Beta');
  await expect(table).toContainText('10 units');
  await expect(table).toContainText('20 units');
});

test('chart data table remains available when runtime loading fails', async ({
  page,
}) => {
  const interceptedUrls: string[] = [];
  const failedUrls: string[] = [];
  page.on('requestfailed', (request) => {
    failedUrls.push(request.url());
  });
  await page.route(chartRuntimePattern, async (route) => {
    interceptedUrls.push(route.request().url());
    await route.abort();
  });

  await page.goto('/projects/1/');
  const chart = page.locator('[data-chart-figure="chart-e2e-chart"]');
  await chart.scrollIntoViewIfNeeded();
  await expect.poll(() => interceptedUrls.length).toBe(1);
  await expect
    .poll(() => failedUrls.some((url) => chartRuntimePattern.test(url)))
    .toBe(true);
  expect(interceptedUrls[0]).toMatch(chartRuntimePattern);

  await expect(chart.locator('canvas')).toHaveCount(0);
  await chart.locator('summary').click();
  const table = chart.locator('table');
  await expect(table).toBeVisible();
  await expect(table).toContainText('Alpha');
  await expect(table).toContainText('Beta');
  await expect(table).toContainText('10 units');
  await expect(table).toContainText('20 units');
});

test('video exposes an error fallback after a real 404 response', async ({
  page,
}) => {
  const fulfilledUrls: string[] = [];
  await page.route('**/__fixture/broken.mp4', async (route) => {
    fulfilledUrls.push(route.request().url());
    await route.fulfill({
      status: 404,
      contentType: 'video/mp4',
      body: '',
    });
  });

  await page.goto('/projects/1/');
  const video = page.locator('[data-video-state]');
  await video.scrollIntoViewIfNeeded();
  await expect.poll(() => fulfilledUrls.length).toBeGreaterThan(0);
  await expect(video).toHaveAttribute('data-video-state', 'error');

  const error = video.locator('.video-error');
  await expect(error).toBeVisible();
  await expect(error.locator('a')).toHaveAttribute(
    'href',
    '/__fixture/broken.mp4',
  );

  const element = video.locator('video');
  await expect(element).toHaveJSProperty('controls', true);
  await expect
    .poll(async () => {
      const box = await element.boundingBox();
      return (box?.width ?? 0) * (box?.height ?? 0);
    })
    .toBeGreaterThan(0);

  await video.locator('.video-transcript summary').click();
  await expect(video.locator('.video-transcript')).toContainText(
    'E2E transcript',
  );
});
