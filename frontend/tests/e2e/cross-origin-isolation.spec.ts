import { test, expect } from '@playwright/test'


test.describe('Cross-Origin Isolation', () => {
  test('[P0] should be cross-origin isolated (required for SharedArrayBuffer/Pyodide)', async ({ page }) => {
    await page.goto('/practice')

    const isIsolated = await page.evaluate(() => window.crossOriginIsolated)
    expect(isIsolated).toBe(true)
  })
})
