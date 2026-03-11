// @ts-check
import { test, expect } from '@playwright/test';

test.describe('API Integration', () => {
  test('should load weeks from API', async ({ page }) => {
    // Listen for API responses
    const weeksResponse = page.waitForResponse(response => 
      response.url().includes('/weeks') && response.status() === 200
    );
    
    await page.goto('/planner');
    
    const response = await weeksResponse;
    const data = await response.json();
    
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
  });

  test('should load progress from API', async ({ page }) => {
    const progressResponse = page.waitForResponse(response => 
      response.url().includes('/progress') && response.status() === 200
    );
    
    await page.goto('/');
    
    const response = await progressResponse;
    const data = await response.json();
    
    expect(data).toHaveProperty('total_xp');
    expect(data).toHaveProperty('level');
    expect(data).toHaveProperty('tasks_completed');
    expect(data).toHaveProperty('tasks_total');
  });

  test('should load badges from API', async ({ page }) => {
    const badgesResponse = page.waitForResponse(response => 
      response.url().includes('/badges') && response.status() === 200
    );
    
    await page.goto('/progress');
    
    const response = await badgesResponse;
    const data = await response.json();
    
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('should handle task completion API call', async ({ page }) => {
    await page.goto('/planner');
    
    // Wait for page to load
    await page.waitForSelector('text=Learning Roadmap');
    
    // Find an uncompleted task and click it
    const taskCheckbox = page.locator('button').filter({ 
      has: page.locator('div.border-surface-600') 
    }).first();
    
    if (await taskCheckbox.isVisible()) {
      // Listen for the complete API call
      const completePromise = page.waitForResponse(response => 
        response.url().includes('/complete') || response.url().includes('/uncomplete')
      );
      
      await taskCheckbox.click();
      
      const response = await completePromise;
      expect(response.status()).toBe(200);
    }
  });

  test('should load reflections from API', async ({ page }) => {
    const reflectionsResponse = page.waitForResponse(response => 
      response.url().includes('/reflections') && 
      response.request().method() === 'GET' &&
      response.status() === 200
    );
    
    await page.goto('/reflections');
    
    const response = await reflectionsResponse;
    expect(response.status()).toBe(200);
  });
});

