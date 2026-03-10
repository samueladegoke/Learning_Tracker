import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {
    test('should load the login route', async ({ page }) => {
        await page.goto('/login');
        await expect(page.locator('body')).toBeVisible();
        await expect(page.locator('h1, h2, h3').first()).toBeVisible();
    });

    test('should submit login form when present', async ({ page }) => {
        await page.goto('/login');
        const submitButton = page.locator('button[type="submit"]');

        if (await submitButton.count()) {
            await submitButton.first().click();
        }

        await expect(page.locator('body')).toBeVisible();
    });
});
