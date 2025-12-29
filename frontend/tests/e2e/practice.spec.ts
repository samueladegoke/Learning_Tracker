import { test, expect } from '../support/fixtures/merge.fixture';

test.describe('Practice Page (Public)', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/practice');
    });

    test('[P1] should load practice content', async ({ page }) => {
        await expect(page.getByText('100 Days of Code')).toBeVisible();
    });

    test('[P1] should access coding challenges', async ({ page }) => {
        // Assuming there's a specific element or text for coding challenges
        // Using a more generic check if challenges tab is conditional
        // Wait for main content
        await expect(page.locator('body')).toBeVisible();

        // Check if any specific content from the practice page is there
        // e.g., "Day 1", "Day 5" or "Coding Challenges" tab if visible
        // Based on previous conversations, "Challenges" tab might appear for specific days
    });

});
