// @ts-check
import { test, expect } from '@playwright/test';

test('Boss Battle Logic Verification', async ({ page }) => {
  // 1. App loads and Boss appears
  await page.goto('http://localhost:5175/');
  await expect(page).toHaveTitle(/Learning Tracker/);
  
  // Verify initial Boss: Syntax Serpent
  await expect(page.getByText('The Syntax Serpent')).toBeVisible();
  
  // Check HP (70/70)
  await expect(page.locator('body')).toContainText('70 / 70 HP');

  // 2. Navigate to Planner and complete a task
  await page.getByRole('link', { name: 'Planner' }).click();
  await expect(page.getByRole('heading', { name: 'Learning Roadmap' })).toBeVisible();

  // Expand Week 1
  await page.getByText('Week 1: Core Foundations').click();
  
  // Find first task: "w1-d1" (likely has text "Day 1")
  // Task rewards 15 XP.
  const task1 = page.locator('div').filter({ hasText: 'Day 1' }).filter({ hasText: '15 XP' }).first();
  const checkbox1 = task1.getByRole('checkbox');
  
  // Ensure it's not checked
  expect(await checkbox1.isChecked()).toBeFalsy();
  
  // Complete it
  await checkbox1.check();
  
  // Wait for visual feedback
  await page.waitForTimeout(1000);

  // 3. Verify Damage on Dashboard
  await page.getByRole('link', { name: 'Dashboard' }).click();
  
  // Expected HP: 70 - 15 = 55
  await expect(page.locator('body')).toContainText('55 / 70 HP');
  
  // 4. Defeat the Boss
  await page.getByRole('link', { name: 'Planner' }).click();
  await page.getByText('Week 1: Core Foundations').click();

  // Complete remaining tasks in Week 1
  // We locate all checkboxes in Week 1.
  // We need to be careful to target only visible ones under the expanded accordion.
  const week1Section = page.locator('div').filter({ hasText: 'Week 1: Core Foundations' }).first().locator('..'); // go up to container
  const week1Tasks = week1Section.getByRole('checkbox');
  
  const count = await week1Tasks.count();
  for (let i = 0; i < count; i++) {
    if (!(await week1Tasks.nth(i).isChecked())) {
      await week1Tasks.nth(i).check();
      await page.waitForTimeout(500);
    }
  }
  
  // 5. Verify Boss Defeat and New Boss
  await page.getByRole('link', { name: 'Dashboard' }).click();
  
  // New boss "The OOP Titan" (95 HP) should appear.
  await expect(page.getByText('The OOP Titan')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('body')).toContainText('95 / 95 HP');

});
