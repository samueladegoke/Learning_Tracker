import { test, expect } from '@playwright/test';

test.describe('Dashboard Smoke', () => {
    test('[P0] should load home route', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('body')).toBeVisible();
    });

    test('[P1] should load planner route', async ({ page }) => {
        await page.goto('/planner');
        await expect(page.locator('body')).toBeVisible();
    });
});
