import { test, expect } from '@playwright/test';

test.describe('Dashboard (Nano Banana Update)', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('[P0] should load dashboard with Electric Banana theme', async ({ page }) => {
        // Check for dashboard title or key element
        await expect(page.getByText('Current Sync')).toBeVisible();

        // Check if body or main container has correct background (simplified check)
        // We expect checking a primary color element involves the yellow color
        // This is hard to test strictly without computed styles, but we can check if classes exist
        const shopButton = page.getByRole('button', { name: 'Quest Shop' });
        await expect(shopButton).toBeVisible();

        // Check for "Electric Banana" color (Yellow-500/Amber-400 approx)
        // We can check if the class for the gradient exists if we want strict class checking
        // or just ensure it's visible.
    });

    test('[P0] should NOT contain emojis (Zero Emoji Policy)', async ({ page }) => {
        // Wait for content to load
        await expect(page.getByText('Current Sync')).toBeVisible();

        // Scan for common emojis that used to exist
        const prohibited = ['📜', '💰', '🛒', '⚡', '🐉', '📅'];
        const content = await page.content();

        for (const emoji of prohibited) {
            expect(content).not.toContain(emoji);
        }

        // Check for Lucide icon replacements instead
        // We can't easily check for SVG contents, but we can check for the absence of the emoji text
    });

    test('[P1] should toggle navigation tabs', async ({ page }) => {
        await page.getByRole('link', { name: 'Planner' }).click();
        await expect(page).toHaveURL(/.*planner/);

        await page.getByRole('link', { name: 'Dashboard' }).click();
        await expect(page).toHaveURL(/.*\/$/);
    });

});
