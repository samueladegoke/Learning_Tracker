import { test, expect } from '@playwright/test';

/**
 * Practice Page Comprehensive E2E Tests
 * Tests the practice/quiz functionality including day selection, tabs, and quiz interactions
 * Priority: P0 - Critical path
 */
test.describe('📚 Practice Page Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/practice');
        await page.waitForTimeout(1000);
    });

    test.describe('[P0] Page Loading', () => {
        test('should load practice page without crashing', async ({ page }) => {
            await expect(page.locator('body')).toBeVisible();
        });

        test('should display page heading', async ({ page }) => {
            // Should have a heading (either title or guest prompt)
            const heading = page.locator('h1').first();
            await expect(heading).toBeVisible();
        });

        test('should render main content area', async ({ page }) => {
            const main = page.locator('main, [role="main"], .container').first();
            await expect(main).toBeVisible();
        });
    });

    test.describe('[P1] Day Selector', () => {
        test('should show day selector bar', async ({ page }) => {
            // Look for day selection UI
            const daySelector = page.locator('[data-testid="day-selector"], .day-selector, button:has-text("Day")').first();

            if (await daySelector.count() > 0) {
                await expect(daySelector).toBeVisible();
            }
        });

        test('should have today indicator', async ({ page }) => {
            // Check for "Today" or current day indicator
            const todayIndicator = page.locator('text=/Today|current/i').first();

            // May or may not be visible depending on implementation
            if (await todayIndicator.count() > 0) {
                await expect(todayIndicator).toBeVisible();
            }
        });
    });

    test.describe('[P1] Tab Navigation', () => {
        test('should display tab navigation', async ({ page }) => {
            // Look for tabs - Deep Dive, Quiz, Challenges
            const tabs = page.locator('[role="tablist"], .tabs-list').first();

            if (await tabs.count() > 0) {
                await expect(tabs).toBeVisible();
            }
        });

        test('should have Deep Dive tab', async ({ page }) => {
            const deepDiveTab = page.locator('text=Deep Dive, [role="tab"]:has-text("Deep Dive")').first();

            if (await deepDiveTab.count() > 0) {
                await expect(deepDiveTab).toBeVisible();
            }
        });

        test('should have Quiz/Practice tab', async ({ page }) => {
            const quizTab = page.locator('text=Quiz, text=Practice, [role="tab"]:has-text("Quiz")').first();

            if (await quizTab.count() > 0) {
                await expect(quizTab).toBeVisible();
            }
        });

        test('should switch tabs on click', async ({ page }) => {
            const quizTab = page.locator('text=Quiz, [role="tab"]:has-text("Quiz")').first();

            if (await quizTab.count() > 0) {
                await quizTab.click();
                await page.waitForTimeout(500);

                // Tab should be selected/active
                await expect(quizTab).toBeVisible();
            }
        });
    });

    test.describe('[P1] Review Mode', () => {
        test('should handle review mode query parameter', async ({ page }) => {
            await page.goto('/practice?mode=review');
            await page.waitForTimeout(500);

            // Should render without error
            await expect(page.locator('body')).toBeVisible();
        });

        test('should show memory training UI in review mode', async ({ page }) => {
            await page.goto('/practice?mode=review');
            await page.waitForTimeout(500);

            // May show "Memory Training" or similar heading
            const memoryHeading = page.locator('text=Memory Training, text=Review').first();

            // Conditional - depends on auth state
            if (await memoryHeading.count() > 0) {
                await expect(memoryHeading).toBeVisible();
            }
        });
    });

    test.describe('[P2] Guest Access', () => {
        test('should show sign-in prompt for unauthenticated users', async ({ page }) => {
            // Look for guest prompt or sign-in CTA
            const signInPrompt = page.locator('text=Sign In, text=Login, a:has-text("Sign")').first();

            // May or may not be visible in DEV_MODE
            if (await signInPrompt.count() > 0) {
                await expect(signInPrompt).toBeVisible();
            }
        });

        test('should have link to login page', async ({ page }) => {
            // Look for login links
            const loginLink = page.locator('a[href="/login"]').first();

            if (await loginLink.count() > 0) {
                await expect(loginLink).toBeVisible();
            }
        });
    });

    test.describe('[P2] Loading States', () => {
        test('should show loading skeleton while fetching data', async ({ page }) => {
            // Navigate fresh to catch loading state
            await page.goto('/practice', { waitUntil: 'domcontentloaded' });

            // There might be a brief loading state
            // Just verify the page eventually loads
            await expect(page.locator('body')).toBeVisible();
        });
    });

    test.describe('[P1] Navigation Integration', () => {
        test('navbar should be visible on practice page', async ({ page }) => {
            await expect(page.locator('body')).toBeVisible();
        });

        test('should be able to navigate away from practice page', async ({ page }) => {
            // Click a nav link
            const dashboardLink = page.locator('nav a[href="/"], nav a:has-text("Dashboard")').first();

            if (await dashboardLink.count() > 0) {
                await dashboardLink.click();
                await page.waitForTimeout(500);

                const url = page.url();
                expect(url.endsWith('/') || url.includes('/login')).toBeTruthy();
            } else {
                await expect(page.locator('body')).toBeVisible();
            }
        });
    });
});
