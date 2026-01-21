import { test, expect } from '@playwright/test'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'


test.describe('Practice Day 9', () => {
  test('[P0] Deep Dive Day 9 Secret Auction snippet should render valid escapes', async ({ page }) => {
    await page.goto('/practice')

    await page.getByRole('button', { name: 'Day 9' }).click()
    await page.getByRole('button', { name: 'Deep Dive' }).click()

    await expect(
      page.getByRole('heading', { name: 'Day 9: Dictionaries, Nesting & the Secret Auction' })
    ).toBeVisible()

    const codeBlock = page.locator('pre code').filter({ hasText: 'find_highest_bidder' }).first()

    await expect(codeBlock).toBeVisible()
    await expect(codeBlock).toContainText('print("\\n" * 100)')
    await expect(codeBlock).toContainText('bid of ${highest_bid}.')
  })

  test('[P1] repo should ignore .env files (prevent secret commits)', async () => {
    const gitignorePath = fileURLToPath(new URL('../../../.gitignore', import.meta.url))
    const content = readFileSync(gitignorePath, 'utf-8')

    expect(content).toMatch(/^\.env\s*$/m)
    expect(content).toMatch(/^\.env\.\*\.local\s*$/m)
  })

  test('[P1] Day 9 MCQ option should match Udemy formatting (two-line answer, no semicolon)', async () => {
    const day9Path = fileURLToPath(new URL('../../../scripts/data/questions/day-9.json', import.meta.url))
    const raw = readFileSync(day9Path, 'utf-8')
    const questions = JSON.parse(raw)

    const q0 = questions[0]
    const opt = q0.options[4]

    expect(typeof opt).toBe('string')
    expect(opt).toContain('\n')
    expect(opt).not.toContain(';')
  })

  test('[P1] Practice page should render MCQ options with \\n escape support', async () => {
    const practicePath = fileURLToPath(new URL('../../src/pages/Practice.jsx', import.meta.url))
    const content = readFileSync(practicePath, 'utf-8')

    expect(content).toContain('whitespace-pre-wrap')
  })

  test('[P0] usePythonRunner should not contain hardcoded agent ingest telemetry endpoint', async () => {
    const filePath = fileURLToPath(new URL('../../src/hooks/usePythonRunner.js', import.meta.url))
    const content = readFileSync(filePath, 'utf-8')

    expect(content).not.toContain('127.0.0.1:7242/ingest')
  })
})
