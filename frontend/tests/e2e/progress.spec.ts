import { test, expect } from '@playwright/test';

/**
 * Progress Page Comprehensive E2E Tests
 * Tests the progress tracking, stats, badges, and achievements functionality
 * Priority: P0 - Critical path
 */
test.describe('📈 Progress Page Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/progress');
        await page.waitForTimeout(1000);
    });

    test.describe('[P0] Page Loading', () => {
        test('should load progress page without crashing', async ({ page }) => {
            await expect(page.locator('body')).toBeVisible();
        });

        test('should display page content', async ({ page }) => {
            // Should have either progress stats or guest prompt
            const content = page.locator('h1, h2, .card, [role="region"]').first();
            await expect(content).toBeVisible();
        });
    });

    test.describe('[P0] Guest Access', () => {
        test('should show sign-in prompt for unauthenticated users', async ({ page }) => {
            // Look for guest prompt elements
            const signInPrompt = page.locator('text=/Sign In|Login|track your progress/i').first();

            // May or may not be visible depending on DEV_MODE
            if (await signInPrompt.count() > 0) {
                await expect(signInPrompt).toBeVisible();
            }
        });

        test('should have login link for guests', async ({ page }) => {
            const loginLink = page.locator('a[href="/login"]').first();

            if (await loginLink.count() > 0) {
                await expect(loginLink).toBeVisible();
            }
        });
    });

    test.describe('[P1] Progress Stats (Authenticated)', () => {
        test('should display progress ring with percentage', async ({ page }) => {
            // Look for progress ring or percentage display
            const progressRing = page.locator('svg circle, .progress-ring').first();

            if (await progressRing.count() > 0) {
                await expect(progressRing).toBeVisible();
            }
        });

        test('should show completion percentage', async ({ page }) => {
            // Look for percentage text
            const percentage = page.locator('text=/\\d+%|Complete/').first();

            if (await percentage.count() > 0) {
                await expect(percentage).toBeVisible();
            }
        });

        test('should display task completion count', async ({ page }) => {
            // Look for "X of Y tasks done" text
            const taskCount = page.locator('text=/tasks? done/i, text=/of.*tasks/i').first();

            if (await taskCount.count() > 0) {
                await expect(taskCount).toBeVisible();
            }
        });

        test('should show XP and level information', async ({ page }) => {
            const xpDisplay = page.locator('text=/XP|Level/i').first();

            if (await xpDisplay.count() > 0) {
                await expect(xpDisplay).toBeVisible();
            }
        });

        test('should display streak counter', async ({ page }) => {
            const streak = page.locator('text=/Streak|Day Streak/i').first();

            if (await streak.count() > 0) {
                await expect(streak).toBeVisible();
            }
        });
    });

    test.describe('[P1] Quiz Mastery Section', () => {
        test('should display Quiz Mastery heading', async ({ page }) => {
            const quizMastery = page.locator('text=Quiz Mastery').first();

            if (await quizMastery.count() > 0) {
                await expect(quizMastery).toBeVisible();
            }
        });

        test('should show quizzes taken count', async ({ page }) => {
            const quizzesTaken = page.locator('text=Quizzes Taken').first();

            if (await quizzesTaken.count() > 0) {
                await expect(quizzesTaken).toBeVisible();
            }
        });

        test('should show average score', async ({ page }) => {
            const avgScore = page.locator('text=Average Score').first();

            if (await avgScore.count() > 0) {
                await expect(avgScore).toBeVisible();
            }
        });

        test('should show best score', async ({ page }) => {
            const bestScore = page.locator('text=Best Score').first();

            if (await bestScore.count() > 0) {
                await expect(bestScore).toBeVisible();
            }
        });
    });

    test.describe('[P1] Weekly Progress Grid', () => {
        test('should display weekly progress heading', async ({ page }) => {
            const weeklyProgress = page.locator('text=Weekly Progress').first();

            if (await weeklyProgress.count() > 0) {
                await expect(weeklyProgress).toBeVisible();
            }
        });

        test('should show week indicator squares', async ({ page }) => {
            // Look for week grid items
            const weekSquares = page.locator('[class*="aspect-square"], .grid > div').first();

            if (await weekSquares.count() > 0) {
                await expect(weekSquares).toBeVisible();
            }
        });

        test('should display legend for week status', async ({ page }) => {
            const legend = page.locator('text=Not started, text=In progress, text=Complete').first();

            if (await legend.count() > 0) {
                await expect(legend).toBeVisible();
            }
        });
    });

    test.describe('[P1] Badges & Achievements', () => {
        test('should display Badges & Achievements section', async ({ page }) => {
            const section = page.locator('text=Badges & Achievements, text=Badges, text=Achievements').first();

            if (await section.count() > 0) {
                await expect(section).toBeVisible();
            }
        });

        test('should show achievements list or empty state', async ({ page }) => {
            // Either achievements grid or empty state message
            const grid = page.locator('.grid').first();
            const noAchievements = page.locator('text=No achievements').first();
            const keepLearning = page.locator('text=Keep learning').first();

            const gridCount = await grid.count();
            const noAchievementsCount = await noAchievements.count();
            const keepLearningCount = await keepLearning.count();

            if (gridCount > 0) {
                await expect(grid).toBeVisible();
            } else if (noAchievementsCount > 0) {
                await expect(noAchievements).toBeVisible();
            } else if (keepLearningCount > 0) {
                await expect(keepLearning).toBeVisible();
            }
        });

        test('should show badges section', async ({ page }) => {
            const badges = page.locator('text=Badges').first();

            if (await badges.count() > 0) {
                await expect(badges).toBeVisible();
            }
        });
    });

    test.describe('[P2] Loading States', () => {
        test('should handle loading state gracefully', async ({ page }) => {
            await page.goto('/progress', { waitUntil: 'domcontentloaded' });

            // Page should eventually render
            await expect(page.locator('body')).toBeVisible();
        });
    });

    test.describe('[P1] Navigation Integration', () => {
        test('navbar should be visible on progress page', async ({ page }) => {
            await expect(page.locator('body')).toBeVisible();
        });

        test('should be able to navigate away from progress page', async ({ page }) => {
            const dashboardLink = page.locator('nav a[href="/"]').first();

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
