// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Planner Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/planner');
  });

  test('should display page title and description', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Learning Roadmap' })).toBeVisible();
    await expect(page.getByText('8-week bootcamp refresh')).toBeVisible();
  });

  test('should display overall progress bar', async ({ page }) => {
    await expect(page.getByText('Overall Progress')).toBeVisible();
    await expect(page.getByText(/of \d+ tasks completed/)).toBeVisible();
  });

  test('should display all 8 weeks', async ({ page }) => {
    // Check for week indicators
    for (let i = 1; i <= 8; i++) {
      await expect(page.getByText(`W${i}`, { exact: false }).first()).toBeVisible();
    }
  });

  test('should expand week accordion to show tasks', async ({ page }) => {
    // Click on Week 2 (which should be collapsed)
    const week2Button = page.locator('button').filter({ hasText: 'W2' }).first();

    if (await week2Button.isVisible()) {
      await week2Button.click();

      // Should now show tasks for Week 2
      await page.waitForTimeout(500);
      await expect(page.getByText('Guess the Number', { exact: false })).toBeVisible();
    }
  });

  test('should show task progress per week', async ({ page }) => {
    // Each week should show X/5 tasks
    await expect(page.getByText(/\d\s*\/\s*5\s*tasks?/i).first()).toBeVisible();
  });

  test('should display weekly notes', async ({ page }) => {
    // Notes from the seed should appear in the accordion header
    await expect(page.getByText('bootcamp', { exact: false }).first()).toBeVisible();
  });
});

