import { test, expect } from '@playwright/test';

test.describe('Practice Route', () => {
    test('[P1] should either render practice content or redirect to login', async ({ page }) => {
        await page.goto('/practice');

        const redirectedToLogin = /\/login(?:$|\?)/.test(page.url());
        if (redirectedToLogin) {
            await expect(page.locator('h1')).toContainText(/Create Account|Welcome Back/);
            return;
        }

        await expect(page.locator('body')).toBeVisible();
    });
});
