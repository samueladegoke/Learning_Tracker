import { test, expect } from '@playwright/test';

test.describe('Dashboard (Nano Banana Update)', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('[P0] should load dashboard with Electric Banana theme', async ({ page }) => {
        // Check for dashboard title or key element - Increase timeout for initial load
        await expect(page.getByText('Current Sync')).toBeVisible({ timeout: 5000 });

        // Fail fast if Sync Failure appears
        const errorCard = page.getByText('Sync Failure');
        if (await errorCard.isVisible()) {
            throw new Error("Dashboard failed to sync with backend - check if backend is running");
        }

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

    test('[P1] should have animation classes for "Juice"', async ({ page }) => {
        // Verify CurrentSyncStatus float animation (always visible)
        await expect(page.locator('.animate-float')).toBeVisible({ timeout: 5000 });
    });



    test('[P1] should verify animation elements presence', async ({ page }) => {
        // Verify CurrentSyncStatus float animation
        await expect(page.locator('.animate-float')).toBeVisible({ timeout: 5000 });

        // Verify stats are present (NumberTicker elements)
        // They might be initialized with 0 or empty, just check existence of container or standard stats
        await expect(page.getByText('Campaign Progress')).toBeVisible();
    });

    test('[P2] task toggles should be accessible', async ({ page }) => {
        // Wait for tasks to load
        await expect(page.getByText('Active Quests')).toBeVisible();

        // Check for aria-labels on task buttons if any tasks exist
        const taskButtons = page.locator('button[aria-label="Mark task as complete"], button[aria-label="Mark task as incomplete"]');
        if (await taskButtons.count() > 0) {
            await expect(taskButtons.first()).toBeVisible();
        }
    });

    test('[P1] should toggle navigation tabs', async ({ page }) => {
        await page.getByRole('link', { name: 'Planner' }).click();
        await expect(page).toHaveURL(/.*planner/);

        await page.getByRole('link', { name: 'Dashboard' }).click();
        await expect(page).toHaveURL(/.*\/$/);
    });

});
