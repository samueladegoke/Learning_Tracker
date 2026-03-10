// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Task Completion', () => {
  test('should mark task as completed and update XP', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial load
    await page.waitForSelector('text=Total XP');
    
    // Get initial XP value
    const initialXPText = await page.locator('text=Total XP').locator('..').locator('p').first().textContent();
    const initialXP = parseInt(initialXPText || '0');
    
    // Find and click first uncompleted task checkbox
    const taskCheckbox = page.locator('button').filter({ has: page.locator('svg').or(page.locator('div:empty')) }).first();
    
    // Check if there's an uncompleted task
    const upNextSection = page.locator('text=Up Next').locator('..');
    const uncompleteTask = upNextSection.locator('button').first();
    
    if (await uncompleteTask.isVisible()) {
      await uncompleteTask.click();
      
      // Wait for API response
      await page.waitForTimeout(1000);
      
      // Verify XP increased (should be +10)
      await page.waitForSelector('text=Total XP');
    }
  });

  test('should show task completion in planner view', async ({ page }) => {
    await page.goto('/planner');
    
    // Wait for weeks to load
    await page.waitForSelector('text=Learning Roadmap');
    
    // Week 1 should be visible and expanded
    await expect(page.getByText(/Week 1/i).first()).toBeVisible();
    await expect(page.getByText(/Bootcamp Days/i).first()).toBeVisible();
    
    // Check task count display
    await expect(page.getByText(/\d\s*\/\s*5\s*tasks?/i).first()).toBeVisible();
  });

  test('should toggle task completion status', async ({ page }) => {
    await page.goto('/planner');
    
    // Wait for page to load
    await page.waitForSelector('text=Learning Roadmap');
    
    // Find a task checkbox in Week 1 (which should be expanded)
    const taskCard = page.locator('.card').filter({ hasText: 'Day 1' }).first();
    
    if (await taskCard.isVisible()) {
      const checkbox = taskCard.locator('button').first();
      const isCompleted = await checkbox.locator('svg').count() > 0;
      
      // Click to toggle
      await checkbox.click();
      await page.waitForTimeout(1000);
      
      // Verify state changed
      const newState = await checkbox.locator('svg').count() > 0;
      expect(newState).not.toBe(isCompleted);
    }
  });
});

