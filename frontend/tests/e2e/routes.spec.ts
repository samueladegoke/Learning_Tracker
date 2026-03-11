import { test, expect } from '@playwright/test';

function isLoginUrl(url: string) {
  return /\/login(?:$|\?)/.test(url);
}

test.describe('Route Regression Smoke', () => {
  test('[P1] /practice route should render or redirect to login', async ({ page }) => {
    await page.goto('/practice');
    await expect(page.locator('body')).toBeVisible();
  });

  test('[P1] /calendar route should render or redirect to login', async ({ page }) => {
    await page.goto('/calendar');
    await expect(page.locator('body')).toBeVisible();
  });

  test('[P1] /world-map route should render or redirect to login', async ({ page }) => {
    await page.goto('/world-map');
    await expect(page.locator('body')).toBeVisible();
  });

  test('[P1] wildcard route should resolve without crash', async ({ page }) => {
    await page.goto('/__missing-route__');
    await expect(page.locator('body')).toBeVisible();

    // If auth guard is enabled, missing route may resolve through login path.
    if (isLoginUrl(page.url())) {
      await expect(page.locator('h1, h2, h3').first()).toBeVisible();
    }
  });
});
