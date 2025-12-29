import { test, expect } from '../support/fixtures/merge.fixture';

test.describe('Dashboard (Authenticated)', () => {

    test.beforeEach(async ({ createAuthenticatedSession, page }) => {
        await createAuthenticatedSession();
        await page.goto('/');
    });

    test('[P0] should load dashboard for authenticated user', async ({ page }) => {
        await expect(page.getByText('Current Sync')).toBeVisible({ timeout: 10000 });
        await expect(page.getByRole('button', { name: 'Quest Shop' })).toBeVisible();
    });

    test('[P1] should show quest log', async ({ page }) => {
        await expect(page.getByText('Active Quests')).toBeVisible();
    });

});
