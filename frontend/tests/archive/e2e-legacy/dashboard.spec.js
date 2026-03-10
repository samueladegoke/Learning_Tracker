// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Dashboard Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load dashboard with welcome message', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Welcome back, Learner!' })).toBeVisible();
  });

  test('should display stats cards', async ({ page }) => {
    await expect(page.getByText('Total XP')).toBeVisible();
    await expect(page.getByText('Level', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Streak', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Badges', { exact: true }).first()).toBeVisible();
  });

  test('should display current week info', async ({ page }) => {
    await expect(page.getByText('Week 1').first()).toBeVisible();
    await expect(page.getByText(/Bootcamp Days/i).first()).toBeVisible();
    await expect(page.getByText(/bootcamp review/i)).toBeVisible();
  });

  test('should display Up Next tasks section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Up Next' })).toBeVisible();
  });

  test('should navigate to Planner via link', async ({ page }) => {
    await page.getByRole('link', { name: 'View Full Roadmap' }).click();
    await expect(page).toHaveURL('/planner');
  });

  test('should have working navigation links', async ({ page }) => {
    // Click Planner
    await page.getByRole('link', { name: /Planner/i }).click();
    await expect(page).toHaveURL('/planner');

    // Click Reflections
    await page.getByRole('link', { name: /Reflection/i }).click();
    await expect(page).toHaveURL('/reflections');

    // Click Progress
    await page.getByRole('link', { name: /Progre/i }).click();
    await expect(page).toHaveURL('/progress');

    // Click Dashboard
    await page.getByRole('link', { name: /Dashboard/i }).click();
    await expect(page).toHaveURL('/');
  });
});

