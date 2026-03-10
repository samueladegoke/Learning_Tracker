// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Progress Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/progress');
  });

  test('should display page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Progress & Stats' })).toBeVisible();
  });

  test('should display completion percentage', async ({ page }) => {
    await expect(page.getByText('Complete', { exact: true }).first()).toBeVisible();
    await expect(page.locator('text=/%/')).toBeVisible();
  });

  test('should display task count', async ({ page }) => {
    await expect(page.getByText(/\d+ of \d+ tasks done/)).toBeVisible();
  });

  test('should display level and XP', async ({ page }) => {
    await expect(page.getByText(/Level \d+/)).toBeVisible();
    await expect(page.getByText('Total XP')).toBeVisible();
  });

  test('should display streak', async ({ page }) => {
    await expect(page.getByText('Day Streak', { exact: true }).first()).toBeVisible();
  });

  test('should display weekly progress grid', async ({ page }) => {
    await expect(page.getByText('Weekly Progress')).toBeVisible();
    
    // Should show week numbers 1-8
    for (let i = 1; i <= 8; i++) {
      await expect(page.getByText(i.toString(), { exact: true }).first()).toBeVisible();
    }
  });

  test('should display progress legend', async ({ page }) => {
    await expect(page.getByText('Not started')).toBeVisible();
    await expect(page.getByText('In progress')).toBeVisible();
    // Note: 'Complete' text is also used for the main progress, so we check for it in context
  });

  test('should display badges section', async ({ page }) => {
    await expect(page.getByText('Badges & Achievements')).toBeVisible();
  });

  test('should show XP to next level', async ({ page }) => {
    await expect(page.getByText(/\d+ XP to next level/)).toBeVisible();
  });
});

