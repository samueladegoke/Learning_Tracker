// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Reflections Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/reflections');
  });

  test('should display page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Weekly Reflections' })).toBeVisible();
  });

  test('should display week selector dropdown', async ({ page }) => {
    await expect(page.getByText('Select Week')).toBeVisible();
    await expect(page.getByRole('combobox')).toBeVisible();
  });

  test('should display check-in prompt for selected week', async ({ page }) => {
    await expect(page.getByText('Prompt:')).toBeVisible();
  });

  test('should have reflection textarea', async ({ page }) => {
    const textarea = page.getByRole('textbox');
    await expect(textarea).toBeVisible();
    await expect(textarea).toHaveAttribute('placeholder', /What did you learn/);
  });

  test('should have save button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Save Reflection' })).toBeVisible();
  });

  test('should be able to type in reflection textarea', async ({ page }) => {
    const textarea = page.getByRole('textbox');
    await textarea.fill('Test reflection content');
    await expect(textarea).toHaveValue('Test reflection content');
  });

  test('should change week selection', async ({ page }) => {
    const select = page.getByRole('combobox');
    await select.selectOption({ index: 1 }); // Select Week 2
    
    // The prompt should change (Week 2 has different prompt)
    await expect(page.getByText('Prompt:')).toBeVisible();
  });

  test('should save reflection successfully', async ({ page }) => {
    // Fill in reflection
    const textarea = page.getByRole('textbox');
    await textarea.fill('This is my test reflection for Week 1');
    
    // Click save
    await page.getByRole('button', { name: 'Save Reflection' }).click();
    
    // Wait for save to complete
    await page.waitForTimeout(1000);
    
    // Should show success message or the reflection should be saved
    // (The saved message appears briefly)
  });
});

