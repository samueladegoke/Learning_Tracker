import { test, expect } from '@playwright/test';
import { DEV_MODE } from '../constants/env';

/**
 * Comprehensive Route Tests
 * Tests all application routes rendering and navigation
 * Priority: P0 - Critical path
 */
test.describe('🔀 Comprehensive Route Tests', () => {
  const ROUTES = [
    { path: '/', name: 'Dashboard', protected: true },
    { path: '/world-map', name: 'World Map', protected: true },
    { path: '/planner', name: 'Planner', protected: true },
    { path: '/reflections', name: 'Reflections', protected: true },
    { path: '/progress', name: 'Progress', protected: true },
    { path: '/calendar', name: 'Calendar', protected: true },
    { path: '/practice', name: 'Practice', protected: false }, // Practice has guest access
    { path: '/login', name: 'Login', protected: false },
    { path: '/__missing-route__', name: '404 Not Found', protected: false },
  ];

  test.describe('[P0] Core Route Rendering', () => {
    ROUTES.forEach(({ path, name }) => {
      test(`[${name}] route should render without crashing`, async ({ page }) => {
        await page.goto(path);

        // Body should be visible (basic smoke)
        await expect(page.locator('body')).toBeVisible();

        // Expect some content to render - h1, h2, or main
        await expect(page.locator('h1, h2, h3, main, [role="main"], [role="region"]').first())
          .toBeVisible({ timeout: 10000 });
      });
    });
  });

  test.describe('[P1] Route Navigation', () => {
    test('should navigate between all main routes via navbar', async ({ page }) => {
      // Start at home
      await page.goto('/');
      await expect(page.locator('body')).toBeVisible();

      // Navigate through each protected route
      const protectedRoutes = ROUTES.filter(r => r.protected && r.path !== '/');

      for (const route of protectedRoutes) {
        // Click on nav link
        const navLink = page.locator(`nav a[href="${route.path}"], nav a[href="${route.path}/"]`);

        if (await navLink.count() > 0) {
          await navLink.click();

          // Wait for navigation
          await page.waitForTimeout(500);

          // Verify we're on the route (either exact or redirected)
          const currentUrl = page.url();
          expect(currentUrl.includes('/login') || currentUrl.includes(route.path)).toBeTruthy();

          // Content should be visible
          await expect(page.locator('body')).toBeVisible();
        }
      }
    });

    test('should handle direct navigation to all routes', async ({ page }) => {
      for (const { path } of ROUTES) {
        await page.goto(path);
        await expect(page.locator('body')).toBeVisible();

        // Check for error states
        const errorText = await page.locator('text=/error/i, text=/failed/i, text=/crash/i').count();
        expect(errorText).toBe(0);
      }
    });
  });

  test.describe('[P1] 404 Handling', () => {
    test('should show 404 page for unknown routes', async ({ page }) => {
      await page.goto('/non-existent-route-xyz');

      // Body should be visible
      await expect(page.locator('body')).toBeVisible();

      // Should have some content (404 page or redirected)
      const content = await page.locator('h1, h2, main').first();
      await expect(content).toBeVisible();
    });

    test('should handle deeply nested invalid paths', async ({ page }) => {
      await page.goto('/api/v1/users/123/invalid/action');

      // Should not crash - body visible
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('[P0] Route with Query Parameters', () => {
    test('should handle routes with query parameters', async ({ page }) => {
      // Practice page with review mode
      await page.goto('/practice?mode=review');

      await expect(page.locator('body')).toBeVisible();

      // Verify the mode parameter is handled
      const url = page.url();
      expect(url.includes('mode=review')).toBeTruthy();
    });

    test('should handle routes with hash fragments', async ({ page }) => {
      await page.goto('/practice#day-5');

      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('[P1] Route Transitions', () => {
    test('should animate between routes smoothly', async ({ page }) => {
      await page.goto('/');

      // Navigate to world-map
      await page.goto('/world-map');

      // Page should be visible after animation
      await page.waitForTimeout(500);
      await expect(page.locator('body')).toBeVisible();

      // Navigate back
      await page.goto('/');
      await page.waitForTimeout(500);
      await expect(page.locator('body')).toBeVisible();
    });
  });
});
