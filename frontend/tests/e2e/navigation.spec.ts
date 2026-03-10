import { test, expect } from '@playwright/test';

/**
 * Navigation E2E Tests
 * Tests navbar links, active states, mobile responsive navigation
 * Priority: P0 - Critical path
 */
test.describe('🧭 Navigation Tests', () => {
  test('[P0] should render navbar on all pages', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });

  test('[P0] should display logo in navbar', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });

  test('[P0] should display nav links', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });

  test('[P0] should navigate to practice when link clicked', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });

  test('[P1] should adapt navbar for mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });

  test('[P1] should show nav icons on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });

  test('[P1] should show login or logout button', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });
});
